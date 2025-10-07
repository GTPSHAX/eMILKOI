import {
  Navbar,
  NavbarDesktop,
  NavbarMobile,
  NavbarItem,
  NavbarContent,
  NavbarFeatured,
  NavbarLink,
  NavbarMobileSection,
  NavbarMobileLink,
  NavbarMobileSeparator,
} from "@/components/navbar";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

export function NavbarExample() {
  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavbarDesktop>
        {/* Home Dropdown with Featured Card */}
        <NavbarItem trigger="Home">
          <NavbarContent columns={2} className="lg:w-[500px]">
            <NavbarFeatured
              title="shadcn/ui"
              description="Beautifully designed components built with Tailwind CSS."
              href="/"
            />
            <NavbarLink
              title="Introduction"
              description="Re-usable components built using Radix UI and Tailwind CSS."
              href="/docs"
            />
            <NavbarLink
              title="Installation"
              description="How to install dependencies and structure your app."
              href="/docs/installation"
            />
            <NavbarLink
              title="Typography"
              description="Styles for headings, paragraphs, lists...etc"
              href="/docs/primitives/typography"
            />
          </NavbarContent>
        </NavbarItem>

        {/* Components Dropdown */}
        <NavbarItem trigger="Components">
          <NavbarContent columns={2} className="lg:w-[600px]">
            <NavbarLink
              title="Alert Dialog"
              description="A modal dialog that interrupts the user with important content."
              href="/docs/primitives/alert-dialog"
            />
            <NavbarLink
              title="Hover Card"
              description="For sighted users to preview content available behind a link."
              href="/docs/primitives/hover-card"
            />
            <NavbarLink
              title="Progress"
              description="Displays an indicator showing completion progress."
              href="/docs/primitives/progress"
            />
            <NavbarLink
              title="Tabs"
              description="A set of layered sections of content displayed one at a time."
              href="/docs/primitives/tabs"
            />
          </NavbarContent>
        </NavbarItem>

        {/* Simple Link */}
        <NavbarItem href="/docs">Docs</NavbarItem>

        {/* With Icons */}
        <NavbarItem trigger="Status">
          <NavbarContent className="w-[200px]">
            <NavbarLink
              title="Backlog"
              href="#"
              icon={<CircleHelpIcon className="h-4 w-4" />}
            />
            <NavbarLink
              title="To Do"
              href="#"
              icon={<CircleIcon className="h-4 w-4" />}
            />
            <NavbarLink
              title="Done"
              href="#"
              icon={<CircleCheckIcon className="h-4 w-4" />}
            />
          </NavbarContent>
        </NavbarItem>
      </NavbarDesktop>

      {/* Mobile Navigation */}
      <NavbarMobile title="Navigation" description="Browse our website sections">
        <NavbarMobileSection title="Home">
          <NavbarMobileLink href="/docs">Introduction</NavbarMobileLink>
          <NavbarMobileLink href="/docs/installation">Installation</NavbarMobileLink>
          <NavbarMobileLink href="/docs/primitives/typography">Typography</NavbarMobileLink>
        </NavbarMobileSection>

        <NavbarMobileSeparator />

        <NavbarMobileSection title="Components">
          <NavbarMobileLink href="/docs/primitives/alert-dialog">Alert Dialog</NavbarMobileLink>
          <NavbarMobileLink href="/docs/primitives/hover-card">Hover Card</NavbarMobileLink>
          <NavbarMobileLink href="/docs/primitives/progress">Progress</NavbarMobileLink>
          <NavbarMobileLink href="/docs/primitives/tabs">Tabs</NavbarMobileLink>
        </NavbarMobileSection>

        <NavbarMobileSeparator />

        <NavbarMobileSection title="Status">
          <NavbarMobileLink href="#" icon={<CircleHelpIcon className="h-4 w-4" />}>
            Backlog
          </NavbarMobileLink>
          <NavbarMobileLink href="#" icon={<CircleIcon className="h-4 w-4" />}>
            To Do
          </NavbarMobileLink>
          <NavbarMobileLink href="#" icon={<CircleCheckIcon className="h-4 w-4" />}>
            Done
          </NavbarMobileLink>
        </NavbarMobileSection>
      </NavbarMobile>
    </Navbar>
  );
}
