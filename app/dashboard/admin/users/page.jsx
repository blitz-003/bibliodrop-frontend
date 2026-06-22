export default function UsersPage() {
  const users = [
    { name: "John", role: "user" },
    { name: "Sara", role: "librarian" },
  ];

  return (
    <div>
      <h1>Users</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.name}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
