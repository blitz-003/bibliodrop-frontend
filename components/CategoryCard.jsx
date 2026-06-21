export default function CategoryCard({ category }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{category.name}</h3>
    </div>
  );
}
