import { useState ,useEffect,useRef} from "react";
import randomWords from "random-words"
import './App.css';

function App() {
  const [text,setText]=useState([])
  const [countdown,setCountDown]=useState(300)
  const [currentInput,setCurrentInput]=useState('')
  const [currentIndex,setCurrentIndex]=useState(0)
  const [currentCharIndex,setCurrentCharIndex]=useState(-1)
  const [currentChar,setCurrentChar]=useState('')
  const [correctCount,setCorrectCount]=useState(0)
  const [inCorrectCount,setInCorrectCount]=useState(0)
  const [status,setStatus]=useState('initial')
  const [charCount,setCharCount]=useState(0)
  const textInput=useRef(null)
  
 useEffect(()=>{
  setText(generoateText())
 },[])

 useEffect(()=>{
  if(status==="started"){
    textInput.current.focus()
  }
 },[status])

  function generoateText(){
    return new Array(100).fill(null).map(()=>randomWords())
  }

  function start(){
    if (status==="finished"){
      setText(generoateText())
      setCurrentIndex(0)
      setCorrectCount(0)
      setInCorrectCount(0)
      setCurrentCharIndex(-1)
      setCurrentChar('')
    }
    if (status!=='started'){
      setStatus('started')
      let minutes=5
      let seconds=minutes*60
      setCountDown(seconds)

      let interval=setInterval(()=>{
        setCountDown((prevCount)=>{
          if(prevCount===0){
              clearInterval(interval)
              setStatus("finished")
              setCurrentInput('')
              return seconds
          }else{
            return prevCount-1
          }
        })
      },1000)
    
    }
  }

  function formatTime(time){
    const minutes=Math.floor(time/60)
    const seconds=time%60
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
  }


  function keyDownHandler({keyCode,key}){
    if (keyCode===32){
      checkMatch()
      setCurrentInput('')
      //setCurrentIndex(currentIndex+1)
     setCurrentIndex((prevIndex)=>{
      //last word typed,generate new text
      if(prevIndex===text.length-1){
        setText(generoateText())
        return 0 //Reset index to start from the begining
      }else{
        return prevIndex+1
      }
     })
      setCurrentCharIndex(-1)

    }else if (keyCode===8){
      setCurrentCharIndex(currentCharIndex-1)
      setCurrentChar('')

    }else{
      setCurrentCharIndex(currentCharIndex+1)
      setCurrentChar(key)
      setCharCount(charCount+1)
    }
  }

  function checkMatch(){
    const wordToCompare=text[currentIndex]
    const dosItMatch=wordToCompare===currentInput.trim()
    if(dosItMatch){
      setCorrectCount(correctCount+1)
    }else{
      setInCorrectCount(inCorrectCount+1)
    }

  }

  function getClassName(wordindx,charindx,char){
    if(wordindx===currentIndex && charindx===currentCharIndex && currentChar && status!=="finished"){
      if(char===currentChar){
        return "next-word"
      }else{
        return "wrong-word"
      }
    }else if(wordindx===currentIndex && currentCharIndex>=text[currentIndex].length){
        return "wrong-word"
    }else{
      return ""
    }

  }

  return (
    <div className="App">
      <h1>Touch Typing</h1>
      <p>{formatTime(countdown)}</p>
      {status==="started" && (
         <div className="card">
         {text&&text.map((word,i)=>(
           <span className="words" key={i}>
             <span>
               {
                 word.split('').map((char,index)=>(
                   <span className={getClassName(i,index,char)} key={index}>{char}</span>
                 ))
               }
             </span>
             <span> </span>
           </span>
         ))}
       </div>
      )}
     
      <div className="input-container">
      <div>
        <input ref={textInput} disabled={status!=='started'} type="text" className="input" onKeyDown={keyDownHandler} value={currentInput} onChange={(e)=>setCurrentInput(e.target.value)}/>
      </div>
      <div>
        <button type="button" className="btn" onClick={start}>Start</button>
      </div>
      </div>
      {status==="finished" && (
          <div className="bottom-card">
          <div>
            <p>WPM</p>
            <p>{correctCount}</p>
          </div>
          <div>
            <p>Accuracy:</p>
            {
              correctCount!==0 ? (
                <p>
                  {Math.round((correctCount/(correctCount+inCorrectCount))*100)}%
                </p>
              ):(
                <p>0%</p>
              )
            }
          </div>
          <div>
            <p>No.of keys type in 5mins:</p>
            <p>{charCount}</p>
          </div>
         
        </div>
         )}
      </div>
  );
}

export default App;
