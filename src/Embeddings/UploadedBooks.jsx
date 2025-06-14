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
    // TODO: Progress needs to be an array so each button can be referenced individually 
    const { progress, isError: progressError, generateEmbeddings } = useGenerateEmbeddings();

    useEffect(()=>{
        if(isErrorLoadBooks === true){
            setMsg("There was an error loading the uploaded books.")
        }
    }, [isErrorLoadBooks])

    useEffect(()=>{
        console.log(progress)
    }, [progress])
    const handleGenerate = (e, book) => {
        e.preventDefault()
        generateEmbeddings(book)
    }
    const Table = () => {
        return (
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th width="100%">Book</th>
                        <th>Embeddings DB</th>
                    </tr>
                </thead>
                <tbody>
                  {dataLoadBooks.map((book, index) => (
                    <tr key={index}>
                      <td>{book.book}</td>
                      <td>{book.embeddings ? "✓" : (
                        <button onClick={(e)=>handleGenerate(e, book.book)}>{progress}</button>
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
