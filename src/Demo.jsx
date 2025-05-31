import { useState } from 'react'
import PDFViewer from './PDFViewer.jsx'
import Chat from './Chat.jsx'

function Demo() {
  const [page, setPage] = useState(1);
  const demoQuestions = [
    { 
      id: 0, 
      text: "" ,
      answer: "",
      pages: []
    },
    { 
      id: 1, 
      text: "Por que el cielo es azul?" ,
      answer: "Por que sí",
      pages: [1, 3, 5]
    },
    { 
      id: 2, 
      text: "Por que el cielo no es violeta" ,
      answer: "Por que no",
      pages: [2, 4, 6]
    }
  ];
  return (
    <>
      <div className="card disclaimer">
        On this demo you might choose a predefined question on a specific book, 
        on the real app of course you can choose/provide the book and ask your
        own question, the result will look like this:
      </div>
      <div className="row">
        <div className="chat-column">
          <Chat 
            setPage={setPage}
            demoQuestions={demoQuestions}
          />
        </div>
        <div className="pdf-column">
          <PDFViewer page={page} />
        </div>
      </div>
    </>
  )
}

export default Demo