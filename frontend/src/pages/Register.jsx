import { useState } from "react";
import { useDispatch } from "react-redux";
import { register as registerAction } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await dispatch(registerAction(form)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center text-white justify-center min-h-screen bg-gradient-to-br from-black to-gray-900">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white hover:bg-purple-700 p-3 rounded-lg font-semibold transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
