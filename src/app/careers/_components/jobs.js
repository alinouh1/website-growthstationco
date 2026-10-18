// القيم المسموحة للـ position في الـ backend
export const POSITIONS = [
  "HR", "Art Director", "Media Buyer", "Content Creator", "Graphic Designer", "Moderator",
  "Social Media Specialist", "UI/UX Designer", "Frontend Developer", "Backend Developer",
  "Media Production", "Accountant",
  "Ads Advertising", "SEO Specialist",
];

// بترجّع الوظايف كـ Array سليمة دايمًا، أيًّا كان اللي جه من الـ API
export const toJobsArray = (raw) => {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.announcements) ? raw.announcements : [];
  return list.filter((j) => j && typeof j === "object");
};
export const deptOf = (job) => (typeof job?.department === "string" ? job.department.trim() : "");
export const jobKey = (job, i) => job._id ?? job.id ?? `${job.title || "job"}-${i}`;
