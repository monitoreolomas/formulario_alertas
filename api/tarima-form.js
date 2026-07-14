import { getGoogleClient, SHEET_ID, marcaTemporalAR } from "./_googleSheets.js";

const SUBCATEGORIA_COLS = [
  "Subcategoria Robo",
  "Subcategoria Hurto",
  "Subcategoria Accidente de tránsito",
  "Subcategoria Conflicto",
  "Subcategoria Violencia",
  "Subcategoria Heridos",
  "Subcategoria Persecución",
  "Subcategoria Obito",
  "Subcategoria Otros",
  "Subcategoria Incendios",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { fecha, horario, comisaria, cgm, camara, numeroCamara, categoria, subcategoria } = req.body || {};

  const errores = [];
  if (!fecha) errores.push("Fecha requerida");
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horario || "")) errores.push("Horario inválido (HH:MM)");
  if (!comisaria) errores.push("Comisaría requerida");
  if (!cgm) errores.push("CGM requerido");
  if (!categoria) errores.push("Categoría requerida");
  if (categoria && categoria !== "Otros" && !subcategoria) errores.push("Subcategoría requerida");
  if (!camara) errores.push("Debe indicar si se ve por cámara");
  if (errores.length) {
    res.status(400).json({ error: errores.join(" · ") });
    return;
  }

  try {
    const client = getGoogleClient();

    const [y, mo, d] = String(fecha).split("-");
    const fechaStr = `${d}/${mo}/${y}`;
    const subcategoriaVal = categoria === "Otros" ? "Otros" : subcategoria;

    const fila = {
      "Marca temporal": marcaTemporalAR(),
      "Fecha evento": fechaStr,
      Horario: `${horario}:00`,
      "¿Se ve por cámara?": camara,
      "Camara del Evento": numeroCamara || "",
      CGM: cgm,
      Categoria: categoria,
      Comisaria: comisaria,
      Subcategoria: subcategoriaVal,
    };
    SUBCATEGORIA_COLS.forEach((c) => { fila[c] = ""; });
    const colSub = `Subcategoria ${categoria}`;
    if (SUBCATEGORIA_COLS.includes(colSub)) fila[colSub] = subcategoriaVal;

    // Traer el orden real de columnas de la hoja (igual que sheet.row_values(1) en Python)
    const headRes = await client.request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:1`,
    });
    const columnas = headRes.data.values?.[0] || Object.keys(fila);
    const filaFinal = columnas.map((col) => fila[col] ?? "");

    await client.request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      method: "POST",
      data: { values: [filaFinal] },
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Error en /api/tarima-form:", e);
    res.status(500).json({ error: e.message || "Error al guardar la novedad." });
  }
}
