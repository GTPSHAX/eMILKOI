# Responsive Navbar Component

A fully responsive, composable navigation menu built with shadcn/ui components.

## Features

- ✅ **Fully Responsive** - Desktop navigation with dropdowns, mobile drawer menu
- ✅ **Composable API** - Build your navbar using declarative components
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Accessible** - Built on Radix UI primitives
- ✅ **Customizable** - Easy to style with Tailwind CSS

## Components

### `<Navbar>`
Main wrapper component that provides context for the navbar.

```tsx
<Navbar className="...">
  {children}
</Navbar>
```

### `<NavbarDesktop>`
Container for desktop navigation items (hidden on mobile, visible on lg+ screens).

```tsx
<NavbarDesktop>
  <NavbarItem>...</NavbarItem>
</NavbarDesktop>
```

### `<NavbarMobile>`
Mobile navigation drawer component.

**Props:**
- `title?: string` - Sheet title (default: "Navigation")
- `description?: string` - Sheet description
- `children: React.ReactNode` - Mobile menu content

```tsx
<NavbarMobile title="Menu" description="Browse sections">
  <NavbarMobileSection>...</NavbarMobileSection>
</NavbarMobile>
```

### `<NavbarItem>`
Navigation item that can be a simple link or have dropdown content.

**Props:**
- `trigger?: React.ReactNode` - Trigger text for dropdown
- `href?: string` - Link URL (for simple links)
- `children: React.ReactNode` - Dropdown content or link text

```tsx
{/* Simple Link */}
<NavbarItem href="/docs">Docs</NavbarItem>

{/* With Dropdown */}
<NavbarItem trigger="Products">
  <NavbarContent>...</NavbarContent>
</NavbarItem>
```

### `<NavbarContent>`
Grid layout container for dropdown content.

**Props:**
- `columns?: 1 | 2 | 3` - Number of grid columns (default: 1)
- `children: React.ReactNode` - NavbarLink components

```tsx
<NavbarContent columns={2} className="lg:w-[600px]">
  <NavbarLink>...</NavbarLink>
</NavbarContent>
```

### `<NavbarFeatured>`
Featured card item for highlighting special content.

**Props:**
- `title: string` - Card title
- `description: string` - Card description
- `href: string` - Link URL

```tsx
<NavbarFeatured
  title="New Release"
  description="Check out our latest features"
  href="/whats-new"
/>
```

### `<NavbarLink>`
Individual link item in dropdown content.

**Props:**
- `title: string` - Link title
- `description?: string` - Optional description text
- `href: string` - Link URL
- `icon?: React.ReactNode` - Optional icon element

```tsx
<NavbarLink
  title="Documentation"
  description="Learn how to use our components"
  href="/docs"
  icon={<BookIcon className="h-4 w-4" />}
/>
```

### `<NavbarMobileSection>`
Section container for mobile menu with optional title.

**Props:**
- `title?: string` - Section title
- `children: React.ReactNode` - NavbarMobileLink components

```tsx
<NavbarMobileSection title="Resources">
  <NavbarMobileLink>...</NavbarMobileLink>
</NavbarMobileSection>
```

### `<NavbarMobileLink>`
Link item for mobile navigation.

**Props:**
- `href: string` - Link URL
- `children: React.ReactNode` - Link text
- `icon?: React.ReactNode` - Optional icon element

```tsx
<NavbarMobileLink href="/docs" icon={<BookIcon />}>
  Documentation
</NavbarMobileLink>
```

### `<NavbarMobileSeparator>`
Visual separator for mobile menu sections.

```tsx
<NavbarMobileSeparator />
```

## Usage Example

```tsx
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

export function MyNavbar() {
  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavbarDesktop>
        {/* Dropdown with featured card */}
        <NavbarItem trigger="Products">
          <NavbarContent columns={2}>
            <NavbarFeatured
              title="New Release"
              description="Check out what's new"
              href="/whats-new"
            />
            <NavbarLink
              title="Features"
              description="Explore our features"
              href="/features"
            />
          </NavbarContent>
        </NavbarItem>

        {/* Simple link */}
        <NavbarItem href="/pricing">Pricing</NavbarItem>
        
        {/* Dropdown with icons */}
        <NavbarItem trigger="Resources">
          <NavbarContent>
            <NavbarLink
              title="Documentation"
              href="/docs"
              icon={<BookIcon className="h-4 w-4" />}
            />
          </NavbarContent>
        </NavbarItem>
      </NavbarDesktop>

      {/* Mobile Navigation */}
      <NavbarMobile>
        <NavbarMobileSection title="Main">
          <NavbarMobileLink href="/features">Features</NavbarMobileLink>
          <NavbarMobileLink href="/pricing">Pricing</NavbarMobileLink>
        </NavbarMobileSection>

        <NavbarMobileSeparator />

        <NavbarMobileSection title="Resources">
          <NavbarMobileLink href="/docs" icon={<BookIcon />}>
            Documentation
          </NavbarMobileLink>
        </NavbarMobileSection>
      </NavbarMobile>
    </Navbar>
  );
}
```

## Responsive Behavior

- **Desktop (lg+):** Full navigation menu with dropdown menus
- **Mobile (<lg):** Hamburger menu that opens a side drawer

## Customization

All components accept a `className` prop for custom styling:

```tsx
<Navbar className="border-b">
  <NavbarDesktop className="max-w-7xl mx-auto">
    <NavbarItem className="font-bold">...</NavbarItem>
  </NavbarDesktop>
</Navbar>
```

## Accessibility

- Built on Radix UI primitives (NavigationMenu, Sheet)
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels

## Notes

- The component uses Tailwind's `lg` breakpoint (1024px) for responsive switching
- Mobile menu automatically closes when a link is clicked
- Supports nested content and complex layouts
