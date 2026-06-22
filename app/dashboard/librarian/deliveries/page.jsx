export default function LibrarianDeliveries() {
  const deliveries = [
    { book: "Book A", user: "John", status: "Pending" },
    { book: "Book B", user: "Sara", status: "Delivered" },
  ];

  return (
    <div>
      <h1>Deliveries</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Book</th>
            <th>User</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((d, i) => (
            <tr key={i}>
              <td>{d.book}</td>
              <td>{d.user}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
