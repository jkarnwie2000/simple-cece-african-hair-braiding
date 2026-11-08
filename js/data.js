/* ==========================================================================
   SITE CONTENT DATA — services, gallery, testimonials.
   --------------------------------------------------------------------------
   PRICES & DURATIONS: leave as "" until the salon confirms them.
   Empty values are shown as "Price on consultation" / "Duration to be
   confirmed" — never as invented numbers.
     price:    e.g. "$180"  (shown as "From $180")
     duration: e.g. "5–6 hrs"
   IMAGES: files live in assets/images/. Each photo has a full-size version
   (name.webp) and a small version (name-sm.webp). See README.md.
   ========================================================================== */
window.CECE_DATA = {
  serviceCategories: [
    {
      id: "knotless",
      name: "Knotless Braids",
      intro: "Braids that begin with your natural hair and gradually feed in extensions, for a flat, natural-looking root and a lighter feel.",
      services: [
        {
          id: "small-knotless",
          name: "Small Knotless Braids",
          image: "knotless-small",
          alt: "Long, fine blonde knotless braids falling over a woman's shoulder",
          description: "Fine, delicate braids with a seamless, natural-looking start at the scalp. Versatile and elegant.",
          details: ["Smallest parts for a refined, full look", "Gentle, knot-free start at the root", "Ask about length and colour options"],
          duration: "",
          price: "",
          popular: true
        },
        {
          id: "medium-knotless",
          name: "Medium Knotless Braids",
          image: "knotless-medium",
          alt: "Woman with long burgundy knotless braids",
          description: "The everyday favourite — a balanced braid size that's lightweight, flexible and easy to style.",
          details: ["Balanced size and fullness", "Lightweight and flexible", "Easy to pull up into buns and ponytails"],
          duration: "",
          price: "",
          popular: true
        },
        {
          id: "large-knotless",
          name: "Large Knotless Braids",
          image: "knotless-large",
          alt: "Braider installing knotless braids in a salon",
          description: "Bold, beautiful braids with a natural root and a quicker install than smaller sizes.",
          details: ["Larger parts for a bold statement", "Natural, flat root", "Ideal for a lighter-weight style"],
          duration: "",
          price: ""
        },
        {
          id: "jumbo-knotless",
          name: "Jumbo Knotless Braids",
          image: "knotless-jumbo",
          alt: "Knotless braids in deep red being parted and installed",
          description: "Statement-making jumbo braids for a dramatic, confident look with minimal tension.",
          details: ["Extra-large, eye-catching braids", "Fewer braids for a faster install", "Great for colour accents"],
          duration: "",
          price: ""
        }
      ]
    },
    {
      id: "box-braids",
      name: "Box Braids",
      intro: "The timeless protective style — neatly sectioned, square-parted braids that never go out of style.",
      services: [
        {
          id: "small-box-braids",
          name: "Small Box Braids",
          image: "box-braids-small",
          alt: "Black and white photo of a woman with small box braids decorated with beads",
          description: "Classic small box braids with crisp, clean parts — beautiful worn down, up, or adorned with beads.",
          details: ["Crisp, square-shaped parts", "Long-lasting protective style", "Beads and cuffs welcome"],
          duration: "",
          price: "",
          popular: true
        },
        {
          id: "medium-box-braids",
          name: "Medium Box Braids",
          image: "box-braids-medium",
          alt: "Smiling woman with braids styled in an elegant high updo",
          description: "A versatile mid-size braid that holds updos beautifully and balances fullness with comfort.",
          details: ["Versatile everyday size", "Holds updos and buns well", "Choose your preferred length"],
          duration: "",
          price: ""
        },
        {
          id: "large-box-braids",
          name: "Large Box Braids",
          image: "box-braids-large",
          alt: "Stylish woman with braids and a striped head scarf posing outdoors",
          description: "Chunky, confident box braids with a bold look and a faster installation time.",
          details: ["Bold, chunky braids", "Quicker installation", "Lightweight for its size"],
          duration: "",
          price: ""
        }
      ]
    },
    {
      id: "cornrows",
      name: "Cornrows",
      intro: "Braids woven close to the scalp — from clean straight-backs to intricate patterns and designs.",
      services: [
        {
          id: "straight-back-cornrows",
          name: "Straight-Back Cornrows",
          image: "cornrows-straight-back",
          alt: "Close-up of neat, fine cornrows braided straight back",
          description: "Clean, classic cornrows braided neatly back — polished, practical and perfect for any occasion.",
          details: ["Neat, uniform rows", "With or without added hair", "A great base for wigs and wraps"],
          duration: "",
          price: ""
        },
        {
          id: "stitch-braids",
          name: "Stitch Braids",
          image: "cornrows-stitch",
          alt: "Top view of intricate stitch cornrows with crisp geometric parts",
          description: "Cornrows with signature 'stitched' horizontal lines for sharp, defined, eye-catching texture.",
          details: ["Distinctive stitched texture", "Sharp, defined parts", "Choose straight-back or a custom design"],
          duration: "",
          price: ""
        },
        {
          id: "feed-in-braids",
          name: "Feed-In Braids",
          image: "cornrows-feed-in",
          alt: "Woman wearing glasses with sleek feed-in braids",
          description: "Hair is gradually fed in for braids that start natural and grow fuller — sleek, sculpted and lightweight.",
          details: ["Natural start, fuller finish", "Less tension at the hairline", "Popular in 2 to 8+ braid styles"],
          duration: "",
          price: "",
          popular: true
        },
        {
          id: "tribal-braids",
          name: "Tribal Braids",
          image: "cornrows-tribal",
          alt: "Side view of curved, patterned tribal-style cornrows",
          description: "Creative cornrow patterns paired with individual braids — a celebration of heritage and artistry.",
          details: ["Custom patterns and curves", "Mix of cornrows and loose braids", "Accessories and cuffs welcome"],
          duration: "",
          price: ""
        }
      ]
    },
    {
      id: "twists",
      name: "Twists",
      intro: "Soft, rope-like two-strand twists — a stylish, protective alternative to braids.",
      services: [
        {
          id: "senegalese-twists",
          name: "Senegalese Twists",
          image: "twists-senegalese",
          alt: "Smiling woman with long, sleek Senegalese twists",
          description: "Sleek, smooth rope twists with a glossy finish and graceful movement.",
          details: ["Smooth, polished finish", "Lightweight feel", "Available in many lengths"],
          duration: "",
          price: ""
        },
        {
          id: "passion-twists",
          name: "Passion Twists",
          image: "twists-passion",
          alt: "Two-tone brown and honey-blonde twists viewed from behind",
          description: "Soft, bohemian twists with a curly, textured look that feels effortlessly romantic.",
          details: ["Soft, textured, bohemian look", "Light and bouncy", "Beautiful in ombré colours"],
          duration: "",
          price: ""
        },
        {
          id: "marley-twists",
          name: "Marley Twists",
          image: "twists-marley",
          alt: "Woman with chunky twists accented with copper tones and a flower",
          description: "Fuller twists with a natural, kinky texture that blends beautifully with natural hair.",
          details: ["Natural, kinky texture", "Full and voluminous", "Matte, natural finish"],
          duration: "",
          price: ""
        }
      ]
    },
    {
      id: "additional",
      name: "Additional Styles",
      intro: "Signature looks and specialty styles — from romantic curls to culturally rooted classics.",
      services: [
        {
          id: "goddess-braids",
          name: "Goddess Braids",
          image: "style-goddess",
          alt: "Woman with a sculpted braided updo",
          description: "Braids finished with soft, flowing curls for a feminine, glamorous and effortlessly elegant look.",
          details: ["Curly pieces woven throughout", "Romantic, glamorous finish", "Perfect for special occasions"],
          duration: "",
          price: "",
          popular: true
        },
        {
          id: "boho-braids",
          name: "Boho Braids",
          image: "style-boho",
          alt: "Woman with long braids accented with red strands and loose curly ends",
          description: "Free-spirited braids with loose curly strands left out for a soft, lived-in bohemian vibe.",
          details: ["Curly strands throughout", "Soft, textured, effortless look", "Human or synthetic curl options"],
          duration: "",
          price: ""
        },
        {
          id: "fulani-braids",
          name: "Fulani Braids",
          image: "style-fulani",
          alt: "Woman with cornrows adorned with cowrie shells and beads",
          description: "Inspired by the Fulani people of West Africa — a centre-part cornrow pattern with beads, cuffs and shells.",
          details: ["Signature cornrow pattern", "Beads, cuffs and cowrie shells", "A tribute to West African heritage"],
          duration: "",
          price: "",
          popular: true
        },
        {
          id: "kids-braiding",
          name: "Kids Braiding",
          image: "style-kids",
          alt: "Young girl with cornrows braided into a voluminous natural afro",
          description: "Gentle, age-appropriate braiding styles for little ones — cute, neat and kind to growing hair.",
          details: ["Gentle, patient approach", "Age-appropriate styles", "Fun beads and accessories"],
          duration: "",
          price: ""
        }
      ]
    }
  ],

  /* Gallery — category must be one of:
     "knotless" | "box-braids" | "cornrows" | "twists" | "other"           */
  gallery: [
    { image: "box-braids-large", category: "box-braids", title: "Statement Braids", alt: "Woman with braids and a striped head scarf posing outdoors" },
    { image: "knotless-small", category: "knotless", title: "Small Knotless", alt: "Fine blonde knotless braids falling over a shoulder" },
    { image: "box-braids-small", category: "box-braids", title: "Beaded Box Braids", alt: "Black and white photo of box braids decorated with white beads" },
    { image: "twists-passion", category: "twists", title: "Two-Tone Twists", alt: "Brown and honey-blonde twists viewed from behind" },
    { image: "style-goddess", category: "other", title: "Sculpted Updo", alt: "Woman with a sculpted braided updo" },
    { image: "cornrows-stitch", category: "cornrows", title: "Stitch Cornrows", alt: "Intricate stitch cornrows with geometric parts" },
    { image: "knotless-medium", category: "knotless", title: "Burgundy Knotless", alt: "Woman with long burgundy knotless braids" },
    { image: "box-braids-medium", category: "box-braids", title: "Braided Updo", alt: "Smiling woman with braids styled in a high updo" },
    { image: "twists-senegalese", category: "twists", title: "Senegalese Twists", alt: "Smiling woman with long Senegalese twists" },
    { image: "cornrows-feed-in", category: "cornrows", title: "Sleek Feed-Ins", alt: "Woman wearing glasses with sleek feed-in braids" },
    { image: "style-fulani", category: "other", title: "Cowrie Accents", alt: "Cornrows adorned with cowrie shells" },
    { image: "hero-feed-in-braids", category: "cornrows", title: "Feed-In Braids", alt: "Woman with long feed-in cornrow braids looking down" },
    { image: "cornrows-tribal", category: "cornrows", title: "Tribal Pattern", alt: "Curved, patterned cornrows seen from the side" },
    { image: "style-boho", category: "other", title: "Boho Braids", alt: "Long braids with red accents and loose curly ends" },
    { image: "knotless-large", category: "knotless", title: "Knotless Install", alt: "Braider installing knotless braids in a salon" },
    { image: "twists-marley", category: "twists", title: "Textured Twists", alt: "Chunky twists with copper tones and a flower accent" },
    { image: "style-kids", category: "other", title: "Kids Cornrows", alt: "Young girl with cornrows and a voluminous afro" },
    { image: "cornrows-straight-back", category: "cornrows", title: "Straight-Backs", alt: "Neat, fine cornrows braided straight back" },
    { image: "knotless-jumbo", category: "knotless", title: "Bold Colour", alt: "Deep red knotless braids being installed" },
    { image: "style-beaded-threads", category: "other", title: "Threaded Art", alt: "Braided style with colourful threaded loops and a beaded headband" },
    { image: "cornrows-artistic", category: "cornrows", title: "Classic Cornrows", alt: "Black and white photo of a man with neat cornrows" },
    { image: "style-adepa", category: "other", title: "Braided Crown", alt: "Natural hair with a braided crown detail, viewed from above" },
    { image: "cornrows-process", category: "cornrows", title: "Zig-Zag Parts", alt: "Braider creating zig-zag cornrow parts with a comb" },
    { image: "kids-braiding-session", category: "other", title: "Kids Braiding", alt: "Braider gently styling a young girl's hair" }
  ],

  /* SAMPLE testimonials — clearly labelled on the site as samples.
     Replace with real, permission-granted customer reviews and set
     `sample: false` on each one. When all are real, the "sample" labels
     and notice disappear automatically. */
  testimonials: [
    {
      sample: true,
      quote: "This is where a real client review will appear — for example, a few words about how they loved their knotless braids.",
      name: "Sample Client",
      detail: "Knotless Braids"
    },
    {
      sample: true,
      quote: "Placeholder review: replace this text with genuine feedback from a happy customer, shared with their permission.",
      name: "Sample Client",
      detail: "Feed-In Braids"
    },
    {
      sample: true,
      quote: "Example testimonial — real customer words about their experience, the atmosphere, and their finished style go here.",
      name: "Sample Client",
      detail: "Kids Braiding"
    }
  ]
};
