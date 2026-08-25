import { useState, useEffect } from 'react'
import './App.css'

const initialMembers = [
  { id: 1, name: 'Priya', status: 'On track' },
  { id: 2, name: 'Rohan', status: 'Blocked' },
  { id: 3, name: 'Ananya', status: 'On track' },
]
// Use the latest state value inside the interval to avoid a stale closure.
function App() {
  const [members, setMembers] = useState(initialMembers)
  const [newName, setNewName] = useState('')
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0)

  // "Seconds since last update" ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSinceUpdate((seconds) => seconds + 1)    }, 1000)
    return () => clearInterval(interval)
  }, [])

  function addMember() {
    if (!newName.trim()) return
    setMembers([...members, { id: Date.now(), name: newName, status: 'On track' }])
    setNewName('')
    setSecondsSinceUpdate(0)
  }

  function removeMember(id) {
    setMembers(members.filter((m) => m.id !== id))
    setSecondsSinceUpdate(0)
  }

  function toggleStatus(id) {
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'On track' ? 'Blocked' : 'On track' }
          : m
      )
    )
    setSecondsSinceUpdate(0)
  }

  return (
    <div className="app">
      <header className="header-bar">
        <h1>Standup Tracker</h1>
        <span className="ticker">Last update: {secondsSinceUpdate}s ago</span>
      </header>

      <div className="add-row">
        <input
          aria-label="Add a team member"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a team member"
        />
        <button onClick={addMember}>Add</button>
      </div>

      <ul className="member-list">
      {/* Fix: Using member.id as a stable key prevents incorrect list re-rendering. */}
        {members.map((member) => (
          <div key={member.id} className="member-row">
            <span className="member-name">{member.name}</span>
            <button
              className={`status-pill ${member.status === 'On track' ? 'ok' : 'blocked'}`}
              onClick={() => toggleStatus(member.id)}
            >
              {member.status}
            </button>
            {/* Fix: A real button with an accessible name allows keyboard and screen-reader users to remove members. */}
<button
  className="remove-icon"
  onClick={() => removeMember(member.id)}
  aria-label={`Remove ${member.name}`}
>
  ×
</button>
</div>        ))}
      </ul>
    </div>
  )
}

export default App
