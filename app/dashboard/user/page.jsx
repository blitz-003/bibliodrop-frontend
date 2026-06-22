export default function UserOverviewPage() {
  return (
    <div>
      <h1>Overview</h1>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: 20 }}>
        <div>Total Books Read: 12</div>
        <div>Pending Deliveries: 3</div>
        <div>Total Spent: $45</div>
      </div>

      {/* Chart placeholder */}
      <div style={{ marginTop: 30 }}>
        <h3>Reading Progress Chart</h3>
        <div style={{ height: 300, background: "#eee" }}>
          Chart goes here (Recharts / Chart.js)
        </div>
      </div>
    </div>
  );
}
