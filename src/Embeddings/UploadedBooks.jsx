import { useState, useEffect } from 'react'
import { NavLink } from "react-router"
import { useGet, useGenerateEmbeddings, paths } from "../Api/Api.jsx"
const base = import.meta.env.VITE_ENV === "local" ? "" : "/"+import.meta.env.VITE_REPO

function UploadedBooks ({ _ }) {
    const [msg, setMsg] = useState('')
    const {
        refetch: refetchLoadBooks,
        isSuccess: isSuccessLoadBooks,
        data: dataLoadBooks,
        isError: isErrorLoadBooks
    } = useGet({path: paths.books.load, retries: 0, credentials: true })

    useEffect(()=>{
        if(isErrorLoadBooks === true){
            setMsg("There was an error loading the uploaded books.")
        }
    }, [isErrorLoadBooks])

    useEffect(()=>{
        refetchLoadBooks()
    }, [])

    const GenerateEmbeddingsButton = ({ book, progress }) => {
        const [generating, setGenerating] = useState(false)
        const { progress: liveProgress, generateEmbeddings } = useGenerateEmbeddings()
        const handleGenerate = (e, book, resume = false) => {
            e.preventDefault()
            setGenerating(true)
            generateEmbeddings(book, { resume })
        }
        useEffect(()=>{
            if (liveProgress === "done"){
                setGenerating(false)
            }
        }, [liveProgress])
        const isComplete = progress?.is_complete ?? false
        const hasCheckpoint = progress?.has_checkpoint ?? false
        const buttonLabel = isComplete ? "Regenerate" : hasCheckpoint ? "Resume" : "Generate"
        const shouldResume = !isComplete && hasCheckpoint
        return (
            generating ? (
                <span>{liveProgress}</span>
            ) : (
                <button onClick={(e) => handleGenerate(e, book, shouldResume)}>
                    {buttonLabel}
                </button>
            )
        )
    }

    const Table = () => {
        return (
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th width="60%">Book</th>
                        <th width="15%">Progress</th>
                        <th width="15%">Embeddings</th>
                        <th width="10%">Details</th>
                    </tr>
                </thead>
                <tbody>
                  {dataLoadBooks.map((book, index) => (
                    <tr key={index}>
                      <td>{book.book}</td>
                      <td>
                        {book.progress?.page_count ? (
                            <>
                                <progress
                                    value={
                                        Math.min(
                                            100,
                                            Math.round(
                                                (book.progress.parsed_pages / book.progress.page_count) * 100
                                            )
                                        )
                                    }
                                    max="100"
                                />
                                {" "}
                                {book.progress.parsed_pages} / {book.progress.page_count}
                            </>
                        ) : "-"}
                      </td>
                      <td>
                        <GenerateEmbeddingsButton
                            book={book.book}
                            progress={book.progress}
                        />
                      </td>
                      <td>
                        <NavLink className="button-link" to={`${base}/book_details/${encodeURIComponent(book.book)}`}>
                            Details
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
          </table>
        )
    }
    return (
        <>
            {isSuccessLoadBooks && <Table />}
            {isErrorLoadBooks && <div className="card warn">{msg}</div>}
        </>
    )
}

export default UploadedBooks
