/* eslint-disable brace-style */
/* eslint-disable react/prop-types */
import React from 'react'

export default function QnA (props) {
  function createOptions () {
    const optionsUi = props.options.map(op => {
      // create a radio button for all options
      let classes = ''
      if (props.showAns) {
        // console.log("is ans true")
        if (props.qa.selected === op) {
          if (props.qa.selected === props.qa.correct_answer) { classes = 'correct' } else { classes = 'incorrect' }
        }
        // if not selected theh check
        else if (op === props.qa.correct_answer) { classes = 'correct' } else { classes = 'ignore' }
      }

      return (
                        <>
                            <input
                                type="radio"
                                name={props.id}
                                value={op}
                                onChange={() => props.handleClick(event, props.id)}
                                id={op}
                                checked={props.qa.selected === op}

                                className = {props.showAns
                                  ? classes
                                  : (props.qa.selected === op ? 'selected' : 'unselected')}
                            />
                            <label htmlFor={op}
                                className = {props.showAns
                                  ? classes
                                  : (props.qa.selected === op ? 'selected' : 'unselected')}
                            >
                            {op}
                            </label>

                        </>
      )
    })
    return optionsUi
  }

  return (
        <main>
            <div className="questions">
                <h3>{props.qa.question}</h3>
            </div>
            <div className="options">
                {createOptions()}
            </div>

        </main>
  )
}
