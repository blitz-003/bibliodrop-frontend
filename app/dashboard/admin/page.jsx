export default function AdminOverview() {
  return (
    <div>
      <h1>Admin Overview</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div>Total Users: 150</div>
        <div>Total Books: 1200</div>
        <div>Pending Approvals: 6</div>
      </div>
    </div>
  );
}
