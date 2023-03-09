import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";

const QuizResult = () => {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [isNameExists, setIsNameExists] = useState(false);
  const [isNameSet, setIsNameSet] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setName(location.state.name);
    setScore(location.state.totalCorrectAnswers);
  }, [location]);

  useEffect(() => {
    if (name && !isNameSet) {
      Axios.get("https://mern-quiz-api-ozt8.onrender.com/getUsers")
        .then((response) => {
          const users = response.data;
          const nameExists = users.some((user) => user.name === name);
          setIsNameExists(nameExists);
          setIsNameSet(true);
          setListOfUsers(users);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [name, isNameSet]);

  useEffect(() => {
    if (name && score && isNameSet) {
      if (isNameExists) {
        Axios.get("https://mern-quiz-api-ozt8.onrender.com/getUsers")
          .then((response) => {
            setListOfUsers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Axios.post("https://mern-quiz-api-ozt8.onrender.com/createUser", {
          name,
          score,
        })
          .then(() => {
            Axios.get("https://mern-quiz-api-ozt8.onrender.com/getUsers")
              .then((response) => {
                setListOfUsers(response.data);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [name, score, isNameExists, isNameSet]);

  useEffect(() => {
    return () => {
      setIsNameSet(false);
    };
  }, []);

  return (
    <div className="App">
      <h1>Quiz Results</h1>

      <div className="usersDisplay">
        {[...listOfUsers].reverse().map((user, index) => {
          return (
            <div key={index}>
              <p>Name: {user.name}</p>
              <p>Score: {user.score} out of 2</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResult;
