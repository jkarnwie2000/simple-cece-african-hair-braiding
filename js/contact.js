/* ==========================================================================
   contact.js — contact form + Google Map embed (contact.html)
   ========================================================================== */
(function () {
  "use strict";
  const C = window.Cece;
  if (!C || !C.forms) return;
  const { $, isSet, escapeHtml } = C;

  /* ---------- Google Map (only when configured) ---------- */
  const mapWrap = $("[data-map]");
  const mapUrl = C.config.salon && C.config.salon.mapEmbedUrl;
  if (mapWrap && isSet(mapUrl) && /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(mapUrl)) {
    mapWrap.innerHTML = `<iframe src="${escapeHtml(mapUrl)}" title="Map showing the location of ${escapeHtml(C.config.salon.name)}"
      loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  }

  // Directions button
  const dirBtn = $("[data-directions]");
  if (dirBtn) {
    const addr = C.fullAddress();
    if (isSet(addr)) {
      dirBtn.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(addr);
      dirBtn.hidden = false;
    }
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  if (!form) return;
  const { validators: v, attachValidation, showAlert, hideAlert, deliver, copyText, initCounters } = C.forms;
  const alertEl = $("#contact-alert");
  const submitBtn = $("button[type='submit']", form);

  const validator = attachValidation(form, {
    name: [
      [v.required, "Please enter your name."],
      [v.name, "Please enter a valid name."]
    ],
    email: [
      [v.required, "Please enter your email address."],
      [v.email, "Please enter a valid email address, e.g. name@example.com."]
    ],
    subject: [
      [v.required, "Please add a subject."],
      [v.minLength(3), "Your subject should be at least 3 characters."]
    ],
    message: [
      [v.required, "Please write your message."],
      [v.minLength(10), "Your message should be at least 10 characters."]
    ]
  });
  initCounters(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(alertEl);

    const invalid = validator.validateAll();
    if (invalid.length) {
      showAlert(alertEl, "error", `<strong>Almost there.</strong> Please fix the highlighted ${invalid.length === 1 ? "field" : "fields"} and try again.`);
      invalid[0].focus();
      return;
    }

    const f = form.elements;
    const msg = {
      name: f.name.value.trim(),
      email: f.email.value.trim(),
      subject: f.subject.value.trim(),
      message: f.message.value.trim(),
      submittedAt: new Date().toISOString(),
      type: "contact-message"
    };
    const text = `Name: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject}\n\n${msg.message}`;

    submitBtn.classList.add("is-loading");
    const label = $(".btn-label", submitBtn);
    const original = label.textContent;
    label.textContent = "Sending…";

    try {
      const result = await deliver("contact", { subject: msg.subject, text, payload: msg });
      const first = escapeHtml(msg.name.split(" ")[0]);

      if (result.method === "endpoint") {
        showAlert(alertEl, "success", `<strong>Thank you, ${first}!</strong> Your message has been sent. We'll get back to you as soon as possible.`);
        form.reset();
        validator.reset();
      } else if (result.method === "email") {
        showAlert(
          alertEl,
          "success",
          `<strong>Your message is ready, ${first}.</strong> Click below to send it from your email app.<br>
           <a class="btn btn--primary btn--sm" style="margin-top:.75rem" href="${result.mailto}"><i class="fa-regular fa-paper-plane" aria-hidden="true"></i>Open Email &amp; Send</a>`
        );
      } else {
        showAlert(
          alertEl,
          "error",
          `<strong>Online messaging isn't set up yet</strong>, so your message was not sent. Please use the phone number or social links on this page instead.
           <br><button type="button" class="link-arrow" style="margin-top:.6rem" data-copy-msg>Copy my message <i class="fa-regular fa-copy" aria-hidden="true"></i></button>
           ${C.config.showSetupNotices ? '<br><small>Site owner: add a recipient email or endpoint in <code>js/config.js</code> → <code>contact</code>.</small>' : ""}`
        );
        const copyBtn = $("[data-copy-msg]", alertEl);
        if (copyBtn) copyBtn.addEventListener("click", async () => C.toast((await copyText(text)) ? "Message copied." : "Couldn't copy automatically."));
      }
    } catch (err) {
      console.warn("Contact submission failed:", err);
      showAlert(alertEl, "error", "<strong>Sorry — your message couldn't be sent.</strong> Please try again shortly or contact us by phone.");
    } finally {
      submitBtn.classList.remove("is-loading");
      label.textContent = original;
      alertEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
