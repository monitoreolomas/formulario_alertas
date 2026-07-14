import { getGoogleClient, SHEET_ID, mesActualAR, indiceColumna, parseFechaCelda, normalizarHorario } from "./_googleSheets.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const client = getGoogleClient();
    const dataRes = await client.request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:Z`,
    });
    const rows = dataRes.data.values || [];
    if (!rows.length) {
      res.status(200).json({ registros: [] });
      return;
    }

    const headers = rows[0];
    const idx = (name) => indiceColumna(headers, name);
    const iFecha = idx("Fecha evento");
    const iHorario = idx("Horario");
    const iCategoria = idx("Categoria");
    const iSubcategoria = idx("Subcategoria");
    const iComisaria = idx("Comisaria");
    const iCgm = idx("CGM");

    const { mes, anio } = mesActualAR();

    const registros = rows
      .slice(1)
      .map((r) => ({ r, f: parseFechaCelda(r[iFecha]) }))
      .filter(({ f }) => f && f.m === mes && f.y === anio)
      .map(({ r, f }) => ({
        fecha: `${String(f.d).padStart(2, "0")}/${String(f.m).padStart(2, "0")}/${f.y}`,
        _dia: f.d,
        horario: normalizarHorario(r[iHorario]),
        categoria: r[iCategoria] || "",
        subcategoria: r[iSubcategoria] || "",
        comisaria: r[iComisaria] || "",
        cgm: r[iCgm] || "",
      }))
      .sort((a, b) => (b._dia !== a._dia ? b._dia - a._dia : b.horario.localeCompare(a.horario)))
      .map(({ _dia, ...resto }) => resto);

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ registros });
  } catch (e) {
    console.error("Error en /api/tarima-historial:", e);
    res.status(500).json({ error: e.message || "Error al consultar el historial del mes." });
  }
}
