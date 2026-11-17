/* Tema claro/oscuro antes del primer paint. Sin elección guardada, sigue al sistema. */
(function () {
  'use strict'
  var root = document.documentElement
  var KEY = 'openqomu.landing.theme'
  var sys = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
  var choice = null
  try { choice = localStorage.getItem(KEY) } catch (e) { /* sin almacenamiento: sistema */ }
  root.classList.add('js')
  if (choice !== 'light' && choice !== 'dark') choice = null
  try {
    var asked = new URLSearchParams(location.search).get('theme')
    if (asked === 'light' || asked === 'dark') choice = asked
  } catch (e) { /* navegador antiguo: ignorar */ }

  function current() { return choice || (sys && sys.matches ? 'dark' : 'light') }

  function apply() {
    var t = current()
    root.setAttribute('data-theme', t)
    var metas = document.querySelectorAll('meta[name="theme-color"]')
    for (var i = 0; i < metas.length; i++) {
      metas[i].removeAttribute('media')
      metas[i].setAttribute('content', t === 'dark' ? '#0c0b12' : '#fbfaff')
    }
    var btns = document.querySelectorAll('[data-theme-toggle]')
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro')
      btns[j].setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false')
    }
    try { document.dispatchEvent(new CustomEvent('openqomu:theme', { detail: t })) } catch (e) { /* navegador antiguo */ }
  }

  apply()
  if (sys) {
    var onSys = function () { if (!choice) apply() }
    if (sys.addEventListener) sys.addEventListener('change', onSys)
    else if (sys.addListener) sys.addListener(onSys)
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply()
    // El ?app= llega desde una instancia que redirige aquí: ofrece volver a entrar.
    var app = null
    try { app = new URLSearchParams(location.search).get('app') } catch (e) { /* ignorar */ }
    if (app) {
      try {
        var appUrl = new URL(app)
        if (appUrl.protocol === 'http:' || appUrl.protocol === 'https:') {
          var enterHref = appUrl.href.replace(/\/$/, '') + '/?entrar=1'
          var enterLinks = document.querySelectorAll('[data-enter]')
          for (var k = 0; k < enterLinks.length; k++) { enterLinks[k].setAttribute('href', enterHref); enterLinks[k].classList.add('is-on') }
        }
      } catch (e) { /* app inválida: sin enlace */ }
    }
    var menu = document.querySelector('.menu')
    if (menu) menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.removeAttribute('open')
    })
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-theme-toggle]')
      if (!btn) return
      choice = current() === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem(KEY, choice) } catch (err) { /* solo esta visita */ }
      root.classList.add('theme-switch')
      apply()
      setTimeout(function () { root.classList.remove('theme-switch') }, 450)
    })
  })
})()
