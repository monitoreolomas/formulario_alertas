import { getGoogleClient, SHEET_ID, mesActualAR } from "./_googleSheets.js";

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
    const idx = (name) => headers.indexOf(name);
    const iFecha = idx("Fecha evento");
    const iHorario = idx("Horario");
    const iCategoria = idx("Categoria");
    const iSubcategoria = idx("Subcategoria");
    const iComisaria = idx("Comisaria");
    const iCgm = idx("CGM");

    const { mes, anio } = mesActualAR();

    const registros = rows
      .slice(1)
      .filter((r) => {
        const partes = (r[iFecha] || "").split("/");
        if (partes.length !== 3) return false;
        const [, m, y] = partes;
        return m === mes && y === anio;
      })
      .map((r) => ({
        fecha: r[iFecha] || "",
        horario: r[iHorario] || "",
        categoria: r[iCategoria] || "",
        subcategoria: r[iSubcategoria] || "",
        comisaria: r[iComisaria] || "",
        cgm: r[iCgm] || "",
      }))
      .sort((a, b) => (a.fecha !== b.fecha ? b.fecha.localeCompare(a.fecha) : b.horario.localeCompare(a.horario)));

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ registros });
  } catch (e) {
    console.error("Error en /api/tarima-historial:", e);
    res.status(500).json({ error: e.message || "Error al consultar el historial del mes." });
  }
}
