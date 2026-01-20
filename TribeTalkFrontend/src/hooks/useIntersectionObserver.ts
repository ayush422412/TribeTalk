// hooks/useIntersectionObserver.ts (NEW)
import { useEffect, useRef, useState } from "react"

/**
 * Hook to track if an element is visible in viewport
 * Used to determine when to mark messages as read
 */
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.5, // Consider visible when 50% in view
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { elementRef, isVisible }
}