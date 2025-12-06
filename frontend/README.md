# Recipe Rescue Pro - Frontend

A Next.js 14 application for Recipe Rescue Pro - a smart food waste reduction platform.

## Features

- 🥗 **Smart Pantry Management**: Add and track your ingredients
- 🍳 **Recipe Search**: Search from 11M+ recipes using ingredients you have
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🌙 **Dark Mode**: Automatic dark mode support
- ⚡ **Fast**: Built with Next.js 14 and React 18

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   └── recipes/       # Recipe search API
│   ├── inventory/         # Pantry management page
│   ├── recipes/           # Recipe search page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
└── next.config.js         # Next.js config
```

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Recipe API**: Supercook API (11M+ recipes)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Implemented

### Phase 1 (MVP)
- ✅ Landing page with hero section
- ✅ Pantry/inventory management
- ✅ Add/remove ingredients
- ✅ Recipe search using ingredients
- ✅ Integration with Supercook API
- ✅ Responsive design
- ✅ Dark mode support

### Planned Features
- 📸 AI photo recognition for ingredients
- 📅 Expiration date tracking
- 🎯 Smart recipe recommendations
- 📊 Waste reduction analytics
- 👥 Family sharing
- 📱 Mobile app (React Native)

## API Integration

The app integrates with the Supercook API to search for recipes based on ingredients. The API endpoint is proxied through Next.js API routes for security and CORS handling.

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm run build
```

Then follow Vercel's deployment instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file in the root directory.
