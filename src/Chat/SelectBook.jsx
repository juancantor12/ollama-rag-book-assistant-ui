import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { getPdf } from '../Api/Api.jsx'

function SelectBook({setBook}) {
    const books = ["iama4.pdf", "TheEmperorsNewMind.pdf", "TheRoadToReality.pdf"]
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
                    {books.map((book, index)=>(
                            <option value={book} key={index}>{book}</option>
                        )
                    )}
                </select>
            </div>
        )

}

export default SelectBook
