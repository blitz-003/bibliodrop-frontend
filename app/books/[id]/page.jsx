export default function BookDetailsPage({ params }) {
  return (
    <div>
      <h1>Book Details Page</h1>

      <p>Book ID: {params.id}</p>
    </div>
  );
}
