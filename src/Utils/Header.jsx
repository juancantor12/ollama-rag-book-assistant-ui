import app_icon from '../assets/ollama_book.png'

function Header() {
    const username = localStorage.getItem("username");
    return (
        <>
            <div>
                <img src={app_icon} className="logo center" alt="Vite logo" />
                {username && username !=="" && <div className="center">Welcome {username}</div>}
            </div>
            <h1>Ollama book assistant.</h1>
        </>
    )
}
export default Header