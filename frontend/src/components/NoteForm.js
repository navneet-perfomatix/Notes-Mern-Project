import { useState } from "react"
import { useNotesContext } from "../hooks/useNotesContext"
import { useAuthContext } from "../hooks/useAuthContext"

const NoteForm = () => {
  const { dispatch } = useNotesContext()
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('Ypu must be logged in!')
      return
    }
    
    const note = {title, desc}

    const response = await fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setTitle('')
      setDesc('')
      setError(null)
      setEmptyFields([])
      console.log('new note added', json)
      dispatch({type: 'CREATE_NOTE', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Note</h3>

      <label>Note Title:</label>
      <input 
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Note Desc:</label>
      <input 
        type="text"
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        className={emptyFields.includes('desc') ? 'error' : ''}
      />

      <button>Add Note</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default NoteForm