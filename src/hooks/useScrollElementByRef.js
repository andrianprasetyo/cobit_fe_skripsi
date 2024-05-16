import { useScroll } from '@vueuse/core'

export const useScrollElementByRef = (elementRef) => {
  const scroll = useScroll(elementRef)

  return scroll
}
