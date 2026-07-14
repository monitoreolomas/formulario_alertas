import { useState } from "react";
import AlertasApp from "./App.jsx";
import TarimaForm from "./TarimaForm.jsx";

const OPCIONES = [
  {
    id: "alerta",
    titulo: "Formulario Alerta",
    desc: "Carga de alertas entrantes (ambulancia, policía, bomberos, sirenas).",
    icon: "🚨",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,0.1)",
  },
  {
    id: "tarima",
    titulo: "Formulario Tarima",
    desc: "Carga de novedades por comisaría (robos, conflictos, siniestros).",
    icon: "🛡️",
    accent: "#14b8a6",
    accentSoft: "rgba(20,184,166,0.1)",
  },
];

export default function Home() {
  const [seleccion, setSeleccion] = useState(null);

  if (seleccion === "alerta") return <AlertasApp onVolver={() => setSeleccion(null)} />;
  if (seleccion === "tarima") return <TarimaForm onVolver={() => setSeleccion(null)} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d12",
      backgroundImage:
        "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(148,163,184,0.08) 0%, transparent 65%)",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
          Municipalidad de Lomas de Zamora
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>¿Qué formulario querés cargar?</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, maxWidth: 640, width: "100%" }}>
        {OPCIONES.map((o) => (
          <button
            key={o.id}
            onClick={() => setSeleccion(o.id)}
            style={{
              background: "#111318",
              border: "1px solid #23262f",
              borderRadius: 20,
              padding: "28px 24px",
              textAlign: "left",
              cursor: "pointer",
              color: "#e2e8f0",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              transition: "transform 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = o.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#23262f"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: o.accentSoft, border: `1px solid ${o.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {o.icon}
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{o.titulo}</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>{o.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
