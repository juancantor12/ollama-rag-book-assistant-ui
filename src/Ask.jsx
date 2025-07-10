import { useState, useEffect, useRef } from 'react'
import demoQuestions from './Demo/DemoQuestions.jsx'
import useCheckSession from './Utils/useCheckSession.jsx'
import Header from './Utils/Header.jsx'
import PDFViewer from './Utils/PDFViewer.jsx'
import Spinner from './Utils/Spinner.jsx'
import SelectBook from './Chat/SelectBook.jsx'
import QuestionBox from './Chat/QuestionBox.jsx'
import Answer from './Chat/Answer.jsx'
import { usePost } from "./Api/Api.jsx"
import Navbar from './Utils/Navbar.jsx'

function Ask() {
    const {
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = useCheckSession(true)
    const [page, setPage] = useState(1)
    const [questionText, setQuestionText] = useState("")
    const [message, setMessage] = useState("")
    const [askedQuestion, setAskedQuestion] = useState("")
    const [llmResponse, setllmResponse] = useState(demoQuestions[0])
    const [searchText, setSearchText] = useState("")
    const [disableButton, setDisableButton] = useState(true)
    const [book, setBook] = useState({filename: "", pdf: null})
    const sessionChecked = useRef(false)
    const spinnerRef = useRef()
    const {
        mutate: mutateAsk,
        isLoading: isLoadingAsk,
        isSuccess: isSuccessAsk,
        data: dataAsk,
        isError: isErrorAsk,
        error: errorAsk
    } = usePost()

    useEffect(() => {
        if (llmResponse.references.length > 0) {
            setPage(llmResponse.references[0].pages[1])
        }
    }, [llmResponse])

    useEffect(() => {
        if (isSuccessAsk === true) {
            spinnerRef.current.stop()
            setllmResponse(dataAsk)
            setMessage("Answer successfully retrieved.")
            setDisableButton(false)
        }
    }, [isSuccessAsk])

    useEffect(() => {
        setllmResponse(demoQuestions[0])
        if (askedQuestion == "") {
            setMessage("Please provide a question.")
            return
        }
        spinnerRef.current.start()
        setMessage("Recollecting relevant documents and asking the LLM...")
        setDisableButton(true)
        mutateAsk({
            path: "/ask/",
            data: {
                book_filename: book.filename,
                question: askedQuestion
            },
            credentials: true
        })
    }, [askedQuestion])

    useEffect(() => {
        if (book.filename !== ""){
            setDisableButton(false)
            setPage(1)
            setQuestionText("")
            setllmResponse(demoQuestions[0])
        }
    }, [book])

    return (
        <>
            <Header />
            {isSuccessCheckSession && <Navbar data={dataCheckSession}/>}
            <SelectBook setBook={setBook}/>
            <div className="row">
                <div className="chat-column card">
                    <QuestionBox 
                        selectedQuestionText={null}
                        demo={false}
                        setAskedQuestion={setAskedQuestion}
                        disableButton={disableButton}
                        questionText={questionText}
                        setQuestionText={setQuestionText}
                    />
                    <div className="disclaimer card small">
                        <Spinner ref={spinnerRef} />&nbsp;{message}
                    </div>
                    <Answer llmResponse={llmResponse} setPage={setPage}/>
                </div>
                <div className="pdf-column">
                    <PDFViewer 
                        file={book.pdf}
                        page={page}
                        setPage={setPage}
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />
                </div>
            </div>
        </>
    )
}

export default Ask