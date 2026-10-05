import { http, HttpResponse } from "msw";

import {
  makeBook,
  makeCatalogueBook,
  makeBooksResponse,
  makeBookDetail,
} from "./fixtures";

/*
 * MSW handlers for the endpoints these tests exercise.
 *
 * Every path is a real route from `bibliodrop-backend/index.js`; nothing here is
 * invented. URLs are absolute because the app builds requests from
 * `NEXT_PUBLIC_API_URL`, which `tests/setup/env.js` points at
 * `http://localhost:5000`. Using absolute paths means a component that forgets
 * the env var produces an unmatched request, which fails the test under
 * `onUnhandledRequest: "error"` rather than quietly hitting localhost:3000.
 *
 * The list handler filters, sorts and paginates for real rather than always
 * returning one fixed page. Browse is the page most likely to regress its
 * parameter handling, and a stub that ignored `page` would let a broken
 * `page=2` request pass unnoticed.
 */

export const API = "http://localhost:5000";

const ITEMS_PER_PAGE = 8;

/** Catalogue used by the default `GET /books` handler. */
export function makeCatalogue(count = ITEMS_PER_PAGE) {
  const titles = [
    "Atomic Habits",
    "Dune",
    "The Pragmatic Programmer",
    "Sapiens",
    "Clean Code",
    "Thinking, Fast and Slow",
    "The Hobbit",
    "Educated",
    "Project Hail Mary",
    "Klara and the Sun",
    "Meditations",
    "The Design of Everyday Things",
  ];

  const categories = ["Self Help", "Fiction", "Technology", "History"];

  return Array.from({ length: count }, (_, index) =>
    makeCatalogueBook({
      _id: `book-${index + 1}`,
      title: titles[index % titles.length],
      category: categories[index % categories.length],
      deliveryFee: (index + 1) * 1.5,
      // Make stock genuinely vary so availability behaviour is observable.
      totalStock: 10,
      availableStock: index % 4 === 0 ? 0 : 10 - index,
    }),
  );
}

function matchesSearch(book, term) {
  if (!term) return true;
  const needle = term.toLowerCase();

  return (
    book.title.toLowerCase().includes(needle) ||
    book.author.toLowerCase().includes(needle)
  );
}

function compare(a, b, sort) {
  switch (sort) {
    case "oldest":
      return new Date(a.createdAt) - new Date(b.createdAt);
    case "price_low":
      return a.deliveryFee - b.deliveryFee;
    case "price_high":
      return b.deliveryFee - a.deliveryFee;
    case "newest":
    default:
      return new Date(b.createdAt) - new Date(a.createdAt);
  }
}

/**
 * Applies the same parameter contract as `GET /books` in the backend, so a test
 * that asserts on rendered output is really asserting on the app's handling of
 * the parameters rather than on the mock's cooperation.
 */
export function buildBooksResponse({
  all = makeCatalogue(),
  search = "",
  category = "",
  sort = "newest",
  minDeliveryFee = "",
  maxDeliveryFee = "",
  page = "1",
  limit = String(ITEMS_PER_PAGE),
} = {}) {
  let books = [...all];

  if (category) books = books.filter((book) => book.category === category);
  if (search) books = books.filter((book) => matchesSearch(book, search));

  if (minDeliveryFee !== "") {
    books = books.filter((book) => book.deliveryFee >= Number(minDeliveryFee));
  }
  if (maxDeliveryFee !== "") {
    books = books.filter((book) => book.deliveryFee <= Number(maxDeliveryFee));
  }

  books.sort((a, b) => compare(a, b, sort));

  const perPage = Number(limit) || ITEMS_PER_PAGE;
  const totalCount = books.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * perPage;

  return {
    books: books.slice(start, start + perPage),
    totalCount,
    currentPage: current,
    totalPages,
    allCategories: Array.from(new Set(all.map((b) => b.category))).sort(),
  };
}

/** Shorthand for a success response built from the shared catalogue. */
export function booksResponse(init) {
  return HttpResponse.json(buildBooksResponse(init));
}

export const handlers = [
  // GET /books — search, category, available, page, limit, sort, fee bounds
  http.get(`${API}/books`, ({ request }) => {
    const params = new URL(request.url).searchParams;

    return booksResponse({
      search: params.get("search") ?? "",
      category: params.get("category") ?? "",
      sort: params.get("sort") ?? "newest",
      minDeliveryFee: params.get("minDeliveryFee") ?? "",
      maxDeliveryFee: params.get("maxDeliveryFee") ?? "",
      page: params.get("page") ?? "1",
      limit: params.get("limit") ?? String(ITEMS_PER_PAGE),
    });
  }),

  // GET /books/:id — the backend wraps the book in a payload that also carries
  // the four flags the detail page branches on, so the mock must not return the
  // bare book or every one of those branches silently takes its false default.
  http.get(`${API}/books/:id`, ({ params }) =>
    HttpResponse.json(
      makeBookDetail({ _id: String(params.id) }),
    ),
  ),

  // GET /deliveries/history
  http.get(`${API}/deliveries/history`, () =>
    HttpResponse.json([
      {
        _id: "delivery-1",
        transactionId: "transaction-1",
        stripeSessionId: "cs_test_bibliodrop_session",
        bookId: "book-1",
        bookTitle: "Atomic Habits",
        userId: "user-1",
        userName: "Karim",
        deliveryFee: 5,
        status: "pending",
        createdAt: new Date("2026-03-01T09:00:00.000Z").toISOString(),
        updatedAt: new Date("2026-03-01T09:00:00.000Z").toISOString(),
      },
    ]),
  ),

  // POST /books/:id/reviews
  http.post(`${API}/books/:id/reviews`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return HttpResponse.json({ success: true });
  }),
];

export { makeBook, makeCatalogueBook, makeBooksResponse };