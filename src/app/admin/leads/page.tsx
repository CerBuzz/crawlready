"use client";

import { useState } from "react";

interface Lead {
  url: string;
  email: string;
  lang: string;
  status: string;
  token: string;
  emailSent?: boolean;
  createdAt: string;
  confirmedAt: string | null;
  source: string;
}

export default function AdminLeads() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [resending, setResending] = useState<string | null>(null);

  async function resendEmail(token: string) {
    setResending(token);
    try {
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Error: ${data.error}`);
        return;
      }
      setLeads((prev) =>
        prev.map((l) => (l.token === token ? { ...l, emailSent: true } : l))
      );
    } catch {
      alert("Error de red al reenviar");
    } finally {
      setResending(null);
    }
  }

  async function fetchLeads(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/track?password=${encodeURIComponent(password)}`);
      if (!res.ok) {
        setError(res.status === 401 ? "Password incorrecta" : "Error al cargar");
        return;
      }
      const data = await res.json();
      setLeads(data.leads);
      setLoaded(true);
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">CrawlReady — Leads</h1>

        {!loaded && (
          <form onSubmit={fetchLeads} className="flex gap-3 mb-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="px-6 py-2 rounded bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Ver leads"}
            </button>
          </form>
        )}

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loaded && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400">{leads.length} lead{leads.length !== 1 ? "s" : ""}</p>
              <button
                onClick={() => { setLoaded(false); setLeads([]); }}
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                Cerrar
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-zinc-500">No hay leads todavía.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left text-zinc-400">
                      <th className="py-3 pr-4">Estado</th>
                      <th className="py-3 pr-4">Fecha</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">URL</th>
                      <th className="py-3 pr-4">Confirmado</th>
                      <th className="py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                        <td className="py-3 pr-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            lead.status === "confirmed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-zinc-400 whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleString("es-ES")}
                        </td>
                        <td className="py-3 pr-4 font-medium">{lead.email}</td>
                        <td className="py-3 pr-4">
                          <a href={`https://${lead.url}`} target="_blank" rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline">{lead.url}</a>
                        </td>
                        <td className="py-3 pr-4 text-zinc-500 whitespace-nowrap">
                          {lead.confirmedAt
                            ? new Date(lead.confirmedAt).toLocaleString("es-ES")
                            : "—"}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {lead.emailSent === true ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                              Enviado
                            </span>
                          ) : lead.emailSent === false ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                                Falló
                              </span>
                              <button
                                onClick={() => resendEmail(lead.token)}
                                disabled={resending === lead.token}
                                className="px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
                              >
                                {resending === lead.token ? "Enviando..." : "Reenviar"}
                              </button>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs text-zinc-600">N/A</span>
                              <button
                                onClick={() => resendEmail(lead.token)}
                                disabled={resending === lead.token}
                                className="px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
                              >
                                {resending === lead.token ? "Enviando..." : "Reenviar"}
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
