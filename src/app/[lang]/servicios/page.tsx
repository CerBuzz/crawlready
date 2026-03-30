import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import ServiciosClient from "../_components/ServiciosClient";

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <ServiciosClient dict={dict} lang={lang} />;
}
