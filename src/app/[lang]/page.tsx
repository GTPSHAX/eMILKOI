import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Github, Code2, LayoutDashboard, Zap, Palette, Lock, Globe, SplinePointer, ClipboardList, Share2, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import {
  Navbar,
  NavbarDesktop,
  NavbarMobile,
  NavbarItem,
  NavbarMobileSection,
  NavbarMobileLink,
  NavbarMobileTrigger,
} from "@/components/navbar";
import Logo from "@/components/logo";
import Footer from "@/components/footer";
import Link from "next/link";

interface PageProps {
  params: { lang: Locale };
}

export default async function Home({ params }: PageProps) {
  const parm = await params;
  const dict = await getDictionary(parm.lang);
  const steps: ReadonlyArray<{ key: "create" | "share" | "monitor"; icon: LucideIcon }> = [
    { key: "create", icon: ClipboardList },
    { key: "share", icon: Share2 },
    { key: "monitor", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50">
        <Navbar className="px-5 md:px-10 py-3 md:py-5 flex justify-between items-center w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Logo />

          <div>
            {/* Desktop Navigation */}
            <NavbarDesktop>
              <NavbarItem href="#hero">Home</NavbarItem>
              <NavbarItem href="#features">Features</NavbarItem>
              <NavbarItem href="#how-it-works">How It Works</NavbarItem>
            </NavbarDesktop>

            {/* Mobile Navigation */}
            <NavbarMobile
              title="Navigation"
              description="Browse our website sections"
            >
              <NavbarMobileSection title="Home">
                <NavbarMobileLink href="#hero">Home</NavbarMobileLink>
                <NavbarMobileLink href="#features">Features</NavbarMobileLink>
                <NavbarMobileLink href="#how-it-works">How It Works</NavbarMobileLink>
              </NavbarMobileSection>
            </NavbarMobile>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSwitcher
              currentLang={parm.lang}
              srOnly={dict.others.changeLanguage}
            />
            <ModeToggle
              srOnly={dict.others.mode.srOnly}
              light={dict.others.mode.light}
              dark={dict.others.mode.dark}
              system={dict.others.mode.system}
            />
            <NavbarMobileTrigger className="..." />
            <Button variant="default" asChild>
              <Link href="/dashboard" className="flex items-center gap-2 shadow">
                <LayoutDashboard className="h-4 w-4" />
                <b className="hidden md:inline">Dashboard</b>
              </Link>
            </Button>
          </div>
        </Navbar>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-5/10 animate-gradient-shift" />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-5/20 rounded-full blur-3xl animate-float-delayed" />

          <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-0">
            <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm font-medium text-primary">
                  {dict.page.home.hero.badge}
                </span>
              </div>

              {/* Main Heading with Gradient */}
              <div className="space-y-4 animate-fade-in-up animation-delay-200">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                  <span className="block bg-gradient-to-r from-chart-2 via-green-300 to-chart-5 bg-clip-text text-transparent">
                    {dict.page.home.hero.title}
                  </span>
                  <span className="block mt-2 bg-gradient-to-r from-chart-5 via-chart-2 to-primary bg-clip-text text-transparent">
                    {dict.page.home.hero.subtitle}
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-accent-foreground max-w-3xl mx-auto leading-relaxed">
                  {dict.page.home.hero.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-400">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-semibold">
                      {dict.page.home.hero.buttons.getStarted}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/docs" className="flex items-center gap-2">
                    <Github className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-semibold">
                      {dict.page.home.hero.buttons.learnMore}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </Link>
                </Button>
              </div>

              {/* Stats or Features Pills */}
              <div className="pt-8 animate-fade-in-up animation-delay-600">
                {/* Mobile: Marquee */}
                <div className="sm:hidden overflow-hidden relative">
                  <div className="flex gap-3 animate-marquee-infinite">
                    {/* Original set */}
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.fast}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-2/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-chart-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.beautiful}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-5/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-chart-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.typeSafe}</span>
                      </div>
                    </div>
                    {/* Duplicate 1 */}
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.fast}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-2/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-chart-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.beautiful}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-5/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-chart-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.typeSafe}</span>
                      </div>
                    </div>
                    {/* Duplicate 2 */}
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.fast}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-2/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-chart-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.beautiful}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-5/50 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-chart-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{dict.page.home.hero.features.typeSafe}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Static centered */}
                <div className="hidden sm:flex flex-wrap justify-center gap-3">
                  <div className="px-5 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{dict.page.home.hero.features.fast}</span>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-2/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-chart-2 flex-shrink-0" />
                      <span className="text-sm font-medium">{dict.page.home.hero.features.beautiful}</span>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-chart-5/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-chart-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{dict.page.home.hero.features.typeSafe}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image or Demo Preview - Laptop Mockup */}
              <div className="relative w-full mt-12 animate-fade-in-up animation-delay-800">
                {/* Laptop Container */}
                <div className="relative mx-auto" style={{ perspective: "1000px" }}>
                  {/* Laptop Screen */}
                  <div className="relative bg-gradient-to-b from-muted/80 to-muted rounded-t-2xl p-3 shadow-2xl border-2 border-border/50">
                    {/* Camera Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-muted-foreground/20 rounded-b-lg" />
                    
                    {/* Screen Content */}
                    <div className="relative rounded-lg overflow-hidden bg-background shadow-inner border border-border/30">
                      <div className="aspect-video bg-gradient-to-br from-background via-muted/5 to-background">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-destructive/70" />
                            <div className="w-3 h-3 rounded-full bg-chart-4/70" />
                            <div className="w-3 h-3 rounded-full bg-primary/70" />
                          </div>
                          <div className="flex-1 flex items-center justify-center gap-2 px-4">
                            <div className="w-full max-w-md h-7 rounded-md bg-background/80 border border-border/50 flex items-center px-3 text-xs text-muted-foreground">
                              <div className="flex gap-2 items-center opacity-60">
                                <Globe className="h-4 w-4" />
                                <p>voting.emilkoi.com</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Voting Content */}
                        <div className="p-4 sm:p-6 space-y-3">
                          {/* Top Bar with Timer */}
                          <div className="flex items-center justify-between pb-3 border-b border-border/30">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-primary/60" />
                              </div>
                              <div className="h-2.5 w-20 bg-foreground/60 rounded" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-12 bg-destructive/40 rounded" />
                              <div className="h-2.5 w-16 bg-foreground/50 rounded" />
                            </div>
                          </div>

                          {/* Header */}
                          <div className="text-center py-2">
                            <div className="h-4 w-48 bg-foreground/80 rounded mx-auto mb-2" />
                            <div className="h-2.5 w-36 bg-muted-foreground/40 rounded mx-auto" />
                          </div>

                          {/* Voting Stats */}
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <div className="text-center bg-primary/5 rounded-lg p-2">
                              <div className="h-4 w-10 bg-primary/60 rounded mx-auto mb-1" />
                              <div className="h-1.5 w-12 bg-muted-foreground/30 rounded mx-auto" />
                            </div>
                            <div className="text-center bg-chart-5/5 rounded-lg p-2">
                              <div className="h-4 w-10 bg-chart-5/60 rounded mx-auto mb-1" />
                              <div className="h-1.5 w-14 bg-muted-foreground/30 rounded mx-auto" />
                            </div>
                            <div className="text-center bg-chart-2/5 rounded-lg p-2">
                              <div className="h-4 w-10 bg-chart-2/60 rounded mx-auto mb-1" />
                              <div className="h-1.5 w-11 bg-muted-foreground/30 rounded mx-auto" />
                            </div>
                            <div className="text-center bg-muted/30 rounded-lg p-2">
                              <div className="h-4 w-10 bg-muted-foreground/50 rounded mx-auto mb-1" />
                              <div className="h-1.5 w-10 bg-muted-foreground/30 rounded mx-auto" />
                            </div>
                          </div>

                          {/* Candidate Cards */}
                          <div className="grid grid-cols-2 gap-2.5">
                            {/* Candidate 1 */}
                            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-3 border-2 border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full bg-primary/30 border-2 border-primary/60" />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="text-[8px] font-bold text-primary-foreground">1</div>
                                  </div>
                                </div>
                                <div className="text-center space-y-1 w-full">
                                  <div className="h-2.5 w-20 bg-foreground/80 rounded mx-auto" />
                                  <div className="h-2 w-16 bg-muted-foreground/40 rounded mx-auto" />
                                  <div className="flex items-center justify-center gap-1 pt-1">
                                    <div className="h-1.5 w-8 bg-primary/40 rounded-full" />
                                    <div className="h-2 w-6 bg-primary/60 rounded text-[6px]" />
                                  </div>
                                </div>
                                <div className="w-full pt-1">
                                  <div className="h-6 w-full bg-primary/40 hover:bg-primary/50 rounded-md transition-colors" />
                                </div>
                              </div>
                            </div>

                            {/* Candidate 2 */}
                            <div className="bg-gradient-to-br from-chart-2/5 to-transparent rounded-xl p-3 border-2 border-chart-2/30 hover:border-chart-2/60 transition-all hover:shadow-lg hover:shadow-chart-2/20">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full bg-chart-2/30 border-2 border-chart-2/60" />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-chart-2 rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="text-[8px] font-bold text-primary-foreground">2</div>
                                  </div>
                                </div>
                                <div className="text-center space-y-1 w-full">
                                  <div className="h-2.5 w-20 bg-foreground/80 rounded mx-auto" />
                                  <div className="h-2 w-16 bg-muted-foreground/40 rounded mx-auto" />
                                  <div className="flex items-center justify-center gap-1 pt-1">
                                    <div className="h-1.5 w-8 bg-chart-2/40 rounded-full" />
                                    <div className="h-2 w-6 bg-chart-2/60 rounded text-[6px]" />
                                  </div>
                                </div>
                                <div className="w-full pt-1">
                                  <div className="h-6 w-full bg-chart-2/40 hover:bg-chart-2/50 rounded-md transition-colors" />
                                </div>
                              </div>
                            </div>

                            {/* Candidate 3 */}
                            <div className="bg-gradient-to-br from-chart-5/5 to-transparent rounded-xl p-3 border-2 border-chart-5/30 hover:border-chart-5/60 transition-all hover:shadow-lg hover:shadow-chart-5/20">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full bg-chart-5/30 border-2 border-chart-5/60" />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-chart-5 rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="text-[8px] font-bold text-primary-foreground">3</div>
                                  </div>
                                </div>
                                <div className="text-center space-y-1 w-full">
                                  <div className="h-2.5 w-20 bg-foreground/80 rounded mx-auto" />
                                  <div className="h-2 w-16 bg-muted-foreground/40 rounded mx-auto" />
                                  <div className="flex items-center justify-center gap-1 pt-1">
                                    <div className="h-1.5 w-8 bg-chart-5/40 rounded-full" />
                                    <div className="h-2 w-6 bg-chart-5/60 rounded text-[6px]" />
                                  </div>
                                </div>
                                <div className="w-full pt-1">
                                  <div className="h-6 w-full bg-chart-5/40 hover:bg-chart-5/50 rounded-md transition-colors" />
                                </div>
                              </div>
                            </div>

                            {/* Candidate 4 */}
                            <div className="bg-gradient-to-br from-chart-4/5 to-transparent rounded-xl p-3 border-2 border-chart-4/30 hover:border-chart-4/60 transition-all hover:shadow-lg hover:shadow-chart-4/20">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full bg-chart-4/30 border-2 border-chart-4/60" />
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-chart-4 rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="text-[8px] font-bold text-primary-foreground">4</div>
                                  </div>
                                </div>
                                <div className="text-center space-y-1 w-full">
                                  <div className="h-2.5 w-20 bg-foreground/80 rounded mx-auto" />
                                  <div className="h-2 w-16 bg-muted-foreground/40 rounded mx-auto" />
                                  <div className="flex items-center justify-center gap-1 pt-1">
                                    <div className="h-1.5 w-8 bg-chart-4/40 rounded-full" />
                                    <div className="h-2 w-6 bg-chart-4/60 rounded text-[6px]" />
                                  </div>
                                </div>
                                <div className="w-full pt-1">
                                  <div className="h-6 w-full bg-chart-4/40 hover:bg-chart-4/50 rounded-md transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Info Bar */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                              <div className="h-2 w-20 bg-muted-foreground/30 rounded" />
                            </div>
                            <div className="flex gap-1">
                              <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
                              <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Laptop Base */}
                  <div className="relative h-3 bg-gradient-to-b from-muted to-muted-foreground/30 rounded-b-2xl shadow-lg" />
                  
                  {/* Laptop Bottom */}
                  <div className="relative mx-auto w-[90%] h-2 bg-gradient-to-b from-muted-foreground/20 to-transparent rounded-b-3xl" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-chart-2/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
              </div>
            </div>
          </div>

          {/* Bottom Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <svg
              className="w-full h-auto text-background"
              viewBox="0 0 1440 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0,192L80,208C160,224,320,256,480,240C640,224,800,160,960,144C1120,128,1280,160,1360,176L1440,192L1440,360L1360,360C1280,360,1120,360,960,360C800,360,640,360,480,360C320,360,160,360,80,360L0,360Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-background relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-16 lg:mb-20 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  {dict.page.home.features.title}
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {dict.page.home.features.subtitle}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 - Fast Performance */}
              <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{dict.page.home.features.items.performance.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.page.home.features.items.performance.description}
                  </p>
                </div>
              </div>

              {/* Feature 2 - Beautiful Design */}
              <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border hover:border-chart-2/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-2/10 animate-fade-in-up animation-delay-200">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4 transition-transform">
                    <Palette className="h-6 w-6 text-chart-2" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{dict.page.home.features.items.design.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.page.home.features.items.design.description}
                  </p>
                </div>
              </div>

              {/* Feature 3 - Type Safe */}
              <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border hover:border-chart-5/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-5/10 animate-fade-in-up animation-delay-400">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-5/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-chart-5/10 flex items-center justify-center mb-4 transition-transform">
                    <SplinePointer className="h-6 w-6 text-chart-5" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{dict.page.home.features.items.typeSafe.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.page.home.features.items.typeSafe.description}
                  </p>
                </div>
              </div>

              {/* Feature 4 - Real-time Updates */}
              <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up animation-delay-600">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{dict.page.home.features.items.realtime.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.page.home.features.items.realtime.description}
                  </p>
                </div>
              </div>

              {/* Feature 5 - Secure & Private */}
              <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border hover:border-chart-2/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-2/10 animate-fade-in-up animation-delay-800">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4 transition-transform">
                    <Lock className="h-6 w-6 text-chart-2" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{dict.page.home.features.items.security.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.page.home.features.items.security.description}
                  </p>
                </div>
              </div>

              {/* Feature 6 - Easy Integration */}
              <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border hover:border-chart-5/50 transition-all duration-300 hover:shadow-lg hover:shadow-chart-5/10 animate-fade-in-up animation-delay-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-5/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-chart-5/10 flex items-center justify-center mb-4 transition-transform">
                    <Globe className="h-6 w-6 text-chart-5" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{dict.page.home.features.items.integration.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.page.home.features.items.integration.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-32 bg-background relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {dict.page.home.howItWorks.title}
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {dict.page.home.howItWorks.subtitle}
              </p>
            </div>

            {/* Steps */}
            <div className="mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className="relative animate-fade-in-up h-full"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Connecting Arrow (Desktop Only) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 -right-6 lg:-right-8 w-12 lg:w-16 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0">
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-primary/50" />
                      </div>
                    )}

                    {/* Card */}
                    <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border transition-all duration-300 h-full flex flex-col">
                      {/* Step Number */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl mb-6 transition-colors">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-background/50 border border-border mb-6 transition-transform duration-300">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3">
                        {dict.page.home.howItWorks.steps[step.key].title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {dict.page.home.howItWorks.steps[step.key].description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer dict={dict} />
    </div>
  );
}
