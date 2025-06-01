import { useState, useEffect } from 'react'

function Answer({ llmResponse, setPage }) {
    const referencesList = llmResponse.references.map( (reference, index) =>
        <li
            key={index}
            onClick={() => setPage(reference.page)}
        > {reference.section} (page {reference.page})
        </li>
    )

    return (
            <div className="card-inn">
                <h5>Answer</h5>
                <p>{llmResponse.answer}</p>
                <h5>Sources: </h5>
                <ul className="cited-pages">{referencesList}</ul>
                <div className="card small disclaimer">Click on a page to navigate to it on the right panel</div>
            </div>
        )

}

export default Answer
