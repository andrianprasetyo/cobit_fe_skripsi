import { scroller } from 'vue-scrollto/src/scrollTo'

export function useScrollTo() {
  const scrollTo = scroller()

  return scrollTo
}
