export default function ReviewsPage() {
  const reviews = [
    { book: "Book A", comment: "Great book!" },
    { book: "Book B", comment: "Very helpful." },
  ];

  return (
    <div>
      <h1>My Reviews</h1>

      {reviews.map((r, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <b>{r.book}</b>
          <p>{r.comment}</p>

          <button>Edit</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}
