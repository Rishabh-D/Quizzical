import React from "react"

export default function IntroPage(props){
    
    return(
        <div className="start">
            <h2 className="title">Quizzical</h2>
            <h2 className="desc">Test your knowledge</h2>
            <button onClick={props.handleStart}>Start quiz</button>
        </div>
        
    )
}