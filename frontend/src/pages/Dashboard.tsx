import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <h1>Welcome {user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
