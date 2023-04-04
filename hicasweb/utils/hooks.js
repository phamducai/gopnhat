import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { throttle } from "throttle-debounce"

// Got from https://usehooks.com/useLockBodyScroll/
export function useLockBodyScroll() {
  useEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Prevent scrolling on mount
    document.body.style.overflow = "hidden"

    // Re-enable scrolling when component unmounts
    return () => (document.body.style.overflow = originalStyle)
  }, []) // Empty array ensures effect is only run on mount and unmount
}

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    // Add event listener
    window.addEventListener("resize", handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  if (!windowSize.width) return undefined
  if (windowSize.width >= 1536) return "3xl"
  if (windowSize.width >= 1366) return "xxl"
  if (windowSize.width >= 1280) return "xl"
  if (windowSize.width >= 1024) return "lg"
  if (windowSize.width >= 768) return "md"
  return "sm"
}

export function useScrollListener() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
  })

  // set up event listeners
  useEffect(() => {
    const handleScroll = () => {
      setData((last) => {
        return {
          x: window.scrollX,
          y: window.scrollY,
          lastX: last.x,
          lastY: last.y,
        }
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return data
}
export const useFocus = () => {
  const htmlElRef = useRef(null)
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus()
  }

  return [htmlElRef, setFocus]
}
// Add something to given element placeholder
function addToPlaceholder(toAdd, el) {
  if (el.current) {
    el.current.input.placeholder += toAdd
    // Delay between symbols "typing"
    return new Promise((resolve) => setTimeout(resolve, 100))
  } else {
    return
  }
}

// Cleare placeholder attribute in given element
function clearPlaceholder(el) {
  if (el.current) {
    el.current.input.placeholder = ""
  }
}

// Print one phrase
function printPhrase(phrase, el) {
  return new Promise((resolve) => {
    // Clear placeholder before typing next phrase
    clearPlaceholder(el)
    let letters = phrase.split("")
    // For each letter in phrase
    letters.reduce(
      (promise, letter, index) =>
        promise.then((_) => {
          // Resolve promise when all letters are typed
          if (index === letters.length - 1) {
            // Delay before start next phrase "typing"
            setTimeout(resolve, 1000)
          }
          return addToPlaceholder(letter, el)
        }),
      Promise.resolve()
    )
  })
}

// Print given phrases to element
export function placeHolderTyping(phrases, el) {
  // wait for phrase to be typed
  // before start typing next
  phrases.reduce(
    (promise, phrase) => promise.then((_) => printPhrase(phrase.value, el)),
    Promise.resolve()
  )
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function useRefreshScrollRestoration() {
  useEffect(() => {
    const pageAccessedByReload = window.performance
      .getEntriesByType("navigation")
      .map((nav) => nav.type)
      .includes("reload")

    if (pageAccessedByReload) {
      const scrollPosition = Number.parseInt(
        sessionStorage.getItem("scrollPosition"),
        10
      )
      if (scrollPosition) {
        window.scrollTo(0, scrollPosition)
      }
    }

    const handleScroll = throttle(500, () => {
      sessionStorage.setItem("scrollPosition", window.scrollY)
    })

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
}
