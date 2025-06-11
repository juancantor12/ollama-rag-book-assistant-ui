import { useState, useEffect } from 'react'
import { useUploadBook } from "../Api/Api.jsx"

function UploadBookForm ({ _ }) {
    const [file, setFile] = useState(null)
    const [msg, setMsg] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [formError, setFormError] = useState(false)
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const {
        mutate: mutateUploadBook,
        isLoading: isLoadingUploadBook,
        isSuccess: isSuccessUploadBook,
        data: dataUploadBook,
        isError: isErrorUploadBook,
        error: errorUploadBook
    } = useUploadBook()

    const handleUpload = async (e) => {
        e.preventDefault()
        setDisabled(true)
        const formData = new FormData()
        formData.append('file', file)
        if(file === null){
            setFormError(true)
            setMsg("Please select a valid file")
            setDisabled(false)
            return
        } else {
            setFormError(false)
            mutateUploadBook(formData)
        }
        
    }
    useEffect(()=>{
        if(isSuccessUploadBook === true){
            setMsg("Book succesfully uploaded. Embeddings database can now be generated.")
        }
        setDisabled(false)
    }, [isSuccessUploadBook])

    useEffect(()=>{
        if(isErrorUploadBook === true){
            setMsg("The book upload was not succesfull. Please try again later or contact an administrator.")
        }
        setDisabled(false)
    }, [isErrorUploadBook])

    return (
        <>
            <div>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <br />
                <button disabled={disabled} required onClick={(e) => handleUpload(e)}>Upload Book</button>
            </div>
            {isSuccessUploadBook && <div className="card disclaimer">{msg}</div>}
            {isErrorUploadBook || formError && <div className="card warn">{msg}</div>}
        </>
    )
}

export default UploadBookForm