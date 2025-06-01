import { useState, useEffect, useRef } from 'react'
// import Spinner from './Spinner.jsx'

function Chat({ setPage, demoQuestions }) {

     
    
    return (
        <>
            <div className="card" >
                {questionSelect}
                {questionBox}
            </div>
            <div className="disclaimer card small"><Spinner ref={spinnerRef} />&nbsp;{message}</div>
            <div className="card" >
                {answer}
            </div>
        </>
    )
}

export default Chat