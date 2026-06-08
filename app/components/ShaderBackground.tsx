"use client"

import { useEffect, useRef } from "react"
import type { CSSProperties } from "react"

/**
 * ShaderBackground — a dependency-free, interactive WebGL2 canvas wallpaper.
 *
 * Five "living organisation map" variants share one render pipeline. Every
 * variant reacts to pointer position (`u_mouse` / `u_pointer`) and click
 * ripples (`u_clicks`), and every colour + the output alpha is prop-driven so
 * the same component can be reused as a hero backdrop, a section texture, or a
 * loader background at any opacity.
 */

export interface ShaderBackgroundColors {
  /** Base / darkest tone. Default deep navy #0a0f1e */
  bg?: string
  /** Secondary base tone. Default charcoal #111827 */
  bg2?: string
  /** Primary accent. Default amber #f59e0b */
  accent?: string
  /** Secondary accent used for blooms. Default gold #d97706 */
  accent2?: string
  /** Structural highlight. Default slate-blue #3d557a */
  highlight?: string
}

export interface ShaderBackgroundProps {
  colors?: ShaderBackgroundColors
  /** Output alpha (0–1) — lets the canvas sit translucently over content. */
  alpha?: number
  /** Brightness multiplier. */
  intensity?: number
  /** React to pointer move / clicks. */
  interactive?: boolean
  /** Pause the animation loop. */
  paused?: boolean
  /** Max device pixel ratio (perf cap). */
  maxDpr?: number
  className?: string
  style?: CSSProperties
}

const DEFAULT_COLORS: Required<ShaderBackgroundColors> = {
  bg: "#0a0f1e",
  bg2: "#111827",
  accent: "#f59e0b",
  accent2: "#d97706",
  highlight: "#3d557a",
}

const MAX_CLICKS = 8
const CLICK_LIFETIME = 2.6
const POINTER_IDLE_MS = 2200

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "")
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  }
  const int = parseInt(h, 16)
  if (Number.isNaN(int) || h.length !== 6) return [0, 0, 0]
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`

const FRAG_HEADER = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;     // drawing-buffer pixels, origin bottom-left
uniform vec2 u_mouse_trailing; // eased trailing mouse for slow wakes
uniform float u_pointer;  // 0..1 presence
uniform vec3 u_bg;
uniform vec3 u_bg2;
uniform vec3 u_accent;
uniform vec3 u_accent2;
uniform vec3 u_highlight;
uniform float u_alpha;
uniform float u_intensity;
#define MAX_CLICKS ${MAX_CLICKS}
uniform vec3 u_clicks[MAX_CLICKS]; // xy = pixels, z = age seconds (<0 = inactive)

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
vec2 hash22(vec2 p) {
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(262144.0, 32768.0) * n);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
// Expanding gold rings from recent clicks.
vec3 clickBlooms(vec2 uv) {
  float aspect = u_resolution.x / u_resolution.y;
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_CLICKS; i++) {
    vec3 c = u_clicks[i];
    if (c.z < 0.0) continue;
    vec2 cp = c.xy / u_resolution.xy;
    vec2 d = uv - cp;
    d.x *= aspect;
    float dist = length(d);
    float age = c.z;
    float radius = age * 0.5;
    float ring = exp(-pow((dist - radius) * 9.0, 2.0));
    float fade = exp(-age * 1.9);
    sum += u_accent2 * ring * fade * 0.7; // Tuned down from 1.4
    sum += u_accent * exp(-dist * 7.0) * fade * 0.25; // Tuned down from 0.5
  }
  return sum;
}
`

const FRAG_MAIN = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv; p.x *= aspect;
  
  // Use trailing mouse for a slow, calming wake
  vec2 tm = u_mouse_trailing / u_resolution.xy; tm.x *= aspect;
  float t = u_time * 0.05;
  
  vec2 dm = p - tm;
  float dist = length(dm);
  
  // Wide, soft influence radius
  float influence = smoothstep(1.4, 0.0, dist) * u_pointer;
  
  // Gentle displacement (pebble/wake effect)
  // Expanding ripples from the trailing center
  float ripple = sin(dist * 15.0 - u_time * 3.0) * 0.015;
  
  // Combine a very soft swirl, outward push, and the ripple
  vec2 offset = (dm * 0.08 + vec2(-dm.y, dm.x) * 0.12 + (dm / (dist + 0.001)) * ripple) * influence;
  
  vec2 p_fbm = p + offset;
  float t_fbm = t + influence * 0.05; // Very subtle time acceleration
  
  vec2 q = vec2(fbm(p_fbm * 2.0 + t_fbm), fbm(p_fbm * 2.0 + vec2(5.2, 1.3) - t_fbm));
  vec2 r = vec2(fbm(p_fbm * 2.0 + 4.0 * q + t_fbm * 2.0), fbm(p_fbm * 2.0 + 4.0 * q - t_fbm * 2.0));
  float f = fbm(p_fbm * 2.0 + 4.0 * r);
  
  vec3 col = mix(u_bg, u_bg2, f);
  col = mix(col, u_highlight, q.x * 0.5);
  col = mix(col, u_accent, r.y * 0.4);
  col = mix(col, u_accent2, f * f * 0.3);
  
  col += clickBlooms(uv);
  col *= u_intensity;
  
  vec2 uvq = uv - 0.5; col -= dot(uvq, uvq) * 0.1;
  fragColor = vec4(col, u_alpha);
}`

interface Click {
  x: number
  y: number
  start: number
}

export default function ShaderBackground({
  colors,
  alpha = 1,
  intensity = 1,
  interactive = true,
  paused = false,
  maxDpr = 2,
  className,
  style,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mutable runtime values read inside the render loop without re-binding it.
  const propsRef = useRef({ alpha, intensity, interactive, paused })
  propsRef.current = { alpha, intensity, interactive, paused }

  const palette = { ...DEFAULT_COLORS, ...colors }
  const paletteKey = `${palette.bg}|${palette.bg2}|${palette.accent}|${palette.accent2}|${palette.highlight}`
  const paletteRef = useRef(palette)
  paletteRef.current = palette

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    })
    if (!gl) return // No WebGL2 → render nothing (graceful, invisible canvas).

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("ShaderBackground compile error:", gl.getShaderInfoLog(sh))
        gl.deleteShader(sh)
        return null
      }
      return sh
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_HEADER + FRAG_MAIN)
    if (!vs || !fs) return

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("ShaderBackground link error:", gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      mouseTrailing: gl.getUniformLocation(program, "u_mouse_trailing"),
      pointer: gl.getUniformLocation(program, "u_pointer"),
      bg: gl.getUniformLocation(program, "u_bg"),
      bg2: gl.getUniformLocation(program, "u_bg2"),
      accent: gl.getUniformLocation(program, "u_accent"),
      accent2: gl.getUniformLocation(program, "u_accent2"),
      highlight: gl.getUniformLocation(program, "u_highlight"),
      alpha: gl.getUniformLocation(program, "u_alpha"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      clicks: gl.getUniformLocation(program, "u_clicks"),
    }

    let width = 1
    let height = 1
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (w === width && h === height) return
      width = w
      height = h
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pointer state (drawing-buffer pixels, y-up to match gl_FragCoord).
    let mouseX = width * 0.5
    let mouseY = height * 0.5
    let trailingX = mouseX
    let trailingY = mouseY
    let pointer = 0
    let pointerTarget = 0
    let lastMove = 0
    const clicks: Click[] = []
    const clickData = new Float32Array(MAX_CLICKS * 3)

    const toBufferCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const nx = (clientX - rect.left) / rect.width
      const ny = (clientY - rect.top) / rect.height
      return { x: nx * width, y: (1 - ny) * height }
    }
    const onMove = (e: PointerEvent) => {
      if (!propsRef.current.interactive) return
      const { x, y } = toBufferCoords(e.clientX, e.clientY)
      mouseX = x
      mouseY = y
      pointerTarget = 1
      lastMove = performance.now()
    }
    const onDown = (e: PointerEvent) => {
      if (!propsRef.current.interactive) return
      const { x, y } = toBufferCoords(e.clientX, e.clientY)
      clicks.push({ x, y, start: performance.now() })
      if (clicks.length > MAX_CLICKS) clicks.shift()
    }
    if (interactive && !reduceMotion) {
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("pointerdown", onDown, { passive: true })
    }

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    let raf = 0
    const start = performance.now()
    const renderColors = () => {
      const c = paletteRef.current
      gl.uniform3fv(u.bg, hexToRgb(c.bg))
      gl.uniform3fv(u.bg2, hexToRgb(c.bg2))
      gl.uniform3fv(u.accent, hexToRgb(c.accent))
      gl.uniform3fv(u.accent2, hexToRgb(c.accent2))
      gl.uniform3fv(u.highlight, hexToRgb(c.highlight))
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (propsRef.current.paused || !visible) return

      const now = performance.now()
      const t = reduceMotion ? 0 : (now - start) / 1000

      // Ease pointer presence, dropping off when idle.
      if (now - lastMove > POINTER_IDLE_MS) pointerTarget = 0
      pointer += (pointerTarget - pointer) * 0.06

      // Ease trailing mouse
      trailingX += (mouseX - trailingX) * 0.015
      trailingY += (mouseY - trailingY) * 0.015

      // Pack active click ripples.
      for (let i = 0; i < MAX_CLICKS; i++) {
        const click = clicks[i]
        if (!click) {
          clickData[i * 3 + 2] = -1
          continue
        }
        const age = (now - click.start) / 1000
        if (age > CLICK_LIFETIME) {
          clickData[i * 3 + 2] = -1
        } else {
          clickData[i * 3] = click.x
          clickData[i * 3 + 1] = click.y
          clickData[i * 3 + 2] = age
        }
      }
      // Drop expired ripples so the buffer stays compact.
      for (let i = clicks.length - 1; i >= 0; i--) {
        if ((now - clicks[i].start) / 1000 > CLICK_LIFETIME) clicks.splice(i, 1)
      }

      gl.uniform2f(u.resolution, width, height)
      gl.uniform1f(u.time, t)
      gl.uniform2f(u.mouse, mouseX, mouseY)
      gl.uniform2f(u.mouseTrailing, trailingX, trailingY)
      gl.uniform1f(u.pointer, pointer)
      gl.uniform1f(u.alpha, propsRef.current.alpha)
      gl.uniform1f(u.intensity, propsRef.current.intensity)
      gl.uniform3fv(u.clicks, clickData)
      renderColors()

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
    // Re-init only when the GLSL program or DPR cap changes; colours/alpha/etc.
    // are read live from refs inside the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDpr, paletteKey])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  )
}
