export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.growthstationco.com";

export const JOBS_PAGE_SIZE = 5;

// ── helpers ──
async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.response = { data }; // توافق مع الكود القديم
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await parseBody(res);
  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message || data?.error;
    throw new ApiError(msg || `HTTP ${res.status}`, res.status, data);
  }
  return data;
}

const postJson = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, submittedAt: new Date().toISOString() }),
  });

// ── Brief / Contact ──
export const submitBrief = (data) => postJson("/brief", data);
export const submitContact = (data) => postJson("/contact/", data);

// ── Jobs ──
// unwrapPublishedJobs: انسخها من الملف القديم زي ما هي

export const getJobPostings = async (page = 1, limit = JOBS_PAGE_SIZE) => {
  const data = await request(
    `/announcement/published?page=${page}&limit=${limit}`,
    { headers: { Accept: "application/json" }, next: { revalidate: 300 } },
  );

  const { items, meta } = unwrapPublishedJobs(data);
  const total = meta.total ?? data?.total ?? null;
  const totalPages = meta.totalPages ?? data?.totalPages ?? null;

  let hasMore;
  if (totalPages != null) hasMore = page < totalPages;
  else if (total != null) hasMore = page * limit < total;
  else hasMore = items.length === limit;

  return { items, hasMore };
};

// ── Job Application (FormData) ──
// بدون سلاش في الآخر عن قصد: الـ redirect بيضيّع الـ body
export const submitJobApplication = (formData) => {
  const body = new FormData();
  body.append("fullName", formData.fullName);
  body.append("email", formData.email);
  body.append("position", formData.position || "Open Application");
  if (formData.cv) body.append("resume", formData.cv);
  if (formData.phone) body.append("phone", formData.phone);
  if (formData.portfolio) body.append("portfolio", formData.portfolio);
  if (formData.whyGrowthStation) body.append("message", formData.whyGrowthStation);

  return request("/application", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
};

// ── Portfolio ──
export const fetchPortfolio = (category = null) =>
  request(
    category ? `/portfolio?category=${encodeURIComponent(category)}` : "/portfolio",
    { next: { revalidate: 300 } },
  );