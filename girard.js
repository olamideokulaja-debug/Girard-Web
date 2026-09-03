/* =====================================================================
   Girard Property Limited, shared behaviour.
   Nothing here is load-bearing: every page reads correctly with this file
   blocked, which is the rule the last two redesigns broke.
   ===================================================================== */
(function () {
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window) document.documentElement.classList.add('js');

  /* --- the navigation goes solid once you leave the masthead --- */
  var nav = document.querySelector('.nav');
  var prog = document.querySelector('.prog');
  function onScroll() {
    if (nav) nav.classList.toggle('solid', scrollY > 40);
    if (prog) prog.style.width =
      (scrollY / Math.max(1, document.body.scrollHeight - innerHeight) * 100) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- reveals and counters --- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(function (n) {
          if (REDUCED) return;
          var to = +n.getAttribute('data-count'), s = 0;
          n.textContent = '0';
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

  /* --- the surveyor's mark cursor --- */
  var cur = document.getElementById('cur'), dot = document.getElementById('curdot');
  if (cur && dot && matchMedia('(hover:hover)').matches) {
    document.body.classList.add('hascur');
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
    document.querySelectorAll('a,button,canvas,input,select,textarea').forEach(function (el) {
      el.addEventListener('pointerenter', function () { cur.classList.add('on'); });
      el.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
    });
  }

  /* --- photographs load only once they exist, so a file that has not been
         made yet leaves a composed navy frame rather than a broken icon --- */
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    var probe = new Image();
    probe.onload = function () {
      img.src = img.getAttribute('data-src');
      img.classList.add('loaded');
    };
    probe.onerror = function () { /* leave the frame empty and composed */ };
    probe.src = img.getAttribute('data-src');
  });

  document.body.classList.add('ready');
  window.GIRARD_REDUCED = REDUCED;
})();
