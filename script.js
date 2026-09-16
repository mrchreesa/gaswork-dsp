/* DPS Gasworks: hero pipe layout and enquiry form (preview) */

(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------- Hero copper pipes ---------- */

  const hero = document.querySelector(".hero");
  const svg = hero && hero.querySelector(".pipes");
  const mark = document.querySelector(".site-header .brand-mark-hero");

  // Path through a list of points with a round elbow of radii[i] at each inner corner.
  function pipePath(points, radii) {
    const unit = (a, b) => {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      return [dx / len, dy / len];
    };
    const f = (n) => n.toFixed(1);
    let d = `M${f(points[0][0])} ${f(points[0][1])}`;
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const r = radii[i - 1];
      const d1 = unit(points[i - 1], p1);
      const d2 = unit(p1, points[i + 1]);
      const k = 0.5523 * r; // cubic approximation of a quarter circle
      const a = [p1[0] - d1[0] * r, p1[1] - d1[1] * r];
      const b = [p1[0] + d2[0] * r, p1[1] + d2[1] * r];
      d +=
        ` L${f(a[0])} ${f(a[1])}` +
        ` C${f(a[0] + d1[0] * k)} ${f(a[1] + d1[1] * k)} ${f(b[0] - d2[0] * k)} ${f(b[1] - d2[1] * k)} ${f(b[0])} ${f(b[1])}`;
    }
    const end = points[points.length - 1];
    return `${d} L${f(end[0])} ${f(end[1])}`;
  }

  function rect(group, x, y, w, h, cls) {
    const el = document.createElementNS(SVG_NS, "rect");
    el.setAttribute("x", x.toFixed(1));
    el.setAttribute("y", y.toFixed(1));
    el.setAttribute("width", w.toFixed(1));
    el.setAttribute("height", h.toFixed(1));
    el.setAttribute("rx", 2);
    if (cls) el.setAttribute("class", cls);
    group.appendChild(el);
  }

  // Where the logo's pipes leave the header (x 10 and 21 of its 48-unit box), relative to originLeft.
  function pipeMetrics(originLeft) {
    const markBox = mark.getBoundingClientRect();
    const scale = markBox.width / 48;
    const xA = markBox.left - originLeft + 10 * scale;
    const gap = 11 * scale; // centre-to-centre distance between the two pipes
    const u = (6.95 * scale) / 11; // fittings were drawn for an 11px pipe
    return { xA, xB: xA + gap, gap, u, bend: 46 * u };
  }

  function setPipe(target, name, points, radii) {
    const d = pipePath(points, radii);
    target.querySelectorAll(`[data-pipe="${name}"] path`).forEach((p) => p.setAttribute("d", d));
  }

  function layPipes() {
    const box = hero.getBoundingClientRect();
    const trustBox = hero.querySelector(".hero-trust").getBoundingClientRect();
    const photo = hero.querySelector(".hero-photo").getBoundingClientRect();
    const stacked = window.matchMedia("(max-width: 900px)").matches;
    const nuts = svg.querySelector(".pipe-nuts");
    nuts.replaceChildren();

    const { xA, xB, gap, u, bend } = pipeMetrics(box.left);

    if (!stacked) {
      // Down the left of the copy, elbow, then across into the photo.
      const y = trustBox.bottom - box.top + 64;
      const xEnd = photo.left - box.left;
      setPipe(svg, "outer", [[xA, -12], [xA, y], [xEnd, y]], [bend]);
      setPipe(svg, "inner", [[xB, -12], [xB, y - gap], [xEnd, y - gap]], [bend - gap]);

      rect(nuts, xA - 9 * u, 92, gap + 18 * u, 8 * u, "clip");
      rect(nuts, (xA + xEnd) / 2, y - gap - 9 * u, 8 * u, gap + 18 * u, "clip");
      rect(nuts, xEnd - 18 * u, y - 10 * u, 18 * u, 20 * u);
      rect(nuts, xEnd - 18 * u, y - gap - 10 * u, 18 * u, 20 * u);
    } else {
      // Down the channel left of the copy, across under it, then down into the photo.
      const y = trustBox.bottom - box.top + 40;
      const xRight = box.width - xA; // mirrors the left run
      const yEnd = photo.top - box.top;
      setPipe(svg, "outer", [[xA, -12], [xA, y], [xRight - gap, y], [xRight - gap, yEnd]], [bend, bend - gap]);
      setPipe(svg, "inner", [[xB, -12], [xB, y - gap], [xRight, y - gap], [xRight, yEnd]], [bend - gap, bend]);

      const actions = hero.querySelector(".hero-actions").getBoundingClientRect();
      rect(nuts, xA - 9 * u, actions.top - box.top - 4 * u, gap + 18 * u, 8 * u, "clip");
      rect(nuts, (xB + xRight) / 2, y - gap - 9 * u, 8 * u, gap + 18 * u, "clip");
      rect(nuts, xRight - gap - 10 * u, yEnd - 18 * u, 20 * u, 18 * u);
      rect(nuts, xRight - 10 * u, yEnd - 18 * u, 20 * u, 18 * u);
    }
  }

  // Once per frame at most, however many resize notifications arrive.
  function throttled(fn) {
    let queued = false;
    return () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        fn();
      });
    };
  }

  function onFontsReady(fn) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fn);
    } else {
      fn();
    }
  }

  if (hero && svg && mark) {
    onFontsReady(() => {
      layPipes();
      requestAnimationFrame(() => {
        mark.classList.add("is-laid");
        svg.classList.add("is-laid");
      });
      new ResizeObserver(throttled(layPipes)).observe(hero);
    });
  }

  /* ---------- Footer pipes: the logo's pipes run down the quote section and across the footer ---------- */

  const footerSvg = document.querySelector(".pipes-footer");
  const enquiry = document.querySelector("#enquiry");
  const footer = document.querySelector(".site-footer");
  const footerBase = footer && footer.querySelector(".footer-base");

  function layFooterPipes() {
    const top = enquiry.getBoundingClientRect().top;
    const base = footerBase.getBoundingClientRect();
    footerSvg.style.top = `${top + window.scrollY}px`;
    footerSvg.style.height = `${footer.getBoundingClientRect().bottom - top}px`;

    const nuts = footerSvg.querySelector(".pipe-nuts");
    nuts.replaceChildren();

    // Straight down under the sticky header's logo, elbow, then across as the footer's divider.
    const { xA, xB, gap, u, bend } = pipeMetrics(0);
    const y = base.top - top + gap / 2;
    const xEnd = base.right - parseFloat(getComputedStyle(footerBase).paddingRight);
    setPipe(footerSvg, "outer", [[xA, 0], [xA, y], [xEnd, y]], [bend]);
    setPipe(footerSvg, "inner", [[xB, 0], [xB, y - gap], [xEnd, y - gap]], [bend - gap]);

    const footerTop = footer.getBoundingClientRect().top - top;
    rect(nuts, xA - 9 * u, footerTop - 4 * u, gap + 18 * u, 8 * u, "clip");
    rect(nuts, (xB + xEnd) / 2, y - gap - 9 * u, 8 * u, gap + 18 * u, "clip");
    rect(nuts, xEnd - 18 * u, y - 10 * u, 18 * u, 20 * u);
    rect(nuts, xEnd - 18 * u, y - gap - 10 * u, 18 * u, 20 * u);
  }

  // Draw from just under the header, so the pipes appear to flow out of the logo.
  function runFooterPipes() {
    const nuts = footerSvg.querySelector(".pipe-nuts");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hidden = document.querySelector(".site-header").getBoundingClientRect().bottom - enquiry.getBoundingClientRect().top;
    const draw = 1400;

    footerSvg.querySelectorAll(".pipe").forEach((pipe, i) => {
      pipe.querySelectorAll("path").forEach((path) => {
        const from = Math.min(1, Math.max(0, 1 - hidden / path.getTotalLength()));
        path.style.strokeDashoffset = "0";
        if (reduce || !path.animate) return;
        path.animate([{ strokeDashoffset: String(from) }, { strokeDashoffset: "0" }], {
          duration: draw,
          delay: 100 + i * 100,
          easing: "cubic-bezier(0.2, 0.6, 0.35, 1)",
          fill: "backwards",
        });
      });
    });

    nuts.style.opacity = "1";
    if (!reduce && nuts.animate) {
      nuts.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, delay: draw, easing: "ease-out", fill: "backwards" });
    }
  }

  if (footerSvg && enquiry && footerBase && mark) {
    onFontsReady(() => {
      layFooterPipes();
      new ResizeObserver(throttled(layFooterPipes)).observe(document.body);

      // Start as the sticky header's bottom edge meets the top of the quote section.
      // The slack covers "Get a quote" links, which stop 8px short (scroll-padding-top).
      const header = document.querySelector(".site-header");
      function headerReached() {
        if (enquiry.getBoundingClientRect().top > header.getBoundingClientRect().bottom + 24) return;
        window.removeEventListener("scroll", headerReached);
        window.removeEventListener("resize", headerReached);
        runFooterPipes();
      }
      window.addEventListener("scroll", headerReached, { passive: true });
      window.addEventListener("resize", headerReached);
      headerReached();
    });
  }

  /* ---------- Menu dropdown (below 1080px) ---------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");

  if (menuToggle && menu) {
    const setMenu = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
      menu.classList.toggle("is-open", open);
    };

    menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));

    // A link jumps to its section, so close behind it.
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !menu.classList.contains("is-open")) return;
      setMenu(false);
      menuToggle.focus();
    });

    document.addEventListener("click", (e) => {
      if (menu.classList.contains("is-open") && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
        setMenu(false);
      }
    });

    window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- How it works: lay the pipe and fit the numbered nuts once the steps are in view ---------- */

  const steps = document.querySelector(".steps");

  if (steps) {
    if (!("IntersectionObserver" in window)) {
      steps.classList.add("is-laid");
    } else {
      const stepsSeen = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          stepsSeen.disconnect();
          steps.classList.add("is-laid");
        },
        { threshold: 0.35 }
      );
      stepsSeen.observe(steps);
    }
  }

  /* ---------- Mobile call bar: hide it while the hero buttons or the form are visible ---------- */

  const callBar = document.querySelector(".call-bar");
  const barTargets = [".hero-actions", "#enquiry"].map((s) => document.querySelector(s)).filter(Boolean);

  if (callBar && barTargets.length && "IntersectionObserver" in window) {
    const onScreen = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
      callBar.classList.toggle("is-hidden", onScreen.size > 0);
    });
    callBar.classList.add("is-hidden");
    barTargets.forEach((el) => observer.observe(el));
  }

  /* ---------- Enquiry form (preview only, nothing is sent) ---------- */

  const form = document.querySelector(".enquiry-form");
  if (!form) return;

  const checks = [
    { el: form.elements.name, valid: (v) => v.trim().length > 0 },
    { el: form.elements.phone, valid: (v) => v.replace(/\D/g, "").length >= 10 },
    { el: form.elements.service, valid: (v) => v !== "" },
  ];

  function showError(check, show) {
    const error = document.getElementById(`${check.el.id}-error`);
    error.hidden = !show;
    if (show) {
      check.el.setAttribute("aria-invalid", "true");
      check.el.setAttribute("aria-describedby", error.id);
    } else {
      check.el.removeAttribute("aria-invalid");
      check.el.removeAttribute("aria-describedby");
    }
  }

  checks.forEach((check) => {
    const evt = check.el.tagName === "SELECT" ? "change" : "input";
    check.el.addEventListener(evt, () => {
      if (check.el.getAttribute("aria-invalid") === "true" && check.valid(check.el.value)) {
        showError(check, false);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    checks.forEach((check) => {
      const ok = check.valid(check.el.value);
      showError(check, !ok);
      if (!ok && !firstInvalid) firstInvalid = check.el;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const name = form.elements.name.value.trim().split(/\s+/)[0];
    const done = form.querySelector(".form-done");
    done.querySelector("[data-name]").textContent = name ? `, ${name}` : "";
    form.querySelector(".form-body").hidden = true;
    done.hidden = false;
    done.focus();
  });
})();
