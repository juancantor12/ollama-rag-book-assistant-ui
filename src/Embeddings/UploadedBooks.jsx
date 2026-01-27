import { useState, useEffect } from 'react'
import { useGet, useGenerateEmbeddings, paths } from "../Api/Api.jsx"

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

    const GenerateEmbeddingsButton = ({ book, hasEmbeddings }) => {
        const [done, setDone] = useState(false)
        const [generating, setGenerating] = useState(false)
        const { progress, isError: progressError, generateEmbeddings } = useGenerateEmbeddings()
        const handleGenerate = (e, book) => {
            e.preventDefault()
            setGenerating(true)
            setDone(false)
            generateEmbeddings(book)
        }
        useEffect(()=>{
            if (progress === "done"){
                setDone(true)
                setGenerating(false)
            } else {
                setDone(false)
            }
        }, [progress])
        const showGenerated = done || hasEmbeddings
        return (
            generating ? (
                <span>{progress}</span>
            ) : (
                showGenerated ? (
                    <span>
                        Generated. <button onClick={(e) => handleGenerate(e, book)}>Regenerate</button>
                    </span>
                ) : (
                    <button onClick={(e) => handleGenerate(e, book)}>Generate</button>
                )
            )
        )
    }

    const Table = () => {
        return (
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th width="80%">Book</th>
                        <th width="20%">Embeddings DB</th>
                    </tr>
                </thead>
                <tbody>
                  {dataLoadBooks.map((book, index) => (
                    <tr key={index}>
                      <td>{book.book}</td>
                      <td>
                        <GenerateEmbeddingsButton
                            book={book.book}
                            hasEmbeddings={book.embeddings}
                        />
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
