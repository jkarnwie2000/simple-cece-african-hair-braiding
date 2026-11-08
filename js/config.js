/* ==========================================================================
   SITE CONFIGURATION — edit this file to update salon details.
   --------------------------------------------------------------------------
   Any value left as an empty string ("") is treated as "not configured yet".
   Unconfigured values show a clearly-labelled placeholder on the website
   instead of a fake number, address, or link.
   ========================================================================== */
window.CECE_CONFIG = {
  salon: {
    name: "Cece African Hair Braiding",

    // Phone in human-readable form, e.g. "(404) 555-0182"
    phoneDisplay: "",
    // Phone in international dial form (digits + leading "+"), e.g. "+14045550182"
    phoneDial: "",

    email: "", // e.g. "hello@cecebraiding.com"

    address: {
      street: "", // e.g. "123 Main Street, Suite 4"
      city: "",   // e.g. "Atlanta"
      region: "", // e.g. "GA"
      postalCode: ""
    },

    // Business hours — replace "" with e.g. "9:00 AM – 7:00 PM" or "Closed"
    hours: [
      { day: "Monday", time: "" },
      { day: "Tuesday", time: "" },
      { day: "Wednesday", time: "" },
      { day: "Thursday", time: "" },
      { day: "Friday", time: "" },
      { day: "Saturday", time: "" },
      { day: "Sunday", time: "" }
    ],

    social: {
      instagram: "", // full URL, e.g. "https://www.instagram.com/yourhandle"
      facebook: "",  // full URL
      tiktok: ""     // full URL
    },

    // Google Maps: in Google Maps → Share → "Embed a map" → copy ONLY the src="…" URL
    mapEmbedUrl: ""
  },

  /* ------------------------------------------------------------------------
     FORM SUBMISSIONS
     mode:
       "email"    → (default) the form prepares the request and opens the
                    visitor's email app addressed to `recipientEmail`.
       "endpoint" → the form POSTs JSON to `endpoint` (e.g. Formspree,
                    Getform, Basin, or your own backend / booking service).
     If neither an email nor an endpoint is configured, visitors still see a
     formatted summary they can copy, and an on-page notice tells you what to
     configure.
     ------------------------------------------------------------------------ */
  booking: {
    mode: "email",
    recipientEmail: "", // defaults to salon.email when empty
    endpoint: "",       // e.g. "https://formspree.io/f/xxxxxxx"
    subjectPrefix: "Appointment Request"
  },

  contact: {
    mode: "email",
    recipientEmail: "", // defaults to salon.email when empty
    endpoint: "",
    subjectPrefix: "Website Message"
  },

  // Set to false once everything is configured to hide the dashed
  // "configure this" notices that help you find placeholders.
  showSetupNotices: true
};
