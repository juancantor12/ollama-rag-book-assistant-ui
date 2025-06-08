import { useState, useEffect, useRef } from 'react'
import demoQuestions from './Demo/DemoQuestions.jsx'
import useCheckSession from './Utils/useCheckSession.jsx'
import Header from './Utils/Header.jsx'
import PDFViewer from './Utils/PDFViewer.jsx'
import Spinner from './Utils/Spinner.jsx'
import QuestionBox from './Chat/QuestionBox.jsx'
import Answer from './Chat/Answer.jsx'
import { useAsk } from "./Api/Api.jsx"

function Assistant() {
    useCheckSession()
    const [page, setPage] = useState(1)
    const [message, setMessage] = useState("")
    const [askedQuestion, setAskedQuestion] = useState("")
    const [llmResponse, setllmResponse] = useState(demoQuestions[0])
    const [searchText, setSearchText] = useState("")
    const [disableButton, setDisableButton] = useState(false)
    const sessionChecked = useRef(false);
    const spinnerRef = useRef();
    const {
        mutate: mutateAsk,
        isLoading: isLoadingAsk,
        isSuccess: isSuccessAsk,
        data: dataAsk,
        isError: isErrorAsk,
        error: errorAsk
    } = useAsk()

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
        spinnerRef.current.start();
        setMessage("Recollecting relevant documents and asking the LLM...")
        setDisableButton(true)
        mutateAsk({book_filename: "iama4.pdf", question: askedQuestion})
    }, [askedQuestion])

    return (
        <>
            <Header />
            <div className="row">
                <div className="chat-column card">
                    <QuestionBox 
                        selectedQuestionText={null}
                        demo={false}
                        setAskedQuestion={setAskedQuestion}
                        disableButton={disableButton}
                    />
                    <div className="disclaimer card small">
                        <Spinner ref={spinnerRef} />&nbsp;{message}
                    </div>
                    <Answer llmResponse={llmResponse} setPage={setPage}/>
                </div>
                <div className="pdf-column">
                    <PDFViewer 
                        page={page}
                        setPage={setPage}
                        llmResponse={llmResponse}
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />
                </div>
            </div>
        </>
    )
}

export default Assistant