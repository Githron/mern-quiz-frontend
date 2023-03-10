import React, { useState, useEffect } from "react";
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        Axios.get("https://mern-quiz-api-ozt8.onrender.com/getUsers")
            .then((response) => {
                setExistingNames(response.data.map((user) => user.name));
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
            });
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!existingNames.includes(name)) {
            if (name !== "") {
                setIsSubmitting(true);
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
                        <button
                            id="start-quiz"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Start Quiz"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizRules;
