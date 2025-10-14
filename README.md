# eMILKOI

> eMILKOI is a modern voting web application built with Next.js 15, TypeScript, and Tailwind CSS v4. Designed for seamless user experience with internationalization support (Indonesian/English), it provides a secure and intuitive platform for digital voting processes.

> [!NOTE]
> This application is not yet fully secure and working as it should, so we currently do not recommend deploying it for production.

[🇮🇩 Versi Indonesia](./README.md)

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- [Node.js](https://nodejs.org) v22+ or higher.

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/GTPSHAX/eMILKOI.git
cd eMILKOI
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Admin Dashboard
1. **Login**: Visit `/login` with admin credentials
2. **Create Session**: Set up voting sessions with custom URLs
3. **Manage Voting**: Start, stop, and monitor voting sessions
4. **View Results**: Real-time voting statistics and analytics

### Public Voting (No Authentication)
1. **Access Voting**: Go to `/vote/[session-slug]` 
2. **Direct Selection**: Choose candidate immediately (no forms)
3. **Single Device**: Optimized for kiosk/station voting
4. **Audio Feedback**: Maximum volume success sound after voting
5. **Auto-Reset**: Ready for next voter after 15 seconds

For detailed voting system documentation, see [PUBLIC_VOTING_SYSTEM.md](./PUBLIC_VOTING_SYSTEM.md).

### Development Commands

```bash
# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

### Project Structure

```
src/
├── app/
│   ├── [lang]/
│   │   ├── vote/[slug]/
│   │   │   └── page.tsx       # Public voting page (no auth)
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx       # Admin login
│   │   ├── layout.tsx         # Language-specific layout
│   │   └── page.tsx           # Main page with i18n
│   ├── api/
│   │   ├── vote/[slug]/
│   │   │   └── route.ts       # Public voting API
│   │   ├── voting/sessions/
│   │   │   └── route.ts       # Admin session management
│   │   └── auth/
│   │       └── */route.ts     # Authentication APIs
│   ├── layout.tsx             # Root layout with theme provider
│   └── page.tsx               # Root redirect to default language
├── components/
│   ├── voting-client.tsx      # Public voting interface
│   ├── dashboard-client.tsx   # Admin dashboard
│   └── language-switcher.tsx  # Language toggle component
├── database/
│   ├── schema/                # Database table definitions
│   └── handler/               # CRUD operations
├── lib/
│   ├── dictionaries/
│   │   ├── index.ts           # Dictionary loader functions
│   │   ├── id.json            # Indonesian translations
│   │   └── en.json            # English translations
│   └── session.ts             # Session management
└── middleware.ts              # URL rewriting and locale detection
```

## Contributing

We greatly appreciate all contributions from you. If you are interested in contributing, please:

1. Fork this repository
2. Create a branch for your feature/fix
3. Commit changes with clear messages
4. Push to your branch (Before pushing, make sure you have run `npm run lint` or `npm run lint:fix`)
5. Create a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).