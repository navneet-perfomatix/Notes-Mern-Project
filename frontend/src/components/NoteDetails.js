import { useNotesContext } from '../hooks/useNotesContext'
import { useAuthContext } from '../hooks/useAuthContext'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const NoteDetails = ({ note }) => {
  const { dispatch } = useNotesContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if(!user) {
      return
    }

    const response = await fetch('/api/notes/' + note._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_NOTE', payload: json})
    }
  }

  return (
    <div className="note-details">
      <h4>{note.title}</h4>
      <h5>{note.desc}</h5>
      <p>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default NoteDetails