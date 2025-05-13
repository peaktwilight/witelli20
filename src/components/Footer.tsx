'use client';

// The version will be injected during the build process
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'dev';

export function Footer() {
  return (
    <footer className="mt-12 text-center text-white/60 py-4">
      <p>&copy; {new Date().getFullYear()} Witelli20. Created with ❤️ by a fellow witelli student</p>
      <p className="text-xs mt-2">
        <a 
          href="https://github.com/peaktwilight/witelli20/releases" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          v{APP_VERSION}
        </a>
      </p>
    </footer>
  );
}
