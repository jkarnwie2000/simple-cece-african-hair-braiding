/* ==========================================================================
   booking.js — Appointment REQUEST form (booking.html)
   This prepares and sends an appointment *request*. It does not check
   availability or confirm bookings — the salon follows up to confirm.
   ========================================================================== */
(function () {
  "use strict";
  const C = window.Cece;
  const form = document.getElementById("booking-form");
  if (!C || !C.forms || !form) return;

  const { $, isSet, escapeHtml } = C;
  const { validators: v, attachValidation, showAlert, hideAlert, deliver, copyText, initCounters } = C.forms;

  const alertEl = $("#booking-alert");
  const confirmation = $("#booking-confirmation");
  const formWrap = $("#booking-form-wrap");
  const submitBtn = $("button[type='submit']", form);
  const dateField = form.elements.date;
  const timeField = form.elements.time;
  const styleField = form.elements.hairstyle;

  /* ---------- Populate hairstyle dropdown from data.js ---------- */
  (C.data.serviceCategories || []).forEach((cat) => {
    const group = document.createElement("optgroup");
    group.label = cat.name;
    cat.services.forEach((s) => group.appendChild(new Option(s.name, s.id)));
    styleField.appendChild(group);
  });
  const otherGroup = document.createElement("optgroup");
  otherGroup.label = "Something else";
  otherGroup.appendChild(new Option("Other / not sure yet — I'd like advice", "other"));
  styleField.appendChild(otherGroup);

  // Pre-select a style passed from a "Book Appointment" button (?style=id)
  const preselect = new URLSearchParams(location.search).get("style");
  if (preselect && $(`option[value="${CSS.escape(preselect)}"]`, styleField)) {
    styleField.value = preselect;
    const hint = $("#style-hint");
    if (hint) hint.textContent = "Pre-selected from the style you chose — you can change it.";
  }

  /* ---------- Dates: block past dates ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => toISODate(new Date());
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  dateField.min = todayISO();
  dateField.max = toISODate(maxDate);

  const parseLocalDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const notPast = (val) => isSet(val) && val >= todayISO();
  const withinYear = (val) => isSet(val) && val <= dateField.max;
  const timeInFuture = (val) => {
    if (!isSet(val) || dateField.value !== todayISO()) return true;
    const [h, m] = val.split(":").map(Number);
    const now = new Date();
    return h * 60 + m > now.getHours() * 60 + now.getMinutes();
  };

  const formatDate = (iso) =>
    parseLocalDate(iso).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const formatTime = (val) => {
    const [h, m] = val.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };

  /* ---------- Validation rules ---------- */
  const validator = attachValidation(form, {
    fullName: [
      [v.required, "Please enter your full name."],
      [v.name, "Please enter a valid name (letters, spaces, hyphens and apostrophes only)."]
    ],
    email: [
      [v.required, "Please enter your email address."],
      [v.email, "Please enter a valid email address, e.g. name@example.com."]
    ],
    phone: [
      [v.required, "Please enter your phone number."],
      [v.phone, "Please enter a valid phone number (7–15 digits; +, spaces, dashes and brackets are fine)."]
    ],
    hairstyle: [[v.required, "Please choose a hairstyle (or “Other / not sure yet”)."]],
    date: [
      [v.required, "Please choose your preferred date."],
      [notPast, "That date has already passed — please choose today or a future date."],
      [withinYear, "Please choose a date within the next 12 months."]
    ],
    time: [
      [v.required, "Please choose your preferred time."],
      [timeInFuture, "That time has already passed today — please choose a later time."]
    ],
    hairLength: [[v.required, "Please tell us your preferred braid length."]],
    acknowledge: [[v.checked, "Please confirm you understand this is a request, not a confirmed booking."]]
  });

  // Re-check time when the date changes (today vs. future)
  dateField.addEventListener("change", () => {
    if (isSet(timeField.value)) validator.validateField(timeField);
  });

  initCounters(form);

  /* ---------- Build the request ---------- */
  function collect() {
    const f = form.elements;
    const styleOpt = styleField.options[styleField.selectedIndex];
    const lengthOpt = f.hairLength.options[f.hairLength.selectedIndex];
    return {
      fullName: f.fullName.value.trim(),
      email: f.email.value.trim(),
      phone: f.phone.value.trim(),
      hairstyle: styleOpt ? styleOpt.text : "",
      hairstyleId: f.hairstyle.value,
      preferredDate: f.date.value,
      preferredDateFormatted: formatDate(f.date.value),
      preferredTime: f.time.value,
      preferredTimeFormatted: formatTime(f.time.value),
      hairLength: lengthOpt ? lengthOpt.text : "",
      notes: f.notes.value.trim(),
      submittedAt: new Date().toISOString(),
      type: "appointment-request"
    };
  }

  function summaryRows(r) {
    return [
      ["Name", r.fullName],
      ["Email", r.email],
      ["Phone", r.phone],
      ["Hairstyle", r.hairstyle],
      ["Preferred date", r.preferredDateFormatted],
      ["Preferred time", r.preferredTimeFormatted],
      ["Braid length", r.hairLength],
      ["Notes", r.notes || "—"]
    ];
  }

  function asText(r) {
    return (
      `APPOINTMENT REQUEST — ${C.config.salon.name}\n` +
      `(Request only — not yet confirmed)\n\n` +
      summaryRows(r).map(([k, val]) => `${k}: ${val}`).join("\n") +
      `\n\nPlease contact me to confirm availability and pricing. Thank you!`
    );
  }

  /* ---------- Confirmation screen ---------- */
  function renderConfirmation(r, result) {
    const text = asText(r);
    const firstName = escapeHtml(r.fullName.split(" ")[0]);
    const phoneLink = C.hasPhone()
      ? `<a class="btn btn--outline" href="tel:${escapeHtml(C.config.salon.phoneDial)}"><i class="fa-solid fa-phone" aria-hidden="true"></i>Call the Salon</a>`
      : "";

    let title, lead, primary, notice = "";
    if (result.method === "endpoint") {
      title = `Thank you, ${firstName}!`;
      lead = "Your appointment request has been sent. The salon will contact you to confirm availability, timing and pricing. <strong>Your appointment is not confirmed until you hear back.</strong>";
      primary = "";
    } else if (result.method === "email") {
      title = `Almost there, ${firstName}!`;
      lead = "Your request is ready. Tap <strong>Send Request by Email</strong> to send it from your email app. The salon will then contact you to confirm availability — <strong>your appointment is not confirmed yet.</strong>";
      primary = `<a class="btn btn--gold" href="${result.mailto}" data-mailto><i class="fa-regular fa-paper-plane" aria-hidden="true"></i>Send Request by Email</a>`;
    } else {
      title = `Request prepared, ${firstName}`;
      lead = "Online sending isn't set up yet, so your request has <strong>not</strong> been sent. Please copy the details below and share them with the salon by phone, text or social media.";
      primary = "";
      if (C.config.showSetupNotices) {
        notice = `<p class="placeholder-note" style="text-align:left"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i>
          <span><strong>Site owner:</strong> add a recipient email or form endpoint in <code>js/config.js</code> (<code>booking</code> section) so requests can be sent. See README → “Configuring form submissions”.</span></p>`;
      }
    }

    confirmation.innerHTML = `
      <div class="confirmation__icon"><i class="fa-solid ${result.method === "endpoint" ? "fa-check" : "fa-clipboard-list"}" aria-hidden="true"></i></div>
      <span class="status-pill"><i class="fa-regular fa-hourglass-half" aria-hidden="true"></i>Status: request — awaiting salon confirmation</span>
      <h2 tabindex="-1" id="confirmation-title">${title}</h2>
      <p class="confirmation__lead">${lead}</p>
      <div class="summary">
        <h3>Your request summary</h3>
        <dl>${summaryRows(r).map(([k, val]) => `<div><dt>${k}</dt><dd>${escapeHtml(val)}</dd></div>`).join("")}</dl>
      </div>
      <div class="confirmation__actions">
        ${primary}
        <button type="button" class="btn btn--outline" data-copy><i class="fa-regular fa-copy" aria-hidden="true"></i>Copy Details</button>
        ${phoneLink}
      </div>
      ${notice}
      <button type="button" class="link-arrow" data-new-request>Make another request <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>`;

    $("[data-copy]", confirmation).addEventListener("click", async () => {
      C.toast((await copyText(text)) ? "Request details copied to clipboard." : "Couldn't copy automatically — please select and copy the summary.");
    });
    $("[data-new-request]", confirmation).addEventListener("click", () => {
      form.reset();
      validator.reset();
      confirmation.classList.remove("is-visible");
      confirmation.innerHTML = "";
      formWrap.hidden = false;
      form.elements.fullName.focus();
    });

    formWrap.hidden = true;
    confirmation.classList.add("is-visible");
    confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
    $("#confirmation-title", confirmation).focus({ preventScroll: true });
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(alertEl);

    const invalid = validator.validateAll();
    if (invalid.length) {
      showAlert(
        alertEl,
        "error",
        `<strong>Please check ${invalid.length === 1 ? "1 field" : invalid.length + " fields"}.</strong> Fix the highlighted ${invalid.length === 1 ? "field" : "fields"} below and try again.`
      );
      invalid[0].focus();
      return;
    }

    const request = collect();
    submitBtn.classList.add("is-loading");
    submitBtn.setAttribute("aria-busy", "true");
    const label = $(".btn-label", submitBtn);
    const original = label.textContent;
    label.textContent = "Preparing your request…";

    try {
      const result = await deliver("booking", {
        subject: `${request.hairstyle} — ${request.preferredDateFormatted}`,
        text: asText(request),
        payload: request
      });
      renderConfirmation(request, result);
    } catch (err) {
      console.warn("Booking submission failed:", err);
      showAlert(
        alertEl,
        "error",
        "<strong>Sorry — we couldn't send your request right now.</strong> Please try again in a moment, or contact the salon directly using the details on our Contact page."
      );
      alertEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      submitBtn.classList.remove("is-loading");
      submitBtn.removeAttribute("aria-busy");
      label.textContent = original;
    }
  });
})();
