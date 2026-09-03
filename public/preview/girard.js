/* ==========================================================================
   Girard — shared behaviour
   Everything here is an enhancement. Nothing on any page depends on this file
   running: the CSS only hides content once the `js` class is present, and that
   class is added only when the browser can actually drive the reveals.
   ========================================================================== */
(function () {
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CAN = 'IntersectionObserver' in window;

  if (CAN) document.documentElement.classList.add('js');

  /* ---- reveal on scroll, once each, plus any counters inside ---- */
  if (CAN) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(function (n) {
          var to = +n.getAttribute('data-count');
          if (REDUCED || !to) { n.textContent = to || n.textContent; return; }
          var s = 0;
          (function step() {
            s += Math.max(1, to / 26);
            if (s >= to) { n.textContent = to; return; }
            n.textContent = Math.floor(s);
            requestAnimationFrame(step);
          })();
        });
        io.unobserve(e.target);
      });
    }, { threshold: .16 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---- images: only shown once they have actually decoded, so a file that
          does not exist yet leaves a composed frame rather than a broken box ---- */
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    var probe = new Image();
    probe.onload = function () {
      img.src = img.getAttribute('data-src');
      img.classList.add('loaded');
    };
    probe.src = img.getAttribute('data-src');
  });

  /* ---- scroll progress hairline ---- */
  var prog = document.querySelector('.prog');
  if (prog) {
    addEventListener('scroll', function () {
      var max = Math.max(1, document.body.scrollHeight - innerHeight);
      prog.style.width = (scrollY / max * 100) + '%';
    }, { passive: true });
  }

  /* ---- the surveyor's cursor, pointer devices only ---- */
  var cur = document.querySelector('.cur'), dot = document.querySelector('.cur-dot');
  if (cur && dot && matchMedia('(hover:hover)').matches) {
    document.body.classList.add('has-cursor');
    var cx = 0, cy = 0, tx = 0, ty = 0;
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
    });
    (function ease() {
      requestAnimationFrame(ease);
      cx += (tx - cx) * .18; cy += (ty - cy) * .18;
      cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    })();
    document.querySelectorAll('a,button,canvas,input,textarea,select').forEach(function (el) {
      el.addEventListener('pointerenter', function () { cur.classList.add('on'); });
      el.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
    });
  }

  /* ---- release the hero entrance ---- */
  document.body.classList.add('ready');
})();
