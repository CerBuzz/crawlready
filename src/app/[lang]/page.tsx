import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import HomeClient from "./_components/HomeClient";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <HomeClient dict={dict} lang={lang} />;
}
