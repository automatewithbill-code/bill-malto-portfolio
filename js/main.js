/* ============================================================
   BILL MALTO — site engine
   Lenis smooth scroll · GSAP ScrollTrigger · video scrubbing
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {};
  var mq = window.matchMedia ? window.matchMedia.bind(window) : function () { return { matches: false }; };
  var reduceMotion = mq("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) document.body.classList.add("rm");

  /* ---------- Lenis smooth scrolling ---------- */
  var lenis = null;
  if (!reduceMotion && typeof Lenis !== "undefined") {
    try {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      var rafLoop = function (t) { lenis.raf(t); requestAnimationFrame(rafLoop); };
      requestAnimationFrame(rafLoop);
      if (hasGSAP) lenis.on("scroll", ScrollTrigger.update);
    } catch (err) {
      lenis = null; /* native scroll still works */
      console.warn("[site] smooth scroll unavailable, using native scroll.", err);
    }
  }
  function scrollToTarget(target, offset) {
    if (lenis) { lenis.start(); lenis.scrollTo(target, { offset: offset || 0, duration: 1.4 }); }
    else {
      var el = typeof target === "string" ? document.querySelector(target) : target;
      if (typeof target === "number") window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
      else if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  /* ---------- Anchor + contact wiring ---------- */
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (href && href.charAt(0) === "#") { e.preventDefault(); scrollToTarget(href, -10); }
    });
  });
  /* ---------- Booking modal (Calendly embedded in-page) ---------- */
  var bookbox = document.getElementById("bookbox");
  var bookFrame = document.getElementById("bookboxFrame");
  var bookLastFocus = null;
  function bookingEmbedUrl() {
    var base = CFG.bookingUrl || "";
    if (!base) return "";
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep + "embed_domain=" + encodeURIComponent(location.hostname || "localhost") +
      "&embed_type=Inline&hide_gdpr_banner=1&primary_color=10b981";
  }
  function openBooking() {
    if (!bookbox || !CFG.bookingUrl) return;
    bookLastFocus = document.activeElement;
    if (!bookFrame.getAttribute("src")) {
      bookFrame.addEventListener("load", function () { bookbox.classList.add("is-loaded"); }, { once: true });
      bookFrame.setAttribute("src", bookingEmbedUrl());
    }
    bookbox.hidden = false;
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
    bookbox.querySelector(".bookbox__close").focus();
  }
  function closeBooking() {
    if (!bookbox || bookbox.hidden) return;
    bookbox.hidden = true;
    document.body.classList.remove("modal-open");
    if (lenis) lenis.start();
    if (bookLastFocus && bookLastFocus.focus) bookLastFocus.focus();
  }
  document.querySelectorAll("[data-book]").forEach(function (a) {
    a.setAttribute("href", CFG.bookingUrl || "#");
    a.addEventListener("click", function (e) {
      if (!CFG.bookingUrl || !bookbox) return; /* no modal available: follow the link */
      e.preventDefault();
      openBooking();
    });
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-close-book]")) closeBooking();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeBooking(); });
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.setAttribute("href", "mailto:" + (CFG.email || ""));
  });
  document.querySelectorAll("[data-ext]").forEach(function (a) {
    var url = CFG[a.getAttribute("data-ext")];
    if (url) { a.setAttribute("href", url); a.hidden = false; } else { a.hidden = true; }
  });
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Work-card tags: inject platform logos when configured */
  document.querySelectorAll(".tag[data-plat]").forEach(function (t) {
    var logo = (CFG.platformLogos || {})[t.getAttribute("data-plat")];
    if (logo) {
      t.classList.add("tag--logo");
      var img = document.createElement("img");
      img.src = logo; img.alt = ""; img.loading = "lazy";
      t.insertBefore(img, t.firstChild);
    }
  });

  /* ---------- Nav background on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() { nav.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var mmenu = document.getElementById("mmenu");
  if (burger && mmenu) {
    var closeMenu = function () {
      if (mmenu.hidden) return;
      mmenu.hidden = true;
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("modal-open");
      if (lenis) lenis.start();
    };
    burger.addEventListener("click", function () {
      if (mmenu.hidden) {
        mmenu.hidden = false;
        burger.classList.add("is-open");
        burger.setAttribute("aria-expanded", "true");
        document.body.classList.add("modal-open");
        if (lenis) lenis.stop();
      } else { closeMenu(); }
    });
    mmenu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Hero name: split into animatable letters ---------- */
  var heroLines = document.querySelectorAll(".hero__line");
  var allChars = [];
  heroLines.forEach(function (line) {
    var word = line.getAttribute("data-word") || "";
    word.split("").forEach(function (c) {
      var s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      line.appendChild(s);
      allChars.push(s);
    });
  });

  /* ---------- Video helpers ---------- */
  function attachVideo(id, url, wrapClassTarget, wrapClass) {
    var v = document.getElementById(id);
    if (!v) return null;
    if (!url) { v.remove(); return null; }
    /* data-saver: on small screens don't pre-download full clips */
    if (mq("(max-width: 767px)").matches && v.getAttribute("preload") === "auto") v.preload = "metadata";
    v.src = url;
    v.addEventListener("loadeddata", function () {
      v.classList.add("is-ready");
      if (wrapClassTarget && wrapClass) wrapClassTarget.classList.add(wrapClass);
    });
    v.addEventListener("error", function () {
      console.warn("[site] video failed to load: " + id + " — showing fallback backdrop.");
      v.remove();
    });
    return v;
  }

  var heroSection = document.querySelector(".hero");
  var heroVideo = attachVideo("heroVideo", CFG.videos && CFG.videos.heroOrbit, heroSection, "hero--hasvideo");
  var builderVideo = attachVideo("builderVideo", CFG.videos && CFG.videos.builder);
  var expertVideo = attachVideo("expertVideo", CFG.videos && CFG.videos.expert);
  var closerVideo = attachVideo("closerVideo", CFG.videos && CFG.videos.closer);

  /* Background clips: play only while on screen (battery-friendly). */
  [builderVideo, expertVideo, closerVideo].forEach(function (v) {
    if (!v) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { v.play().catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.15 });
    io.observe(v.closest("section") || v);
  });

  /* ---------- Preloader → intro ---------- */
  var pre = document.getElementById("preloader");
  var introDone = reduceMotion || !hasGSAP;
  function intro() {
    if (pre.classList.contains("is-done")) return;
    pre.classList.add("is-done");
    if (reduceMotion || !hasGSAP) {
      allChars.forEach(function (c) { c.style.transform = "none"; c.style.opacity = "1"; });
      return;
    }
    gsap.set(allChars, { y: "110%", rotate: 4, opacity: 0 });
    gsap.to(allChars, {
      y: 0, rotate: 0, opacity: 1,
      duration: 1.1, ease: "power4.out",
      stagger: 0.045, delay: 0.15,
      onComplete: function () {
        allChars.forEach(function (c) { gsap.set(c, { clearProps: "all" }); c.style.opacity = "1"; });
        introDone = true;
      }
    });
  }
  window.addEventListener("load", function () { setTimeout(intro, 200); });
  /* safety: never leave the preloader up */
  setTimeout(function () { if (!pre.classList.contains("is-done")) intro(); }, 3500);

  /* ============================================================
     HERO — pin + scrub the 360° orbit clip (Lando-style)
     Scroll progress drives video.currentTime with lerp smoothing,
     and the name letters track the same progress (kinetic type).
     ============================================================ */
  var heroProgress = 0;
  if (hasGSAP && !reduceMotion) {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "+=260%",
      pin: ".hero__pin",
      scrub: true,
      refreshPriority: 5,
      onUpdate: function (self) { heroProgress = self.progress; }
    });

    /* Smooth video seek loop */
    var lastSeek = 0;
    gsap.ticker.add(function () {
      if (heroVideo && heroVideo.readyState >= 2 && heroVideo.duration) {
        var target = heroProgress * (heroVideo.duration - 0.05);
        var cur = heroVideo.currentTime;
        var next = cur + (target - cur) * 0.14;           /* lerp for silky scrubbing */
        if (Math.abs(next - cur) > 0.001) {
          var now = performance.now();
          if (now - lastSeek > 16) { heroVideo.currentTime = next; lastSeek = now; }
        }
      }
      /* Kinetic type synchronized with the same scroll progress */
      if (!introDone) return;
      var p = heroProgress;
      for (var i = 0; i < allChars.length; i++) {
        var k = i / Math.max(1, allChars.length - 1);
        var drift = Math.sin(p * Math.PI) * 26 * (k - 0.5) * 2;  /* letters spread apart mid-orbit */
        allChars[i].style.setProperty("transform", "translateX(" + drift.toFixed(2) + "px)");
      }
      var content = document.querySelector(".hero__content");
      if (content) content.style.opacity = String(1 - Math.max(0, (p - 0.72)) / 0.28);
    });
  } else if (heroVideo) {
    /* Reduced motion / no GSAP: park on a representative frame */
    heroVideo.addEventListener("loadeddata", function () { heroVideo.currentTime = 1.2; });
  }

  /* ============================================================
     SERVICES — pinned, revealing one platform at a time
     ============================================================ */
  var services = Array.prototype.slice.call(document.querySelectorAll(".service"));
  var railBtns = Array.prototype.slice.call(document.querySelectorAll("[data-service-btn]"));
  var serviceST = null;
  function setService(i) {
    services.forEach(function (s, j) { s.classList.toggle("is-active", i === j); });
    railBtns.forEach(function (b, j) { b.classList.toggle("is-active", i === j); });
  }
  railBtns.forEach(function (b, i) {
    b.addEventListener("click", function () {
      setService(i); /* instant feedback; scroll position confirms below */
      if (serviceST) {
        var st = serviceST;
        var pos = st.start + (st.end - st.start) * ((i + 0.5) / services.length);
        scrollToTarget(pos);
      }
    });
  });
  var desktop = mq("(min-width: 961px)").matches;
  if (hasGSAP && !reduceMotion && desktop) {
    serviceST = ScrollTrigger.create({
      trigger: ".services",
      start: "top top",
      end: "+=" + services.length * 90 + "%",
      pin: ".services__pin",
      scrub: true,
      refreshPriority: 4,
      onUpdate: function (self) {
        var i = Math.min(services.length - 1, Math.floor(self.progress * services.length));
        setService(i);
      }
    });
  }

  /* ============================================================
     THREE PILLARS — pinned over Clip 2, one word at a time
     ============================================================ */
  var pillars = Array.prototype.slice.call(document.querySelectorAll(".pillar"));
  function setPillar(i) { pillars.forEach(function (p, j) { p.classList.toggle("is-active", i === j); }); }
  setPillar(0);
  if (hasGSAP && !reduceMotion) {
    ScrollTrigger.create({
      trigger: ".pillars",
      start: "top top",
      end: "+=" + pillars.length * 85 + "%",
      pin: ".pillars__pin",
      scrub: true,
      refreshPriority: 2,
      onUpdate: function (self) {
        var i = Math.min(pillars.length - 1, Math.floor(self.progress * pillars.length));
        setPillar(i);
      }
    });
  } else {
    document.body.classList.add("pillars-static");
  }

  /* ============================================================
     PROJECTS — rendered from config, with case-study viewer
     ============================================================ */
  var PLATFORM_META = {
    "n8n":         { cls: "n8n",    glyph: "⬡" },
    "Make.com":    { cls: "make",   glyph: "◍" },
    "Zapier":      { cls: "zapier", glyph: "⚡" },
    "GoHighLevel": { cls: "ghl",    glyph: "▤" }
  };
  function platformMeta(p) { return PLATFORM_META[p] || { cls: "n8n", glyph: "⬡" }; }
  function tagHTML(platform) {
    var logo = (CFG.platformLogos || {})[platform];
    return logo
      ? '<span class="tag tag--logo"><img src="' + logo + '" alt="" loading="lazy">' + platform + "</span>"
      : '<span class="tag">' + platform + "</span>";
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }

  var projectsData = CFG.projects || [];
  var projectsGrid = document.getElementById("projectsGrid");
  if (projectsGrid) {
    var projectsSection = document.getElementById("projects");
    var projPlatforms = [];
    projectsData.forEach(function (p) { if (projPlatforms.indexOf(p.platform) === -1) projPlatforms.push(p.platform); });

    /* one row per platform; cards numbered within their platform */
    var projRows = [];
    projPlatforms.forEach(function (plat) {
      var row = document.createElement("div");
      row.className = "prow";
      row.setAttribute("data-platform", plat);
      projectsGrid.appendChild(row);
      projRows.push(row);
    });
    var platCounts = {};
    projectsData.forEach(function (p, i) {
      var meta = platformMeta(p.platform);
      platCounts[p.platform] = (platCounts[p.platform] || 0) + 1;
      var j = platCounts[p.platform];
      var card = document.createElement("article");
      card.className = "project reveal";
      card.setAttribute("data-platform", p.platform);
      card.setAttribute("data-open-project", String(i));
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "View project: " + p.title);
      card.style.setProperty("--d", (((j - 1) % 2) * 0.12) + "s");
      var num = '<span class="project__num">' + (j < 10 ? "0" : "") + j + "</span>";
      var media = (p.images && p.images.length)
        ? '<div class="project__media"><img src="' + p.images[0] + '" alt="' + esc(p.title) + ' screenshot" loading="lazy">' + tagHTML(p.platform) + num + "</div>"
        : '<div class="project__media"><span class="project__glyphwrap"><span class="project__glyph">' + meta.glyph + "</span></span>" + tagHTML(p.platform) + num + "</div>";
      var tools = p.tools || [];
      var chips = tools.slice(0, 4).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
      if (tools.length > 4) chips += "<span>+" + (tools.length - 4) + "</span>";
      card.innerHTML =
        media +
        '<div class="project__body">' +
        '<h3 class="project__title">' + esc(p.title) + "</h3>" +
        '<p class="project__summary">' + esc(p.summary) + "</p>" +
        '<div class="project__chips">' + chips + "</div>" +
        "</div>" +
        '<div class="project__foot"><span>View case study</span><span class="project__arrow" aria-hidden="true">→</span></div>';
      projRows[projPlatforms.indexOf(p.platform)].appendChild(card);
    });

    /* cursor spotlight on cards */
    projectsGrid.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".project");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(2) + "%");
      card.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(2) + "%");
    });
    var note = document.getElementById("projectsNote");
    if (note && projectsData.length && projectsData.every(function (p) { return !p.sample; })) note.hidden = true;

    /* platform rail (no "All" — one platform at a time) */
    var filterWrap = document.getElementById("projectsFilter");
    var projST = null;
    var projWeights = projPlatforms.map(function (plat) {
      return projectsData.filter(function (p) { return p.platform === plat; }).length;
    });
    var projTotal = projWeights.reduce(function (a, b) { return a + b; }, 0);
    var projCum = [0];
    projWeights.forEach(function (w, i) { projCum.push(projCum[i] + w); });

    function setActivePlatform(i) {
      projRows.forEach(function (row, j) {
        row.classList.toggle("is-active", i === j);
        if (i === j) row.querySelectorAll(".project").forEach(function (c) { c.classList.add("is-in"); });
      });
      if (filterWrap) filterWrap.querySelectorAll("button").forEach(function (b, j) {
        b.classList.toggle("is-active", i === j);
      });
    }

    if (filterWrap) {
      projPlatforms.forEach(function (label, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("data-filter", label);
        var logo = (CFG.platformLogos || {})[label];
        b.innerHTML = (logo ? '<img src="' + logo + '" alt="">' : "") + "<span>" + esc(label) + "</span><i>" + projWeights[i] + "</i>";
        b.addEventListener("click", function () {
          if (projST) {
            var pos = projST.start + (projST.end - projST.start) * ((projCum[i] + 0.02) / projTotal);
            scrollToTarget(pos);
          } else {
            setActivePlatform(i);
            if (hasGSAP && !reduceMotion) ScrollTrigger.refresh();
          }
        });
        filterWrap.appendChild(b);
      });
    }
    setActivePlatform(0);

    /* pinned scroll: step through platforms in order, scrubbing each row */
    if (hasGSAP && !reduceMotion && desktop) {
      window.addEventListener("load", function () {
        projectsSection.classList.add("projects--pinned");
        projectsGrid.querySelectorAll(".project").forEach(function (c) { c.classList.add("is-in"); });
        var sizeStage = function () {
          var h = 0;
          projRows.forEach(function (row) { h = Math.max(h, row.scrollHeight); });
          projectsGrid.style.height = (h + 44) + "px";
        };
        sizeStage();
        projST = ScrollTrigger.create({
          trigger: "#projects",
          start: "top top",
          end: "+=" + (projTotal * 320),
          pin: ".projects__pin",
          scrub: true,
          refreshPriority: 3,
          invalidateOnRefresh: true,
          onRefresh: sizeStage,
          onUpdate: function (self) {
            var p = self.progress * projTotal;
            var i = 0;
            while (i < projPlatforms.length - 1 && p >= projCum[i + 1]) i++;
            setActivePlatform(i);
            var q = Math.min(1, Math.max(0, (p - projCum[i]) / projWeights[i]));
            var row = projRows[i];
            var shift = Math.max(0, row.scrollWidth - document.documentElement.clientWidth);
            gsap.set(row, { x: -q * shift });
          }
        });
        ScrollTrigger.refresh();
      });
    }
  }

  /* --- project viewer modal --- */
  var pmodal = document.getElementById("pmodal");
  var pmodalImg = document.getElementById("pmodalImg");
  var pmodalPlaceholder = document.getElementById("pmodalPlaceholder");
  var pmodalGlyph = document.getElementById("pmodalGlyph");
  var pmodalThumbs = document.getElementById("pmodalThumbs");
  var lastFocus = null;

  function showShot(src) {
    pmodalImg.src = src;
    pmodalImg.hidden = false;
    pmodalPlaceholder.hidden = true;
    pmodalThumbs.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-src") === src);
    });
  }
  function openProject(i) {
    var p = projectsData[i];
    if (!p || !pmodal) return;
    lastFocus = document.activeElement;
    document.getElementById("pmodalTag").outerHTML = tagHTML(p.platform).replace('class="tag', 'id="pmodalTag" class="tag');
    document.getElementById("pmodalTitle").textContent = p.title;
    document.getElementById("pmodalSummary").textContent = p.summary;
    document.getElementById("pmodalWhat").textContent = p.what;
    document.getElementById("pmodalTools").textContent = (p.tools || []).join(" · ");
    document.getElementById("pmodalImpact").textContent = p.impact;
    pmodalThumbs.innerHTML = "";
    if (p.images && p.images.length) {
      p.images.forEach(function (src, j) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("data-src", src);
        b.setAttribute("aria-label", "Screenshot " + (j + 1));
        b.innerHTML = '<img src="' + src + '" alt="" loading="lazy">';
        b.addEventListener("click", function () { showShot(src); });
        pmodalThumbs.appendChild(b);
      });
      showShot(p.images[0]);
      pmodalThumbs.hidden = p.images.length < 2;
    } else {
      pmodalImg.hidden = true;
      pmodalPlaceholder.hidden = false;
      pmodalGlyph.textContent = platformMeta(p.platform).glyph;
      pmodalThumbs.hidden = true;
    }
    pmodal.hidden = false;
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
    pmodal.querySelector(".pmodal__close").focus();
  }
  function closeProject() {
    if (!pmodal || pmodal.hidden) return;
    pmodal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lenis) lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var open = e.target.closest("[data-open-project]");
    if (open) { openProject(parseInt(open.getAttribute("data-open-project"), 10)); return; }
    if (e.target.closest("[data-close-modal]")) closeProject();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeProject(); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target.closest) {
      var open = e.target.closest("article[data-open-project]");
      if (open) { e.preventDefault(); openProject(parseInt(open.getAttribute("data-open-project"), 10)); }
    }
  });

  /* ============================================================
     CERTIFICATIONS — rendered from config, click for full size
     ============================================================ */
  var certsGrid = document.getElementById("certsGrid");
  var certsData = CFG.certifications || [];
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  if (certsGrid && certsData.length) {
    var certsNote = document.getElementById("certsNote");
    if (certsNote) certsNote.textContent = CFG.certificationsNote || "";
    certsData.forEach(function (ct, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cert reveal";
      b.setAttribute("data-open-cert", i);
      b.style.setProperty("--d", ((i % 3) * 0.1) + "s");
      b.innerHTML =
        '<span class="cert__num">' + pad2(i + 1) + " / " + pad2(certsData.length) + "</span>" +
        '<span class="cert__imgwrap"><img src="' + ct.image + '" alt="' + esc(ct.title) + ' certificate" loading="lazy"></span>' +
        '<span class="cert__title">' + esc(ct.title) + "</span>" +
        '<span class="cert__meta">' + esc(ct.issuer) + " · " + esc(ct.date) + "</span>" +
        '<span class="cert__view">View credential</span>';
      certsGrid.appendChild(b);
    });

    /* pinned horizontal filmstrip (desktop); swipe/scroll fallback elsewhere */
    var certsSectionEl = document.getElementById("certifications");
    var certsBar = document.getElementById("certsBar");
    var certsCountEl = document.getElementById("certsCount");
    if (certsCountEl) certsCountEl.textContent = "01 / " + pad2(certsData.length);
    if (hasGSAP && !reduceMotion && desktop) {
      window.addEventListener("load", function () {
        var dist = certsGrid.scrollWidth - document.documentElement.clientWidth;
        if (dist < 60) return; /* everything already fits — no pin needed */
        certsSectionEl.classList.add("certs--pinned");
        var certDist = function () { return Math.max(0, certsGrid.scrollWidth - document.documentElement.clientWidth); };
        gsap.to(certsGrid, {
          x: function () { return -certDist(); },
          ease: "none",
          scrollTrigger: {
            trigger: "#certifications",
            start: "top top",
            end: function () { return "+=" + Math.round(certDist()); },
            pin: ".certs__pin",
            scrub: true,
            refreshPriority: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              if (certsBar) certsBar.style.transform = "scaleX(" + self.progress + ")";
              if (certsCountEl) {
                var n = Math.min(certsData.length, Math.floor(self.progress * certsData.length) + 1);
                certsCountEl.textContent = pad2(n) + " / " + pad2(certsData.length);
              }
            }
          }
        });
        ScrollTrigger.refresh();
      });
    }
  } else if (certsGrid) {
    var certsSection = document.getElementById("certifications");
    if (certsSection) certsSection.hidden = true;
  }

  var certbox = document.getElementById("certbox");
  var certLastFocus = null;
  function openCert(i) {
    var ct = certsData[i];
    if (!ct || !certbox) return;
    certLastFocus = document.activeElement;
    document.getElementById("certboxImg").src = ct.image;
    document.getElementById("certboxImg").alt = ct.title + " certificate";
    document.getElementById("certboxCaption").textContent = ct.title + " — " + ct.issuer + " · " + ct.date;
    certbox.hidden = false;
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
    certbox.querySelector(".certbox__close").focus();
  }
  function closeCert() {
    if (!certbox || certbox.hidden) return;
    certbox.hidden = true;
    document.body.classList.remove("modal-open");
    if (lenis) lenis.start();
    if (certLastFocus && certLastFocus.focus) certLastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var open = e.target.closest("[data-open-cert]");
    if (open) { openCert(parseInt(open.getAttribute("data-open-cert"), 10)); return; }
    if (e.target.closest("[data-close-cert]")) closeCert();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCert(); });

  /* ---------- Reveal on scroll ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealIO.observe(el); });

  /* ---------- Stats: build from config + count up on scroll ---------- */
  var grid = document.getElementById("statsGrid");
  (CFG.stats || []).forEach(function (s) {
    var d = document.createElement("div");
    d.className = "stat";
    d.innerHTML = '<span class="stat__value"><span class="stat__num" data-target="' + s.value + '">0</span><b>' + s.suffix + "</b></span>" +
                  '<span class="stat__label">' + s.label + "</span>";
    grid.appendChild(d);
  });
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString("en-US"); return; }
    var t0 = performance.now(), dur = 1600;
    function tick(t) {
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var statsIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.querySelectorAll(".stat__num").forEach(countUp);
        statsIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.35 });
  var statsSection = document.getElementById("stats");
  if (statsSection) statsIO.observe(statsSection);

  /* ============================================================
     CINEMATIC DEPTH PASS — proof band, parallax, tilt,
     hero node-field, theme toggle, scroll progress
     ============================================================ */

  /* --- proof band: certification chips under the stats --- */
  var proofWrap = document.getElementById("statsProof");
  if (proofWrap && (CFG.certifications || []).length) {
    var proofLabel = document.createElement("span");
    proofLabel.className = "stats__proof-label";
    proofLabel.textContent = "Certified";
    proofWrap.appendChild(proofLabel);
    CFG.certifications.forEach(function (ct) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = ct.title
        .replace(/^AI Automation with /, "")
        .replace(/^No Code Automation with /, "")
        .replace(/ Web Page Building & Maintenance$/, "");
      b.addEventListener("click", function () { scrollToTarget("#certifications", -10); });
      proofWrap.appendChild(b);
    });
  }

  /* --- scroll progress bar --- */
  var sbarFill = document.getElementById("scrollbarFill");
  if (sbarFill) {
    var sbarUpd = function () {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      sbarFill.style.transform = "scaleX(" + (max > 0 ? (window.scrollY / max).toFixed(4) : 0) + ")";
    };
    window.addEventListener("scroll", sbarUpd, { passive: true });
    window.addEventListener("resize", sbarUpd);
    sbarUpd();
  }

  /* --- depth parallax: background media drifts slower than content --- */
  if (hasGSAP && !reduceMotion) {
    [[".work", ".work__media"], [".finale", ".finale__media"]].forEach(function (pair) {
      var sec = document.querySelector(pair[0]);
      var med = document.querySelector(pair[1]);
      if (!sec || !med) return;
      gsap.fromTo(med, { yPercent: -6 }, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* --- cursor perspective tilt (desktop, fine pointer only) --- */
  if (desktop && !reduceMotion && mq("(pointer: fine)").matches) {
    document.querySelectorAll(".project__media,.service__visual").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ty", (px * 6).toFixed(2) + "deg");
        el.style.setProperty("--tx", (-py * 5).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--tx", "0deg");
        el.style.setProperty("--ty", "0deg");
      });
    });
  }

  /* --- hero node-field: drifting automation nodes over the orbit clip --- */
  (function heroField() {
    var canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    if (reduceMotion || !desktop) { canvas.remove(); return; }
    var ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    var DPR = Math.min(1.5, window.devicePixelRatio || 1);
    var W = 0, H = 0;
    function sizeField() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, W * DPR); canvas.height = Math.max(1, H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    sizeField();
    window.addEventListener("resize", sizeField);
    var N = 42, nodes = [];
    for (var i = 0; i < N; i++) {
      nodes.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0007, vy: (Math.random() - 0.5) * 0.0007 });
    }
    var fieldVisible = true;
    new IntersectionObserver(function (en) { fieldVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    var lastT = 0;
    function tickField(t) {
      requestAnimationFrame(tickField);
      if (!fieldVisible || t - lastT < 33) return; /* ~30fps cap */
      lastT = t;
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b2;
      for (i = 0; i < N; i++) {
        a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > 1) a.vx *= -1;
        if (a.y < 0 || a.y > 1) a.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < N; i++) {
        a = nodes[i];
        for (j = i + 1; j < N; j++) {
          b2 = nodes[j];
          var dx = (a.x - b2.x) * (W / H), dy = a.y - b2.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 0.02) {
            ctx.strokeStyle = "rgba(56,224,164," + (0.11 * (1 - d2 / 0.02)).toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b2.x * W, b2.y * H);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(56,224,164,.55)";
      for (i = 0; i < N; i++) {
        a = nodes[i];
        ctx.beginPath();
        ctx.arc(a.x * W, a.y * H, 1.6, 0, 6.2832);
        ctx.fill();
      }
    }
    requestAnimationFrame(tickField);
  })();

  /* ============================================================
     CHAT WIDGET — "Chat with Bill"
     ============================================================ */
  var chatToggle = document.getElementById("chatToggle");
  var chatPanel = document.getElementById("chatPanel");
  var chatClose = chatPanel.querySelector(".chat__close");
  var chatLog = document.getElementById("chatLog");
  var chatInput = document.getElementById("chatInput");
  var chatSend = document.getElementById("chatSend");

  function openChat() {
    chatPanel.hidden = false;
    chatToggle.setAttribute("aria-expanded", "true");
    setTimeout(function () { chatInput.focus(); }, 150);
  }
  function closeChat() {
    chatPanel.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggle.focus();
  }
  function say(text, who) {
    var m = document.createElement("div");
    m.className = "chat__msg chat__msg--" + who;
    m.textContent = text;
    chatLog.appendChild(m);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  function botSay(text) { setTimeout(function () { say(text, "bot"); }, 350); }

  chatToggle.addEventListener("click", function () { chatPanel.hidden ? openChat() : closeChat(); });
  chatClose.addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !chatPanel.hidden) closeChat(); });
  document.querySelectorAll("[data-open-chat]").forEach(function (b) { b.addEventListener("click", openChat); });

  document.getElementById("chatQuick").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-q]");
    if (!btn) return;
    var q = btn.getAttribute("data-q");
    say(btn.textContent, "user");
    var answers = CFG.chatAnswers || {};
    if (q === "book") {
      botSay("Great — opening my calendar so you can grab a slot.");
      if (CFG.bookingUrl) setTimeout(function () { closeChat(); openBooking(); }, 900);
    } else if (q === "cv") {
      botSay("Of course — here's Bill's CV as a PDF.");
      setTimeout(function () {
        var dl = document.createElement("a");
        dl.className = "chat__bookbtn";
        dl.href = "assets/Bill-Malto-CV.pdf";
        dl.setAttribute("download", "");
        dl.textContent = "Download CV (PDF)";
        chatLog.appendChild(dl);
        chatLog.scrollTop = chatLog.scrollHeight;
      }, 700);
    } else if (q === "projects") {
      botSay(answers.projects || "Check the Projects section above.");
      setTimeout(function () { closeChat(); scrollToTarget("#projects", -10); }, 900);
    } else {
      botSay(answers[q] || "Send me a message and I'll get back to you.");
    }
  });

  /* ---- AI chat via Groq (email fallback if unavailable) ---- */
  var GROQ = CFG.groq || {};
  var chatHistory = [];
  var chatBusy = false;

  function chatSystemPrompt() {
    return [
      "You are the friendly AI assistant on the portfolio website of Bill M. Malto, an AI Automation Specialist based in Pasig City, Metro Manila, Philippines.",
      "Answer questions about Bill's background, skills, experience, education, and projects using ONLY the facts below (they come from his CV). If a detail is not covered here, say you don't have it and suggest booking the free call or emailing " + (CFG.email || "Bill") + ".",
      "PROFILE: Bill builds intelligent, no-code systems that save businesses time and drive measurable results. He designs and deploys automated workflows using n8n, Make.com, Zapier, and Claude, with CRM and marketing automation in GoHighLevel. Years of BPO technical and customer service experience plus hands-on AI/LLM training work give him both the builder's and the end-user's perspective.",
      "CORE SKILLS: AI automation with n8n, Make.com, Zapier (workflow design, triggers, multi-app integrations); AI tools and LLMs: Claude (AI-assisted workflows, prompt design, content and data processing); CRM and marketing: GoHighLevel (pipelines, lead nurturing, campaign and follow-up automation); integrations: APIs, webhooks, third-party tools, data entry and management automation; support and data: technical/customer support via chat and email, AI data annotation across image, video, audio, and text.",
      "EXPERIENCE: (1) No-Code AI Automation Specialist, freelance, Feb 2025 to present — end-to-end AI automation solutions, AI-assisted workflows with Claude, GoHighLevel CRM and marketing automation, API integrations. (2) AI Data Annotator for LLM training, 2026 to present, a 6-month project-based contract concurrent with freelance work — annotating and evaluating multimodal datasets under strict quality guidelines. (3) Technical & Customer Service Representative, Dec 2019 to Jan 2025, at WNS Philippines, Sutherland Global Services, and Concentrix CVG Philippines — chat and email support for U.S.-based clients with high customer satisfaction.",
      "EDUCATION: BS in Information Technology, Computer Arts & Technological College Inc., 2011-2016. LANGUAGES: English and Filipino.",
      "CERTIFICATIONS: Tara AI Community / Technical Virtual Assistants PH — AI Automation with n8n, Make.com, Zapier, HighLevel CRM, Prompt Engineering, and WordPress.",
      "The website has a Projects section with real case studies on all four platforms, a Certifications section, and an About section.",
      "Bill's CV is downloadable as a PDF: when someone asks for his CV, resume, credentials document, or wants to download his background, tell them a Download CV button will appear right below your reply (there is also one in the site header).",
      "Visitors can book a free 30-minute automation call using the 'Book a Free Call' button, or email Bill at " + (CFG.email || "the address in the footer") + ".",
      "Guidelines: keep replies short (1-3 sentences), warm and professional, plain text only — no markdown.",
      "For pricing, timelines, or project specifics, recommend booking the free call.",
      "Never invent clients, statistics, or capabilities not listed here.",
      "If asked something unrelated to Bill or automation, politely steer back to how Bill can help."
    ].join(" ");
  }

  function showTyping() {
    var m = document.createElement("div");
    m.className = "chat__msg chat__msg--bot chat__msg--typing";
    m.setAttribute("aria-label", "Assistant is typing");
    m.innerHTML = "<i></i><i></i><i></i>";
    chatLog.appendChild(m);
    chatLog.scrollTop = chatLog.scrollHeight;
    return m;
  }

  function emailFallback(text) {
    botSay("I couldn't reach the chat service just now — opening your email app so this reaches Bill directly.");
    var subject = encodeURIComponent("Website inquiry — automation");
    var body = encodeURIComponent(text + "\n\n— sent from the portfolio website chat");
    setTimeout(function () {
      window.location.href = "mailto:" + (CFG.email || "") + "?subject=" + subject + "&body=" + body;
    }, 1200);
  }

  function sendMessage() {
    var text = chatInput.value.trim();
    if (!text || chatBusy) return;
    say(text, "user");
    chatInput.value = "";

    if (!GROQ.apiKey) { emailFallback(text); return; }

    chatHistory.push({ role: "user", content: text });
    if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);
    chatBusy = true;
    var typing = showTyping();

    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ.apiKey
      },
      body: JSON.stringify({
        model: GROQ.model || "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: chatSystemPrompt() }].concat(chatHistory),
        max_tokens: 260,
        temperature: 0.6
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!reply) throw new Error("empty reply");
        reply = reply.trim();
        chatHistory.push({ role: "assistant", content: reply });
        typing.remove();
        say(reply, "bot");
        /* if the CV comes up, offer the download right in the chat */
        if (/\b(cv|resume|résumé|curriculum vitae|download)\b/i.test(text + " " + reply)) {
          var dl = document.createElement("a");
          dl.className = "chat__bookbtn";
          dl.href = "assets/Bill-Malto-CV.pdf";
          dl.setAttribute("download", "");
          dl.textContent = "Download CV (PDF)";
          chatLog.appendChild(dl);
          chatLog.scrollTop = chatLog.scrollHeight;
        }
        /* if the model suggests booking, surface the modal shortcut */
        if (/book|call|schedule|calendar/i.test(reply) && CFG.bookingUrl) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "chat__bookbtn";
          btn.textContent = "Book a Free Call";
          btn.addEventListener("click", function () { closeChat(); openBooking(); });
          chatLog.appendChild(btn);
          chatLog.scrollTop = chatLog.scrollHeight;
        }
      })
      .catch(function () {
        typing.remove();
        emailFallback(text);
      })
      .then(function () { chatBusy = false; });
  }
  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
})();
