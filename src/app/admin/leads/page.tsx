"use client";

import { useState } from "react";

interface Lead {
  url: string;
  email: string;
  lang: string;
  timestamp: string;
  source: string;
}

export default function AdminLeads() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

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
                      <th className="py-3 pr-4">Fecha</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">URL</th>
                      <th className="py-3 pr-4">Idioma</th>
                      <th className="py-3">Origen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                        <td className="py-3 pr-4 text-zinc-400 whitespace-nowrap">
                          {new Date(lead.timestamp).toLocaleString("es-ES")}
                        </td>
                        <td className="py-3 pr-4 font-medium">{lead.email}</td>
                        <td className="py-3 pr-4">
                          <a href={`https://${lead.url}`} target="_blank" rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline">{lead.url}</a>
                        </td>
                        <td className="py-3 pr-4 uppercase">{lead.lang}</td>
                        <td className="py-3 text-zinc-500">{lead.source}</td>
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
