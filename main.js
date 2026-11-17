/* openQomu landing: Lenis, la historia de cuatro beats y los reveals. */
(function () {
  'use strict'
  var root = document.documentElement
  var MOTION = '(prefers-reduced-motion: no-preference)'
  var STORY = '(min-width: 720px) and (prefers-reduced-motion: no-preference)'
  var motionOK = window.matchMedia(MOTION).matches

  if (!window.gsap || !window.ScrollTrigger) return
  var gsap = window.gsap
  gsap.registerPlugin(window.ScrollTrigger)
  var ScrollTrigger = window.ScrollTrigger
  var $ = function (s, c) { return (c || document).querySelector(s) }
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)) }

  var lenis = null

  /* Scroll suave, apagado en táctil y con movimiento reducido. */
  if (window.Lenis && motionOK && !window.matchMedia('(pointer: coarse)').matches) {
    lenis = new window.Lenis({ lerp: 0.09, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.addEventListener('refresh', function () { lenis.resize() })
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a || a.classList.contains('skip') || e.defaultPrevented || e.button !== 0) return
      var id = a.getAttribute('href')
      if (id.length < 2) return
      var target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.resize()
      lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.3 })
      if (history.pushState) history.pushState(null, '', id)
    })
  }

  if (window.matchMedia(STORY).matches) story()

  function story() {
    root.classList.add('story-live')
    var taskp = $('#taskp'), taskpInner = $('#taskp .taskp-inner'), board = $('#board'), toast = $('#toast')
    var orb = $('#mark-orb'), halo = $('#mark-halo'), drip = $('.drip'), word = $('#mark-word')
    var heroCopy = $('#hero-copy'), caps = $('.caps')
    var typed = $('#typed'), chips = $$('.taskp-meta .chip')
    var cardDoing = $('#card-doing'), cardDone = $('#card-done')
    var ccDoing = $('#cc-doing'), ccDone = $('#cc-done')
    var beats = {}
    $$('.beat').forEach(function (b) { beats[b.getAttribute('data-beat')] = b })
    var capEls = $$('.cap')

    gsap.set(caps, { opacity: 1 })
    gsap.set(taskp, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.96 })
    gsap.set(board, { opacity: 0, y: 26, scale: 0.985 })
    gsap.set(toast, { opacity: 0, y: 12 })
    gsap.set(cardDoing, { opacity: 1 })
    gsap.set(cardDone, { display: 'none', opacity: 0 })
    gsap.set(chips, { opacity: 0, y: 7 })
    gsap.set(heroCopy, { opacity: 1, y: 0 })
    gsap.set(capEls, { opacity: 0 })

    var D = { immediateRender: false, ease: 'none' }
    function st(name) {
      return {
        trigger: beats[name], start: 'top bottom', end: 'bottom bottom',
        scrub: 0.6, invalidateOnRefresh: true
      }
    }
    function capIn(tl, i, at) {
      return tl.fromTo(capEls[i], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, at)
    }
    function capOut(tl, i, at) {
      return tl.fromTo(capEls[i], { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.08, ease: 'power1.in' }, at)
    }

    /* Beat 1: la portada se va y la marca ocupa el centro. */
    var t1 = gsap.timeline({ defaults: D, scrollTrigger: st('space') })
    t1.fromTo(heroCopy, { opacity: 1, y: 0, filter: 'blur(0px)' }, { opacity: 0, y: -90, filter: 'blur(10px)', duration: 0.42, ease: 'power1.in' }, 0.18)
      .fromTo(orb, { scale: 1, opacity: 1 }, { scale: 0.86, opacity: 0.55, x: 28, duration: 0.6 }, 0.1)
      .fromTo(word, { x: 0 }, { x: 28, duration: 0.6 }, 0.1)
      .fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.26)
      .fromTo(halo, { opacity: 1, scale: 1 }, { opacity: 0.4, scale: 1.5, duration: 0.6 }, 0.1)
      .fromTo(drip, { opacity: 1 }, { opacity: 0, duration: 0.12 }, 0.3)
    capIn(t1, 0, 0.5)
    capOut(t1, 0, 0.94)

    /* Beat 2: se abre la tarea y se escribe el título. */
    var TITLE = 'Banner del lanzamiento'
    var typedProxy = { n: 0 }
    typed.textContent = ''
    var t2 = gsap.timeline({ defaults: D, scrollTrigger: st('task') })
    capIn(t2, 1, 0)
    t2.fromTo(taskp, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 0.04)
      .to(typedProxy, {
        n: TITLE.length, duration: 0.5,
        onUpdate: function () { typed.textContent = TITLE.slice(0, Math.round(typedProxy.n)) }
      }, 0.14)
      .to(chips, { opacity: 1, y: 0, duration: 0.1, stagger: 0.07, ease: 'power2.out' }, 0.58)
    capOut(t2, 1, 0.94)

    /* Beat 3: la tarjeta cae en el tablero y el canal avisa. */
    var t3 = gsap.timeline({ defaults: D, scrollTrigger: st('board') })
    capIn(t3, 2, 0.1)
    t3.to(taskpInner, { opacity: 0, y: -8, duration: 0.12, ease: 'power1.in' }, 0.02)
      .fromTo(board, { opacity: 0, y: 26, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: 'power2.out' }, 0.16)
      .fromTo(cardDoing, { opacity: 0, y: -18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.34)
      .fromTo(toast, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.44)
    capOut(t3, 2, 0.94)

    /* Beat 4: se cierra y pasa a Hecho. */
    var t4 = gsap.timeline({ defaults: D, scrollTrigger: st('done') })
    capIn(t4, 3, 0)
    t4.set(cardDone, { display: 'block' }, 0.2)
      .fromTo(cardDone, { opacity: 0, y: 10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.22)
    var counters = { done: false }
    t4.eventCallback('onUpdate', function () {
      var next = t4.progress() > 0.3
      if (next === counters.done) return
      counters.done = next
      ccDoing.textContent = next ? '1' : '2'
      ccDone.textContent = next ? '3' : '2'
      cardDoing.style.display = next ? 'none' : ''
      toast.style.display = next ? 'none' : ''
    })

    ;[t1, t2, t3, t4].forEach(function (t) { t.to({}, { duration: 0 }, 1) })
  }

  /* Reveals: una sola vez por elemento. */
  if (motionOK) {
    root.classList.add('gsap-ready')
    var items = $$('[data-rise]')
    gsap.set(items, { opacity: 0, y: 26 })
    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true })
      }
    })
  }
})()
