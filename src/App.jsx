import { useEffect, useState } from 'react'
import "./Ctp.css"

function App() {
  const  [numPoints, setNumPoints] = useState(5)
  const [ points,setPoints] = useState([])
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [timerId, setTimerId] = useState(null)
  const [autoPlay, setAutoPlay] = useState(false)
  const [expectedId, setExpectedId] = useState(1)
  const  [gameOver, setGameOver] = useState(false);



  // random pooint
  const generatePoints = (counts)=>{
    const newPoints =[]
    for(let i=0;i<counts;i++){
      newPoints.push({
        id: i+1,
        x: Math.random() * 90,
        y:Math.random()*90
      })
    }
    setPoints(newPoints)
  }
  //start game
  const startGame=()=>{
    generatePoints(numPoints)
    setTime(0)
    setStarted(true)
    setExpectedId(1)
    setGameOver(false)
    const id = setInterval(()=>
      setTime((prev)=>prev+0.1
  ),100)
  setTimerId(id)
  }

  //reset game
  const resetGame=()=>{
    clearInterval(timerId)
    // generatePoints(numPoints)
    // setStarted(true)
    // setTime(0)
    // setExpectedId(1)
    // setGameOver(false)
    startGame()
    console.log(timerId)
  }
  // ng dung bam tay
  const handleClick = (id) => {
    if (gameOver || autoPlay) return;
    if (id === expectedId) {
      // Đánh dấu fading trước
      setPoints((prev) =>
        prev.map((p) => (p.id === id ? { ...p, fading: true } : p))
      );
  
      // Sau 0.5s mới xóa
      setTimeout(() => {
        setPoints((prev) => prev.filter((p) => p.id !== id));
        setExpectedId((prev) => prev + 1);
      }, 500);
    } else {
      setGameOver(true);
      clearInterval(timerId);
    }
  };
  

  //auto play
  useEffect(()=>{
    if(started && autoPlay &&points.length>0&& !gameOver){
      const autoId = setInterval(()=>{
        setPoints((prev)=>{
          const updated = [...prev]
          updated.shift()
          setExpectedId((prevExpected )=>prevExpected+1)
          return updated
        })
      },500)
      return ()=>clearInterval(autoId)
    }
  },[started, autoPlay, points, gameOver])

  useEffect(() => {
    if ((points.length === 0 && started) || gameOver) {
      clearInterval(timerId);
    }
  }, [points, started, timerId, gameOver]);



  return (
    <>
      <div className="App">
      {gameOver ? (
            <div className="cleared" style={{ color: "red" }}>
              GAME OVER 
            </div>
          ): started && points.length === 0?<div className="cleared">ALL CLEARED </div>: <h1>LET'S PLAY</h1>}


        <div className="setup">
          <label>
            Number of Points:{" "}
            <input
              type="number"
              min={1}
              value={numPoints}
              onChange={(e) => setNumPoints(Number(e.target.value))}
            />
          </label>
           <div>Time: {time.toFixed(1)}s</div>
          <button onClick={startGame}>Play</button>
        </div>
    
      {started &&(
         <div className="header">
         <div>Points: {points.length}</div>
         <button onClick={resetGame}>Restart</button>
        
         <button onClick={() => setAutoPlay((prev) => !prev)}>
           Autoplay: {autoPlay ? "ON" : "OFF"}
         </button>
       </div>
      )}
      
      <div className="board">
      {started && (
        <>
            {points.map((p) => (
              <div
              key={p.id}
              className={`point ${p.fading ? "fading" : ""}`}
              onClick={() => handleClick(p.id)}
              style={{
                top: `${p.y}%`,
                left: `${p.x}%`,
              }}
            >
              {p.id}
            </div>
            ))}

         

          
        </>
      )}
                </div>

    </div>
    </>
  )
}

export default App
