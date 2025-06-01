import { useState, useEffect, useRef } from 'react'
import demoQuestions from './DemoQuestions.jsx'
import PDFViewer from '../Utils/PDFViewer.jsx'
import Spinner from '../Utils/Spinner.jsx'
import QuestionBox from '../Chat/QuestionBox.jsx'
import Answer from '../Chat/Answer.jsx'

function Demo() {
    const [page, setPage] = useState(1)
    const [selectedQuestionId, setSelectedQuestionId] = useState(0)
    const [selectedQuestionText, setSelectedQuestionText] = useState(demoQuestions[0].text)
    const [message, setMessage] = useState("")
    const [askedQuestion, setAskedQuestion] = useState("")
    const [llmResponse, setllmResponse] = useState({answer: "", references: []})
    const spinnerRef = useRef();

    useEffect(() => {
        setSelectedQuestionText(demoQuestions[selectedQuestionId].text)
    }, [selectedQuestionId])

    useEffect(() => {
        if (askedQuestion == "") {
            setMessage("Please provide a question.")
            return
        }
        spinnerRef.current.start();
        setMessage("Recollecting relevant documents...")
        setTimeout(function() {
            setMessage("Qerying the LLM with relevant documents...")
            setTimeout(function() {
                spinnerRef.current.stop();
                setMessage("Answer successfully retrieved.")
                // console.log(selectedQuestionId)
                setllmResponse({
                    answer: demoQuestions[selectedQuestionId].answer,
                    references: demoQuestions[selectedQuestionId].references
                })
             }, 5000); 
         }, 3500);
    }, [askedQuestion])

    const predefinedQuestionsLi = ( demoQuestions.map( questionObj =>
            <option key={questionObj.id} value={questionObj.id}> {questionObj.text} </option>
        )
    )
    const questionSelect = (
        <div className="card-inn">
            Select a predefined question:
            <select onChange={(e) => setSelectedQuestionId(e.target.value)}>{predefinedQuestionsLi}</select>
        </div>
    )

    return (
        <>
            <div className="card disclaimer">
                On this demo you might choose a predefined question on a specific book, 
                on the real app of course you can choose/provide the book and ask your
                own question, the result will look like this:
            </div>
            <div className="row">
                <div className="chat-column card">
                    {questionSelect}
                    <QuestionBox 
                        selectedQuestionText={selectedQuestionText}
                        demo={true}
                        setAskedQuestion={setAskedQuestion}
                    />
                    <div className="disclaimer card small">
                        <Spinner ref={spinnerRef} />&nbsp;{message}
                    </div>
                    <Answer llmResponse={llmResponse} setPage={setPage}/>
                </div>
                <div className="pdf-column">
                    <PDFViewer page={page} />
                </div>
            </div>
        </>
    )
}

export default Demo