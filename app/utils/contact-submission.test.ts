import { describe, expect, it } from "vitest"
import { ASSESSMENT_QUESTION_LABELS, ASSESSMENT_QUESTIONS } from "./assessment-questions"
import { PULSE_QUESTION_LABELS, PULSE_QUESTIONS } from "./pulse-questions"
import {
  buildContactEmailSubject,
  sanitizeSubjectPart,
  validateContactSubmission,
} from "./contact-submission"
import { buildContactEmailHtml } from "./contact-email"

describe("assessment questions", () => {
  it("has four questions with stable keys matching labels", () => {
    expect(ASSESSMENT_QUESTIONS).toHaveLength(4)
    for (const question of ASSESSMENT_QUESTIONS) {
      expect(ASSESSMENT_QUESTION_LABELS[question.key]).toBe(question.title)
      expect(question.options.length).toBeGreaterThan(0)
    }
  })
})

describe("pulse questions", () => {
  it("has four questions with stable keys matching labels", () => {
    expect(PULSE_QUESTIONS).toHaveLength(4)
    for (const question of PULSE_QUESTIONS) {
      expect(PULSE_QUESTION_LABELS[question.key]).toBe(question.title)
      expect(question.options.length).toBeGreaterThan(0)
    }
  })
})

describe("sanitizeSubjectPart", () => {
  it("strips CR/LF and control characters", () => {
    expect(sanitizeSubjectPart("Ada\r\nBcc: evil@x.com")).toBe("Ada Bcc: evil@x.com")
    expect(sanitizeSubjectPart("Hi\u0000there")).toBe("Hi there")
  })
})

describe("validateContactSubmission", () => {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines",
  }

  it("rejects missing name/email/company", () => {
    expect(validateContactSubmission({ ...base, name: "A" }).ok).toBe(false)
    expect(validateContactSubmission({ ...base, email: "not-an-email" }).ok).toBe(false)
    expect(validateContactSubmission({ ...base, company: "" }).ok).toBe(false)
  })

  it("accepts a default contact payload", () => {
    const result = validateContactSubmission(base)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.flow).toBe("default")
      expect(result.data.name).toBe("Ada Lovelace")
    }
  })

  it("requires valid assessment answers for assessment flow", () => {
    expect(
      validateContactSubmission({
        ...base,
        flow: "assessment",
        answers: { q1: "Under 20" },
      }).ok
    ).toBe(false)

    expect(
      validateContactSubmission({
        ...base,
        flow: "assessment",
        answers: {
          q1: "Under 20",
          q2: "Fewer than headcount",
          q3: "Never had formal levels",
          q4: "totally made up",
        },
      }).ok
    ).toBe(false)

    const result = validateContactSubmission({
      ...base,
      flow: "assessment",
      answers: {
        q1: "Under 20",
        q2: "Fewer than headcount",
        q3: "Never had formal levels",
        q4: "Fundraising",
      },
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.answers?.q4).toBe("Fundraising")
    }
  })

  it("requires valid pulse answers for pulseQuestionnaire flow", () => {
    expect(
      validateContactSubmission({
        ...base,
        flow: "pulseQuestionnaire",
        answers: { q1: "Under 50" },
      }).ok
    ).toBe(false)

    expect(
      validateContactSubmission({
        ...base,
        flow: "pulseQuestionnaire",
        answers: {
          q1: "Under 20",
          q2: "Rising attrition",
          q3: "No",
          q4: "None",
        },
      }).ok
    ).toBe(false)

    const result = validateContactSubmission({
      ...base,
      flow: "pulseQuestionnaire",
      answers: {
        q1: "Under 50",
        q2: "Rising attrition",
        q3: "No",
        q4: "None",
      },
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.flow).toBe("pulseQuestionnaire")
      expect(result.data.answers?.q2).toBe("Rising attrition")
    }
  })

  it("rejects Build answers on the Pulse questionnaire flow and vice versa", () => {
    expect(
      validateContactSubmission({
        ...base,
        flow: "pulseQuestionnaire",
        answers: {
          q1: "Under 20",
          q2: "Fewer than headcount",
          q3: "Never had formal levels",
          q4: "Fundraising",
        },
      }).ok
    ).toBe(false)

    expect(
      validateContactSubmission({
        ...base,
        flow: "assessment",
        answers: {
          q1: "Under 50",
          q2: "Rising attrition",
          q3: "No",
          q4: "None",
        },
      }).ok
    ).toBe(false)
  })
})

describe("contact email builders", () => {
  it("builds a sanitized subject with flow label", () => {
    expect(buildContactEmailSubject("assessment", "Ada\nLovelace")).toBe(
      "New HR Maturity Assessment from Ada Lovelace"
    )
    expect(buildContactEmailSubject("contact", "Ada")).toBe("New Build Contact from Ada")
    expect(buildContactEmailSubject("pulseQuestionnaire", "Ada")).toBe("New Pulse Read from Ada")
    expect(buildContactEmailSubject("pulseContact", "Ada")).toBe("New Pulse Contact from Ada")
  })

  it("includes escaped assessment answers in html", () => {
    const html = buildContactEmailHtml({
      flow: "assessment",
      name: "Ada <script>",
      email: "ada@example.com",
      company: "Engines",
      interest: "Build · Org Design Sprint",
      answers: {
        q1: "Under 20",
        q2: "Fewer than headcount",
        q3: "Never had formal levels",
        q4: "Fundraising",
      },
    })
    expect(html).toContain("New HR Maturity Assessment")
    expect(html).toContain("Ada &lt;script&gt;")
    expect(html).toContain("Assessment answers")
    expect(html).toContain("Fundraising")
    expect(html).not.toContain("<script>")
  })

  it("includes escaped pulse answers in html", () => {
    const html = buildContactEmailHtml({
      flow: "pulseQuestionnaire",
      name: "Ada",
      email: "ada@example.com",
      company: "Engines",
      interest: "Pulse · Relational Diagnostics",
      answers: {
        q1: "Under 50",
        q2: "Rising attrition",
        q3: "No",
        q4: "None",
      },
    })
    expect(html).toContain("New Pulse Read")
    expect(html).toContain("Pulse answers")
    expect(html).toContain("Rising attrition")
    expect(html).toContain("How many people are you looking to pulse-check?")
  })
})
