// حط الصور في public/images/services/ بنفس الأسماء (يفضل 1200x1500 JPG/WebP)
export const groups = [
  { id: "marketing", label: "Digital Marketing", items: [
    { title: "Strategy", img: "strategy", text: "A growth plan built around your goals, your market and your numbers, before a single post goes live.", points: ["Market & competitor audit", "Positioning & funnel map", "Quarterly growth roadmap"] },
    { title: "Branding", img: "branding", text: "Identity systems that make your business recognisable at a glance, on every channel.", points: ["Logo & visual identity", "Tone of voice", "Brand guidelines"] },
    { title: "Content Creation", img: "content", text: "Copy, design and ideas that sound like you and give people a reason to stop scrolling.", points: ["Content pillars", "Monthly calendars", "Copy & creative"] },
    { title: "Social Media Management", img: "social", text: "We run your channels day to day: planning, publishing, community and reporting.", points: ["Publishing & community", "Platform playbooks", "Monthly reports"] },
    { title: "Media Production", img: "media", text: "Photo, video and motion shot and edited by one team that already knows your brand.", points: ["Shoots & reels", "Motion graphics", "Product photography"] },
    { title: "Ads & Performance Advertising", img: "ads", text: "Paid campaigns tied to leads and revenue, tracked and optimised every week.", points: ["Meta, Google & TikTok ads", "Tracking & attribution", "Weekly optimisation"] },
  ]},
  { id: "software", label: "Software", items: [
    { title: "Web Development", img: "web", text: "Fast, scalable websites built to rank, convert and grow with your business.", points: ["Next.js & React builds", "SEO-ready structure", "CMS & integrations"] },
    { title: "E-commerce", img: "ecommerce", text: "Online stores designed around checkout speed, trust and repeat purchases.", points: ["Store setup & design", "Payments & shipping", "Conversion tuning"] },
    { title: "Mobile Application", img: "mobile", text: "iOS and Android apps with clean UX and a codebase your team can keep building on.", points: ["Cross-platform apps", "API integration", "Store launch"] },
    { title: "UI / UX Design", img: "uiux", text: "Interfaces shaped by research and testing, so people find what they need quickly.", points: ["User flows & wireframes", "Interactive prototypes", "Design systems"] },
  ]},
];
export const allItems = groups.flatMap((g) => g.items);
