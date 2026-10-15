// الصور: حطها في public/images/about/ (يفضل 1600x2000 JPG أو أعلى، نسبة 4:5)
export const hero = {
  parts: [["Why did ", false], ["Growth Station", true], [" exist?", false]],
};

export const chapters = [
  {
    id: "why", tone: "forest", flip: false, title: null, em: 3,
    img: "/images/about/story-why.jpg", alt: "Founders and a consultant meeting around a key-shaped table",
    lines: [
      "Too many ambitious businesses were investing in marketing — and getting nothing back but content.",
      "We saw founders and business owners who had everything it takes to build something great — the vision, the drive, the belief — held back by agencies that prioritized output over outcomes.",
      "Businesses that deserved a real partner, not just another vendor.",
      "Growth Station was built to be that partner.",
      "One that leads with strategy, operates with clarity, and measures success the way you do — in revenue, in growth, in results that actually move the needle.",
      "For businesses in Egypt and the GCC that are ready to stop settling — we are ready to build.",
    ],
  },
  {
    id: "different", tone: "cream", flip: true, title: "What makes us different?", em: 0,
    img: "/images/about/story-different.jpg", alt: "Strategy workshop at a whiteboard: research, strategy, execution, growth",
    lines: [
      "Our difference is not a service. It is a mindset.",
      "We refuse to touch execution until the strategy is airtight — because we have seen too many businesses bleed budget on content that was built on nothing.",
      "We do not sell you marketing. We sell you clarity — a clear picture of where you are, where you need to go, and exactly what it takes to get there.",
      "The marketing is just how we prove the thinking works.",
    ],
  },
  {
    id: "serve", tone: "amber", flip: false, title: "Who do we serve?", em: -1,
    img: "/images/about/story-serve.jpg", alt: "Two business partners sharing a high five over a laptop",
    lines: [
      "You gave them your trust, your budget, your time — and they gave you back excuses.",
      "We work with founders and business owners who have been through that — and came out the other side more determined, not broken.",
      "People who still believe in what they are building, even after everything.",
      "People who are not looking for another agency to disappoint them.",
      "They are looking for a partner who feels the weight of their dream — and carries it like it's their own.",
    ],
    cta: { text: "Stop settling for agencies that deliver less than you deserve.", label: "Start your growth journey" },
  },
];

export const why = [
  { title: "Strategy Before Everything", text: "We never touch execution until the strategy is airtight. Every campaign, every post, and every decision is connected to a clear growth plan built specifically for your business." },
  { title: "Results You Can Measure", text: "We are allergic to vanity metrics. Likes and reach mean nothing if revenue does not follow. We track leads, conversions, and real ROI." },
  { title: "Egypt & GCC, One Partner", text: "Whether you are scaling locally or expanding across the Gulf, we understand the audiences, the culture, and the opportunities." },
  { title: "Full Stack, One Team", text: "Strategy, branding, software, content, ads, and media — all under one roof, all aligned to one goal." },
];

export const drives = [
  { label: "Vision", title: "A Future Without Settling", text: "We are building a future where every ambitious business in Egypt and the GCC finds a partner who thinks about their growth with the same seriousness they do. Where strategy is not a luxury, and results are not a promise — they are a standard." },
  { label: "Mission", title: "Build Real Growth", text: "We exist to build real strategies, real systems, and real growth. We fight for businesses that deserve more and do not stop until the numbers move." },
  { label: "Our Promise", title: "Every Client. Every Campaign.", text: "That is the future we are building toward. Every client. Every campaign. Every day. We show up, we deliver, and we hold ourselves accountable to your growth." },
  { label: "What We Stand For", title: "No Guesswork. No Wasted Budget.", text: "No inflated reports. No wasted budget. Just clear thinking, precise execution, and measurable outcomes you can hold us accountable for." },
];

export const how = [
  { title: "Transparency Always", text: "You see exactly what we're doing, why we're doing it, and what the numbers say — no black boxes, no jargon." },
  { title: "Ownership Mentality", text: "We treat your business like it's ours. That means we care about what actually moves, not what looks good in a deck." },
  { title: "Long-term Thinking", text: "We're not here for a quick win. We build frameworks that continue working — with or without us in the room." },
  { title: "Radical Accountability", text: "If we commit to a target, we own the path to reach it. Results are our reputation." },
];
