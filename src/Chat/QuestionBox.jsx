import { useState, useEffect } from 'react'

function QuestionBox({
    selectedQuestionText = "", demo = false, setAskedQuestion
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

    const TextArea = function() {
        return (
            <textarea 
                name="question"
                className="question-box"
                disabled={demo}
                value={questionText}
                onChange={handleChange}
                rows={3}
                cols={40}
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
