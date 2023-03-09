import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import quiz_questions from "./quizQuestions";

const Questions = () => {
    const location = useLocation();
    const name = new URLSearchParams(location.search).get("name");

    const [totalQuestions] = useState(quiz_questions.length);
    const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [disableDiv, setDisableDiv] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const navigate = useNavigate();

    const handleAnswerOptionClick = (option, optionNumber) => {
      if (!disableDiv && !hasAnswered) {
          setSelectedAnswer({ text: option, number: optionNumber });
          setDisableDiv(true);
          setHasAnswered(true);
          const nextDiv = document.getElementById("next-question");
          nextDiv.style.display = "block";
  
          const correctAnswer = quiz_questions[currentQuestion].answer;
          console.log(
              ` ${name} Question ${currentQuestion + 1}: Answer Selected: ${
                  optionNumber + 1
              }. ${option}, Correct Answer: ${correctAnswer}`
          );
  
          if (optionNumber + 1 === correctAnswer) {
              setTotalCorrectAnswers(totalCorrectAnswers + 1);
              console.log(`Selected answer is correct!`);
          } else {
              console.log(`Selected answer is incorrect!`);
          }
  
          clearInterval(countdownId); // Stop the countdown timer
      }
  };
  

    const handleNextQuestionClick = () => {
      setCount(10)
        if (currentQuestion === quiz_questions.length - 1) {
            // Last question, redirect to quiz-result page
            // console.log("quiz result");
            navigate("/quiz-result", {
                state: {
                    totalQuestions: totalQuestions,
                    totalCorrectAnswers: totalCorrectAnswers,
                    name: name,
                },

                
            });
            return;
        }

        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setDisableDiv(false);
        setHasAnswered(false);
        const nextDiv = document.getElementById("next-question");
        nextDiv.style.display = "none";
    };

    const [count, setCount] = useState(10);
    const [countdownId, setCountdownId] = useState(null);

    useEffect(() => {
      const countdown = setInterval(() => {
          if (count > 0) {
              setCount(count - 1);
          } else {
              clearInterval(countdown);
              console.log("Time's up!");
              setDisableDiv(true);
              const nextDiv = document.getElementById("next-question");
              nextDiv.style.display = "block";
          }
      }, 1000);
  
      // Store the countdown ID in a state variable
      setCountdownId(countdown);
  
      return () => clearInterval(countdown);
  }, [count]);
  

    return (
        <div id="container">
            <div className="header">QUIZ APP</div>

            <div className="content">
                <div className="content-wrapper">
                    <span className="question-number">
                        Question {currentQuestion + 1}.
                    </span>
                    <h2 className="question">
                        {quiz_questions[currentQuestion].question}
                    </h2>
                    <div id="option-container">
                        {quiz_questions[currentQuestion].options.map(
                            (option, index) => (
                                <p
                                    className={`option ${
                                        selectedAnswer &&
                                        selectedAnswer.text === option
                                            ? "selected"
                                            : ""
                                    }`}
                                    style={{
                                        pointerEvents: disableDiv
                                            ? "none"
                                            : "auto",
                                    }}
                                    key={index}
                                    onClick={() =>
                                        handleAnswerOptionClick(option, index)
                                    }
                                >
                                    {`${option}`}
                                </p>
                            )
                        )}
                    </div>
                </div>

                <div className="footer" id="footer">
                    <p id="timer">Time Left: {count} Sec</p>
                    <button
                        style={{ display: "none" }}
                        id="next-question"
                        onClick={handleNextQuestionClick}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Questions;
