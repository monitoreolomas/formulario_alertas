import { useState } from "react";

const CATEGORIAS = {
  Robo: ["Moto", "Auto", "Via pública", "Finca", "Comercio", "Tentativa"],
  Hurto: ["Moto", "Auto", "Via pública", "Finca", "Comercio", "Escuela", "Tentativa"],
  "Accidente de tránsito": ["Daños materiales", "Con lesiones"],
  Conflicto: ["Vecinal", "Familiar", "Pareja"],
  Violencia: ["Violencia de Género", "Maltrato animal", "Violencia Infantil", "Violencia Familia"],
  Heridos: ["Arma de fuego", "Arma blanca"],
  Persecución: ["Con aprendido", "Fugó"],
  Obito: ["Homicidio", "Natural", "Suicidio"],
  Incendios: ["Via pública", "Comercio", "Automotor", "Finca", "Escuela"],
  Otros: [],
};

const COMISARIAS = [
  "Cria 1ra", "Cria 2da", "Cria 3ra", "Cria 4ta", "Cria 5ta",
  "Cria 6ta", "Cria 7ma", "Cria 8va", "Cria 9na", "Cria 10ma",
  "Dto Turdera", "Dto Banfield", "Dto Villa Rita",
];

const CGM_OPCIONES = [
  "Banfield", "Ingeniero Budge", "Llavallol", "Lomas de Zamora",
  "Parque Barón", "San José", "Santa Catalina", "Santa Marta",
  "Temperley", "Turdera", "Villa Albertina", "Villa Centenario",
  "Villa Fiorito", "Villa Lamadrid",
];

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

function weekdayFromDDMMYYYY(fechaStr) {
  const [d, m, y] = (fechaStr || "").split("/").map(Number);
  if (!d || !m || !y) return null;
  const jsDay = new Date(y, m - 1, d).getDay(); // 0=Dom..6=Sáb
  return (jsDay + 6) % 7; // 0=Lun..6=Dom
}

function calcularTurno(horario, weekday) {
  const hora = parseInt((horario || "").split(":")[0], 10);
  if (isNaN(hora) || weekday == null) return "—";
  const finde = weekday >= 5;
  if (finde) return hora >= 6 && hora < 18 ? "Mañana" : "Noche";
  if (hora >= 6 && hora < 14) return "Mañana";
  if (hora >= 14 && hora < 22) return "Tarde";
  return "Noche";
}

async function guardarNovedad(data) {
  const res = await fetch("/api/tarima-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
}

// ── SUB-COMPONENTES ───────────────────────────────────────────

function SectionLabel({ num, children }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.7rem",
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#334155",
      marginTop: "1.5rem",
      marginBottom: "0.85rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #1e2d45",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <span style={{
        background: "rgba(20,184,166,0.15)",
        color: "#14b8a6",
        borderRadius: "50%",
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.6rem",
        fontWeight: 800,
        flexShrink: 0,
      }}>{num}</span>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{
      display: "block",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#64748b",
      marginBottom: 5,
    }}>{children}</label>
  );
}

function TextInput({ value, onChange, placeholder, hint, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "#111827",
          border: `1px solid ${focused ? "#14b8a6" : "#1e2d45"}`,
          borderRadius: 8,
          color: "#e2e8f0",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.9rem",
          padding: "0 14px",
          height: 44,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(20,184,166,0.15)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      {hint && (
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#334155", margin: "4px 0 0" }}>{hint}</p>
      )}
    </div>
  );
}

function Select({ value, onChange, options, placeholder = "Seleccione", disabled = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        style={{
          width: "100%",
          background: disabled ? "#0d1420" : "#111827",
          border: `1px solid ${focused ? "#14b8a6" : "#1e2d45"}`,
          borderRadius: 8,
          color: disabled ? "#334155" : value === "" ? "#5a6a80" : "#e2e8f0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
          padding: "0 40px 0 14px",
          height: 44,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(20,184,166,0.15)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          appearance: "none",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#334155", pointerEvents: "none", fontSize: "0.75rem" }}>▼</span>
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const isError = type === "error";
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: isError ? "rgba(239,68,68,0.1)" : "rgba(20,184,166,0.12)",
      border: `1px solid ${isError ? "#7f1d1d" : "#0d9488"}`,
      borderLeft: `3px solid ${isError ? "#ef4444" : "#14b8a6"}`,
      borderRadius: 10, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10,
      fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
      color: isError ? "#fca5a5" : "#5eead4",
      maxWidth: 460, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 9999,
      animation: "tarimaSlideUp 0.25s ease",
    }}>
      <span>{isError ? "⚠" : "✓"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: "1.1rem", lineHeight: 1 }}>×</button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 16, maxWidth: 860, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1e2d45", flexShrink: 0 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#f1f5f9" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "1.3rem", lineHeight: 1, padding: 4 }}>×</button>
        </div>
        <div style={{ padding: "16px 20px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function TablaHistorial({ columnas, filas }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e2d45" }}>
            {columnas.map((c) => (
              <th key={c} style={{ textAlign: "left", padding: "8px 10px", color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(30,45,69,0.5)" }}>
              {fila.map((val, j) => (
                <td key={j} style={{ padding: "8px 10px", color: "#e2e8f0", whiteSpace: "nowrap" }}>{val || "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid #1e2d45" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748b" }}>{label}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.875rem", color: "#e2e8f0", textAlign: "right" }}>{value || "—"}</span>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────

export default function TarimaForm({ onVolver }) {
  const [fecha, setFecha] = useState(today());
  const [horario, setHorario] = useState("");
  const [comisaria, setComisaria] = useState("");
  const [cgm, setCgm] = useState("");
  const [camara, setCamara] = useState("");
  const [numeroCamara, setNumeroCamara] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: null, type: null });
  const [formKey, setFormKey] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [hoyOpen, setHoyOpen] = useState(false);
  const [hoyRegistros, setHoyRegistros] = useState(null);
  const [hoyLoading, setHoyLoading] = useState(false);
  const [hoyError, setHoyError] = useState(null);

  async function cargarHoy() {
    setHoyLoading(true);
    setHoyError(null);
    try {
      const res = await fetch("/api/tarima-hoy");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      setHoyRegistros(json.registros || []);
    } catch (err) {
      setHoyError(err.message);
    } finally {
      setHoyLoading(false);
    }
  }

  function toggleHoy() {
    const next = !hoyOpen;
    setHoyOpen(next);
    if (next) cargarHoy();
  }

  const [historialOpen, setHistorialOpen] = useState(false);
  const [historialRegistros, setHistorialRegistros] = useState(null);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState(null);

  async function cargarHistorial() {
    setHistorialLoading(true);
    setHistorialError(null);
    try {
      const res = await fetch("/api/tarima-historial");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      setHistorialRegistros(json.registros || []);
    } catch (err) {
      setHistorialError(err.message);
    } finally {
      setHistorialLoading(false);
    }
  }

  function toggleHistorial() {
    const next = !historialOpen;
    setHistorialOpen(next);
    if (next) cargarHistorial();
  }

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: null, type: null }), 4500);
  }

  function reset() {
    setFecha(today());
    setHorario("");
    setComisaria("");
    setCgm("");
    setCamara("");
    setNumeroCamara("");
    setCategoria("");
    setSubcategoria("");
    setFormKey((k) => k + 1);
    setReviewing(false);
  }

  function onCategoriaChange(v) {
    setCategoria(v);
    setSubcategoria("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errores = [];
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horario)) errores.push("Horario inválido (HH:MM)");
    if (!comisaria) errores.push("Comisaría requerida");
    if (!cgm) errores.push("CGM requerido");
    if (!categoria) errores.push("Categoría requerida");
    if (categoria && categoria !== "Otros" && !subcategoria) errores.push("Subcategoría requerida");
    if (!camara) errores.push("Debe indicar si se ve por cámara");
    if (errores.length) { showToast(errores.join("  ·  "), "error"); return; }
    setReviewing(true);
  }

  async function confirmarGuardado() {
    setLoading(true);
    try {
      await guardarNovedad({ fecha, horario, comisaria, cgm, camara, numeroCamara, categoria, subcategoria });
      showToast("Novedad registrada correctamente.", "success");
      reset();
      if (hoyOpen) cargarHoy();
      if (historialOpen) cargarHistorial();
    } catch (err) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const subOptions = categoria && categoria !== "Otros" ? CATEGORIAS[categoria] || [] : [];

  const historialFilas = (historialRegistros || []).map((r) => [
    r.fecha,
    r.horario,
    calcularTurno(r.horario, weekdayFromDDMMYYYY(r.fecha)),
    r.categoria,
    r.subcategoria,
    r.comisaria,
    r.cgm,
  ]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          background: #0b1120;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,184,166,0.12) 0%, transparent 70%),
            linear-gradient(180deg, #0b1120 0%, #0d1526 100%);
          min-height: 100vh;
        }
        @keyframes tarimaSlideUp {
          from { opacity:0; transform:translateX(-50%) translateY(12px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes tarimaPulseDot {
          0%,100% { opacity:1; box-shadow:0 0 6px #14b8a6; }
          50%     { opacity:0.6; box-shadow:0 0 12px #14b8a6; }
        }
        select option { background:#1a2640; color:#cbd5e1; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: "2rem" }}>
          {onVolver && (
            <button onClick={onVolver} style={{ background: "rgba(20,184,166,0.1)", border: "1px solid #1e2d45", color: "#94a3b8", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
              ← Volver
            </button>
          )}
          <img src="/logo_izquierda.png" width={64} alt="Logo Lomas de Zamora" style={{ borderRadius: 12, flexShrink: 0 }} />
          <div style={{ paddingTop: 4 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.25)",
              borderRadius: 100, padding: "5px 14px 5px 10px",
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#5eead4", marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#14b8a6", animation: "tarimaPulseDot 2s infinite", display: "inline-block" }} />
              Sistema activo
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
              Carga de Novedades
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
              Registro de incidentes — Partido de Lomas de Zamora
            </p>
          </div>
          <div style={{ marginLeft: "auto", flexShrink: 0, display: "flex", gap: 8 }}>
            <button
              onClick={toggleHoy}
              style={{
                background: hoyOpen ? "rgba(20,184,166,0.15)" : "rgba(20,184,166,0.08)",
                border: `1px solid ${hoyOpen ? "#14b8a6" : "#1e2d45"}`, color: hoyOpen ? "#5eead4" : "#94a3b8",
                borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              📋 Hoy{hoyRegistros ? ` (${hoyRegistros.length})` : ""}
            </button>
            <button
              onClick={toggleHistorial}
              style={{
                background: historialOpen ? "rgba(20,184,166,0.15)" : "rgba(20,184,166,0.08)",
                border: `1px solid ${historialOpen ? "#14b8a6" : "#1e2d45"}`, color: historialOpen ? "#5eead4" : "#94a3b8",
                borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              📅 Historial{historialRegistros ? ` (${historialRegistros.length})` : ""}
            </button>
          </div>
        </div>

        {hoyOpen && (
          <div style={{
            background: "#111827", border: "1px solid #1e2d45", borderRadius: 14,
            padding: "14px 18px", marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hoyLoading || hoyError || (hoyRegistros && hoyRegistros.length) ? 10 : 0 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>
                Novedades cargadas hoy
              </span>
              <button onClick={cargarHoy} disabled={hoyLoading} style={{ background: "none", border: "none", color: "#14b8a6", cursor: hoyLoading ? "default" : "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                ↺ Actualizar
              </button>
            </div>
            {hoyLoading && <p style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>Cargando…</p>}
            {hoyError && <p style={{ fontSize: "0.8rem", color: "#fca5a5", fontFamily: "'DM Sans', sans-serif" }}>{hoyError}</p>}
            {!hoyLoading && !hoyError && hoyRegistros && hoyRegistros.length === 0 && (
              <p style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>Todavía no se cargó ninguna novedad hoy.</p>
            )}
            {!hoyLoading && hoyRegistros && hoyRegistros.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                {hoyRegistros.map((r, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    background: "#0d1420", border: "1px solid #1e2d45", borderRadius: 8,
                    fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#cbd5e1",
                  }}>
                    <span style={{ color: "#14b8a6", fontWeight: 600, flexShrink: 0 }}>{r.horario || "—"}</span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.categoria}{r.subcategoria ? ` · ${r.subcategoria}` : ""}
                    </span>
                    <span style={{ color: "#64748b", flexShrink: 0 }}>{r.comisaria}</span>
                    <span style={{ color: "#64748b", flexShrink: 0 }}>{r.cgm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {historialOpen && (
          <Modal title="Historial del mes en curso" onClose={() => setHistorialOpen(false)}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button onClick={cargarHistorial} disabled={historialLoading} style={{ background: "none", border: "none", color: "#14b8a6", cursor: historialLoading ? "default" : "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                ↺ Actualizar
              </button>
            </div>
            {historialLoading && <p style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>Cargando…</p>}
            {historialError && <p style={{ fontSize: "0.8rem", color: "#fca5a5", fontFamily: "'DM Sans', sans-serif" }}>{historialError}</p>}
            {!historialLoading && !historialError && historialRegistros && historialRegistros.length === 0 && (
              <p style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>Todavía no hay novedades cargadas este mes.</p>
            )}
            {!historialLoading && historialFilas.length > 0 && (
              <TablaHistorial
                columnas={["Día", "Hora", "Turno", "Categoría", "Subcategoría", "Comisaría", "CGM"]}
                filas={historialFilas}
              />
            )}
          </Modal>
        )}

        <div style={{ borderBottom: "1px solid #1e2d45", marginBottom: "2rem" }} />

        {/* ── REVISIÓN ── */}
        {reviewing ? (
          <div>
            <div style={{
              background: "linear-gradient(145deg, #111827 0%, #0f1e30 100%)",
              border: "1px solid #1e2d45",
              borderRadius: 16,
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#14b8a6", marginBottom: 14 }}>
                Revisá los datos antes de confirmar
              </p>
              <ReviewRow label="Fecha del evento" value={fecha} />
              <ReviewRow label="Horario" value={horario} />
              <ReviewRow label="Comisaría" value={comisaria} />
              <ReviewRow label="CGM" value={cgm} />
              <ReviewRow label="¿Se ve por cámara?" value={camara} />
              {camara === "SI" && <ReviewRow label="Número de cámara" value={numeroCamara} />}
              <ReviewRow label="Categoría" value={categoria} />
              <ReviewRow label="Subcategoría" value={subcategoria} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: "1.25rem" }}>
              <button
                type="button"
                onClick={() => setReviewing(false)}
                disabled={loading}
                style={{
                  flex: 1, height: 48, background: "transparent",
                  color: "#94a3b8", border: "1px solid #1e2d45", borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                  letterSpacing: "0.04em", cursor: loading ? "not-allowed" : "pointer",
                }}
              >← Editar</button>
              <button
                type="button"
                onClick={confirmarGuardado}
                disabled={loading}
                style={{
                  flex: 2, height: 48,
                  background: loading ? "#134e4a" : "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                  color: "#ffffff", border: "none", borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                  letterSpacing: "0.04em", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)",
                }}
              >{loading ? "Guardando…" : "Confirmar y Guardar →"}</button>
            </div>
          </div>
        ) : (
        <form key={formKey} onSubmit={handleSubmit}>
          <div style={{
            background: "linear-gradient(145deg, #111827 0%, #0f1e30 100%)",
            border: "1px solid #1e2d45",
            borderRadius: 16,
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)" }} />

            {/* ① Temporalidad */}
            <SectionLabel num="①">Temporalidad</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>Fecha del evento</FieldLabel>
                <TextInput type="date" value={fecha} onChange={setFecha} />
              </div>
              <div>
                <FieldLabel>Horario</FieldLabel>
                <TextInput value={horario} onChange={setHorario} placeholder="HH:MM" hint="Formato 24 h — ej: 08:30 / 21:45" />
              </div>
            </div>

            {/* ② Jurisdicción */}
            <SectionLabel num="②">Jurisdicción</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>Comisaría</FieldLabel>
                <Select value={comisaria} onChange={setComisaria} options={COMISARIAS} />
              </div>
              <div>
                <FieldLabel>CGM</FieldLabel>
                <Select value={cgm} onChange={setCgm} options={CGM_OPCIONES} />
              </div>
              <div>
                <FieldLabel>¿Se ve por cámara?</FieldLabel>
                <Select value={camara} onChange={setCamara} options={["SI", "NO"]} />
              </div>
            </div>
            {camara === "SI" && (
              <div style={{ marginTop: 16 }}>
                <FieldLabel>Número de cámara</FieldLabel>
                <TextInput value={numeroCamara} onChange={setNumeroCamara} placeholder="Ej: CAM-047" />
              </div>
            )}

            {/* ③ Tipo de incidente */}
            <SectionLabel num="③">Tipo de incidente</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>Categoría</FieldLabel>
                <Select value={categoria} onChange={onCategoriaChange} options={Object.keys(CATEGORIAS)} />
              </div>
              <div>
                <FieldLabel>Subcategoría</FieldLabel>
                {categoria === "Otros" ? (
                  <Select value="Otros" onChange={() => {}} options={["Otros"]} placeholder="— No aplica —" disabled />
                ) : (
                  <Select
                    value={subcategoria}
                    onChange={setSubcategoria}
                    options={subOptions}
                    placeholder={categoria ? "Seleccione" : "Seleccione categoría primero"}
                    disabled={!categoria}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1.25rem",
              width: "100%",
              height: 48,
              background: loading ? "#134e4a" : "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "0.04em",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(20,184,166,0.3)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Guardando…" : "Guardar Novedad  →"}
          </button>
        </form>
        )}
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: null, type: null })} />
    </>
  );
}
