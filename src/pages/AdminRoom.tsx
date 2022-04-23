import { useNavigate, useParams } from 'react-router-dom'
import { getDatabase, ref, remove, update } from 'firebase/database'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/room.scss'
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export const AdminRoom = () => {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const database = getDatabase();
  const { title, questions } = useRoom(roomId!)  

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
    }
  }

  const handleQuestionAsAnswered = async (questionId: string) => {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true
    });
  }

  const handleHighlightQuestion = async (questionId: string) => {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isHighlighted: true
    });
  }

  const handleEndRoom = async () => {
    await update(ref(database, `rooms/${roomId}`), {
      endedAt: new Date()
    })
    navigate('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId!} />
            <Button isOutlined onClick={handleEndRoom }>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && (
            <span>{questions.length} pergunta{ questions.length > 1 && 's' }</span>
          )}
        </div>
        

        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isHighlighted={question.isHighlighted}
              isAnswered={question.isAnswered}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type='button'
                    onClick={() => handleQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>

                  <button
                    type='button'
                    onClick={() => handleHighlightQuestion(question.id)}
                    >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}

              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
