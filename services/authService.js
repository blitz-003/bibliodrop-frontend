const fakeUserDB = [
  {
    id: 1,
    name: "Alice",
    email: "alice@test.com",
    role: "user",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@test.com",
    role: "librarian",
  },
  {
    id: 3,
    name: "Admin",
    email: "admin@test.com",
    role: "admin",
  },
];

export async function loginUser(email) {
  await new Promise((res) => setTimeout(res, 500));

  const user = fakeUserDB.find((u) => u.email === email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // fake JWT payload (no real backend yet)
  return {
    token: "fake-jwt-token",
    user,
  };
}
