import { getDictionary, type Locale } from '@/lib/dictionaries'
import { DashboardClient } from '@/components/dashboard-client'

interface DashboardPageProps {
  params: Promise<{ lang: Locale }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <DashboardClient dict={dict.dashboard} currentLang={lang} />
}
