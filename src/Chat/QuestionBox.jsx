import { useState, useEffect } from 'react'

function QuestionBox({
    selectedQuestionText = "", demo = false, setAskedQuestion, disableButton, questionText, setQuestionText
}) {
    useEffect(() => {
        if (demo) {
            setQuestionText(selectedQuestionText)
        } else {
            setQuestionText(questionText)
        }
    }, [demo, selectedQuestionText])

    const answerQuestion = function(e) {
        e.preventDefault()
        setAskedQuestion(questionText)
    }

    const handleChange = (e) => {
        setQuestionText(e.target.value)
    }

    return (
            <div className="card-inn">
                 <textarea 
                    name="question"
                    className="question-box"
                    disabled={demo || disableButton}
                    value={questionText}
                    onChange={handleChange}
                    rows={4}
                    cols={40}
                />
                <br />
                <button disabled={disableButton} onClick={(e) => answerQuestion(e) }>Ask</button>
            </div>
        )

}

export default QuestionBox
