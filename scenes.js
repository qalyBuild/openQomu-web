/* openQomu landing: caos a calma y película de la ventana. */
(function () {
  'use strict'
  var root = document.documentElement
  var MOTION = '(prefers-reduced-motion: no-preference)'
  if (!window.gsap || !window.ScrollTrigger) return
  var gsap = window.gsap
  gsap.registerPlugin(window.ScrollTrigger)
  var ScrollTrigger = window.ScrollTrigger
  var $ = function (s, c) { return (c || document).querySelector(s) }
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)) }
  var mm = gsap.matchMedia()

  /* Caos a calma: la ventana genérica se vacía y queda openQomu. */
  mm.add('(min-width: 900px) and ' + MOTION, function () {
    var sec = $('#caos')
    var h1 = $('.cz-h1'), h2 = $('.cz-h2')
    var before = $('.cz-before'), after = $('.cz-after')
    var chrome = [$('.cz-tabs-extra'), $('.cz-bell'), $('.cz-search'), $('.cz-plan'), $('.cz-banner'), $('.cz-bubble'), $('.cz-mail'), $('.cz-tag'), $('.cz-side')].filter(Boolean)
    var rows = $$('.cz-row')
    var end = $('.cz-end')
    var miniCards = $$('.cz-after .card')

    sec.classList.add('cz-live')
    gsap.set(h2, { opacity: 0, y: 14 })
    gsap.set(after, { opacity: 0, y: 30, scale: 0.985 })
    gsap.set(miniCards, { opacity: 0, y: 12 })
    gsap.set(end, { opacity: 0, y: 14 })

    var tl = gsap.timeline({
      defaults: { ease: 'none', immediateRender: false },
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true }
    })
    tl.to(h1, { opacity: 0.32, duration: 0.12 }, 0.02)
      .to(h2, { opacity: 1, y: 0, duration: 0.12 }, 0.08)
      .to(chrome, { opacity: 0, y: -8, duration: 0.16, stagger: 0.03 }, 0.1)
      .to(rows, { opacity: 0, x: -14, duration: 0.2, stagger: 0.02 }, 0.18)
      .to(before, { opacity: 0, y: -18, scale: 0.98, duration: 0.18 }, 0.34)
      .to(after, { opacity: 1, y: 0, scale: 1, duration: 0.18 }, 0.38)
      .to(miniCards, { opacity: 1, y: 0, duration: 0.12, stagger: 0.04 }, 0.52)
      .to(end, { opacity: 1, y: 0, duration: 0.1 }, 0.72)
    tl.to({}, { duration: 0 }, 1)
    return function () { sec.classList.remove('cz-live') }
  })

  /* Película: cinco vistas, una cámara y un paso encendido. */
  mm.add('(min-width: 901px) and ' + MOTION, function () {
    var sec = $('#ventana')
    var dev = $('.film-dev')
    var views = $$('.view')
    var steps = $$('.film-steps li')
    var navs = $$('.film-side .bs-item')
    var nEl = $('#film-n')
    var capEl = $('#film-capt')
    var captions = steps.map(function (li) { return li.querySelector('span:last-child').textContent })

    sec.classList.add('film-live')
    gsap.set(views, { opacity: 0 })
    gsap.set(views[0], { opacity: 1 })

    var tl = gsap.timeline({
      defaults: { ease: 'none', immediateRender: false },
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true }
    })

    // Segmentos: cada paso ocupa una quinta parte. La cámara se acerca un poco en cada uno.
    var N = views.length
    var seg = 1 / N
    views.forEach(function (v, i) {
      if (i > 0) tl.to(views[i - 1], { opacity: 0, duration: 0.02 }, i * seg - 0.025)
      tl.to(v, { opacity: 1, duration: 0.02 }, i * seg)
    })
    tl.fromTo(dev, { scale: 0.965, xPercent: 1.2 }, { scale: 1.015, xPercent: -1.2, transformOrigin: '58% 50%', duration: 1 }, 0)

    var current = -1
    tl.eventCallback('onUpdate', function () {
      var p = tl.progress()
      var i = Math.min(N - 1, Math.max(0, Math.floor(p / seg + 0.12)))
      if (i === current) return
      current = i
      steps.forEach(function (s, k) { s.classList.toggle('on', k === i) })
      navs.forEach(function (n) { n.classList.toggle('on', Number(n.getAttribute('data-nav')) === i + 1) })
      nEl.textContent = '0' + (i + 1)
      capEl.textContent = captions[i]
    })
    tl.to({}, { duration: 0 }, 1)
    return function () { sec.classList.remove('film-live') }
  })
})()
