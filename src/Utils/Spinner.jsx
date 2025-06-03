import { 
    useState, 
    useEffect, 
    useRef,
    useImperativeHandle,
    forwardRef
} from 'react'

const Spinner = forwardRef(({ timer = 100 }, ref) => {
    const chars = ["⡀", "⣀", "⣄", "⣤", "⣴", "⣶", "⣷", "⣿", "⢿", "⠿", "⠟", "⠛", "⠙", "⠉", "⠈"]
    const [isSpinning, setIsSpinning] = useState(false)
    const spinnerRef = useRef(null)

    useImperativeHandle(ref, () => ({
        start: () => setIsSpinning(true),
        stop: () => {
        setIsSpinning(false)
            spinnerRef.current.textContent = "⡷"
        }
    }));

    useEffect(() => {
        let interval
        if (isSpinning){
            let index = 0
            interval = setInterval(() => {
                spinnerRef.current.textContent = chars[index]
                index += 1
                if (index >= chars.length) {
                    index = 0
                }
            }, timer)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    }, [isSpinning, timer])
    return <div className="d-inline" ref={spinnerRef}>{isSpinning ? '⡀' : '⡷'}</div>
})
export default Spinner