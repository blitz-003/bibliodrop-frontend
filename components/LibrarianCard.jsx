export default function LibrarianCard({ librarian }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{librarian.name}</h3>
      <p>Deliveries: {librarian.deliveries}</p>
    </div>
  );
}
