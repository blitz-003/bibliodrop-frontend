export default function ApprovalsPage() {
  const requests = [
    { book: "Book A", status: "Pending" },
    { book: "Book B", status: "Pending" },
  ];

  return (
    <div>
      <h1>Approvals</h1>

      {requests.map((r, i) => (
        <div key={i}>
          {r.book} - {r.status}
        </div>
      ))}
    </div>
  );
}
