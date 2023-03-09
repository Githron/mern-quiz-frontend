import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import Axios from "axios";

const QuizRules = () => {
    const quizRules = [
        "You Have Only 20 Seconds For Each Question.",
        "Once You Select Any Answer.It Can't Be Undone",
        "You'll Get Points On The Basic Of Your Correct Answers.",
    ];

    const inputStyle = {
        display: "block",
        margin: "auto",
        width: "90%",
        height: "40px",
    };

    const [name, setName] = useState("");
    const [existingNames, setExistingNames] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:3001/getUsers")
            .then((response) => {
                setExistingNames(response.data.map((user) => user.name));
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!existingNames.includes(name)) {
            if (name !== "") {
                // redirect to quiz if the name is not in the database and input is not empty
                window.location.href = `/questions?name=${name}`;
                console.log(`User input: ${name}`);
            } else {
                alert("Please Enter Your Name");
                console.log("Name field is empty.");
            }
        } else {
            alert(`${name} already exists.`);
            console.log(`${name} already exists`);
            // clear input field if the name is in the database
            setName("");
        }
    };
    

    return (
        <div id="container">
            <div>
                <h2 className="header">Quiz Rules</h2>
                <ol>
                    {quizRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                    ))}
                </ol>

                <form onSubmit={handleSubmit}>
                    <input
                        style={inputStyle}
                        className="inpX"
                        type="text"
                        placeholder="Enter your Username"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <div id="start-quiz-wrapper">
                        <button id="start-quiz" type="submit">
                            Start Quiz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizRules;
