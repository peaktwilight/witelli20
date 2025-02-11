# Witelli20

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Transport Information**: Real-time transport schedules and departures
- **Message Board**: Interactive board for student communications
- **Fun Generator**: Custom content generation system
- **Lost & Found**: System for tracking missing items & packages
- **Room Reservations**: Book common spaces like Foyer or Party Room

## Contributing

This is an open source project! All students from Witelli20 are encouraged to contribute to the codebase. Whether you want to fix bugs, add new features, improve documentation, or suggest ideas - your contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Open a Pull Request

We aim to make this project a collaborative effort that benefits all Witelli20 students. Your contributions help make this tool better for everyone!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── board/            # Board view
│   ├── generator/        # AI story generator
│   ├── reservations/    # Room reservation system
│   ├── stolen/          # Lost & found tracking
│   └── transport/       # Transport information
├── components/           # Reusable React components
├── lib/                  # Utility functions and APIs
└── types/               # TypeScript type definitions
```

## Key Components

- `TransportBoard`: Displays transport information and schedules
- `StudentConnections`: Manages student transport connections
- `CountdownTimer`: Timer component for scheduling
- `DailyStory`: Displays daily generated content
- `MessageActions`: Handles message-related actions
- `QuickLinks`: Quick access to important resources
- `FAQ`: Frequently asked questions component

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend and hosting
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Phosphor Icons](https://phosphoricons.com/) - Icon system

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

The project can be deployed on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or Firebase Hosting.

For Firebase deployment:
1. Set up Firebase configuration
2. Configure `.firebaserc` and `firebase.json`
3. Deploy using Firebase CLI
