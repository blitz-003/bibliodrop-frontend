export default function DeliveriesPage() {
  const deliveries = [
    {
      title: "Book A",
      fee: 5,
      date: "2026-06-20",
      status: "Delivered",
    },
    {
      title: "Book B",
      fee: 3,
      date: "2026-06-18",
      status: "Pending",
    },
  ];

  return (
    <div>
      <h1>Delivery History</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Fee</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((d, i) => (
            <tr key={i}>
              <td>{d.title}</td>
              <td>{d.fee}</td>
              <td>{d.date}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
