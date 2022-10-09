import React from 'react'
import { nanoid } from 'nanoid'
import QnA from './qna/QnA'

export default function QuizePage () {
  const [quizes, setQuizes] = React.useState([])
  const [showAns, setShowAns] = React.useState({
    show: false, score: 0, playAgain: true, endGame: false
  })

  function helperDecodeHtml (htmls) {
    const txt = document.createElement('textarea')
    txt.innerHTML = htmls
    return txt.value
  }

  function handleClick (event, id) {
    console.log(event.target.value, id, event.target.className)
    const { value } = event.target
    setQuizes((old) => old.map((each) => (each.id === id ? { ...each, selected: value } : { ...each })))
  }

  function checkAnswer () {
    console.log('checkinh answers')
    let scores = 0
    for (let i = 0; i < quizes.length; i += 1) {
      if (quizes[i].correct_answer === quizes[i].selected) { scores += 1 }
    }
    console.log('score', scores)
    console.log('set show modifying, playagain set to false')
    setShowAns((old) => ({
      ...old, show: true, score: scores, playAgain: false
    }))
  }

  React.useEffect(() => {
    console.log('check play again', showAns.playAgain)
    if (showAns.playAgain === true) {
      setQuizes([])
      //   console.log('fetching data');
      fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple')
        .then((res) => res.json())
        .then((data) => data.results)
        .then((result) => {
          // clean the data
          // incorrect_answers
          // console.log(result);
          for (let i = 0; i < result.length; i += 1) {
            result[i].question = helperDecodeHtml(result[i].question)
            result[i].correct_answer = helperDecodeHtml(result[i].correct_answer)
            for (let j = 0; j < result[i].incorrect_answers.length; j += 1) {
              result[i].incorrect_answers[j] = helperDecodeHtml(result[i].incorrect_answers[j])
            }
            // these lines were moved from QnA to here as there it was running after every click
            // and thus changing the options positions
            const index = Math.floor(Math.random() * (result[i].incorrect_answers.length))
            result[i].incorrect_answers.splice(index, 0, result[i].correct_answer)
          }
          setQuizes(() => result.map((qa) => ({ ...qa, selected: '', id: nanoid() })))
        })
    } else if (showAns.endGame) {
      window.location.href = '/'
    }
  }, [showAns])

  const qna = quizes.map((qas) => (
    <QnA
      key={qas.id}
      id={qas.id}
      qa={qas}
      options={qas.incorrect_answers}
      handleClick={handleClick}
      showAns={showAns.show}
    />
  ))

  function setPlay () {
    console.log('play again getting set')
    setShowAns((old) => ({
      ...old, show: false, score: 0, playAgain: true
    }))
  }

  function endGame () {
    setQuizes([])
    console.log('play again getting set')
    setShowAns((old) => ({
      ...old, show: false, score: 0, playAgain: false, endGame: true
    }))
  }

  const playAgainBtn = !showAns.show
    ? <button className="solutions" onClick={checkAnswer}> Check answers </button>
    : (
      <div className="result">
        <p>
          {' '}
          You scored
          {' '}
          {showAns.score}
          /
          {quizes.length}
          {' '}
          correct answers
          {' '}
        </p>
        <button className="solutions" onClick={setPlay}> play Again </button>
        <button className="endGame" onClick={endGame}> End </button>
      </div>
      )

  return (
    <div className="quize-page">
      {qna}
      {!qna.length > 0 ? <p style={{ textAlign: 'center' }}>...loading</p> : playAgainBtn}

    </div>

  )
}
