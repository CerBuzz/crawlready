import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const isEs = lang === "es";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-accent text-3xl">&#10003;</span>
        </div>
        <h1 className="text-2xl font-bold mb-3">
          {isEs ? "¡Solicitud confirmada!" : "Request confirmed!"}
        </h1>
        <p className="text-zinc-400 text-lg mb-6">
          {isEs
            ? "En breve recibirás tu análisis de visibilidad IA en tu email. Normalmente tardamos 24-48 horas."
            : "You'll receive your AI visibility analysis by email shortly. We usually deliver within 24-48 hours."}
        </p>
        <a
          href={`/${lang}`}
          className="inline-block px-6 py-3 rounded-lg border border-surface-light text-zinc-400 hover:text-foreground hover:border-accent transition-colors"
        >
          {isEs ? "Volver a la web" : "Back to website"}
        </a>
      </div>
    </div>
  );
}
