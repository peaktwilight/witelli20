'use client';

// The version will be injected during the build process
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'dev';

export function Footer() {
  return (
    <footer className="mt-12 text-center text-white/60 py-4">
      <p>&copy; {new Date().getFullYear()} Witelli20. Created with ❤️ by a fellow witelli student</p>
      <div className="flex justify-center items-center space-x-3 mt-3">
        <a 
          href="https://github.com/peaktwilight/witelli20" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center space-x-1 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-full px-3 py-1 text-xs"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span className="group-hover:text-white">Open Source</span>
        </a>
        <a 
          href="https://github.com/peaktwilight/witelli20/releases" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-full px-3 py-1 text-xs hover:text-white"
        >
          v{APP_VERSION}
        </a>
      </div>
    </footer>
  );
}
