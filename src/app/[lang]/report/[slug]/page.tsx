import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import type { ReportData } from "@/lib/types";
import ReportClient from "../../_components/ReportClient";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "src/data/reports");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const slugs = files.map((f) => f.replace(".json", ""));
  const params: { lang: string; slug: string }[] = [];
  for (const lang of ["es", "en"]) {
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }
  return params;
}

function loadReport(slug: string): ReportData | null {
  const filePath = path.join(process.cwd(), "src/data/reports", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ReportData;
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const report = loadReport(slug);
  if (!report) notFound();

  const dict = await getDictionary(lang);
  return <ReportClient report={report} dict={dict} lang={lang} />;
}
