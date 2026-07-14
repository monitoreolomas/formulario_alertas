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
  }

  function onCategoriaChange(v) {
    setCategoria(v);
    setSubcategoria("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errores = [];
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horario)) errores.push("Horario inválido (HH:MM)");
    if (!comisaria) errores.push("Comisaría requerida");
    if (!cgm) errores.push("CGM requerido");
    if (!categoria) errores.push("Categoría requerida");
    if (categoria && categoria !== "Otros" && !subcategoria) errores.push("Subcategoría requerida");
    if (!camara) errores.push("Debe indicar si se ve por cámara");
    if (errores.length) { showToast(errores.join("  ·  "), "error"); return; }

    setLoading(true);
    try {
      await guardarNovedad({ fecha, horario, comisaria, cgm, camara, numeroCamara, categoria, subcategoria });
      showToast("Novedad registrada correctamente.", "success");
      reset();
    } catch (err) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const subOptions = categoria && categoria !== "Otros" ? CATEGORIAS[categoria] || [] : [];

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
        </div>

        <div style={{ borderBottom: "1px solid #1e2d45", marginBottom: "2rem" }} />

        {/* ── FORM ── */}
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
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: null, type: null })} />
    </>
  );
}
