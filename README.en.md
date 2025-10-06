# eMILKOI

> eMILKOI is a modern web application built using cutting-edge technologies to deliver a more optimal user experience.

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
├── app/                 # App Router directory
│   ├── globals.css     # Global styles dengan Tailwind
│   ├── layout.tsx      # Root layout dengan font loading
│   ├── page.tsx        # Homepage component
│   └── favicon.ico     # App icon
├── lib/                # Utility functions
│   └── utils.ts        # Helper utilities
public/                 # Static assets
components.json         # shadcn/ui configuration
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