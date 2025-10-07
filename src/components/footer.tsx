import Link from "next/link";
import Logo from "./logo";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import type { Locale } from "@/lib/dictionaries";

interface FooterProps {
  dict: {
    footer: {
      description: string;
      product: {
        title: string;
        features: string;
        howItWorks: string;
        pricing: string;
        documentation: string;
      };
      company: {
        title: string;
        about: string;
        blog: string;
        careers: string;
        contact: string;
      };
      legal: {
        title: string;
        privacy: string;
        terms: string;
        cookies: string;
        security: string;
      };
      bottom: {
        rights: string;
        sitemap: string;
        status: string;
        accessibility: string;
      };
    };
  };
}

export default function Footer({ dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dict.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="w-9 h-9 rounded-lg bg-background border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dict.footer.product.title}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.product.features}
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.product.howItWorks}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.product.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.product.documentation}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dict.footer.company.title}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.company.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.company.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.company.careers}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.company.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{dict.footer.legal.title}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.legal.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.legal.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.legal.cookies}
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.legal.security}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} eMILKOI. {dict.footer.bottom.rights}.
            </p>
            <div className="flex gap-6">
              <Link
                href="/sitemap"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.footer.bottom.sitemap}
              </Link>
              <Link
                href="/status"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.footer.bottom.status}
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.footer.bottom.accessibility}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
