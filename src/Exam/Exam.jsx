import { useEffect, useState } from 'react'
import CodeEditor from '@uiw/react-textarea-code-editor'
import Header from '../Utils/Header.jsx'
import Navbar from '../Utils/Navbar.jsx'
import useCheckSession from '../Utils/useCheckSession.jsx'
import { useGet, usePost, paths } from '../Api/Api.jsx'

const apiUrl = import.meta.env.VITE_API_URL

function Exam() {
    const {
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = useCheckSession(true)

    const [book, setBook] = useState("")
    const [options, setOptions] = useState({ chapters: [] })
    const [selectedChapter, setSelectedChapter] = useState("")
    const [difficulty, setDifficulty] = useState("medium")
    const [exam, setExam] = useState(null)
    const [answers, setAnswers] = useState({})
    const [feedback, setFeedback] = useState({})
    const [attemptsLeft, setAttemptsLeft] = useState({})
    const [message, setMessage] = useState("")
    const [examLoading, setExamLoading] = useState(false)
    const [showContext, setShowContext] = useState(false)

    const {
        refetch: refetchLoadBooks,
        isSuccess: isSuccessLoadBooks,
        data: dataLoadBooks
    } = useGet({ path: paths.books.load, retries: 0, credentials: true })

    const {
        mutate: mutateGenerate,
        isLoading: isLoadingGenerate,
        isSuccess: isSuccessGenerate,
        data: dataGenerate,
        isError: isErrorGenerate,
        error: errorGenerate
    } = usePost()

    useEffect(() => {
        refetchLoadBooks()
    }, [])

    useEffect(() => {
        if (isSuccessGenerate) {
            const rawQuestions = Array.isArray(dataGenerate?.questions)
                ? dataGenerate.questions
                : dataGenerate?.question
                    ? [dataGenerate.question]
                    : []
            const shuffled = {
                ...dataGenerate,
                questions: rawQuestions.map((question, index) => {
                    const withId = {
                        ...question,
                        id: question.id ? `${question.id}-${index}` : `q-${index + 1}`
                    }
                    if (question.type !== "multiple_choice") {
                        return withId
                    }
                    const choices = Array.isArray(question.choices) ? question.choices : []
                    const indices = choices.map((_, idx) => idx)
                    for (let i = indices.length - 1; i > 0; i -= 1) {
                        const j = Math.floor(Math.random() * (i + 1))
                        ;[indices[i], indices[j]] = [indices[j], indices[i]]
                    }
                    const shuffledChoices = indices.map((idx) => choices[idx])
                    const shuffledAnswerIndex = indices.indexOf(question.answer_index)
                    return {
                        ...withId,
                        shuffledChoices,
                        shuffledAnswerIndex
                    }
                })
            }
            setExam(shuffled)
            setAnswers({})
            setFeedback({})
            const attempts = {}
            const initialAnswers = {}
            shuffled.questions.forEach((question) => {
                if (question.type === "open_text" || question.type === "code_fill") {
                    attempts[question.id] = 3
                }
                if (question.type === "code_fill" && question.code_prompt) {
                    initialAnswers[question.id] = question.code_prompt
                }
            })
            setAnswers(initialAnswers)
            setAttemptsLeft(attempts)
            setExamLoading(false)
            setMessage("Exam generated.")
        }
    }, [isSuccessGenerate])

    useEffect(() => {
        if (isErrorGenerate) {
            setExamLoading(false)
            setMessage(`Exam generation failed (${errorGenerate}).`)
        }
    }, [isErrorGenerate, errorGenerate])

    const fetchOptions = async (bookFilename) => {
        try {
            const response = await fetch(`${apiUrl}${paths.exam.options}${bookFilename}`, {
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error("Failed to load exam options.")
            }
            const data = await response.json()
            setOptions({ chapters: data.chapters || [] })
            setSelectedChapter("")
            setSelectedChapter("")
        } catch (err) {
            setMessage(err.message || "Failed to load exam options.")
        }
    }

    const handleBookChange = (e) => {
        const value = e.target.value
        setBook(value)
        setExam(null)
        setFeedback({})
        setMessage("")
        if (value) {
            fetchOptions(value)
        }
    }

    const handleGenerate = (e) => {
        e.preventDefault()
        if (!book) {
            setMessage("Select a book first.")
            return
        }
        if (!selectedChapter) {
            setMessage("Select a chapter.")
            return
        }
        setMessage("Generating exam...")
        setExamLoading(true)
        const payload = {
            book_filename: book,
            mode: "chapter",
            difficulty,
            chapter_numbers: [selectedChapter]
        }
        mutateGenerate({ path: paths.exam.generate, data: payload, credentials: true })
    }

    const handleAnswerChange = (qid, index) => {
        setAnswers((prev) => ({ ...prev, [qid]: index }))
    }

    const handleCheck = async (question) => {
        if (question.type === "open_text") {
            const textAnswer = answers[question.id]
            if (!textAnswer || textAnswer.trim() === "") {
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status: "empty", message: "Write an answer first." }
                }))
                return
            }
            const left = attemptsLeft[question.id] ?? 3
            if (left <= 0) {
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status: "wrong", message: "No attempts left." }
                }))
                return
            }
            try {
                const response = await fetch(`${apiUrl}${paths.exam.evaluate}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        question: question.question,
                        expected_answer: question.expected_answer,
                        user_answer: textAnswer,
                        context: question.context || ""
                    })
                })
                if (!response.ok) {
                    throw new Error("Evaluation failed.")
                }
                const data = await response.json()
                const status = data.status || "incorrect"
                const feedbackMsg = data.feedback || (status === "correct" ? "Correct." : "Try again.")
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status, message: feedbackMsg }
                }))
                if (status !== "correct") {
                    setAttemptsLeft((prev) => ({
                        ...prev,
                        [question.id]: Math.max(0, left - 1)
                    }))
                }
                return
            } catch (err) {
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status: "wrong", message: "Evaluation failed." }
                }))
                return
            }
        }
        if (question.type === "code_fill") {
            const codeAnswer = answers[question.id]
            if (!codeAnswer || codeAnswer.trim() === "") {
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status: "empty", message: "Write the missing code first." }
                }))
                return
            }
            const left = attemptsLeft[question.id] ?? 3
            if (left <= 0) {
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status: "wrong", message: "No attempts left." }
                }))
                return
            }
            try {
                const response = await fetch(`${apiUrl}${paths.exam.evaluateCode}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        code: codeAnswer,
                        function_name: question.function_name,
                        tests: question.tests || []
                    })
                })
                if (!response.ok) {
                    throw new Error("Evaluation failed.")
                }
                const data = await response.json()
                const status = data.status || "incorrect"
                const feedbackMsg = data.feedback || (status === "correct" ? "Correct." : "Try again.")
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status, message: feedbackMsg }
                }))
                if (status !== "correct") {
                    setAttemptsLeft((prev) => ({
                        ...prev,
                        [question.id]: Math.max(0, left - 1)
                    }))
                }
                return
            } catch (err) {
                setFeedback((prev) => ({
                    ...prev,
                    [question.id]: { status: "wrong", message: "Evaluation failed." }
                }))
                return
            }
        }
        const selected = answers[question.id]
        if (selected === undefined) {
            setFeedback((prev) => ({
                ...prev,
                [question.id]: { status: "empty", message: "Select an answer first." }
            }))
            return
        }
        if (selected === question.shuffledAnswerIndex) {
            setFeedback((prev) => ({
                ...prev,
                [question.id]: { status: "correct", message: question.explanation || "Correct." }
            }))
            return
        }
        setFeedback((prev) => ({
            ...prev,
            [question.id]: { status: "wrong", message: question.hint || "Try again." }
        }))
    }

    return (
        <>
            <Header />
            {isSuccessCheckSession && <Navbar data={dataCheckSession} />}
            <div className="card exam-form">
                <h3>Exam</h3>
                <div className="exam-field">
                    <label>Book</label>
                    <select value={book} onChange={handleBookChange}>
                        <option value="">..Select a book</option>
                        {isSuccessLoadBooks && dataLoadBooks
                            .filter((item) => item.embeddings)
                            .map((item, idx) => (
                                <option key={idx} value={item.book}>
                                    {item.book}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="exam-field">
                    <label>Chapter</label>
                    <select
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                    >
                        <option value="">..Select a chapter</option>
                        {options.chapters.map((chapter, idx) => (
                            <option key={idx} value={chapter.number}>
                                {"-- ".repeat(Math.max(0, (chapter.level || 1) - 1))}
                                {chapter.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="exam-controls">
                    <div className="exam-field">
                        <label>Difficulty</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoadingGenerate || examLoading}>
                        {isLoadingGenerate || examLoading ? "Generating..." : "Generate exam"}
                    </button>
                </div>
                {message && (
                    <div className="disclaimer card small exam-status">
                        {examLoading ? "⡷ " : ""}{message}
                    </div>
                )}
            </div>

            {exam && (
                <div className="card">
                    <h3>Questions</h3>
                    {exam.questions.map((question, idx) => (
                        <div className="card small exam-question" key={question.id}>
                            <div className="exam-question-text">
                                {idx + 1}. {question.question}
                            </div>
                            <div className="exam-meta">
                                Topic: {question.topic || "General"}
                            </div>
                            {question.sources && question.sources.length > 0 &&
                                question.sources.some((source) =>
                                    (source.sections && source.sections.length > 0) ||
                                    (source.pages && source.pages.length > 0)
                                ) && (
                                <div className="exam-sources card">
                                    <div><strong>Sources</strong></div>
                                    {question.sources.map((source, sidx) => (
                                        <div key={sidx}>
                                            {source.sections && source.sections.length > 0 && (
                                                <div>Sections: {source.sections.join(", ")}</div>
                                            )}
                                            {source.pages && source.pages.length > 0 && (
                                                <div>
                                                    Pages: {
                                                        source.pages.length > 4
                                                            ? `${source.pages[0]}-${source.pages[source.pages.length - 1]}`
                                                            : source.pages.join(", ")
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {question.type === "open_text" ? (
                                <div className="exam-open">
                                    <textarea
                                        value={answers[question.id] || ""}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        rows="4"
                                        placeholder="Write your answer..."
                                    />
                                    <div className="exam-attempts">
                                        Attempts left: {attemptsLeft[question.id] ?? 3}
                                    </div>
                                </div>
                            ) : question.type === "code_fill" ? (
                                <div className="exam-open">
                                    <CodeEditor
                                        value={answers[question.id] || question.code_prompt || ""}
                                        language="python"
                                        placeholder="Complete the code..."
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        padding={12}
                                        data-color-mode="light"
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
                                            backgroundColor: "#f7f7f7",
                                            border: "1px solid var(--medium-dark)",
                                            borderRadius: "6px"
                                        }}
                                    />
                                    <div className="exam-attempts">
                                        Attempts left: {attemptsLeft[question.id] ?? 3}
                                    </div>
                                </div>
                            ) : (
                                <div className="exam-choices">
                                    {(question.shuffledChoices || question.choices || []).map((choice, choiceIdx) => (
                                        <label className="exam-choice" key={choiceIdx}>
                                            <input
                                                type="radio"
                                                name={`q-${question.id}`}
                                                checked={answers[question.id] === choiceIdx}
                                                onChange={() => handleAnswerChange(question.id, choiceIdx)}
                                            />
                                            <span>{choice}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            <button
                                className="exam-check"
                                onClick={() => handleCheck(question)}
                                disabled={(question.type === "open_text" || question.type === "code_fill") && feedback[question.id]?.status === "correct"}
                            >
                                Check
                            </button>
                            {feedback[question.id] && (
                                <div className={`card exam-feedback ${feedback[question.id].status}`}>
                                    {feedback[question.id].message}
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={() => setShowContext(true)}>See context</button>
                </div>
            )}
            {showContext && exam && (
                <div className="popup-overlay" onClick={() => setShowContext(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Exam context</h3>
                        <pre className="exam-context">
                            {Array.isArray(exam.prompts) ? exam.prompts.join("\n\n---\n\n") : (exam.prompt || "No context available.")}
                        </pre>
                        <button onClick={() => setShowContext(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Exam
