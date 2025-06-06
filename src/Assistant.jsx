import { useState, useEffect, useRef } from 'react'
import demoQuestions from './Demo/DemoQuestions.jsx'
import PDFViewer from './Utils/PDFViewer.jsx'
import Spinner from './Utils/Spinner.jsx'
import QuestionBox from './Chat/QuestionBox.jsx'
import Answer from './Chat/Answer.jsx'
import Header from './Utils/Header.jsx'

function Assistant() {
    const [page, setPage] = useState(1)
    const [message, setMessage] = useState("")
    const [askedQuestion, setAskedQuestion] = useState("")
    const [llmResponse, setllmResponse] = useState(demoQuestions[0])
    const [searchText, setSearchText] = useState("")
    const spinnerRef = useRef();
    useEffect(() => {
        if (llmResponse.references.length > 0) {
            setPage(llmResponse.references[0].pages[1])
        }
    }, [llmResponse])

    useEffect(() => {
        // setllmResponse(demoQuestions[0])
        // if (askedQuestion == "") {
        //     setMessage("Please provide a question.")
        //     return
        // }
        console.log("calling api")
        const apiUrl = import.meta.env.VITE_API_URL
        const fetchData = async () => {
            const response = await fetch(apiUrl + "/ask/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({book_filename: "mybook", question: "myquestion"}),
                credentials: 'include'
            });
        }
        fetchData();
        // spinnerRef.current.start();
        // setMessage("Recollecting relevant documents...")
        // setTimeout(function() {
        //     setMessage("Qerying the LLM with relevant documents...")
        //     setTimeout(function() {
        //         spinnerRef.current.stop();
        //         setMessage("Answer successfully retrieved.")
        //         // setllmResponse(demoQuestions[selectedQuestionId])
        //      }, 1500); 
        //  }, 1000);
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