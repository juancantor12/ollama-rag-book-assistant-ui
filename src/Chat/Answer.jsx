import { useState, useEffect } from 'react'

function Answer({ llmResponse, setPage }) {
    const referencesList = llmResponse.references.map( (reference, index) =>
        <li
            key={index}
        > {reference.section} (pages {
            reference.pages.map( (page, index) => 
                <a key={index} className="d-inline" onClick={() => setPage(page)} >{page} </a>
            )
        })
        </li>
    )

    return (
            <div className="card-inn">
                <h5>Answer</h5>
                <p className="answer">{llmResponse.answer}</p>
                <h5>Sources: </h5>
                <ul className="cited-pages">{referencesList}</ul>
                <div className="card small disclaimer">Click on a page to navigate to it on the right panel</div>
            </div>
        )

}

export default Answer
