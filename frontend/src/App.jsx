import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  taskAddedSync,
  taskUpdatedSync,
  taskDeletedSync,
} from "./features/tasks/taskSlice";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      const socketUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace("/api", "")
        : "http://localhost:5000";
      const socket = io(socketUrl);
      try {
        const decoded = jwtDecode(token);
        socket.emit("join", decoded.id);

        socket.on("task_created", (task) => dispatch(taskAddedSync(task)));
        socket.on("task_updated", (task) => dispatch(taskUpdatedSync(task)));
        socket.on("task_deleted", (id) => dispatch(taskDeletedSync(id)));
      } catch (err) {
        console.error("Invalid token", err);
      }
      return () => socket.disconnect();
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
