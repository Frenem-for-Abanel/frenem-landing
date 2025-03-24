export function smoothScrollTo(elementId: string) {
  // Remove the # if it's included
  const id = elementId.startsWith("#") ? elementId.substring(1) : elementId

  const element = document.getElementById(id)

  if (element) {
    // Scroll to the element with smooth behavior
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

