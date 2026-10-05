/*
 * Fixture factories.
 *
 * Every factory returns a fresh object with overrides applied, so a test that
 * mutates a fixture cannot leak that change into the next one.
 *
 * Field names mirror the real schemas so a handler response matches what the
 * backend actually sends:
 *   - `models/book.model.js`
 *   - `models/Delivery.js`
 *   - `GET /books`, which wraps the list in
 *     `{ books, totalCount, currentPage, totalPages, allCategories }`
 */

const OBJECT_ID = /^([0-9a-fA-F]{24})$/;

let sequence = 0;

/** Deterministic, Mongo-shaped ObjectId so snapshots stay stable across runs. */
export function makeId(prefix = "") {
  sequence += 1;
  const hex = sequence.toString(16).padStart(4, "0");
  const body = `${hex}`.padEnd(24, "0");
  return OBJECT_ID.test(body) ? body : "000000000000000000000000";
}

export function makeBook(overrides = {}) {
  const id = overrides._id ?? makeId();

  return {
    _id: id,
    title: "Atomic Habits",
    author: "James Clear",
    description: "A practical guide to building good habits and breaking bad ones.",
    category: "Self Help",
    coverImage: "https://res.cloudinary.com/demo/image/upload/atomic-habits.jpg",
    deliveryFee: 5,
    totalStock: 10,
    availableStock: 4,
    publishStatus: "approved",
    deliveryStatus: "available",
    ownerId: makeId(),
    ownerName: "Rahim",
    ownerEmail: "rahim@bibliodrop.test",
    totalReviews: 2,
    averageRating: 4.5,
    borrowCount: 17,
    reviews: [
      {
        userId: makeId(),
        userName: "Salma",
        comment: "Changed how I plan my mornings.",
        rating: 5,
        createdAt: new Date("2026-01-14T10:00:00.000Z"),
      },
    ],
    createdAt: new Date("2026-01-02T08:30:00.000Z"),
    updatedAt: new Date("2026-02-11T12:00:00.000Z"),

    ...overrides,
  };
}

/**
 * `available` is not part of the backend Book schema, but `BookCard` branches on
 * `book.available !== false`. Both branches are covered here so the card can be
 * tested in isolation; see README "Known gaps" for why Browse always renders
 * "In Stock" in practice.
 */
export function makeCatalogueBook(overrides = {}) {
  const book = makeBook(overrides);
  const { availableStock, totalStock } = book;

  return {
    ...book,
    available: overrides.available ?? availableStock < totalStock,
    ...overrides,
  };
}

export function makeDelivery(overrides = {}) {
  const id = overrides._id ?? makeId();

  return {
    _id: id,
    transactionId: makeId(),
    stripeSessionId: "cs_test_bibliodrop_session",
    bookId: makeId(),
    bookTitle: "Atomic Habits",
    userId: makeId(),
    userName: "Karim",
    deliveryFee: 5,
    status: "pending",
    createdAt: new Date("2026-03-01T09:00:00.000Z"),
    updatedAt: new Date("2026-03-01T09:00:00.000Z"),

    ...overrides,
  };
}

export function makeUser(overrides = {}) {
  return {
    _id: makeId(),
    name: "Karim",
    email: "karim@bibliodrop.test",
    emailVerified: true,
    image: null,
    role: "user",
    createdAt: new Date("2026-01-05T08:00:00.000Z"),
    updatedAt: new Date("2026-01-05T08:00:00.000Z"),

    ...overrides,
  };
}

/** The real `GET /books` success envelope, as sent by `index.js`. */
export function makeBooksResponse({
  books = [makeCatalogueBook()],
  totalCount = books.length,
  currentPage = 1,
  allCategories = ["Self Help", "Fiction"],
} = {}) {
  const limit = 8; // ITEMS_PER_PAGE in app/browse-books/page.jsx

  return {
    books,
    totalCount,
    currentPage,
    totalPages: Math.ceil(totalCount / limit),
    allCategories,
  };
}
export function makeBookDetail({
  book,
  isAuthenticated = false,
  isLibrarianOwner = false,
  hasRequestedDelivery = false,
  canReview = false,
  ...overrides
} = {}) {
  const resolvedBook = book ? { ...book } : makeBook(overrides);

  return {
    book: resolvedBook,
    isAuthenticated,
    isLibrarianOwner,
    hasRequestedDelivery,
    canReview,
  };
}
