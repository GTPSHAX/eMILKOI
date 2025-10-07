"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Context for managing navbar state
interface NavbarContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const NavbarContext = React.createContext<NavbarContextType | undefined>(undefined);

const useNavbar = () => {
  const context = React.useContext(NavbarContext);
  if (!context) {
    throw new Error("Navbar components must be used within a Navbar");
  }
  return context;
};

// Main Navbar Component
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Navbar({ children, className }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <NavbarContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
      <nav className={cn("relative", className)}>
        {children}
      </nav>
    </NavbarContext.Provider>
  );
}

// Desktop Menu Component
interface NavbarDesktopProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarDesktop({ children, className }: NavbarDesktopProps) {
  return (
    <div className={cn("hidden lg:block", className)}>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {children}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

// Mobile Menu Trigger (Burger Button)
interface NavbarMobileTriggerProps {
  className?: string;
}

export function NavbarMobileTrigger({ className }: NavbarMobileTriggerProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavbar();

  return (
    <div className={cn("lg:hidden", className)}>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </div>
  );
}

// Mobile Menu Component
interface NavbarMobileProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function NavbarMobile({ children, title = "Navigation", description = "Browse our website sections", className }: NavbarMobileProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavbar();

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className={cn("w-[300px] sm:w-[400px] overflow-y-auto", className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-6 px-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Navigation Item Component
interface NavbarItemProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  href?: string;
  className?: string;
}

export function NavbarItem({ children, trigger, href, className }: NavbarItemProps) {
  // If it's a simple link without dropdown
  if (href && !React.Children.toArray(children).some(child => 
    React.isValidElement(child) && (child.type === NavbarContent || child.type === NavbarDropdown)
  )) {
    // Use regular <a> tag for hash links to enable smooth scrolling
    const isHashLink = href.startsWith('#');
    
    return (
      <NavigationMenuItem className={className}>
        <NavigationMenuLink asChild>
          {isHashLink ? (
            <a href={href} className={navigationMenuTriggerStyle()}>
              {trigger || children}
            </a>
          ) : (
            <Link href={href} className={navigationMenuTriggerStyle()}>
              {trigger || children}
            </Link>
          )}
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  // If it has dropdown content
  return (
    <NavigationMenuItem className={className}>
      {trigger && <NavigationMenuTrigger>{trigger}</NavigationMenuTrigger>}
      {children}
    </NavigationMenuItem>
  );
}

// Dropdown Content Component
interface NavbarDropdownProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarDropdown({ children, className }: NavbarDropdownProps) {
  return (
    <NavigationMenuContent>
      <div className={cn("p-4", className)}>
        {children}
      </div>
    </NavigationMenuContent>
  );
}

// Content wrapper for grid layouts
interface NavbarContentProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function NavbarContent({ children, columns = 1, className }: NavbarContentProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3"
  }[columns];

  return (
    <NavigationMenuContent>
      <ul className={cn("grid gap-3 p-4 w-[200px] md:w-[300px]", gridClass, className)}>
        {children}
      </ul>
    </NavigationMenuContent>
  );
}

// Featured Item (like the shadcn/ui card)
interface NavbarFeaturedProps {
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function NavbarFeatured({ title, description, href, className }: NavbarFeaturedProps) {
  return (
    <li className={cn("row-span-3", className)}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="mb-2 mt-4 text-lg font-medium">
            {title}
          </div>
          <p className="text-sm leading-tight text-muted-foreground">
            {description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// Link Item Component
interface NavbarLinkProps {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NavbarLink({ title, description, href, icon, className }: NavbarLinkProps) {
  return (
    <li className={className}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          {description && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// Mobile Section Component
interface NavbarMobileSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function NavbarMobileSection({ title, children, className }: NavbarMobileSectionProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

// Mobile Link Component
interface NavbarMobileLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function NavbarMobileLink({ href, children, icon, className }: NavbarMobileLinkProps) {
  const { setIsMobileMenuOpen } = useNavbar();
  const isHashLink = href.startsWith('#');

  const handleClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (isHashLink) {
    return (
      <a 
        href={href} 
        className={cn("flex items-center gap-2 py-2 text-sm hover:text-primary transition-colors", className)}
        onClick={handleClick}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link 
      href={href} 
      className={cn("flex items-center gap-2 py-2 text-sm hover:text-primary transition-colors", className)}
      onClick={handleClick}
    >
      {icon}
      {children}
    </Link>
  );
}

// Mobile Separator
export function NavbarMobileSeparator({ className }: { className?: string }) {
  return <Separator className={className} />;
}
