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

export async function getBooks(filters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.search) {
    queryParams.append("search", filters.search);
  }

  if (filters.category) {
    queryParams.append("category", filters.category);
  }

  if (filters.available !== undefined) {
    queryParams.append("available", filters.available);
  }

  if (filters.page) {
    queryParams.append("page", filters.page);
  }

  if (filters.limit) {
    queryParams.append("limit", filters.limit);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books?${queryParams.toString()}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

export async function getTopLibrarians() {
  await delay(800);
  return librarians;
}

export async function getCategories() {
  await delay(500);
  return categories;
}

// single book fetch
export async function getBookById(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

export async function createBook(formData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create book");
  }

  return res.json();
}
