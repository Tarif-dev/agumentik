import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
