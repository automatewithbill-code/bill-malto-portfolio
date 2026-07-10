/* ============================================================
   SITE CONFIG — edit everything here, no need to touch main.js
   ============================================================ */
window.SITE_CONFIG = {

  /* ---- CINEMATIC CLIPS (Seedance 2.0 via Higgsfield) ----
     Paste the final .mp4 URLs here when each render completes.
     Leave "" to show the styled fallback backdrop instead.   */
  videos: {
    heroOrbit:  "assets/videos/hero-orbit.mp4",   // Clip 1 — 360° orbit, scroll-scrubbed hero ✓
    builder:    "assets/videos/builder.mp4",      // Clip 2 — desk + holographic workflows (Three Pillars bg) ✓
    expert:     "assets/videos/expert.mp4",       // Clip 3 — automation studio lateral move (Work bg) ✓
    closer:     "assets/videos/closer.mp4",       // Clip 4 — walk toward camera, screens flare (Finale bg) ✓
  },
  videoDuration: 8,   // seconds per clip

  /* ---- AI CHAT (OpenAI-compatible endpoint) ----
     The API key lives in js/secrets.js (gitignored) so it never
     reaches the public repo. Without it, the chat widget falls
     back to opening the visitor's email app. For a live site,
     route the call through a small proxy (e.g. Vercel function)
     instead of shipping any key to the browser.                  */
  aiChat: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    model:    "gpt-4o-mini",
    apiKey:   (typeof window !== "undefined" && (window.OPENAI_API_KEY || window.GROQ_API_KEY)) || "",
  },

  /* ---- CONTACT ---- */
  email:       "maltoyeet@gmail.com",                          // from CV ✓
  bookingUrl:  "https://calendly.com/automatewithbill/30min",  // your Calendly link ✓
  linkedinUrl: "https://www.linkedin.com/in/your-handle",
  youtubeUrl:  "https://www.youtube.com/@your-handle",
  githubUrl:   "",                                   // optional — leave "" to hide
  twitterUrl:  "",                                   // optional — leave "" to hide

  /* ---- HERO STATS (real figures — ~7 months of project work) ---- */
  stats: [
    { value: 8,   suffix: "+",  label: "Automation Projects Completed" },
    { value: 300, suffix: "+",  label: "Hours Saved for Clients" },
    { value: 30,  suffix: "%+", label: "Average Efficiency Gain" },
    { value: 6,   suffix: "+",  label: "Businesses Supported" },
  ],

  /* ---- PLATFORM LOGOS ----
     Drop logo files into assets/logos/ and set paths here
     (PNG or SVG, transparent background works best).
     Leave "" to show the text badge instead.               */
  platformLogos: {
    "n8n":         "assets/logos/n8n.png",
    "Make.com":    "assets/logos/make.png",
    "Zapier":      "assets/logos/zapier.png",
    "GoHighLevel": "assets/logos/gohighlevel.png",
  },

  /* ---- PROJECTS ----
     One entry per project. Drop screenshots into
     assets/projects/<folder>/ and list them in images[].
     The first image becomes the card thumbnail; all images
     appear in the project viewer gallery.
     Set sample:false once it's a real project.             */
  projects: [
    /* ===== N8N — real projects ===== */
    {
      platform: "n8n",
      title: "AI Voice Receptionist (VAPI + n8n)",
      summary: "A phone receptionist powered by voice AI — it checks real availability, books, reschedules, looks up clients, and cancels, all mid-call.",
      what: "VAPI tool calls hit an n8n webhook and are routed by tool name. The availability route calculates potential slots, checks Google Calendar, and responds with genuinely open times; booking creates the calendar event and logs the client to Google Sheets. Additional routes look up client records, reschedule, and cancel — each responding to the voice agent while the caller is still on the line.",
      tools: ["n8n", "VAPI voice AI", "Webhooks", "Google Calendar", "Google Sheets"],
      impact: "Callers get a human-quality booking experience with zero staff time, and the calendar never double-books.",
      images: ["assets/projects/n8n/voice-receptionist-vapi/booking-core.png", "assets/projects/n8n/voice-receptionist-vapi/full-toolset.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI Research & Fact Validation Expert",
      summary: "A research engine that studies a business website, fact-checks its own findings, and writes review-backed marketing articles.",
      what: "Three connected workflows: a form-triggered researcher fetches and cleans the website, extracts URLs, runs a Gemini research agent with Perplexity search, then fact-checks every finding against the site itself before storing it. A second flow profiles target audience and service pricing using Gemini with Google Search. A third merges all of it, writes the article, fact-checks twice via Perplexity, folds in top scraped Google Business reviews, and appends the final piece to Google Docs.",
      tools: ["n8n", "Gemini", "Perplexity", "Google Search", "Web scraping", "Google Docs"],
      impact: "Marketing content grounded in verified facts and real customer reviews — research that would take days runs in one pass.",
      images: ["assets/projects/n8n/research-fact-validation/website-research.png", "assets/projects/n8n/research-fact-validation/audience-pricing.png", "assets/projects/n8n/research-fact-validation/article-generator.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI Facebook Messenger Chatbot",
      summary: "A Messenger chatbot that answers customer questions from your own business documents, 24/7.",
      what: "Handles Facebook's webhook verification and incoming messages, filters valid events, pulls its knowledge from a Google Docs file, and lets a Gemini-powered AI agent with conversation memory craft each reply — sent back through the Messenger API.",
      tools: ["n8n", "Facebook Messenger", "Google Docs", "Gemini", "AI Agent + Memory"],
      impact: "Customers get instant, accurate answers around the clock — and updating the bot is as easy as editing a document.",
      images: ["assets/projects/n8n/fb-chatbot/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI-Powered UGC Video Creator",
      summary: "Send one product photo to a Telegram bot — get back a merged, ready-to-post UGC-style video ad.",
      what: "A Telegram bot receives the product image; Gemini analyzes it and writes the image and video prompts with Think-tool reasoning. Generation tasks run through the Kie AI API with polling and content-filter checks, the resulting clips are aggregated and merged through the FAL API, and the finished video is delivered back in the same Telegram chat.",
      tools: ["n8n", "Telegram", "Gemini", "Kie AI", "FAL video merge"],
      impact: "UGC-style video ads in minutes from a single photo — no filming, actors, or editing.",
      images: ["assets/projects/n8n/ugc-creator/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI Short Video Generator",
      summary: "Generates AI short videos on schedule and publishes them natively to Instagram, YouTube, and TikTok.",
      what: "On schedule, a randomized concept feeds a Claude-powered Prompter agent with a Think tool and structured output. The video is generated through the Kie AI API, polled until ready, then uploaded and posted to Instagram, YouTube, and TikTok in one run.",
      tools: ["n8n", "Anthropic Claude", "Kie AI", "Instagram", "YouTube", "TikTok"],
      impact: "A constant three-platform shorts pipeline with no filming, editing, or manual uploading.",
      images: ["assets/projects/n8n/short-video-generator/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "ASMR Video Creator",
      summary: "A fully hands-off ASMR channel: AI writes the concept, generates the video, quality-checks it, and publishes it.",
      what: "On schedule, Gemini writes the video prompt with structured output. The workflow signs a JWT, exchanges it for an API token, generates the video, and polls until done — checking error and content-filter states. Finished videos upload to YouTube, with a fallback branch converting the file and posting through the Facebook Graph API.",
      tools: ["n8n", "Gemini", "JWT auth", "Video generation API", "YouTube", "Facebook"],
      impact: "A niche content channel that produces, quality-checks, and publishes itself.",
      images: ["assets/projects/n8n/asmr-video-creator/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI Smart Telegram Calendar Sync",
      summary: "Manage your Google Calendar by chatting — or sending voice notes — to a Telegram bot.",
      what: "A Telegram bot routes incoming text and voice (voice notes are transcribed first). A Gemini AI agent with conversation memory then uses Google Calendar tools to create, update, delete, or list events, and confirms everything back in Telegram.",
      tools: ["n8n", "Telegram", "Voice transcription", "Gemini", "Google Calendar"],
      impact: "Natural-language scheduling from your pocket — \"move my 3pm to Friday\" just works, even hands-free.",
      images: ["assets/projects/n8n/telegram-calendar/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI Social Media Content Creator",
      summary: "Posts a fresh, AI-designed quote graphic to Facebook on schedule — weather-aware and never repeating itself.",
      what: "On schedule, an AI agent generates a quote, checking a Google Sheet so nothing repeats and saving each new one. It pulls current weather from OpenWeatherMap for context, a second agent selects a background image and verifies the URL hasn't been used, the final graphic is composed through the Imejis API, and the post publishes via Facebook Graph API.",
      tools: ["n8n", "Gemini", "Google Sheets", "OpenWeatherMap", "Imejis", "Facebook"],
      impact: "A page that stays active daily with original branded content — no designer, no scheduler, no repeats.",
      images: ["assets/projects/n8n/social-content-creator/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "Auto-Post AI Images to Facebook",
      summary: "An idea agent that invents the next post from your content history, generates the image, and publishes it.",
      what: "On schedule, the workflow reads the content log from Google Sheets, and an Idea Agent (OpenRouter model with a Think tool) creates a fresh concept based on the latest entries. The idea is appended to the sheet as an archive, the image is generated, and the post goes out via Facebook Graph API.",
      tools: ["n8n", "OpenRouter", "Google Sheets", "AI image generation", "Facebook"],
      impact: "The content calendar plans and executes itself — and the sheet doubles as a complete content archive.",
      images: ["assets/projects/n8n/auto-post-fb-images/workflow.png"],
      sample: false,
    },
    {
      platform: "n8n",
      title: "AI Receptionist — Modular Booking Engine",
      summary: "A production-grade booking system built as five modular sub-workflows: get slots, book, update, cancel, and log results.",
      what: "Each booking capability is its own dedicated n8n sub-workflow — GetSlots, BookSlots, UpdateSlots, CancelSlots, and call_results — with its own validation, friendly error responses, and record updates, all composable behind a single entry point.",
      tools: ["n8n", "Sub-workflows", "Google Calendar", "Webhooks", "Error handling"],
      impact: "Reliable and maintainable: each function is tested and upgraded independently, which is what keeps a client-facing booking line stable.",
      images: ["assets/projects/n8n/receptionist-modular/workflow.png"],
      sample: false,
    },

    /* ===== MAKE.COM — real projects ===== */
    {
      platform: "Make.com",
      title: "AI Appointment Booking & Reservation System",
      summary: "A webhook-driven booking engine: AI checks real calendar availability, initializes booking sessions, and handles cancellations end to end.",
      what: "Three coordinated scenarios behind one API. An AI availability checker parses the requested time preferences with OpenAI, cross-checks Google Calendar free/busy across parallel paths, and responds with genuinely open slots. A session initialization flow searches calendar events and returns structured booking data. A cancellation flow finds the reservation and deletes the event, confirming back instantly through the webhook.",
      tools: ["Make.com", "Webhooks API", "OpenAI", "Google Calendar", "Text Parser", "Routers"],
      impact: "Clients book, verify, and cancel appointments through a chatbot or app with real-time calendar accuracy — no double-bookings and no back-and-forth emails.",
      images: ["assets/projects/make/booking-system/check-availability.png", "assets/projects/make/booking-system/session-initialization.png", "assets/projects/make/booking-system/cancel-reservation.png"],
      sample: false,
    },
    {
      platform: "Make.com",
      title: "AI Customer Support Agent (Zendesk)",
      summary: "An AI agent that answers open Zendesk tickets and turns solved ones into a growing knowledge base.",
      what: "Tickets arrive via webhook, are fetched and parsed as JSON, then routed by status. Open tickets get an AI-drafted reply from an OpenAI assistant, posted back to Zendesk through the API. Solved tickets are summarized by AI and stored as structured Airtable records — building a searchable knowledge base from every resolution.",
      tools: ["Make.com", "Zendesk API", "Webhooks", "OpenAI Assistants", "Airtable", "HTTP/JSON"],
      impact: "First responses go out in seconds instead of hours, and every solved ticket makes the support system smarter.",
      images: ["assets/projects/make/support-agent-zendesk/workflow.png"],
      sample: false,
    },
    {
      platform: "Make.com",
      title: "AI Social Media Automation — Fresh Posts Every Day",
      summary: "One spreadsheet row becomes AI-written, platform-native posts on Facebook, Instagram, X, and LinkedIn.",
      what: "Watches Google Sheets for new content rows and researches each topic with Perplexity AI. A router then fans out to four branches: Claude writes the Facebook post, OpenAI writes the caption and generates the image for Instagram, OpenAI drafts the post published to X, and Claude writes the LinkedIn update — each in that platform's native voice.",
      tools: ["Make.com", "Google Sheets", "Perplexity AI", "Claude", "OpenAI", "Facebook", "Instagram", "X", "LinkedIn"],
      impact: "A full multi-platform content calendar runs itself from a single spreadsheet — no copywriting, resizing, or manual posting.",
      images: ["assets/projects/make/social-media-ai/workflow.png"],
      sample: false,
    },
    {
      platform: "Make.com",
      title: "AI-Powered Gmail Attachment Processing",
      summary: "Incoming email attachments are read by Gemini AI, filed in Drive, logged in Sheets, and answered — automatically.",
      what: "Watches Gmail for new messages and iterates through every attachment. Each file is uploaded to Google Gemini AI, which reads and extracts its key data. The file is archived to the right Google Drive folder, the extracted details are logged as a Google Sheets row, and a summary email goes back out via Gmail.",
      tools: ["Make.com", "Gmail", "Google Gemini AI", "Google Drive", "Google Sheets"],
      impact: "Invoices and documents that arrive by email are processed, filed, and logged with zero manual data entry or lost attachments.",
      images: ["assets/projects/make/gmail-attachment-ai/workflow.png"],
      sample: false,
    },
    {
      platform: "Make.com",
      title: "Automated Xero Report Upload to Asana",
      summary: "Pulls live financial data from Xero and delivers a formatted report straight into the Asana task that requested it.",
      what: "When a new task appears in Asana, the scenario calls the Xero API for the report data and splits into two timed paths: the first iterates results into Google Sheets as a staging table; the second waits, aggregates the completed range into a report, uploads it as an attachment on the Asana task, and clears the staging sheet for the next run.",
      tools: ["Make.com", "Asana", "Xero API", "Google Sheets", "Router", "Iterator + Aggregator"],
      impact: "Finance reports show up inside project tasks automatically — no exporting from Xero, formatting, or re-uploading by hand.",
      images: ["assets/projects/make/xero-asana-reports/workflow.png"],
      sample: false,
    },


    /* ===== ZAPIER — real projects ===== */
    {
      platform: "Zapier",
      title: "Automated Lead Qualification Workflow",
      summary: "Every inbound lead gets enriched, scored, and routed — hot leads reach sales in minutes with an AI-drafted email ready to send.",
      what: "Leads arrive via webhook and are enriched with Apollo company data, then split into High and Low priority paths. High-priority leads are saved to Google Sheets, announced to sales in Slack, and receive a personalized AI-drafted email via Gmail; lower-priority leads are queued to the sales team automatically.",
      tools: ["Zapier", "Webhooks", "Apollo", "Paths", "Google Sheets", "Slack", "AI by Zapier", "Gmail"],
      impact: "Sales stops manually reviewing every submission — they see only qualified leads, with context and a drafted reply, so response time drops from hours to minutes.",
      images: ["assets/projects/zapier/lead-qualification/workflow.png"],
      sample: false,
    },
    {
      platform: "Zapier",
      title: "Asana CRM Automation",
      summary: "A full client pipeline run inside Asana — stage-based client emails, auto-created project folders, and daily + weekly task digests.",
      what: "When a task moves stage (Ready to Start, No Response, Quoted, Approved, Paid & Closed), the matching client email goes out and project assets are created — Google Drive folders, Asana subtasks, and service-specific follow-up paths. Scheduled Zaps also pull open tasks from Asana and email the team a digest every day and every week.",
      tools: ["Zapier", "Asana", "Gmail", "Google Drive", "Paths", "Schedule by Zapier"],
      impact: "No more chasing statuses — clients hear from you at every stage automatically, and the team starts each day and week with a task summary in their inbox.",
      images: ["assets/projects/zapier/asana-crm/pipeline-paths.png", "assets/projects/zapier/asana-crm/daily-digest.png", "assets/projects/zapier/asana-crm/weekly-digest.png"],
      sample: false,
    },
    {
      platform: "Zapier",
      title: "Content Repurposing Automation",
      summary: "Drop one recording into a folder — get transcribed, AI-written posts published across Facebook, LinkedIn, and Instagram.",
      what: "Watches a Google Drive folder for new files. Each file is transcribed by AI, turned into blog-style posts, then looped through parallel publishing paths that post to Facebook Pages, LinkedIn, and Instagram for Business.",
      tools: ["Zapier", "Google Drive", "AI by Zapier", "Looping", "Facebook Pages", "LinkedIn", "Instagram"],
      impact: "One piece of source content becomes a multi-platform publishing run — no manual transcribing, rewriting, or copy-pasting into each network.",
      images: ["assets/projects/zapier/content-repurposing/workflow.png"],
      sample: false,
    },
    {
      platform: "Zapier",
      title: "Employee Onboarding Automation",
      summary: "One click starts the entire new-hire sequence: calendar, Slack welcome, account provisioning, and a personalized welcome email.",
      what: "A \"Start Onboarding\" button in Zapier Tables finds the next onboarding event in Google Calendar and adds the new hire, posts a \"Welcome to the team!\" message in Slack, provisions their account through Okta, and sends a ChatGPT-personalized welcome email via Gmail.",
      tools: ["Zapier Tables", "Google Calendar", "Slack", "Okta", "ChatGPT", "Gmail"],
      impact: "New hires get their calendar invite, system access, and a warm welcome on day one — HR runs the whole checklist with a single button.",
      images: ["assets/projects/zapier/employee-onboarding/workflow.png"],
      sample: false,
    },
    {
      platform: "Zapier",
      title: "Help Desk Ticket Summarizer",
      summary: "Every new support ticket is summarized by AI and delivered to the team as a clean, scannable brief.",
      what: "When a new ticket record lands in Zapier Tables, ChatGPT condenses the issue into a short summary and Gmail delivers it to the right inbox immediately.",
      tools: ["Zapier Tables", "ChatGPT", "Gmail"],
      impact: "Support triages in seconds — the team reads a two-line summary instead of digging through full ticket threads.",
      images: ["assets/projects/zapier/help-desk/workflow.png"],
      sample: false,
    },
    {
      platform: "Zapier",
      title: "Scheduling & Notification Automation",
      summary: "Every Calendly booking triggers instant confirmations, team alerts, and timed reminders — automatically.",
      what: "When an invitee books, they get an immediate confirmation email and the team is alerted in Slack. A timed delay then fires a reminder email to the invitee and a second Slack notification before the meeting.",
      tools: ["Zapier", "Calendly", "Gmail", "Slack", "Delay by Zapier"],
      impact: "Fewer no-shows and zero manual reminder-sending — every booking is confirmed, announced, and followed up without touching a keyboard.",
      images: ["assets/projects/zapier/scheduling-notifications/workflow.png"],
      sample: false,
    },


    /* ===== GOHIGHLEVEL — real projects ===== */
    {
      platform: "GoHighLevel",
      title: "Smart Lead Capture & Follow-Up Automation Suite",
      summary: "A seven-workflow CRM suite covering the entire customer journey — instant lead follow-up, appointment reminders, no-show recovery, review requests, and long-term nurture.",
      what: "A connected set of GoHighLevel workflows: form submissions trigger instant SMS plus a call, with reply/timeout branches that detect \"INTERESTED\" replies and route accordingly; uninterested replies are re-tagged and closed out politely; appointments get confirmations and reminders; no-shows enter a recovery sequence; a won opportunity fires email + SMS review requests with a 3-day wait and internal notification; and a long-term nurture keeps cold leads warm.",
      tools: ["GoHighLevel", "Workflows", "SMS + Voice", "Email", "Tags", "Pipeline triggers"],
      impact: "Every lead is contacted within minutes of the form hitting the CRM, and every stage after — booking, no-show, sale, review, nurture — runs completely hands-free.",
      images: ["assets/projects/ghl/lead-automation-suite/workflow-list.png", "assets/projects/ghl/lead-automation-suite/sms-lead-capture.png", "assets/projects/ghl/lead-automation-suite/not-interested-handler.png", "assets/projects/ghl/lead-automation-suite/review-request.png"],
      sample: false,
    },
    {
      platform: "GoHighLevel",
      title: "Car Service Booking Funnel",
      summary: "A three-step booking funnel — landing page, native appointment calendar, and confirmation — that turns visitors into scheduled jobs.",
      what: "A GoHighLevel funnel flowing Home → Appointment → Thank You. The landing page sells the service with specs and a \"Get An Appointment\" CTA, the appointment step runs on GHL's native calendar with 60-minute timezone-aware slots, and the branded thank-you page confirms the booking — every appointment landing directly in the CRM.",
      tools: ["GoHighLevel", "Funnels", "Native calendars", "CRM"],
      impact: "Visitors go from click to confirmed appointment in one flow — no phone tag, no manual scheduling, and every booking tracked in the pipeline.",
      images: ["assets/projects/ghl/car-service-funnel/home-page.png", "assets/projects/ghl/car-service-funnel/appointment-booking.png", "assets/projects/ghl/car-service-funnel/thank-you.png", "assets/projects/ghl/car-service-funnel/funnel-steps.png"],
      sample: false,
    },
    {
      platform: "GoHighLevel",
      title: "Skin Care Sales Funnel",
      summary: "A two-step product sales funnel with a conversion-focused offer page and branded thank-you — split-test ready.",
      what: "A GoHighLevel sales funnel for a skincare brand: an offer-led landing page (\"50% Off First Purchase\" with Buy Now CTA) flowing into a branded thank-you page. Built with GHL's funnel engine, so every step supports split-test variations and has sales and stats tracking built in.",
      tools: ["GoHighLevel", "Funnels", "Split testing", "Sales tracking"],
      impact: "A complete product sales flow that can be cloned for any new offer, with conversion analytics from day one.",
      images: ["assets/projects/ghl/skincare-funnel/home-page.png", "assets/projects/ghl/skincare-funnel/thank-you-page.png", "assets/projects/ghl/skincare-funnel/funnel-step-overview.png", "assets/projects/ghl/skincare-funnel/funnels-dashboard.png"],
      sample: false,
    },
    {
      platform: "GoHighLevel",
      title: "Web Design Agency Website",
      summary: "A six-page agency site where every CTA ends in a booked consultation — hero, contact form, FAQ, link-in-bio, and a Book Now calendar.",
      what: "A complete GoHighLevel website for a design agency: a conversion hero (\"Claim $100 Off Web Design\"), a Contact Us page with a compliant consent opt-in form, a Book Now page with the embedded Schedule-an-Appointment calendar, a Thank You page with FAQ, a mobile link-in-bio page, and a reusable inner-page template.",
      tools: ["GoHighLevel", "Websites", "Forms + consent", "Native calendars"],
      impact: "A lead-generation site where forms, booking, and follow-up all live in one CRM — every inquiry becomes a scheduled consultation automatically.",
      images: ["assets/projects/ghl/website-designer/home-page.png", "assets/projects/ghl/website-designer/book-now.png", "assets/projects/ghl/website-designer/contact-page.png", "assets/projects/ghl/website-designer/thank-you-faq.png", "assets/projects/ghl/website-designer/link-in-bio.png", "assets/projects/ghl/website-designer/pages-overview.png"],
      sample: false,
    },
    {
      platform: "GoHighLevel",
      title: "Car Detailing Business Website",
      summary: "A six-page business website — Home, Contact, booking Calendar, Thank You, Multi-Purpose landing, and Link-in-Bio — all in one platform.",
      what: "A full GoHighLevel website build for a car detailing business: home and contact pages, a calendar page wired to online booking, a thank-you page, a multi-purpose landing page for campaigns, and a mobile link-in-bio page for social profiles — the whole web presence managed from the GHL dashboard.",
      tools: ["GoHighLevel", "Websites", "Calendars", "Link-in-bio"],
      impact: "The business's entire online presence — including booking and its social link hub — runs in one platform tied straight to the CRM.",
      images: ["assets/projects/ghl/car-detailing-website/pages-overview.png", "assets/projects/ghl/car-detailing-website/websites-dashboard.png"],
      sample: false,
    },
    {
      platform: "GoHighLevel",
      title: "Lead Capture & Registration Forms",
      summary: "A library of conversion-ready forms — compliant contact capture, event sign-ups, and webinar registration with marketing attribution.",
      what: "A set of GoHighLevel forms feeding straight into the CRM: a contact form with a compliant transactional-SMS consent checkbox, a branded \"Sign Up For Free\" event registration form, and a webinar registration form capturing organization, \"how did you hear about us\" attribution, and pre-webinar questions — alongside claim-offer and newsletter subscription forms. Each submission can trigger the follow-up automation suite instantly.",
      tools: ["GoHighLevel", "Forms", "Consent compliance", "CRM"],
      impact: "Every entry point captures structured, consent-compliant lead data directly into the pipeline — and kicks off follow-up within minutes via the connected workflows.",
      images: ["assets/projects/ghl/forms-library/forms-dashboard.png", "assets/projects/ghl/forms-library/contact-form.png", "assets/projects/ghl/forms-library/event-registration.png", "assets/projects/ghl/forms-library/webinar-registration.png"],
      sample: false,
    },
  ],

  /* ---- CERTIFICATIONS ----
     Shown in the Certifications section; click opens full size.
     Add new entries here as you earn them.                    */
  certificationsNote: "Trained and certified through the Tara AI Community by RJ Villamer (Kuys RJ) — n8n Ambassador in the Philippines and Certified GoHighLevel Admin.",
  certifications: [
    { title: "AI Automation with n8n",                    issuer: "Tara AI Community · Technical Virtual Assistants PH", date: "November 2025", image: "assets/certs/n8n.jpg" },
    { title: "No Code Automation with Make.com",          issuer: "Tara AI Community · Technical Virtual Assistants PH", date: "December 2025", image: "assets/certs/make.jpg" },
    { title: "No Code Automation with Zapier",            issuer: "Tara AI Community · Technical Virtual Assistants PH", date: "December 2025", image: "assets/certs/zapier.jpg" },
    { title: "HighLevel CRM",                             issuer: "Tara AI Community · Technical Virtual Assistants PH", date: "December 2025", image: "assets/certs/ghl.jpg" },
    { title: "Prompt Engineering",                        issuer: "Tara AI Community · Technical Virtual Assistants PH", date: "December 2025", image: "assets/certs/prompt_engineering.jpg" },
    { title: "WordPress Web Page Building & Maintenance", issuer: "Tara AI Community · Technical Virtual Assistants PH", date: "December 2025", image: "assets/certs/wordpress.jpg" },
  ],

  /* ---- CHAT QUICK ANSWERS (scripted replies in the chat widget) ---- */
  chatAnswers: {
    automate: "Almost anything repetitive: lead capture & follow-up, client onboarding, data entry between tools, reporting, notifications, CRM updates, and AI-powered steps like qualification or drafting. If it happens the same way twice, it can probably be automated.",
    projects: "Scroll to the Projects section for featured builds on n8n, Make.com, Zapier, and GoHighLevel — or use the button below to jump straight there.",
    tools:    "My core stack: n8n, Make.com, Zapier, and GoHighLevel — plus AI agents, APIs, webhooks, and whatever CRM or spreadsheet your business already runs on.",
  },
};
