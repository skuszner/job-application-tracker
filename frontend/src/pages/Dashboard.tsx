import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <>
      <h1>Welcome {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
}
