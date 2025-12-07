# Witelli20 Student Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open-Source-green.svg)](https://github.com/peaktwilight/witelli20)
[![GitHub Stars](https://img.shields.io/github/stars/peaktwilight/witelli20)](https://github.com/peaktwilight/witelli20/stargazers)
[![GitHub Releases](https://img.shields.io/github/v/release/peaktwilight/witelli20)](https://github.com/peaktwilight/witelli20/releases)

A modern, responsive web application for the Witellikerstrasse 20 student housing community in Zurich. Built with Next.js 15, React 19, Firebase, and Tailwind CSS, featuring real-time transport information, room reservations, community message boards, and weather integration.

![Witelli20 Screenshot](public/screenshot.png)

## Features

### Core Functionality
- **Room Reservations** - Book common spaces (Foyer, Party Room, Rooftop Terrace) with calendar view
- **Transport Information** - Real-time departures and schedules using Swiss Transport API
- **Lost & Found** - System for tracking missing items and packages
- **Community Board** - Anonymous confession board for student communications
- **Weather Integration** - Local weather forecasts and conditions

### Technical Highlights
- Server-side rendering with Next.js 15 App Router
- Real-time database with Firebase Firestore
- Responsive design with Tailwind CSS
- Smooth animations using Framer Motion
- Modern React 19 features
- TypeScript for type safety
- Automated release management

## Tech Stack

### Frontend
- **Framework**: [Next.js 15.4.8](https://nextjs.org/) with App Router
- **UI Library**: [React 19.1.1](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with Typography plugin
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/), [Heroicons](https://heroicons.com/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown) with GFM support
- **Animations**: [Lottie](https://lottiefiles.com/) via @lottiefiles/dotlottie-react

### Backend & Services
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **APIs**: Swiss Transport API, Weather API
- **HTTP Client**: [Axios 1.11](https://axios-http.com/)
- **Date Handling**: [date-fns 4.1](https://date-fns.org/)

### Development
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Linting**: ESLint 9 with Next.js config
- **Build Tool**: Next.js with Turbopack (dev mode)
- **Package Manager**: npm
- **Node Version**: 20.x or later

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Firebase account (for database and authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/peaktwilight/witelli20.git
   cd witelli20
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_APP_VERSION=0.1.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate-messages` - Run message migration script
- `npm run release` - Automated release (version bump, tag, push)

## Project Structure

```
witelli20/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API route handlers
│   │   ├── board/             # Community message board
│   │   ├── reservations/      # Room reservation system
│   │   ├── stolen/            # Lost & found tracker
│   │   ├── transport/         # Transport information
│   │   ├── weather/           # Weather forecast
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── FAQ.tsx
│   │   ├── QuickLinks.tsx
│   │   ├── WeatherWidget.tsx
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and API clients
│   │   ├── firebase.ts        # Firebase configuration
│   │   ├── transportApi.ts    # Swiss Transport API
│   │   └── weatherApi.ts      # Weather API integration
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── scripts/                   # Build and deployment scripts
├── .github/                   # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml            # Continuous integration
│       └── release.yml       # Release automation
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Environment Variables

The application requires the following environment variables in `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `NEXT_PUBLIC_APP_VERSION` | Application version | No |

**Note**: The Swiss Transport API used in the project does not require authentication.

## Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js application:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/)
3. Configure environment variables in project settings
4. Deploy - Vercel will automatically build and deploy on every push to main

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/peaktwilight/witelli20)

### Firebase Hosting

Alternative deployment option using Firebase:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done)
   ```bash
   firebase init
   ```
   - Select Hosting and Firestore
   - Choose your Firebase project
   - Set `build` as the public directory

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## Release Management

### Automated Release

The project includes automated release management:

```bash
npm run release
```

This will:
- Bump the patch version in `package.json`
- Update version in `.env.local`
- Create a git tag
- Push changes and tags to GitHub
- Trigger GitHub Actions to create a release

### Manual Release

For more control over versioning:

```bash
# Bump version (patch, minor, or major)
npm version patch

# Push with tags
git push --follow-tags

# Or create release with GitHub CLI
gh release create v0.1.x --title "Release v0.1.x" --notes "Release notes"
```

View all releases: [GitHub Releases](https://github.com/peaktwilight/witelli20/releases)

## Contributing

This is an open source project and contributions are welcome! Whether you want to:
- Fix bugs
- Add new features
- Improve documentation
- Suggest ideas

Your contributions are appreciated.

### How to Contribute

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Commit with descriptive messages
   ```bash
   git commit -m "Add: brief description of changes"
   ```
5. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Code of Conduct

Please be respectful and constructive in all interactions. This project follows standard open source community guidelines.

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the student community at Witellikerstrasse 20, Zurich
- Uses the [Swiss Transport API](https://transport.opendata.ch/) for real-time transport data
- Icons by [Phosphor Icons](https://phosphoricons.com/) and [Heroicons](https://heroicons.com/)
- Animations by [Lottie](https://lottiefiles.com/)

## Support

If you encounter any issues or have questions:
- Open an [issue on GitHub](https://github.com/peaktwilight/witelli20/issues)
- Check existing issues and discussions
- Review the [FAQ section](https://witelli20.web.app) on the live site

---

**Maintained with care by the Witelli20 community**
