export default function ReadingListPage() {
  const books = [
    { title: "Book A", image: "/book1.jpg" },
    { title: "Book B", image: "/book2.jpg" },
  ];

  return (
    <div>
      <h1>My Reading List</h1>

      <div style={{ display: "flex", gap: 20 }}>
        {books.map((b, i) => (
          <div key={i}>
            <div style={{ width: 120, height: 160, background: "#ddd" }} />
            <p>{b.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
