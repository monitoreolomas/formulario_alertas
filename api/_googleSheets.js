import { JWT } from "google-auth-library";

// Mismo Sheet que lee dashboard_col.py.
export const SHEET_ID = "1RFsEMgRx-nfnVxKLTGt_hzB_BmLspqJb9GIRusd8dKM";

export function getGoogleClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Faltan GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY en las variables de entorno del servidor.");
  }
  return new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
}

export function marcaTemporalAR() {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => partes.find((p) => p.type === t)?.value;
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export function fechaHoyAR() {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());
  const get = (t) => partes.find((p) => p.type === t)?.value;
  return `${get("day")}/${get("month")}/${get("year")}`;
}
