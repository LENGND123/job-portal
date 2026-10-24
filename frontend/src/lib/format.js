export function timeAgo(date) {
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return formatDate(date);
}

export function formatDate(date) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return value.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function salaryMatches(lpa, band) {
  if (!band) return true;
  const salary = Number(lpa);
  if (band === "0-40k") return salary <= 5;
  if (band === "42-1lakh") return salary > 5 && salary <= 12;
  if (band === "1lakh to 5lakh") return salary > 12;
  return true;
}

export function matchesIndustry(title, industry) {
  if (!industry) return true;
  const compact = (value) => String(value || "").toLowerCase().replace(/\s+/g, "");
  return compact(title).includes(compact(industry));
}

export function statusClass(status) {
  if (status === "accepted") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-800";
}
