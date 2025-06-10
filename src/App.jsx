import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router"
import './assets/App.css'
import Demo from './Demo/Demo.jsx'
import Header from './Utils/Header.jsx'
import { useServerStatus, useLogin } from "./Api/Api.jsx"
import useCheckSession from './Utils/useCheckSession.jsx'
import Navbar from './Utils/Navbar.jsx'

function App() {
    const {
        isLoading: isLoadingSS,
        isError: isErrorSS,
        isSuccess: isSuccessSS
    } = useServerStatus()
    const {
        mutate: mutateLogin,
        isSuccess: isSuccessLogin,
        error: errorLogin
    } = useLogin()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [invalidCredentialsMsg, setInvalidCredentialsMsg] = useState(false)

    const {
        refetch: refetchCheckSession,
        isError: isErrorCheckSession,
        isSuccess: isSuccessCheckSession,
        data: dataCheckSession
    } = useCheckSession()

    useEffect(()=>{
        if (errorLogin !== undefined && errorLogin !== null){
           if (errorLogin == 401){
                setInvalidCredentialsMsg(true)
           }
        }
    }, [errorLogin])

    useEffect(()=>{
        if (isSuccessLogin === true){
            refetchCheckSession()
        }
    }, [isSuccessLogin])

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        mutateLogin({username, password})
    }

    const LoginForm = (
            <>
                <form onSubmit={handleSubmit} className="card">
                    <label>Username:<br />
                    <input 
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    /></label>
                <br />
                    <label>Password:<br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /></label>
                <br />
                <button type="submit">Login</button>
                <br />
                {errorLogin && (
                    <div className="card warn">Invalid credentials</div>
                )}
                </form>
            </>
    )

    const loginOptions = () => {

    };

    return (
        <>
            <Header />
            {isSuccessCheckSession && <Navbar data={dataCheckSession}/>}
            {isErrorCheckSession && <Navbar data={{ permissions: [] }}/>}
            {isLoadingSS && <p className="card warn">Waiting for the server...</p>}
            {isErrorSS && <p className="card warn">The server is currently unavailable, please see the <a href="#demo">demo</a>.</p>}
            {isSuccessSS && isErrorCheckSession && LoginForm }
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
