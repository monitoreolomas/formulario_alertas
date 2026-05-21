import { useState } from "react";

// ── CONFIG — reemplazar con tus valores de Supabase ──────────
const SUPABASE_URL = "https://ygwjvkjrpojxjczcholu.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnd2p2a2pycG9qeGpjemNob2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzgyNDYsImV4cCI6MjA5NDk1NDI0Nn0.NvCxB2sXVxa4kQVGiVPs6_x1cinRi4UFpBJud6sx1Nw";
// ────────────────────────────────────────────────────────────

const CGM_OPCIONES = [
  "Banfield","Ingeniero Budge","Llavallol","Lomas de Zamora",
  "Parque Barón","San José","Santa Catalina","Santa Marta",
  "Temperley","Turdera","Villa Albertina","Villa Centenario",
  "Villa Fiorito","Villa Lamadrid",
];

const CATEGORIAS = [
  { id: "Sirena",    icon: "🚨" },
  { id: "Policía",   icon: "👮" },
  { id: "Bomberos",  icon: "🚒" },
  { id: "VG",        icon: "🛡️" },
  { id: "Ambulancia",icon: "🚑" },
];

const TIPOS = [
  { id: "Whatsapp",  icon: "💬" },
  { id: "Botmarket", icon: "🤖" },
  { id: "Sistema",   icon: "🖥️" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

async function guardarAlerta(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/alertas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ── SUB-COMPONENTS ───────────────────────────────────────────

function SelectCard({ label, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "14px 8px",
        background: selected ? "rgba(245,158,11,0.12)" : "#17110a",
        border: `1px solid ${selected ? "#f59e0b" : "#2a1f12"}`,
        borderRadius: 12,
        cursor: "pointer",
        outline: "none",
        boxShadow: selected ? "0 0 0 1px rgba(245,158,11,0.3)" : "none",
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        color: selected ? "#f59e0b" : "#a08060",
      }}>{label}</span>
    </button>
  );
}

function SectionLabel({ num, children }) {
  return (
    <div style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "#9a7a50",
      marginTop: "1.75rem",
      marginBottom: "0.85rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #2a1f12",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <span style={{
        background: "rgba(245,158,11,0.15)",
        color: "#f59e0b",
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
      fontFamily: "'Syne', sans-serif",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#b8905a",
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
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "#17110a",
          border: `1px solid ${focused ? "#f59e0b" : "#2a1f12"}`,
          borderRadius: 8,
          color: "#e8d5b0",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.875rem",
          padding: "0 14px",
          height: 44,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(245,158,11,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      {hint && (
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.68rem",
          color: "#7a6040",
          margin: "4px 0 0",
        }}>{hint}</p>
      )}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "#17110a",
          border: `1px solid ${focused ? "#f59e0b" : "#2a1f12"}`,
          borderRadius: 8,
          color: value === "" ? "#5a4030" : "#e8d5b0",
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.875rem",
          padding: "0 40px 0 14px",
          height: 44,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(245,158,11,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>Seleccione un CGM…</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span style={{
        position: "absolute", right: 14, top: "50%",
        transform: "translateY(-50%)",
        color: "#4a3520", pointerEvents: "none", fontSize: "0.75rem",
      }}>▼</span>
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const isError = type === "error";
  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      background: isError ? "#1a0a0a" : "#0a1a0a",
      border: `1px solid ${isError ? "#7f1d1d" : "#3b6011"}`,
      borderLeft: `3px solid ${isError ? "#ef4444" : "#84cc16"}`,
      borderRadius: 10,
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "'Syne', sans-serif",
      fontSize: "0.82rem",
      color: isError ? "#fca5a5" : "#bef264",
      maxWidth: 460,
      width: "90%",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      zIndex: 9999,
      animation: "slideUp 0.25s ease",
    }}>
      <span>{isError ? "⚠" : "✓"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "inherit", padding: 0, fontSize: "1.1rem", lineHeight: 1,
        }}
      >×</button>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────

export default function AlertasApp() {
  const [tipo, setTipo] = useState(null);
  const [fecha, setFecha] = useState(today());
  const [horario, setHorario] = useState("");
  const [cgm, setCgm] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: null, type: null });
  const [formKey, setFormKey] = useState(0);

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: null, type: null }), 4500);
  }

  function reset() {
    setTipo(null);
    setFecha(today());
    setHorario("");
    setCgm("");
    setCategoria(null);
    setFormKey(k => k + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errores = [];
    if (!tipo) errores.push("Tipo de alerta requerido");
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horario)) errores.push("Horario inválido (HH:MM)");
    if (!cgm) errores.push("CGM requerido");
    if (!categoria) errores.push("Categoría requerida");
    if (errores.length) { showToast(errores.join("  ·  "), "error"); return; }

    setLoading(true);
    try {
      await guardarAlerta({ tipo, fecha, horario, cgm, categoria, created_at: new Date().toISOString() });
      showToast("Alerta registrada correctamente.", "success");
      reset();
    } catch (err) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          background: #0e0b07;
          background-image:
            radial-gradient(ellipse 70% 45% at 50% -5%, rgba(245,158,11,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 85% 90%, rgba(220,100,0,0.06) 0%, transparent 60%);
          min-height: 100vh;
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateX(-50%) translateY(12px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; box-shadow:0 0 6px #f59e0b; }
          50%     { opacity:0.4; box-shadow:0 0 14px #f59e0b; }
        }
        select option { background:#1c1409; color:#e8d5b0; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(2) hue-rotate(5deg); cursor:pointer; }
      `}</style>

      <div style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
      }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: "2rem" }}>
          {/* 
            LOGO: reemplazar el div de abajo con:
            <img src="/logo_izquierda.png" width={64} alt="Logo Lomas de Zamora" style={{borderRadius:12,flexShrink:0}} />
          */}
          <div style={{
            width: 64, height: 64, borderRadius: 12, flexShrink: 0,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem",
          }}>🔔</div>

          <div style={{ paddingTop: 4 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 100,
              padding: "4px 14px 4px 10px",
              fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#f59e0b", marginBottom: 10,
              fontFamily: "'Syne', sans-serif",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#f59e0b",
                animation: "pulseDot 2s infinite",
                display: "inline-block",
              }} />
              Monitoreo activo
            </div>
            <h1 style={{
              fontSize: "2rem", fontWeight: 800,
              color: "#f0dbb8", letterSpacing: "-0.02em",
              lineHeight: 1.15, marginBottom: 4,
              fontFamily: "'Syne', sans-serif",
            }}>
              Carga de Alertas
            </h1>
            <p style={{
              fontSize: "0.82rem", color: "#4a3520",
              fontFamily: "'Syne', sans-serif",
            }}>
              Registro de alertas entrantes — Partido de Lomas de Zamora
            </p>
          </div>
        </div>

        <div style={{ borderBottom: "1px solid #1e1508", marginBottom: "2rem" }} />

        {/* ── FORM ── */}
        <form key={formKey} onSubmit={handleSubmit}>
          <div style={{
            background: "linear-gradient(150deg, #17110a 0%, #130f08 100%)",
            border: "1px solid #261b0e",
            borderRadius: 16,
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)",
            }} />

            {/* ① Tipo */}
            <SectionLabel num="①">Tipo de alerta</SectionLabel>
            <div style={{ display: "flex", gap: 12 }}>
              {TIPOS.map(t => (
                <SelectCard
                  key={t.id} label={t.id} icon={t.icon}
                  selected={tipo === t.id}
                  onClick={() => setTipo(t.id)}
                />
              ))}
            </div>
            {tipo && (
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"0.73rem", color:"#f59e0b", marginTop:8, letterSpacing:"0.06em" }}>
                ✓  {tipo} seleccionado
              </p>
            )}

            {/* ② Temporalidad */}
            <SectionLabel num="②">Temporalidad</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <FieldLabel>Fecha del evento</FieldLabel>
                <TextInput type="date" value={fecha} onChange={setFecha} />
              </div>
              <div>
                <FieldLabel>Horario</FieldLabel>
                <TextInput
                  value={horario} onChange={setHorario}
                  placeholder="HH:MM"
                  hint="Formato 24 h — ej: 08:30 / 21:45"
                />
              </div>
            </div>

            {/* ③ CGM */}
            <SectionLabel num="③">Centro de Gestión Municipal</SectionLabel>
            <SelectInput value={cgm} onChange={setCgm} options={CGM_OPCIONES} />

            {/* ④ Categoría */}
            <SectionLabel num="④">Categoría</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIAS.map(c => {
                const sel = categoria === c.id;
                return (
                  <button
                    key={c.id} type="button"
                    onClick={() => setCategoria(c.id)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "9px 18px",
                      background: sel ? "rgba(245,158,11,0.10)" : "#17110a",
                      border: `1px solid ${sel ? "#f59e0b" : "#2a1f12"}`,
                      borderRadius: 100,
                      cursor: "pointer",
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "0.82rem", fontWeight: 600,
                      color: sel ? "#f59e0b" : "#a08060",
                      letterSpacing: "0.03em",
                      boxShadow: sel ? "0 0 0 1px rgba(245,158,11,0.25)" : "none",
                      transition: "all 0.15s ease",
                      outline: "none",
                    }}
                  >
                    {c.icon}  {c.id}
                  </button>
                );
              })}
            </div>
            {categoria && (
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"0.73rem", color:"#f59e0b", marginTop:8, letterSpacing:"0.06em" }}>
                ✓  {categoria} seleccionada
              </p>
            )}
          </div>

          {/* ── SUBMIT ── */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1.25rem",
              width: "100%",
              height: 52,
              background: loading ? "#5a3a10" : "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
              color: "#0e0b07",
              border: "none",
              borderRadius: 10,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 24px rgba(245,158,11,0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Guardando…" : "Registrar Alerta  →"}
          </button>
        </form>
      </div>

      <Toast
        msg={toast.msg}
        type={toast.type}
        onClose={() => setToast({ msg: null, type: null })}
      />
    </>
  );
}
