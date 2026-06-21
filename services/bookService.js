const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    fee: 5,
    librarian: "Rahim",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    fee: 8,
    librarian: "Karim",
  },
  {
    id: 3,
    title: "Harry Potter",
    author: "J.K. Rowling",
    category: "Fantasy",
    fee: 6,
    librarian: "Rahim",
  },
];

const librarians = [
  {
    id: 1,
    name: "Rahim",
    deliveries: 120,
  },
  {
    id: 2,
    name: "Karim",
    deliveries: 95,
  },
  {
    id: 3,
    name: "Salma",
    deliveries: 80,
  },
];

const categories = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Programming" },
  { id: 3, name: "Self Help" },
  { id: 4, name: "Fantasy" },
];

// simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// APIs
export async function getBooks(filters = {}) {
  await delay(800);

  let result = [...books];

  // search
  if (filters.search) {
    result = result.filter((book) =>
      book.title.toLowerCase().includes(filters.search.toLowerCase()),
    );
  }

  // category filter
  if (filters.category) {
    result = result.filter((book) => book.category === filters.category);
  }

  // availability filter
  if (filters.available !== undefined) {
    result = result.filter((book) => book.available === filters.available);
  }

  return result;
}

export async function getTopLibrarians() {
  await delay(800);
  return librarians;
}

export async function getCategories() {
  await delay(500);
  return categories;
}
