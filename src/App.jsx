// import { useState } from 'react'
import app_icon from './assets/ollama_book.png'
import './App.css'
import Demo from './Demo.jsx'

function App() {
  return (
    <>
      <div>
          <img src={app_icon} className="logo" alt="Vite logo" />
      </div>
      <h1>Ollama book assistant.</h1>
      <div className="card">
        The server is currently unavailable, please see the <a href="#demo">demo</a>.
      </div>
      <div className="disclaimer card">
          I host this app on a local machine so both the Embeddings and LLM 
          servers might not always be up and running or they could be locked 
          from another process.
          <br />
          If you want to check the online app with real inference 
          (not simulated like the demo), feel free to contact me at&nbsp;
          <a target="_blank" href="mailto:juancantor.all@gmail.com">juancantor.all@gmail.com</a>
          and I'll get back to you with a user and a password as well as 
          information about when the servers will be running.
          If you want to try the app locally feel free to clone it from 
          github, you can clone only the&nbsp;
          <a target="_blank" href="https://github.com/juancantor12/ollama-rag-book-assistant">
            backend 
          </a> part and use either the CLI or the API, or you can clone also this&nbsp;
          <a target="_blank" href="https://github.com/juancantor12/ollama-rag-book-assistant-ui">React UI
          </a> and set it up to point at your local API.
      </div>

      <h3>What is this app about.</h3>
      <div className="card">
         This application allows the user to provide a large book in PDF 
         (text based) and to query the contents of the book using natural 
         language and a local LLM, the generated responses will feature 
         precise, sourced and cited information from the book, 
         including the relation from the retrieved parts of the book with 
         the question and reference to chapters, sections and pages used
         to generate the answer.
         <br />
         This is achieved by construction a embeddings vector database 
         with the book information and then enhancing the LLM context 
         with related documents fromt he book using RAG.
      </div>
      <h3> Demo</h3>
      <div className="card" id="demo">
        <Demo />
      </div>
    </>
  )
}

export default App
