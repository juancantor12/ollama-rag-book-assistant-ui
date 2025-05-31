import { useState, useEffect } from 'react'

function Chat({ setPage, demoQuestions }) {
  const [question, setQuestion] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState(0);
  const [setSelectedQuestionText, setSetSelectedQuestionText] = useState(demoQuestions[0].text);
  const [message, setMessage] = useState("");
  // const spinnerChars = ["⣿", "⢿", "⣻", "⣽", "⣾", "⣷", "⣯", "⣟", "⡿"];
  const spinnerChars = ["⡀", "⣀", "⣄", "⣤", "⣴", "⣶", "⣷", "⣿", "⢿", "⠿", "⠟", "⠛", "⠙", "⠉", "⠈"];
  const [spinner, setSpinner] = useState("⡷");

  useEffect(() => {
    setSetSelectedQuestionText(demoQuestions[selectedQuestionId].text);
  }, [selectedQuestionId]);

  const answerQuestion = function(e, questionId) {
    e.preventDefault();
    setQuestion(0);
    if (questionId == 0) {
      setMessage("Please select a demo question.");
      return
    }
    // Spinner
    let spinnerIndex = 0;
    const spinnerInterval = setInterval(() => {
      setSpinner(spinnerChars[spinnerIndex]);
      spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
    }, 100);

    setMessage("Recollecting relevant documents...")
    setTimeout(function() {
      setMessage("Qerying the LLM with relevant documents...")
      setTimeout(function() {
        clearInterval(spinnerInterval);
        setSpinner("⡷")
        setMessage("Answer successfully retrieved.")
        setQuestion(selectedQuestionId)
       }, 5000); 
     }, 3500); 
  }
  const predefinedQuestions = ( demoQuestions.map( questionObj =>
      <option key={questionObj.id} value={questionObj.id}> {questionObj.text} </option>
    )
  );
  const questionSelect = (
    <div>
      Select a predefined question:
      <select onChange={(e) => setSelectedQuestionId(e.target.value)}>{predefinedQuestions}</select>
    </div>
  );
  const questionBox = (
      <>
        <textarea 
          name="question"
          className="question-box"
          disabled
          value={setSelectedQuestionText}
        />
        <br />
        <button onClick={(e) => answerQuestion(e, selectedQuestionId) }>Ask</button>
      </>
    );
   const list = demoQuestions[question].pages.map( x =>
      <li
        key={x}
        onClick={() => setPage(x)}
      > Page {x}
      </li>
    );
  const answer = (
    <>
      <h5>Answer</h5>
      <p>{demoQuestions[question].answer}</p>
      <strong>Sources: </strong>
      <ul className="cited-pages">{list}</ul>
      <div className="card small disclaimer">Click on a page to navigate to it on the right panel</div>
    </>
    );
  return (
    <>
      <div className="card" >
        {questionSelect}
        {questionBox}
      </div>
      <div className="disclaimer card small">{spinner}&nbsp;{message}</div>
      <div className="card" >
        {answer}
      </div>
    </>
  )
}

export default Chat