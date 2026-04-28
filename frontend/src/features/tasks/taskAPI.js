import API from "../auth/authAPI";

export const createTask = (data, token) =>
  API.post("/tasks", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTasks = (token) =>
  API.get("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTask = (id, data, token) =>
  API.put(`/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTask = (id, token) =>
  API.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });