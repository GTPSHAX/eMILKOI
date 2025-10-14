import { getDictionary, type Locale } from '@/lib/dictionaries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ModeToggle } from '@/components/mode-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AuthForms } from '@/components/auth-forms'

interface LoginPageProps {
  params: Promise<{ lang: Locale }>
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-chart-2/5 p-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-5/20 rounded-full blur-3xl animate-float-delayed" />

      {/* Language & Theme Switcher */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LanguageSwitcher currentLang={lang} srOnly={dict.others.changeLanguage} />
        <ModeToggle
          srOnly={dict.others.mode.srOnly}
          light={dict.others.mode.light}
          dark={dict.others.mode.dark}
          system={dict.others.mode.system}
        />
      </div>

      <Card className="w-full max-w-md shadow-lg relative z-10 bg-card/70">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            {dict.auth.title}
          </CardTitle>
          <CardDescription>{dict.auth.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForms dict={dict.auth} currentLang={lang} />
        </CardContent>
      </Card>
    </div>
  )
}
