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

    const {
        mutate: mutateGenerateEmbeddings,
        isLoading: isLoadingGenerateEmbeddings,
        isSuccess: isSuccessGenerateEmbeddings,
        data: dataGenerateEmbeddings,
        isError: isErrorGenerateEmbeddings,
        error: errorGenerateEmbeddings
    } = useUploadBook()

    useEffect(()=>{
        if(isSuccessLoadBooks === true){
            console.log(dataLoadBooks)
        }
    }, [isSuccessLoadBooks])

    useEffect(()=>{
        if(isErrorLoadBooks === true){
            setMsg("There was an error loading the uploaded books.")
        }
    }, [isErrorLoadBooks])
    const handleGenerate = (e, book) => {
        e.preventDefault()
        console.log("generating Embeddings of ", book)
        // mutateGenerateEmbeddings(book)
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
                        <button onClick={(e)=>handleGenerate(e, book.book)}>Generate</button>
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