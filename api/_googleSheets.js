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

// Dia/mes/anio de hoy en Argentina, como numeros (para comparar sin
// depender del formato exacto con el que Sheets devuelva las fechas).
export function hoyPartesAR() {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());
  const get = (t) => Number(partes.find((p) => p.type === t)?.value);
  return { d: get("day"), m: get("month"), y: get("year") };
}

// Google Sheets convierte automaticamente texto tipo fecha en un valor de
// fecha real, y al leerlo devuelve el texto FORMATEADO segun el locale de
// la planilla (que puede no llevar cero adelante: "14/7/2026" en vez de
// "14/07/2026"). Por eso parseamos a numeros en vez de comparar strings.
export function parseFechaCelda(valor) {
  const partes = String(valor || "").trim().split("/");
  if (partes.length !== 3) return null;
  const [d, m, y] = partes.map(Number);
  if (!d || !m || !y) return null;
  return { d, m, y };
}

// Mismo problema con "Horario": Sheets puede devolverlo en 12hs con
// a.m./p.m. en vez del "HH:MM:SS" en 24hs que espera calcularTurno().
// Esto normaliza cualquiera de los dos formatos a "HH:MM:SS" 24hs.
export function normalizarHorario(valor) {
  const s = String(valor || "").trim();
  if (!s) return "";
  const m12 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?$/i);
  if (m12) {
    let h = Number(m12[1]);
    const ampm = m12[4].toLowerCase();
    if (ampm === "p" && h !== 12) h += 12;
    if (ampm === "a" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m12[2]}:${m12[3] || "00"}`;
  }
  const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (m24) return `${m24[1].padStart(2, "0")}:${m24[2]}:${m24[3] || "00"}`;
  return s;
}

// Normaliza nombres de columna para poder matchear los headers reales de la
// planilla aunque difieran en tildes, mayusculas o espacios extra
// (ej. el codigo espera "Comisaria" pero la celda real dice "Comisaria" con
// tilde, o con otra capitalizacion).
const MAPA_ACENTOS = {
  "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
  "Á": "a", "É": "e", "Í": "i", "Ó": "o", "Ú": "u",
  "ü": "u", "Ü": "u", "ñ": "n", "Ñ": "n",
};

export function normalizarHeader(s) {
  return String(s || "")
    .split("")
    .map((c) => MAPA_ACENTOS[c] || c)
    .join("")
    .trim()
    .toLowerCase();
}

// Busca el indice de una columna por nombre, tolerando diferencias de
// tildes/mayusculas/espacios.
export function indiceColumna(headers, nombre) {
  const objetivo = normalizarHeader(nombre);
  return headers.findIndex((h) => normalizarHeader(h) === objetivo);
}

export function mesActualAR() {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());
  const get = (t) => Number(partes.find((p) => p.type === t)?.value);
  return { mes: get("month"), anio: get("year") };
}
