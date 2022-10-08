import React from 'react'
import {nanoid} from "nanoid"
import QnA from './qna/QnA'

export default function QuizePage(){
    
    const [quizes, setQuizes] = React.useState([])
    const [showAns, setShowAns] = React.useState({"show":false, "score":0, "playAgain":true, endGame:false})

    
    React.useEffect(()=>{
        
        console.log("check play again", showAns.playAgain)
        if (showAns.playAgain == true) {
            console.log("fetching data")
        fetch("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple")
            .then(res => res.json())
            .then(data => data.results)
            .then(data => localStorage.setItem('dataKey', JSON.stringify(data)))

        
        // clean the data
            // incorrect_answers
            // question
            // correct_answer
        let result = JSON.parse(localStorage.getItem('dataKey'))
        console.log(result)
        for (let i=0; i< result.length; i++){
            result[i].question = helperDecodeHtml(result[i].question)
            result[i].correct_answer = helperDecodeHtml(result[i].correct_answer)
            for (let j=0; j<result[i].incorrect_answers.length;j++){
                
                result[i].incorrect_answers[j]=helperDecodeHtml(result[i].incorrect_answers[j])
                
            }
            
            // these lines of code were moved from QnA to here as there it was running after every click and thus changing the options positions
            const index = Math.floor(Math.random() * (result[i].incorrect_answers.length))
            result[i].incorrect_answers.splice(index,0,result[i].correct_answer)
            
        }
        

  
        
        setQuizes(old => {
            return result.map(qa => {
                return {...qa, "selected":"", "id":nanoid()}
            })
        })
        
        }
        else{
            if (showAns.endGame){
                window.location.href="/"
            }
        }
  
    },[showAns])
    
    

    
    function helperDecodeHtml(htmls) {
        var txt = document.createElement("textarea");
        txt.innerHTML = htmls;
        return txt.value;
    }
    
    const qna = quizes.map(qas => {
        return <QnA key={qas.id} id={qas.id} qa={qas} options={qas.incorrect_answers} handleClick={handleClick} showAns={showAns.show}
        />
    })
    
    function handleClick(event, id){
        console.log(event.target.value,id, event.target.className)
        const value = event.target.value
        setQuizes(old => {
            return old.map(each => {
                return each.id === id ? {...each, "selected":value} : {...each}
            })
        })
    }
    
    
    function checkAnswer(){
        console.log("checkinh answers")
        let scores=0
        for (let i=0; i<quizes.length; i++){
            if (quizes[i].correct_answer == quizes[i].selected)
                scores+=1
        }
        
        console.log("score", scores)
        console.log("set show modifying, playagain set to false")
        setShowAns(old => ({...old,"show":true,"score":scores,"playAgain":false}))
        
    }
    
    function setPlay(){
        console.log("play again getting set")
        setShowAns(old => ({...old,"show":false,"score":0,"playAgain":true}))
    }

    function endGame(){
        console.log("play again getting set")
        setShowAns(old => ({...old,"show":false,"score":0,"playAgain":false, "endGame":true}))
    }
    
    return(
        <div className="quize-page">
            {qna}
            {!showAns.show ? 
                <button className="solutions" onClick={checkAnswer}> Check answers </button> :
                <div className="result">
                    <p> You scored {showAns.score}/{quizes.length} correct answers </p>
                    <button className="solutions" onClick={setPlay}> play Again </button>
                    <button className="endGame" onClick={endGame}> End </button>
                </div>
                
                }
            
        </div>
        
    )
}