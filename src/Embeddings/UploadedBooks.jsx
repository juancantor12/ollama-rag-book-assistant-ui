import { useState, useEffect } from 'react'
import { useLoadBooks, useGenerateEmbeddings } from "../Api/Api.jsx"

function UploadedBooks ({ _ }) {
    const [msg, setMsg] = useState('')
    const {
        refetch: refetchLoadBooks,
        isSuccess: isSuccessLoadBooks,
        data: dataLoadBooks,
        isError: isErrorLoadBooks,
    } = useLoadBooks()
    useEffect(()=>{
        if(isErrorLoadBooks === true){
            setMsg("There was an error loading the uploaded books.")
        }
    }, [isErrorLoadBooks])

    const GenerateEmbeddingsButton = ({ book }) => {
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
        return (
            done ? "✓" : (
                generating ? <span>{progress}</span> : <button onClick={(e) => handleGenerate(e, book)} >Generate</button>
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
                      <td>{book.embeddings ? "✓" : (
                            <GenerateEmbeddingsButton book={book.book}/>
                        )}
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
