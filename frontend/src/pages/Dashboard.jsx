import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
} from "../features/tasks/taskSlice";
import Navbar from "../components/Navbar";

// Utility to calculate priority score
const getTaskPriorityScore = (task) => {
  if (task.status === "Completed") return -1000; // Push to bottom

  const now = new Date();
  const deadline = new Date(task.deadline);
  // Reset time to start of day for fair comparison
  now.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 500; // Overdue
  if (diffDays === 0) return 400; // Due today
  if (diffDays === 1) return 300; // Due tomorrow
  if (diffDays <= 3) return 200; // Due soon

  return 100 - diffDays; // Higher priority for closer deadlines
};

// Extrapolate label and color
const getPriorityBadge = (score) => {
  if (score >= 500)
    return { label: "Overdue", color: "bg-red-600 text-white animate-pulse" };
  if (score >= 400)
    return { label: "Due Today", color: "bg-orange-500 text-white" };
  if (score >= 300)
    return { label: "High Priority", color: "bg-orange-400 text-white" };
  if (score >= 200)
    return { label: "Medium", color: "bg-yellow-500 text-white" };
  if (score === -1000)
    return { label: "Done", color: "bg-gray-600 text-gray-300" };
  return { label: "Normal", color: "bg-blue-500 text-white" };
};

function Dashboard() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { token } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    dispatch(fetchTasks(token));
  }, [dispatch, token]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;
    dispatch(
      addTask({ data: { title, description, category, deadline }, token }),
    );
    setTitle("");
    setDescription("");
    setCategory("Work");
    setDeadline("");
  };

  const handleDelete = (id) => {
    dispatch(deleteTask({ id, token }));
  };

  const handleStatusChange = (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
          ? "Completed"
          : "Pending";
    dispatch(updateTask({ id, data: { status: newStatus }, token }));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const pA = getTaskPriorityScore(a);
    const pB = getTaskPriorityScore(b);
    if (pA !== pB) return pB - pA;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // --- Insights Calculation ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = tasks.filter((t) => {
    if (t.status !== "Completed") return false;
    const updatedAt = new Date(t.updatedAt);
    updatedAt.setHours(0, 0, 0, 0);
    return updatedAt.getTime() === today.getTime();
  }).length;

  const categoriesCount = tasks.reduce((acc, t) => {
    if (t.category) acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  let mostActiveCategory = "None";
  if (Object.keys(categoriesCount).length > 0) {
    mostActiveCategory = Object.keys(categoriesCount).reduce((a, b) =>
      categoriesCount[a] > categoriesCount[b] ? a : b,
    );
  }
  // ----------------------------

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Productivity Insights Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
          <div className="bg-gray-800 p-4 shadow-md rounded-lg border border-gray-700 border-l-4 border-l-blue-500">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Total
            </p>
            <p className="text-3xl font-bold text-white mt-1">{totalTasks}</p>
          </div>
          <div className="bg-gray-800 p-4 shadow-md rounded-lg border border-gray-700 border-l-4 border-l-green-500">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Completed
            </p>
            <p className="text-3xl font-bold text-white mt-1">
              {completedTasks}
            </p>
          </div>
          <div className="bg-gray-800 p-4 shadow-md rounded-lg border border-gray-700 border-l-4 border-l-yellow-500">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Pending
            </p>
            <p className="text-3xl font-bold text-white mt-1">{pendingTasks}</p>
          </div>
          <div className="bg-gray-800 p-4 shadow-md rounded-lg border border-gray-700 border-l-4 border-l-purple-500">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Today's Done
            </p>
            <p className="text-3xl font-bold text-white mt-1">
              {completedToday}
            </p>
          </div>
          <div className="bg-gray-800 p-4 shadow-md rounded-lg border border-gray-700 border-l-4 border-l-orange-500 justify-center flex flex-col items-center">
            <p className="text-xs text-gray-400 font-semibold uppercase text-center">
              Top Category
            </p>
            <p
              className="text-xl font-bold text-white mt-1 truncate"
              title={mostActiveCategory}
            >
              {mostActiveCategory}
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
          Your Tasks
        </h1>

        <form
          onSubmit={handleAddTask}
          className="mb-8 bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700"
        >
          <div className="flex gap-3 w-full flex-col sm:flex-row mb-3">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="p-2.5 bg-gray-900 border border-gray-600 rounded text-white flex-1 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2.5 bg-gray-900 border border-gray-600 rounded text-white flex-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 w-full flex-col sm:flex-row items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2.5 bg-gray-900 border border-gray-600 rounded text-white flex-1 focus:outline-none focus:border-blue-500"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
            </select>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="p-2.5 bg-gray-900 border border-gray-600 rounded text-white flex-1 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 py-2.5 px-6 rounded text-white font-bold tracking-wide transition-colors whitespace-nowrap"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {sortedTasks.map((task) => {
            const score = getTaskPriorityScore(task);
            const badge = getPriorityBadge(score);

            return (
              <div
                key={task._id}
                className={`p-4 rounded-lg flex justify-between items-center shadow border transition-all ${
                  score >= 500
                    ? "bg-red-900/30 border-red-700"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <div>
                  <h2
                    className={`font-semibold text-xl ${task.status === "Completed" ? "line-through text-gray-500" : ""}`}
                  >
                    {task.title}
                  </h2>
                  <p className="text-sm text-gray-300 mt-1 mb-2">
                    {task.description}
                  </p>
                  <div className="flex gap-2 flex-wrap text-xs items-center">
                    <span
                      className={`px-2.5 py-1 rounded-full font-medium ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full font-medium ${
                        task.status === "Pending"
                          ? "bg-yellow-900/60 text-yellow-100 border border-yellow-700/50"
                          : task.status === "In Progress"
                            ? "bg-blue-900/60 text-blue-100 border border-blue-700/50"
                            : "bg-green-900/60 text-green-100 border border-green-700/50"
                      }`}
                    >
                      {task.status}
                    </span>
                    {task.category && (
                      <span className="px-2.5 py-1 rounded-full font-medium bg-gray-700 text-gray-200 border border-gray-600">
                        {task.category}
                      </span>
                    )}
                    {task.deadline && (
                      <span className="px-2.5 py-1 rounded-full font-medium bg-purple-900/60 text-purple-100 border border-purple-700/50">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(task._id, task.status)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {sortedTasks.length === 0 && (
            <p className="text-gray-400 text-center mt-6">
              No tasks found. Create one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
