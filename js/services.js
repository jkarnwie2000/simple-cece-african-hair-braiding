/* ==========================================================================
   services.js — renders the service menu from js/data.js (services.html)
   with a sticky category bar that highlights the section in view.
   ========================================================================== */
(function () {
  "use strict";
  const C = window.Cece;
  const root = C && C.$("[data-services]");
  const nav = C && C.$("[data-services-nav]");
  if (!root) return;
  const { $$, escapeHtml } = C;
  const cats = C.data.serviceCategories || [];

  root.innerHTML = cats
    .map(
      (cat) => `
      <section class="service-category" id="${escapeHtml(cat.id)}" aria-labelledby="${escapeHtml(cat.id)}-title">
        <header class="service-category__head reveal">
          <div>
            <span class="eyebrow">${cat.services.length} styles</span>
            <h2 id="${escapeHtml(cat.id)}-title">${escapeHtml(cat.name)}</h2>
            <p>${escapeHtml(cat.intro)}</p>
          </div>
        </header>
        <div class="grid service-grid">
          ${cat.services.map((s) => C.serviceCard(s, cat)).join("")}
        </div>
      </section>`
    )
    .join("");

  if (nav) {
    nav.innerHTML = cats
      .map((cat) => `<a class="filter-btn" href="#${escapeHtml(cat.id)}">${escapeHtml(cat.name)}</a>`)
      .join("");
  }

  C.initServiceCardToggles(root);
  C.observeReveal(root);

  // Scroll-spy: highlight the category currently in view
  if (nav && "IntersectionObserver" in window) {
    const links = $$("a", nav);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => {
            const on = l.getAttribute("href") === `#${entry.target.id}`;
            l.classList.toggle("is-active", on);
            if (on) {
              l.setAttribute("aria-current", "true");
              // scroll only the chip bar horizontally (never the page)
              nav.scrollTo({ left: l.offsetLeft - nav.clientWidth / 2 + l.clientWidth / 2, behavior: "smooth" });
            } else l.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    $$(".service-category", root).forEach((s) => spy.observe(s));
  }

  // If arriving with a hash (e.g. services.html#twists), jump after render
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
})();
