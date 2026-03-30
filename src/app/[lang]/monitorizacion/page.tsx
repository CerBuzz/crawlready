import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import MonitorClient from "../_components/MonitorClient";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function MonitorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <MonitorClient dict={dict} lang={lang} />;
}
