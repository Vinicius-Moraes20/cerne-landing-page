/* ============================================================
   Cerne — landing page behaviour.

   Progressive enhancement only: with JavaScript disabled the page
   renders complete and readable. The `js` class is set inline in
   the document head, so animated elements are never painted in
   their finished state and then hidden.

   If anything here throws, `reveal-off` cancels the reveal effect
   and every section stays visible — a broken script must never
   leave the page blank.

   All scroll work happens in one requestAnimationFrame pass that
   reads geometry first and writes styles second, so it never
   forces a mid-frame layout.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = false;

  function cancelReveal() { root.classList.add('reveal-off'); }

  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* current year in the footer ------------------------------ */
    var ano = document.getElementById('ano');
    if (ano) ano.textContent = String(new Date().getFullYear());

    var supportsIO = 'IntersectionObserver' in window;

    /* ── reveal on scroll ───────────────────────────────────── */
    if (!supportsIO || reduced) {
      cancelReveal();
    } else {
      var targets = document.querySelectorAll(
        '.section-head, .frente, .feature, .projeto, .nucleo-inner, .etapa, ' +
        '.contato-text, .canais, .etapas'
      );

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      /* A percentage bottom margin can never be crossed by content
         that sits at the very end of the document — there is nothing
         left to scroll. A fixed offset always resolves. */
      }, { rootMargin: '0px 0px -60px 0px', threshold: 0 });

      Array.prototype.forEach.call(targets, function (el) {
        /* Stagger by position among siblings, so a row of three cards
           arrives in sequence while unrelated groups each start over. */
        var i = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = Math.min(i, 4) * 80 + 'ms';
        io.observe(el);
      });

      /* Landing on a deep link (#projetos, #contato) puts everything above
         the target off-screen, where it would never intersect. Show it. */
      window.addEventListener('load', function () {
        Array.prototype.forEach.call(targets, function (el) {
          if (el.classList.contains('is-in')) return;
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.style.transitionDelay = '0ms';
            el.classList.add('is-in');
            io.unobserve(el);
          }
        });
      });
    }

    /* ── header hairline once the page leaves the top ───────── */
    var head = document.querySelector('.site-head');
    if (head && supportsIO) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px';
      document.body.prepend(sentinel);
      new IntersectionObserver(function (entries) {
        head.classList.toggle('is-stuck', !entries[0].isIntersecting);
      }).observe(sentinel);
    }

    /* ── one scroll pass: progress, parallax, current section ── */
    var bar     = document.querySelector('.progress i');
    var mark    = document.querySelector('.hero-mark svg');
    var pattern = document.querySelector('.pattern svg');
    var band    = document.querySelector('.section-nucleo');

    var links = Array.prototype.filter.call(
      document.querySelectorAll('.nav a[href^="#"]'),
      function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }
    );
    var panes = links.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    });

    var current = -1;
    var queued = false;

    function pass() {
      queued = false;

      var vh = window.innerHeight;

      /* ---- read ---- */
      var y = window.scrollY || window.pageYOffset;
      var span = document.documentElement.scrollHeight - vh;
      var bandBox = (!reduced && pattern && band) ? band.getBoundingClientRect() : null;

      var active = -1;
      for (var i = 0; i < panes.length; i++) {
        /* the section under the header edge is the one you are in */
        if (panes[i].getBoundingClientRect().top <= 140) active = i;
      }

      /* ---- write ---- */
      if (bar) {
        bar.style.transform =
          'scaleX(' + (span > 0 ? Math.min(Math.max(y / span, 0), 1) : 0) + ')';
      }

      if (!reduced && mark) {
        /* Referenced to the top of the document, so the mark sits at its
           natural position on load and only drifts once you scroll.
           Capped so it cannot wander far from its column. */
        mark.style.setProperty('--py', Math.min(y * 0.1, 60).toFixed(1) + 'px');
      }

      if (bandBox) {
        /* Zero when the band is centred in the viewport, +/-1 at the
           extremes of its travel. Clamped so the drift stays bounded. */
        var t = (bandBox.top + bandBox.height / 2 - vh / 2) / vh;
        t = Math.min(Math.max(t, -1), 1);
        pattern.style.setProperty('--px', (t * -30).toFixed(1) + 'px');
      }

      if (active !== current) {
        if (links[current]) links[current].classList.remove('is-current');
        if (links[active]) links[active].classList.add('is-current');
        current = active;
      }
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(pass);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    pass();
  } catch (err) {
    cancelReveal();
  }
})();
