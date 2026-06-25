import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900/95 border-t border-slate-800 text-slate-300 font-sans mt-auto py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-8">
        {/* LEFT SIDE: BRAND IDENTITY & TEXT DESCRIPTION (Upscaled to text-base) */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-4 max-w-sm mx-auto md:mx-0">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-normal">
              Bibliodrop
            </span>
          </div>
          <p className="text-base leading-relaxed text-slate-400">
            A shared ecosystem catalog built to streamline book collections,
            reading queues, and distribution tracking effortlessly.
          </p>
        </div>

        {/* RIGHT SIDE: PLATFORM LINKS & SOCIALS CONNECT GROUPS */}
        <div className="flex flex-col items-center text-center md:items-end md:text-right space-y-8">
          {/* NAVIGATION LINKS (Upscaled to text-base) */}
          <nav className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-base font-semibold">
            <Link
              href="/browse-books"
              className="hover:text-white transition-colors py-1 md:py-0"
            >
              Browse Books
            </Link>
            <Link
              href="/pricing"
              className="hover:text-white transition-colors py-1 md:py-0"
            >
              Platform Pricing
            </Link>
            <Link
              href="/about"
              className="hover:text-white transition-colors py-1 md:py-0"
            >
              About Project
            </Link>
          </nav>

          {/* FOUR INTEGRATED SOCIAL PLATFORMS */}
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            >
              <svg
                className="w-5 h-5 fill-none stroke-current stroke-2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" w="20" h="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BASE UTILITY STRIP (Upscaled to text-sm) */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 pt-8 mt-10 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
        <p>© 2026 Bibliodrop System. All rights reserved.</p>
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-4 h-4 text-red-500/90 fill-red-500/20" />
          <span>for literary management</span>
        </div>
      </div>
    </footer>
  );
}
