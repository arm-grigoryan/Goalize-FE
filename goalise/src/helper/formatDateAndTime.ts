const ARMENIA_TIMEZONE = "Asia/Yerevan";

export function formatUTCDate(
  dateString: string | null,
  format: string = "dd-mm-yyyy"
): string {
  if (!dateString) return "To-Be-Announced";

  const normalized = dateString.split(".")[0];

  if (normalized.startsWith("0001-01-01")) return "To-Be-Announced";

  if (normalized.startsWith("1970-01-01T00:00:00")) return "To-Be-Announced";

  const utcDate = new Date(dateString);
  if (isNaN(utcDate.getTime())) return "To-Be-Announced";

  const local = new Date(
    utcDate.toLocaleString("en-US", { timeZone: ARMENIA_TIMEZONE })
  );

  const dd = String(local.getDate()).padStart(2, "0");
  const mm = String(local.getMonth() + 1).padStart(2, "0");
  const yyyy = local.getFullYear();

  const HH = String(local.getHours()).padStart(2, "0");
  const MM = String(local.getMinutes()).padStart(2, "0");

  return format
    .replace("dd", dd)
    .replace("mm", mm)
    .replace("yyyy", String(yyyy))
    .replace("HH", HH)
    .replace("MM", MM);
}
