/* ==========================================================================
   Cece African Hair Braiding — main.js
   Shared behaviour for every page:
   navigation, header, smooth scrolling, active links, back-to-top,
   scroll-reveal animations, config-driven contact details, shared
   renderers (service cards, gallery tiles, testimonials) and toasts.
   ========================================================================== */
(function () {
  "use strict";

  const CONFIG = window.CECE_CONFIG || {};
  const DATA = window.CECE_DATA || {};
  const SALON = CONFIG.salon || {};

  /* ---------- Utilities ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const isSet = (v) => typeof v === "string" && v.trim() !== "";
  const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const IMG_DIR = "assets/images/";
  const img = (name, size = "") => `${IMG_DIR}${name}${size ? "-" + size : ""}.webp`;
  const srcset = (name) => `${img(name, "sm")} 600w, ${img(name)} 1200w`;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.remove("no-js");

  /* ---------- Toast ---------- */
  let toastEl;
  let toastTimer;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 3200);
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    const toggle = $(".nav__toggle");
    const menu = $(".nav__menu");
    if (!toggle || !menu) return;

    const desktop = window.matchMedia("(min-width: 1024px)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("no-scroll", open);
      if (open) {
        const first = $("a", menu);
        if (first) setTimeout(() => first.focus(), 80);
      }
    };

    // Hide the off-canvas menu from assistive tech while closed on mobile
    const syncInert = () => {
      const closed = !menu.classList.contains("is-open");
      if (!desktop.matches && closed) menu.setAttribute("inert", "");
      else menu.removeAttribute("inert");
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
      syncInert();
    });

    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        setOpen(false);
        syncInert();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        syncInert();
        toggle.focus();
      }
      // simple focus trap while the mobile menu is open
      if (e.key === "Tab" && menu.classList.contains("is-open")) {
        const focusables = [toggle, ...$$("a, button", menu)];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    desktop.addEventListener("change", () => {
      setOpen(false);
      syncInert();
    });
    syncInert();
  }

  /* ---------- Active navigation link ---------- */
  function initActiveLink() {
    let page = location.pathname.split("/").pop() || "index.html";
    if (!page.includes(".")) page += ".html"; // supports clean URLs (e.g. /about)
    $$(".nav__link, .nav__book").forEach((link) => {
      const target = (link.getAttribute("href") || "").split("#")[0];
      const active = target === page;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Smooth scrolling for in-page links ---------- */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.getElementById(decodeURIComponent(id.slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
      // move focus for keyboard & screen-reader users
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    const btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);

    const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      const skipTarget = $("#main");
      if (skipTarget) skipTarget.focus({ preventScroll: true });
    });
  }

  /* ---------- Scroll-triggered reveal animations ---------- */
  let revealObserver;
  function observeReveal(root = document) {
    const els = $$(".reveal:not(.is-visible)", root);
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    els.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Salon details from config ---------- */
  const fullAddress = () => {
    const a = SALON.address || {};
    const line2 = [a.city, [a.region, a.postalCode].filter(isSet).join(" ")].filter(isSet).join(", ");
    return [a.street, line2].filter(isSet).join(", ");
  };
  const hasPhone = () => isSet(SALON.phoneDial) && isSet(SALON.phoneDisplay);

  function placeholder(text) {
    return `<span class="placeholder-text" title="Edit js/config.js to add this detail">${escapeHtml(text)}</span>`;
  }

  function bindSalonDetails() {
    $$("[data-salon='name']").forEach((el) => (el.textContent = SALON.name || "Cece African Hair Braiding"));

    $$("[data-salon='phone']").forEach((el) => {
      if (hasPhone()) {
        el.innerHTML = `<a href="tel:${escapeHtml(SALON.phoneDial)}">${escapeHtml(SALON.phoneDisplay)}</a>`;
      } else {
        el.innerHTML = placeholder("Phone number coming soon");
      }
    });

    $$("[data-salon='email']").forEach((el) => {
      if (isSet(SALON.email)) {
        el.innerHTML = `<a href="mailto:${escapeHtml(SALON.email)}">${escapeHtml(SALON.email)}</a>`;
      } else {
        el.innerHTML = placeholder("Email address coming soon");
      }
    });

    $$("[data-salon='address']").forEach((el) => {
      const addr = fullAddress();
      if (isSet(addr)) {
        const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addr);
        el.innerHTML = `<a href="${maps}" target="_blank" rel="noopener">${escapeHtml(addr)}</a>`;
      } else {
        el.innerHTML = placeholder("Salon address coming soon");
      }
    });

    $$("[data-salon='hours']").forEach((el) => {
      const hours = SALON.hours || [];
      if (!hours.some((h) => isSet(h.time))) {
        el.innerHTML = `<li>${placeholder("Business hours coming soon")}</li>`;
        return;
      }
      el.innerHTML = hours
        .map((h) => `<li><span>${escapeHtml(h.day)}</span><span>${isSet(h.time) ? escapeHtml(h.time) : "—"}</span></li>`)
        .join("");
    });

    $$("[data-salon='social']").forEach((el) => {
      const social = SALON.social || {};
      const nets = [
        ["instagram", "Instagram", "fa-instagram"],
        ["facebook", "Facebook", "fa-facebook-f"],
        ["tiktok", "TikTok", "fa-tiktok"]
      ];
      el.innerHTML = nets
        .map(([key, label, icon]) =>
          isSet(social[key])
            ? `<a class="social-link" href="${escapeHtml(social[key])}" target="_blank" rel="noopener" aria-label="${label} (opens in a new tab)"><i class="fa-brands ${icon}" aria-hidden="true"></i></a>`
            : `<span class="social-link is-unconfigured" role="img" aria-label="${label} link coming soon" title="${label} link coming soon — add it in js/config.js"><i class="fa-brands ${icon}" aria-hidden="true"></i></span>`
        )
        .join("");
    });

    // Call buttons: real tel: link when configured, otherwise a working fallback
    $$("[data-call-btn]").forEach((btn) => {
      const label = $(".btn-label", btn) || btn;
      if (hasPhone()) {
        btn.href = `tel:${SALON.phoneDial}`;
        label.textContent = `Call ${SALON.phoneDisplay}`;
      } else {
        btn.href = btn.dataset.fallbackHref || "contact.html#contact-form";
        label.textContent = btn.dataset.fallbackLabel || "Send Us a Message";
        const icon = $("i", btn);
        if (icon) icon.className = "fa-regular fa-envelope";
      }
    });

    // Setup notices — only visible while showSetupNotices is true
    $$("[data-setup-notice]").forEach((el) => {
      const key = el.dataset.setupNotice;
      const needed = {
        phone: !hasPhone(),
        map: !isSet(SALON.mapEmbedUrl),
        contact: !hasPhone() || !isSet(SALON.email) || !isSet(fullAddress()),
        always: true
      }[key];
      el.hidden = !(CONFIG.showSetupNotices && needed);
    });

    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Shared renderers ---------- */
  function findService(id) {
    for (const cat of DATA.serviceCategories || []) {
      const s = cat.services.find((x) => x.id === id);
      if (s) return { service: s, category: cat };
    }
    return null;
  }

  function serviceCard(service, category, { headingLevel = 3 } = {}) {
    const h = `h${headingLevel}`;
    const price = isSet(service.price)
      ? `<span><i class="fa-solid fa-tag" aria-hidden="true"></i>From ${escapeHtml(service.price)}</span>`
      : `<span class="is-placeholder"><i class="fa-solid fa-tag" aria-hidden="true"></i>Price on consultation</span>`;
    const duration = isSet(service.duration)
      ? `<span><i class="fa-regular fa-clock" aria-hidden="true"></i>${escapeHtml(service.duration)}</span>`
      : `<span class="is-placeholder"><i class="fa-regular fa-clock" aria-hidden="true"></i>Duration to be confirmed</span>`;
    const detailsId = `details-${service.id}`;
    const details = (service.details || []).map((d) => `<li>${escapeHtml(d)}</li>`).join("");

    return `
      <article class="service-card reveal" data-service="${escapeHtml(service.id)}">
        <div class="service-card__media">
          <img src="${img(service.image, "sm")}" srcset="${srcset(service.image)}"
               sizes="(min-width: 1024px) 380px, (min-width: 560px) 50vw, 100vw"
               alt="${escapeHtml(service.alt)}" loading="lazy" decoding="async" width="600" height="450">
          <span class="service-card__tag">${escapeHtml(category.name)}</span>
        </div>
        <div class="service-card__body">
          <${h}>${escapeHtml(service.name)}</${h}>
          <p class="service-card__desc">${escapeHtml(service.description)}</p>
          <div class="service-card__meta">${duration}${price}</div>
          ${details ? `<div class="service-card__more" id="${detailsId}"><div><ul>${details}</ul></div></div>` : ""}
          <div class="service-card__actions">
            <a class="btn btn--primary btn--sm" href="booking.html?style=${encodeURIComponent(service.id)}">
              Book Appointment <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
            ${details ? `<button class="service-card__toggle" type="button" aria-expanded="false" aria-controls="${detailsId}">
              Details <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
            </button>` : ""}
          </div>
        </div>
      </article>`;
  }

  function initServiceCardToggles(root = document) {
    root.addEventListener("click", (e) => {
      const btn = e.target.closest(".service-card__toggle");
      if (!btn) return;
      const card = btn.closest(".service-card");
      const open = !card.classList.contains("is-expanded");
      card.classList.toggle("is-expanded", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.firstChild.textContent = open ? "Less " : "Details ";
    });
  }

  const GALLERY_LABELS = {
    knotless: "Knotless Braids",
    "box-braids": "Box Braids",
    cornrows: "Cornrows",
    twists: "Twists",
    other: "Other Styles"
  };

  function galleryItem(item, index) {
    const label = GALLERY_LABELS[item.category] || "Style";
    return `
      <li class="gallery-item reveal" data-category="${escapeHtml(item.category)}" style="--delay:${(index % 4) * 0.06}s">
        <button type="button" data-lightbox-index="${index}" aria-label="View larger: ${escapeHtml(item.title)}">
          <img src="${img(item.image, "sm")}" srcset="${srcset(item.image)}"
               sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
               alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async" width="600" height="800">
          <span class="gallery-item__overlay"><span>${escapeHtml(label)}</span><strong>${escapeHtml(item.title)}</strong></span>
          <span class="gallery-item__zoom" aria-hidden="true"><i class="fa-solid fa-expand"></i></span>
        </button>
      </li>`;
  }

  function renderTestimonials() {
    const wrap = $("[data-testimonials]");
    if (!wrap) return;
    const list = DATA.testimonials || [];
    wrap.innerHTML = list
      .map((t, i) => {
        const initial = escapeHtml((t.name || "?").trim().charAt(0).toUpperCase());
        return `
        <figure class="testimonial reveal" style="--delay:${i * 0.1}s">
          ${t.sample ? '<span class="sample-label"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>Sample</span>' : ""}
          <span class="testimonial__quote-mark" aria-hidden="true">&ldquo;</span>
          <blockquote>${escapeHtml(t.quote)}</blockquote>
          <figcaption class="testimonial__author">
            <span class="testimonial__avatar" aria-hidden="true">${initial}</span>
            <span><strong>${escapeHtml(t.name)}</strong><span>${escapeHtml(t.detail || "")}</span></span>
          </figcaption>
        </figure>`;
      })
      .join("");
    const note = $("[data-testimonials-note]");
    if (note) note.hidden = !list.some((t) => t.sample);
  }

  function renderFeaturedServices() {
    const wrap = $("[data-featured-services]");
    if (!wrap) return;
    const featured = [];
    (DATA.serviceCategories || []).forEach((cat) =>
      cat.services.forEach((s) => s.popular && featured.push(serviceCard(s, cat)))
    );
    wrap.innerHTML = featured.slice(0, 6).join("");
  }

  function renderGalleryPreview() {
    const wrap = $("[data-gallery-preview]");
    if (!wrap) return;
    const items = (DATA.gallery || []).slice(0, 8);
    wrap.innerHTML = items.map(galleryItem).join("");
  }

  /* ---------- Public API for page scripts ---------- */
  window.Cece = {
    $, $$, isSet, escapeHtml, img, srcset, toast, observeReveal,
    serviceCard, galleryItem, findService, initServiceCardToggles,
    GALLERY_LABELS, hasPhone, fullAddress,
    config: CONFIG, data: DATA
  };

  /* ---------- Boot ---------- */
  initNav();
  initActiveLink();
  initHeader();
  initSmoothScroll();
  bindSalonDetails();
  renderFeaturedServices();
  renderGalleryPreview();
  renderTestimonials();
  if ($("[data-featured-services]")) initServiceCardToggles($("[data-featured-services]"));
  initBackToTop();
  observeReveal();
})();
