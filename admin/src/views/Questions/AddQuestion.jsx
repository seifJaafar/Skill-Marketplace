import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { GetQuizzes, addQuestionToQuiz } from "../../actions/quiz.action"
import Select from "react-select";
function AddQuestion() {
    const [QuestionText, setQuestionText] = useState("");
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [quiz, setQuiz] = useState([]);
    const [QuizData, setQuizesData] = useState([]);
    const [options, setOptions] = useState([]);
    const fetchQuizes = async () => {
        try {
            const response = await GetQuizzes();
            if (response) {
                console.log(response)
                const quizesWithoutQuestions = response.filter(quiz => quiz.questions.length < 5);
                const quizes = quizesWithoutQuestions.map(quiz => ({ value: quiz._id, label: quiz.title }));
                setQuizesData(quizes);
            } else {
                console.error("quizes data is missing or invalid");
            }
        } catch (error) {
            console.error("Error fetching quizes:", error);
        }
    };

    useEffect(() => {
        fetchQuizes();
    }, []);
    const handleCancel = () => {
        setQuestionText("");
        setCorrectAnswerIndex(0);
        setOptions([]);
        setQuiz([]);
    };

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, ""]);
        }
    };

    const handleOptionChange = (value, index) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const deleteOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    const handleSubmit = async () => {
        const data = {
            questionText: QuestionText,
            options,
            correctAnswerIndex,
            quiz
        }
        try {
            const response = await addQuestionToQuiz(data);
            if (response) {
                window.location.reload();
            } else {
                console.error("Error adding question to quiz");
            }
        } catch (error) {
            console.error("Error adding question to quiz:", error);
        }
    };

    return (
        <div className="add-question">
            <div className="form-row">
                <div className="form-field">
                    <label>Question</label>
                    <InputTextarea
                        id="name"
                        value={QuestionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        rows={5}
                        style={{ width: "100%", fontSize: "1rem" }}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Correct Answer Index</label>
                    <InputNumber
                        value={correctAnswerIndex}
                        onValueChange={(e) => setCorrectAnswerIndex(e.value)}
                        mode="decimal"
                        showButtons
                        min={0}
                        max={options.length > 0 ? options.length - 1 : 0}
                    />
                </div>
            </div>
            <div className="form-row">

                <div className="form-field" style={{ display: " flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                    <label>Quiz</label>
                    <Select
                        defaultValue={quiz}
                        options={QuizData}
                        name="quiz"
                        placeholder="Select your quiz"
                        onChange={(e) => {
                            setQuiz(e.value);
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={{
                            container: (provided) => ({
                                ...provided,
                                width: "300px", // Set your desired width
                            }),
                        }}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-item mb-2 flex align-items-center">
                            <InputText
                                value={option}
                                onChange={(e) => handleOptionChange(e.target.value, index)}
                                placeholder={`Option ${index + 1}`}
                                style={{ width: "70%", fontSize: "0.9rem" }}
                                className="p-inputtext-sm"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-sm ml-2"
                                onClick={() => deleteOption(index)}
                                tooltip="Delete this option"
                            />
                        </div>
                    ))}
                </div>

            </div>
            <Button
                label="Add Option"
                icon="pi pi-plus"
                onClick={addOption}
                disabled={options.length >= 5}
                style={{
                    marginTop: "10px",
                    fontSize: "0.9rem",
                    padding: "10px 20px",
                    width: "auto",
                }}
            />
            <div className="button-row mt-3">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    style={{
                        backgroundColor: "#1E1F2A",
                        color: "#C9E782",
                        border: "none",
                        fontSize: "1rem",
                        padding: "0.5rem 1rem",
                    }}
                    onClick={handleCancel}
                />
                <Button
                    label="Add Quiz"
                    icon="pi pi-check"
                    style={{
                        backgroundColor: "#C9E782",
                        color: "#1E1F2A",
                        border: "none",
                        marginLeft: "10px",
                        fontSize: "1rem",
                        padding: "0.5rem 1rem",
                    }}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}

export default AddQuestion;
