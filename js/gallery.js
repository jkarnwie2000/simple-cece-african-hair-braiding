/* ==========================================================================
   gallery.js — gallery rendering, category filtering and lightbox modal.
   Used on gallery.html (full gallery) and index.html (preview mosaic).
   ========================================================================== */
(function () {
  "use strict";
  const C = window.Cece;
  if (!C) return;
  const { $, $$, escapeHtml, img } = C;
  const ITEMS = (C.data && C.data.gallery) || [];

  /* ---------- Render full gallery + filters (gallery.html) ---------- */
  const grid = $("[data-gallery-grid]");
  const filterBar = $("[data-gallery-filters]");
  const status = $("[data-gallery-status]");

  if (grid) {
    grid.innerHTML = ITEMS.map(C.galleryItem).join("");
    C.observeReveal(grid);
  }

  if (grid && filterBar) {
    const counts = ITEMS.reduce((acc, it) => ((acc[it.category] = (acc[it.category] || 0) + 1), acc), {});
    const filters = [["all", "All Styles", ITEMS.length]].concat(
      Object.entries(C.GALLERY_LABELS)
        .filter(([key]) => counts[key])
        .map(([key, label]) => [key, label, counts[key]])
    );
    filterBar.innerHTML = filters
      .map(
        ([key, label, n], i) =>
          `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${key}" aria-pressed="${i === 0}">
            ${escapeHtml(label)}<span class="count">${n}</span>
          </button>`
      )
      .join("");

    const applyFilter = (key) => {
      $$(".filter-btn", filterBar).forEach((b) => {
        const on = b.dataset.filter === key;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      let shown = 0;
      $$(".gallery-item", grid).forEach((item) => {
        const match = key === "all" || item.dataset.category === key;
        item.classList.toggle("is-hidden", !match);
        item.classList.remove("is-entering");
        if (match) {
          shown++;
          item.classList.add("is-visible");
          void item.offsetWidth; // restart entry animation
          item.classList.add("is-entering");
        }
      });
      if (status) {
        const label = key === "all" ? "all styles" : C.GALLERY_LABELS[key];
        status.textContent = `Showing ${shown} photo${shown === 1 ? "" : "s"} of ${label}.`;
      }
      // keep the URL shareable, e.g. gallery.html#cornrows
      history.replaceState(null, "", key === "all" ? location.pathname : `#${key}`);
    };

    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (btn) applyFilter(btn.dataset.filter);
    });

    const initial = location.hash.slice(1);
    if (initial && C.GALLERY_LABELS[initial]) applyFilter(initial);
  }

  /* ---------- Lightbox ---------- */
  const containers = $$("[data-gallery-grid], [data-gallery-preview]");
  if (!containers.length) return;

  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Hairstyle photo viewer");
  lb.hidden = true;
  lb.innerHTML = `
    <span class="lightbox__counter" aria-live="polite"></span>
    <button type="button" class="lightbox__btn lightbox__close" aria-label="Close photo viewer"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" src="" alt="">
      <figcaption class="lightbox__caption"><span></span><strong></strong></figcaption>
    </figure>
    <button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous photo"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
    <button type="button" class="lightbox__btn lightbox__next" aria-label="Next photo"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>`;
  document.body.appendChild(lb);

  const lbImg = $(".lightbox__img", lb);
  const lbCat = $(".lightbox__caption span", lb);
  const lbTitle = $(".lightbox__caption strong", lb);
  const lbCounter = $(".lightbox__counter", lb);
  const closeBtn = $(".lightbox__close", lb);
  const prevBtn = $(".lightbox__prev", lb);
  const nextBtn = $(".lightbox__next", lb);

  let sequence = []; // indices into ITEMS currently navigable
  let pos = 0;
  let lastFocus = null;

  const show = (p) => {
    pos = (p + sequence.length) % sequence.length;
    const item = ITEMS[sequence[pos]];
    lbImg.classList.add("is-switching");
    const next = new Image();
    next.onload = next.onerror = () => {
      lbImg.src = next.src;
      lbImg.alt = item.alt;
      lbImg.classList.remove("is-switching");
    };
    next.src = img(item.image);
    lbCat.textContent = C.GALLERY_LABELS[item.category] || "";
    lbTitle.textContent = item.title;
    lbCounter.textContent = `${pos + 1} / ${sequence.length}`;
    const multi = sequence.length > 1;
    prevBtn.hidden = nextBtn.hidden = !multi;
  };

  const open = (container, index) => {
    sequence = $$(".gallery-item:not(.is-hidden) [data-lightbox-index]", container).map((b) => Number(b.dataset.lightboxIndex));
    lastFocus = document.activeElement;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.classList.add("no-scroll");
    show(Math.max(0, sequence.indexOf(index)));
    closeBtn.focus();
  };

  const close = () => {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      lb.hidden = true;
      lbImg.src = "";
    }, 350);
    if (lastFocus) lastFocus.focus();
  };

  containers.forEach((container) =>
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lightbox-index]");
      if (btn) open(container, Number(btn.dataset.lightboxIndex));
    })
  );

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(pos - 1));
  nextBtn.addEventListener("click", () => show(pos + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox__figure")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(pos + 1);
    else if (e.key === "ArrowLeft") show(pos - 1);
    else if (e.key === "Tab") {
      const f = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // Swipe support on touch screens
  let startX = null;
  lb.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50 && sequence.length > 1) show(pos + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
