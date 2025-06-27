import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

function SelectBook({setBook}) {
    const books = ["book1", "book2"]
    const handleChange = (e) => {
        setBook(e.target.value)
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
