import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDatabase, ref, push } from 'firebase/database';

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export const Room = () => {
  const { user } = useAuth()
  const [newQuestion, setNewQuestion] = useState('');
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    if (newQuestion.trim() === '') return;

    if (!user) throw new Error('You must be logged in');

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    await push(
      ref(getDatabase(), `rooms/${roomId}/questions`),
      question
    );
    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId!} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala</h1>
          <span>4 perguntas</span>
        </div>
        
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{ user.name }</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
