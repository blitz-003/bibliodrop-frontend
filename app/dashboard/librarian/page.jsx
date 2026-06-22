export default function LibrarianOverview() {
  return (
    <div>
      <h1>Librarian Overview</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div>Total Books: 120</div>
        <div>Pending Requests: 8</div>
        <div>Active Deliveries: 5</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>System Status</h3>
        <p>All systems operational</p>
      </div>
    </div>
  );
}
