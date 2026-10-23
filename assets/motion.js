/* Pentadeva motion — progressive enhancement only.
   No network, no storage, no cookies, no dependencies.
   Inert under prefers-reduced-motion; page is fully usable without it. */
(function () {
  'use strict';
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('motion');
    var fine = window.matchMedia('(pointer: fine)').matches;

    /* 1 · Sections rise as they enter view */
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('in');
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    var sel = ['main section h2', 'main .lede', '.page-head h1', '.page-head .sub',
      '.outcome', '.step', '.rung', '.offer .scarce', '.offer .small',
      '.founder-card', '.founder > div', '.boroughs',
      '.svc > p', '.svc ul', '.faq details', '.contact-big'].join(',');
    document.querySelectorAll(sel).forEach(function (el) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = ((idx > 0 ? idx % 4 : 0) * 80) + 'ms';
      el.classList.add('r');
      io.observe(el);
    });

    /* 2 · The letter sits in the hand: a faint tilt toward the cursor */
    var letter = document.querySelector('.hero .letter');
    if (letter && fine) {
      var raf = 0, rx = 0, ry = 0;
      var apply = function () {
        raf = 0;
        letter.style.transform = (rx || ry)
          ? 'perspective(1400px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)'
          : '';
      };
      letter.parentNode.addEventListener('mousemove', function (e) {
        var r = letter.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 1.5;
        rx = ((e.clientY - r.top) / r.height - 0.5) * -1.1;
        if (!raf) { raf = requestAnimationFrame(apply); }
      });
      letter.parentNode.addEventListener('mouseleave', function () {
        rx = 0; ry = 0;
        if (!raf) { raf = requestAnimationFrame(apply); }
      });
    }

    /* 3 · Buttons lean gently toward the cursor */
    if (fine) {
      document.querySelectorAll('.btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = (e.clientX - r.left - r.width / 2) / r.width;
          var dy = (e.clientY - r.top - r.height / 2) / r.height;
          btn.style.transform = 'translate(' + (dx * 5).toFixed(1) + 'px,' + (dy * 3.5).toFixed(1) + 'px)';
        });
        btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
      });
    }
  } catch (err) {
    /* enhancement must never break the page */
    document.documentElement.classList.remove('motion');
    var hidden = document.querySelectorAll('.r');
    for (var j = 0; j < hidden.length; j++) { hidden[j].classList.add('in'); }
  }
}());
