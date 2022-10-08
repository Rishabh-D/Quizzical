import React from "react"
import IntroPage from "./IntroPage"
import QuizePage from "./QuizePage"

export default function Quizzical(){
    
    const [enter, setEnter] = React.useState(false)
    
    function handleStart(){
        setEnter(oldState => !oldState)
        
    }
    return(
        <div>
            { enter ? <QuizePage /> : <IntroPage handleStart={handleStart}/> }
        </div>
        
    )
}