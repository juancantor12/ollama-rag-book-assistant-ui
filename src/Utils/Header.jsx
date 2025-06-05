import app_icon from '../assets/ollama_book.png'

function Header() {
    return (
        <>
            <div>
                <img src={app_icon} className="logo" alt="Vite logo" />
                </div>
            <h1>Ollama book assistant.</h1>
        </>
    )
}
export default Header