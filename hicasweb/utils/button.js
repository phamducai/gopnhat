// Decide what the button will look like based on its type (primary or secondary)
// and on its background (light or dark).
export function getButtonAppearance(type, background) {
  if (type === "primary") {
    if (background === "light") {
      // Dark primary button on a light background
      return "dark"
    }
    // Fully white primary button on a dark background
    return "white"
  }
  if (type === "secondary") {
    if (background === "light") {
      // Dark outline primary button on a light background
      return "dark-outline"
    }
    // White outline primary button on a dark background
    return "white-outline"
  }

  // Shouldn't happen, but default to dark button just in case
  return "dark"
}
export const getPositionTitle = (value) => {
  if (value === "right") return "justify-end text-right"
  else if (value === "left") return "justify-start text-left"
  else if (value === "center") return "justify-center text-center"
  else return "justify-start"
}
export const showPositionGradient = (value) => {
  if (value === "right") return "banner-gradient-background-right"
  else if (value === "left") return "banner-gradient-background-left"
  else if (value === "center") return "banner-gradient-background-center"
  else return ""
}
export const checkShowGradient = (item) => {
  if (!item.title && !item.subTitle && item.description === "") {
    return false
  }
  return true
}
