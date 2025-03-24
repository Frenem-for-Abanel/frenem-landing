export function smoothScrollTo(elementId: string) {
  // Remove the # if it's included
  const id = elementId.startsWith("#") ? elementId.substring(1) : elementId

  const element = document.getElementById(id)

  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - 80 // Adjust for header height

    // Use window.scrollTo for better cross-browser compatibility
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

