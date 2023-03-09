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
            Axios.get("http://localhost:3001/getUsers")
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
                Axios.get("http://localhost:3001/getUsers")
                    .then((response) => {
                        setListOfUsers(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                Axios.post("http://localhost:3001/createUser", {
                    name,
                    score,
                })
                    .then(() => {
                        Axios.get("http://localhost:3001/getUsers")
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
        <div id="container">
            <div style={{padding: "0 2rem"}}>
                <h1 className="header">Leader Boards</h1>

                <div id="option-container">
                    {[...listOfUsers].reverse().map((user, index) => {
                        return (
                            <div key={index}>
                                <p style={{fontSize:"16px"}} className="option"> {user.name} <h4 id="scoreR">Score: {user.score} out of 2</h4></p>
                             
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
