/* ==========================================================================
   forms.js — shared form validation + submission adapter.
   Used by booking.js and contact.js.

   Submission is intentionally pluggable (see js/config.js):
     • "endpoint" mode → POST JSON to a form service / backend
     • "email" mode    → prepare a pre-filled email for the visitor to send
     • not configured  → show a copyable summary + setup notice
   To integrate a booking platform later, replace `deliver()` below or point
   `endpoint` at your own API — the forms themselves don't need to change.
   ========================================================================== */
(function () {
  "use strict";
  const C = window.Cece;
  if (!C) return;
  const { $, $$, isSet } = C;

  /* ---------- Validators ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validators = {
    required: (v) => v.trim() !== "",
    email: (v) => EMAIL_RE.test(v.trim()),
    phone: (v) => {
      if (!/^[+()\-.\s\d]+$/.test(v.trim())) return false;
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
    minLength: (n) => (v) => v.trim().length >= n,
    name: (v) => /^[\p{L}\p{M}' .-]{2,}$/u.test(v.trim()),
    checked: (_v, field) => field.checked
  };

  /* ---------- Field helpers ---------- */
  function groupOf(field) {
    return field.closest(".form-group");
  }

  function setError(field, message) {
    const group = groupOf(field);
    if (!group) return;
    const errEl = $(".field-error", group);
    group.classList.toggle("has-error", !!message);
    group.classList.toggle("is-valid", !message && field.type !== "checkbox" && field.value.trim() !== "");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errEl) {
      errEl.innerHTML = message ? `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>${C.escapeHtml(message)}` : "";
    }
  }

  /**
   * Attach live validation to a form.
   * rules: { fieldName: [[testFn, "message"], ...] }
   * Returns { validateAll(): HTMLElement[] (invalid fields), reset() }
   */
  function attachValidation(form, rules) {
    const touched = new Set();

    const validateField = (field) => {
      const list = rules[field.name] || [];
      for (const [test, message] of list) {
        const msg = typeof message === "function" ? message(field) : message;
        if (!test(field.value || "", field)) {
          setError(field, msg);
          return false;
        }
      }
      setError(field, "");
      return true;
    };

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      // link error message for screen readers
      const group = groupOf(field);
      const errEl = group && $(".field-error", group);
      if (errEl) {
        errEl.id = errEl.id || `${form.id}-${name}-error`;
        const described = new Set((field.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
        described.add(errEl.id);
        field.setAttribute("aria-describedby", Array.from(described).join(" "));
      }
      field.addEventListener("blur", () => {
        touched.add(name);
        validateField(field);
      });
      field.addEventListener(field.tagName === "SELECT" || field.type === "checkbox" || field.type === "date" ? "change" : "input", () => {
        if (touched.has(name)) validateField(field);
      });
    });

    return {
      validateField,
      validateAll() {
        const invalid = [];
        Object.keys(rules).forEach((name) => {
          const field = form.elements[name];
          if (!field) return;
          touched.add(name);
          if (!validateField(field)) invalid.push(field);
        });
        return invalid;
      },
      reset() {
        touched.clear();
        $$(".form-group", form).forEach((g) => g.classList.remove("has-error", "is-valid"));
        $$("[aria-invalid]", form).forEach((f) => f.setAttribute("aria-invalid", "false"));
      }
    };
  }

  /* ---------- Alerts ---------- */
  function showAlert(el, type, html) {
    if (!el) return;
    el.className = `form-alert form-alert--${type} is-visible`;
    el.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}" aria-hidden="true"></i><div>${html}</div>`;
  }
  function hideAlert(el) {
    if (el) el.className = "form-alert";
  }

  /* ---------- Submission adapter ---------- */
  function resolveSettings(kind) {
    const cfg = (C.config && C.config[kind]) || {};
    const salonEmail = (C.config.salon && C.config.salon.email) || "";
    return {
      mode: cfg.mode || "email",
      endpoint: cfg.endpoint || "",
      recipient: isSet(cfg.recipientEmail) ? cfg.recipientEmail : salonEmail,
      subjectPrefix: cfg.subjectPrefix || "Website Enquiry"
    };
  }

  /**
   * deliver(kind, { subject, text, payload })
   * Resolves to { method: "endpoint" | "email" | "none", mailto? }
   * Rejects only when an endpoint is configured and the request fails.
   */
  async function deliver(kind, { subject, text, payload }) {
    const s = resolveSettings(kind);
    const fullSubject = `${s.subjectPrefix}: ${subject}`;

    if (s.mode === "endpoint" && isSet(s.endpoint)) {
      const res = await fetch(s.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: fullSubject, ...payload })
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      return { method: "endpoint" };
    }

    if (isSet(s.recipient)) {
      const mailto = `mailto:${s.recipient.trim()}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(text)}`;
      return { method: "email", mailto };
    }

    return { method: "none" };
  }

  /* ---------- Clipboard ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  /* ---------- Character counters ---------- */
  function initCounters(form) {
    $$("[data-counter]", form).forEach((field) => {
      const out = document.getElementById(field.dataset.counter);
      const max = Number(field.getAttribute("maxlength")) || 0;
      if (!out || !max) return;
      const update = () => (out.textContent = `${field.value.length} / ${max}`);
      field.addEventListener("input", update);
      update();
    });
  }

  C.forms = { validators, attachValidation, showAlert, hideAlert, deliver, copyText, initCounters, resolveSettings };
})();
