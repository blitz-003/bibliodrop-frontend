export default function InventoryPage() {
  const books = [
    { title: "Book A", stock: 5 },
    { title: "Book B", stock: 2 },
  ];

  return (
    <div>
      <h1>Inventory</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b, i) => (
            <tr key={i}>
              <td>{b.title}</td>
              <td>{b.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
