import { useState, useEffect } from 'react'

function QuestionBox({
    selectedQuestionText = "", demo = false, setAskedQuestion, disableButton
}) {
    const [questionText, setQuestionText] = useState("");
    useEffect(() => {
        if (demo) {
            setQuestionText(selectedQuestionText);
        } else {
            setQuestionText(questionText)
        }
    }, [demo, selectedQuestionText]);

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
                    disabled={demo}
                    value={questionText}
                    onChange={handleChange}
                    rows={3}
                    cols={40}
                />
                <br />
                <button disabled={disableButton} onClick={(e) => answerQuestion(e) }>Ask</button>
            </div>
        )

}

export default QuestionBox
