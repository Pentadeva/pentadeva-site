/* Pentadeva motion — progressive enhancement only.
   No network, no storage, no cookies, no dependencies.
   Inert under prefers-reduced-motion; page is fully usable without it. */
(function () {
  'use strict';
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
      return;
    }
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
      '.founder-card', '.founder > div', '.boroughs', '.map-wrap', '.calc-in', '.calc-out',
      '.svc > p', '.svc ul', '.svc-row', '.pframe', '.faq details', '.contact-big'].join(',');
    document.querySelectorAll(sel).forEach(function (el) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = ((idx > 0 ? idx % 4 : 0) * 80) + 'ms';
      el.classList.add('r');
      io.observe(el);
    });

    /* 2 · Depth: things tilt faintly toward the cursor (fine pointers only) */
    if (fine) {
      document.querySelectorAll('[data-tilt]').forEach(function (el) {
        var max = parseFloat(el.getAttribute('data-tilt')) || 1.5;
        var raf = 0, rx = 0, ry = 0;
        var apply = function () {
          raf = 0;
          el.style.transform = (rx || ry)
            ? 'perspective(1400px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)'
            : '';
        };
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          ry = ((e.clientX - r.left) / r.width - 0.5) * max;
          rx = ((e.clientY - r.top) / r.height - 0.5) * -max * 0.75;
          if (!raf) { raf = requestAnimationFrame(apply); }
        });
        el.addEventListener('mouseleave', function () {
          rx = 0; ry = 0;
          if (!raf) { raf = requestAnimationFrame(apply); }
        });
      });
    }

    /* 3 · Depth: layers drift at different speeds on scroll */
    var paras = Array.prototype.slice.call(document.querySelectorAll('[data-para]'));
    if (paras.length) {
      paras.forEach(function (el) { el._f = parseFloat(el.getAttribute('data-para')) || 0.08; });
      var ticking = 0;
      var drift = function () {
        ticking = 0;
        var mid = window.innerHeight / 2;
        for (var i = 0; i < paras.length; i++) {
          var el = paras[i], r = el.getBoundingClientRect();
          var off = ((r.top + r.bottom) / 2 - mid) * -el._f;
          el.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
        }
      };
      var onScroll = function () { if (!ticking) { ticking = requestAnimationFrame(drift); } };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      drift();
    }

    /* 4 · People frames: shards float at their own depth (cursor + scroll); media counter-shifts */
    document.querySelectorAll('.pframe').forEach(function (fr) {
      var frags = Array.prototype.slice.call(fr.querySelectorAll('.frag'));
      var media = fr.querySelector('.pf-media img, .pf-media video');
      var mx = 0, my = 0, sy = 0, raf = 0;
      frags.forEach(function (f) { f._d = parseFloat(f.getAttribute('data-depth')) || 20; });
      var paint = function () {
        raf = 0;
        for (var i = 0; i < frags.length; i++) {
          var d = frags[i]._d;
          frags[i].style.transform = 'translate3d(' + (mx * d).toFixed(1) + 'px,' + (my * d + sy * d / 600).toFixed(1) + 'px,0) rotate(' + (mx * d * 0.35).toFixed(1) + 'deg)';
        }
        if (media) { media.style.transform = 'scale(1.1) translate3d(' + (-mx * 1.5).toFixed(2) + '%,' + (-my * 1 - sy / (window.innerHeight * 0.6) * 3).toFixed(2) + '%,0)'; }
      };
      var queue = function () { if (!raf) { raf = requestAnimationFrame(paint); } };
      if (fine) {
        fr.addEventListener('mousemove', function (e) {
          var r = fr.getBoundingClientRect();
          mx = (e.clientX - r.left) / r.width - 0.5;
          my = (e.clientY - r.top) / r.height - 0.5;
          queue();
        });
        fr.addEventListener('mouseleave', function () { mx = 0; my = 0; queue(); });
      }
      window.addEventListener('scroll', function () {
        var r = fr.getBoundingClientRect();
        var lim = window.innerHeight * 0.6;
        sy = Math.max(-lim, Math.min(lim, (r.top + r.height / 2) - window.innerHeight / 2));
        queue();
      }, { passive: true });
      queue();
    });

    /* 5 · People loops: fetch + play only when near the viewport; pause when away */
    var vids = document.querySelectorAll('.pf-media video');
    if (vids.length) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) { p.catch(function () {}); } }
          else { v.pause(); }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      vids.forEach(function (v) { vio.observe(v); });
    }

    /* 6 · Buttons lean gently toward the cursor */
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
