import { useState, useEffect } from 'react'

function QuestionBox({
    selectedQuestionText = "", demo = false, setAskedQuestion
}) {
    const [questionText, setQuestionText] = useState("");
    useEffect(() => {
        if (demo) {
            setQuestionText(selectedQuestionText);
        }
    }, [demo, selectedQuestionText]);

    const answerQuestion = function(e) {
        e.preventDefault()
        setAskedQuestion(questionText)
    }

    const TextArea = function() {
        return (
            <textarea 
                name="question"
                className="question-box"
                disabled={demo}
                value={demo && selectedQuestionText}
                // onChange={(e) => setQuestionText(e.target.value)}
            />
        )
    }

    return (
            <div className="card-inn">
                <TextArea />
                <br />
                <button onClick={(e) => answerQuestion(e) }>Ask</button>
            </div>
        )

}

export default QuestionBox
