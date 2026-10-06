# BiblioDrop Frontend 📚

BiblioDrop is a modern online book marketplace built with Next.js. This repository contains the frontend application, providing a responsive and user-friendly interface for browsing, buying, and managing books.

## 🌐 Live Demo

**Website:** https://bibliodrop-frontend.vercel.app/

## 🔗 Repository

**GitHub:** https://github.com/blitz-003/bibliodrop-frontend

## ✨ Features

- User authentication
- Browse and search books
- Book details page
- Stripe Integration
- User / Librarian / Admin dashboard
- Responsive design

## 🛠️ Tech Stack

- Next.js
- React
- Tailwind CSS
- TanStack Query
- BetterAuth.js
- Stripe
- Cloudinary

## 🚀 Getting Started

```bash
git clone https://github.com/blitz-003/bibliodrop-frontend.git
cd bibliodrop-frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## Precaution

First set up environment variables in your .env file

## 📄 License

This project is licensed under the MIT License.


## Testing

This project uses Jest, React Testing Library, MSW, and jest-axe for unit, integration, and accessibility testing.

### Run tests

`ash
npm run test
` 

### Run tests in watch mode

`ash
npm run test:watch
` 

### Run with coverage

`ash
npm run test:coverage
` 

### Testing notes

- MSW mocks API calls to http://localhost:5000; handlers are in 	ests/mocks/handlers.js.
- Navigation is mocked in-memory via 	ests/setup/navigationMock.js to round-trip URL changes.
- Accessibility tests use jest-axe in integration suites. 

## Known gaps

- BookCard reads ook.available to decide availability, but the backend catalogue returns vailableStock/	otalStock; in practice Browse currently renders cards based on catalogue data. See fixtures and comments for details.
- Some ESLint warnings exist in generated coverage files and in 	ests/mocks/betterAuthReact.js (non-blocking).

