/* Back-office cost calculator — all arithmetic happens on this page; nothing is sent anywhere. */
(function () {
  'use strict';
  var h = document.getElementById('c-hours'), r = document.getElementById('c-rate');
  if (!h || !r) return;
  var $ = function (id) { return document.getElementById(id); };
  var gbp = function (n) { return '£' + Math.round(n).toLocaleString('en-GB'); };
  var STANDARD = 749, FOUNDING = 449;

  function keepLine(el, cost, price) {
    var diff = cost - price;
    el.textContent = diff > 0 ? gbp(diff) : '—';
  }

  function update() {
    var hours = +h.value, rate = +r.value;
    var monthHours = hours * 52 / 12, cost = monthHours * rate;
    $('o-hours').textContent = hours + (hours === 1 ? ' hour' : ' hours');
    $('o-rate').textContent = gbp(rate);
    $('r-month').textContent = gbp(cost);
    $('r-hours').textContent = Math.round(monthHours) + ' hours';
    keepLine($('r-keep'), cost, STANDARD);
    keepLine($('r-keepf'), cost, FOUNDING);
    $('r-verdict').textContent = cost > STANDARD
      ? 'At the standard rate, Pentadeva costs less than the time it gives back.'
      : 'Below our standard price — you may not need us yet. Email us anyway; we’ll tell you honestly.';
  }
  h.addEventListener('input', update);
  r.addEventListener('input', update);
  update();
}());
