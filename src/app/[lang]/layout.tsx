import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/dictionaries";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MILKOI";

interface LayoutProps {
  children: React.ReactNode;
  params: { lang: Locale };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const parm = await params;
  const dict = await getDictionary(parm.lang)

  return {
    title      : `${APP_NAME} - ${dict.page.meta.title}`,
    description: dict.page.meta.description,
  }
}

export async function generateStaticParams() {
  return [{ lang: 'id' }, { lang: 'en' }]
}

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return children
}