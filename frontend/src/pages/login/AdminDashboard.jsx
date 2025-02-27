"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./AdminDashboard.css"
import { Edit, Trash2, LogOut } from "lucide-react"

function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/admin/users", { withCredentials: true })
      setUsers(response.data)
      setIsLoading(false)
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setError("Failed to load users. Please try again.")
      setIsLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser({ ...user })
  }

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/users//${editingUser._id}`, editingUser, { withCredentials: true })
      setUsers(users.map((user) => (user._id === editingUser._id ? editingUser : user)))
      setEditingUser(null)
    } catch (err) {
      console.error("Failed to update user:", err)
      setError("Failed to update user. Please try again.")
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5001/admin/users/${userId}`, { withCredentials: true })
        setUsers(users.filter((user) => user._id !== userId))
      } catch (err) {
        console.error("Failed to delete user:", err)
        setError("Failed to delete user. Please try again.")
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    navigate("/admin-login")
  }

  if (isLoading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>NepNutri Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </header>
      <main className="dashboard-content">
        <h2>User Management</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <button className="save-btn" onClick={handleSave}>
                      Save
                    </button>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(user)}>
                        <Edit size={18} />
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default AdminDashboard

