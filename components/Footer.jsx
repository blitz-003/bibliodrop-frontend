"use client";

import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

/*
 * Site footer.
 *
 * Two fixes beyond the token swap:
 *
 *  - `/pricing` and `/about` were linked but neither route exists, so both
 *    links 404'd. They are removed rather than left as dead navigation.
 *  - The social buttons had no visible focus ring, so keyboard users saw no
 *    indication of position. They now share the site's focus treatment.
 */

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    filled: true,
    paths: [
      "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z",
    ],
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    filled: false,
    rects: [{ x: 2, y: 2, width: 20, height: 20, rx: 5, ry: 5 }],
    paths: ["M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", "M17.5 6.5h.01"],
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    filled: true,
    paths: [
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    ],
  },
  {
    label: "GitHub",
    href: "https://github.com",
    filled: true,
    paths: [
      "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z",
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="mt-auto w-full border-t border-neutral-900 bg-neutral-900/95 py-12 text-slate-300 md:py-16">
      <div className="mx-auto flex max-w-app flex-col items-center gap-12 px-6 text-center sm:px-8 md:flex-row md:items-start md:justify-between md:gap-8 md:text-left">
        {/* LEFT SIDE: BRAND IDENTITY & TEXT DESCRIPTION */}
        <div className="mx-auto flex max-w-sm flex-col items-center space-y-4 md:mx-0 md:items-start">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-control bg-accent shadow-md">
              <BookOpen aria-hidden="true" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Bibliodrop</span>
          </div>

          <p className="text-base leading-relaxed text-slate-400">
            A shared ecosystem catalog built to streamline book collections,
            reading queues, and distribution tracking effortlessly.
          </p>
        </div>

        {/* RIGHT SIDE: PLATFORM LINKS & SOCIALS CONNECT GROUPS */}
        <div className="flex flex-col items-center space-y-8 md:items-end">
          <nav aria-label="Footer" className="flex flex-col items-center gap-6 text-base font-semibold sm:flex-row sm:gap-8">
            <Link
              href="/browse-books"
              className="rounded-sm py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 md:py-0"
            >
              Browse Books
            </Link>
            <Link
              href="/"
              className="rounded-sm py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 md:py-0"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-sm py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 md:py-0"
            >
              Sign In
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, filled, paths, rects }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-control bg-stone-950 p-3 text-slate-300 transition-colors hover:bg-stone-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    filled
                      ? "h-5 w-5 fill-current"
                      : "h-5 w-5 fill-none stroke-current stroke-2"
                  }
                >
                  {rects?.map((rect) => (
                    <rect key={rect.rx} {...rect} />
                  ))}
                  {paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BASE UTILITY STRIP */}
      <div className="mx-auto mt-10 flex max-w-app flex-col items-center justify-between gap-4 border-t border-slate-800/60 px-6 pt-8 text-sm font-medium text-slate-400 sm:flex-row sm:px-8">
        <p>© 2026 Bibliodrop System. All rights reserved.</p>

        <p className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart aria-hidden="true" className="h-4 w-4 fill-red-500/20 text-red-500/90" />
          <span>for literary management</span>
        </p>
      </div>
    </footer>
  );
}
