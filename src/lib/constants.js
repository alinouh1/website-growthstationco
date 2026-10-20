export const SITE = {
  name: "Growth Station",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://growthstationco.com",
  email: "info@growthstationco.com",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/service" },
  { label: "Careers", href: "/careers" },
  { label: "Brief", href: "/brief" },
  { label: "Framework", href: "/framework" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT = {
  email: "info@growthstationco.com",
  phone: "+20 128 133 8483",
  phoneHref: "+201281338483",
  hours: "Sun – Thu · 10:00 AM — 06:00 PM",
  address: ["17 Ismail El Qabbany Street, Nasr City, Cairo", "1st Floor, Apartment 1"],
  mapLink: "https://www.google.com/maps/search/?api=1&query=17+Ismail+El+Qabbany+Street+Nasr+City+Cairo",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1508.201099626861!2d31.330036786529888!3d30.059017346942582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e5d0e2bc985%3A0xbb5ad87d4365c246!2zMTcg2KXYs9mF2KfYudmK2YQg2KfZhNmC2KjYp9mG2YrYjCDYp9mE2YXZhti32YLYqSDYp9mE2KPZiNmE2YnYjCDZhdiv2YrZhtipINmG2LXYsdiMINmF2K3Yp9mB2LjYqSDYp9mE2YLYp9mH2LHYqeKArCA0NDUwMTE1!5e1!3m2!1sar!2seg!4v1780822256758!5m2!1sar!2seg",
};

// TODO: حط روابط حسابات الشركة الexport const SOCIALS = [
  export const SOCIALS = [

  { name: "Facebook",  href: "https://www.facebook.com/growthstationco" },
  { name: "Instagram", href: "https://www.instagram.com/growthstationco" },
  { name: "TikTok",    href: "https://www.tiktok.com/@growthstationco" },
  { name: "Snapchat",  href: "https://www.snapchat.com/add/growthstationco" },
  { name: "Behance",   href: "https://www.behance.net/growthstationco" },
  { name: "LinkedIn",  href: "https://www.linkedin.com/company/growthstationco" },
  { name: "WhatsApp",  href: "https://wa.me/201281338483" },
];

export const COUNTRY_CODES = [
  ["+20", "Egypt"], ["+966", "Saudi Arabia"], ["+971", "UAE"], ["+965", "Kuwait"], ["+974", "Qatar"],
  ["+968", "Oman"], ["+962", "Jordan"], ["+961", "Lebanon"], ["+964", "Iraq"], ["+212", "Morocco"],
  ["+213", "Algeria"], ["+216", "Tunisia"], ["+218", "Libya"], ["+1", "USA/Canada"], ["+44", "UK"],
  ["+33", "France"], ["+49", "Germany"], ["+90", "Turkey"], ["+91", "India"], ["+86", "China"],
];
