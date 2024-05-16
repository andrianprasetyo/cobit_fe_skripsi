import VueScrollTo from 'vue-scrollto'

export default function setupVueScrollTo(app) {
  app.use(VueScrollTo, {
    container: 'body',
    duration: 100,
    easing: 'ease',
    offset: 0,
    force: true,
    cancelable: true,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true
  })
}
