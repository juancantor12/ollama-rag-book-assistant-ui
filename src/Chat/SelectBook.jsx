import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { getFile, useGet, paths } from '../Api/Api.jsx'

function SelectBook({setBook}) {
    const books = ["iama4.pdf", "TheEmperorsNewMind.pdf", "TheRoadToReality.pdf"]
    const {
        refetch: refetchLoadBooks,
        isSuccess: isSuccessLoadBooks,
        data: dataLoadBooks,
    } = useGet({path: paths.books.load, retries: 0, credentials: true })

    useEffect(()=>{
        refetchLoadBooks()
    }, [])

    const handleChange = async (e) => {
        if (e.target.value === ""){
            return
        }
        const pdf = await getFile(`/data/${e.target.value}`)
        setBook({filename: e.target.value, pdf})
    }
    return (
            <div className="card">
                <select onChange={handleChange}>
                    <option value="" >..Select a book</option>
                    {isSuccessLoadBooks &&
                        dataLoadBooks.map((book, index)=>{
                            if (book.embeddings){
                                return (<option value={book.book} key={index}>{book.book}</option>)
                            } else {
                                return null
                            }
                        })
                    }
                </select>
            </div>
        )

}

export default SelectBook
