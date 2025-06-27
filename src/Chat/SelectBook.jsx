import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { getPdf, useLoadBooks } from '../Api/Api.jsx'

function SelectBook({setBook}) {
    const books = ["iama4.pdf", "TheEmperorsNewMind.pdf", "TheRoadToReality.pdf"]
    const {
        isSuccess: isSuccessLoadBooks,
        data: dataLoadBooks,
    } = useLoadBooks()

    const handleChange = async (e) => {
        if (e.target.value === ""){
            return
        }
        const pdf = await getPdf(e.target.value)
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
