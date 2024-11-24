import React, { useEffect, useState } from 'react';
import { GetQuiz, SubmitQuizResult } from '../../actions/quiz.action';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "./quiz.css";

function QuizComponent() {
  const { skillID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const { skills, userID } = location.state || {};
  const currentSkillIndex = skills.indexOf(skillID);

  useEffect(() => {
    fetchQuiz();
  }, [skillID]);

  const fetchQuiz = async () => {
    try {
      const data = await GetQuiz(skillID);
      const quiz = data.quiz;
      setQuizData(transformQuizData(quiz));
    } catch (error) {
      console.error(error);
    }
  };

  function transformQuizData(quiz) {
    return {
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex
      }))
    };
  }

  const handleAnswerSelect = (index) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: index
    });
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleNextQuiz = async () => {
    const nextSkillIndex = currentSkillIndex + 1;
    let quizScore = calculateScore(); // Calculate score before navigating
    console.log("Quiz Score: ", quizScore);
    try {
      const response = await SubmitQuizResult({
        userId: userID,
        skillID,
        currentSkillIndex,
        skills,
        quizScore
      });

      console.log(response);

      if (nextSkillIndex < skills.length) {
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentQuestionIndex(0);
        navigate(`/quiz/${skills[nextSkillIndex]}`, { state: { skills, userID } });
      } else {
        navigate("/login");  // Redirect to login or any other page after all quizzes
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      console.error(error.response?.data?.message || error.message);
    }
  };

  const calculateScore = () => {
    return quizData.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswerIndex ? 1 : 0);
    }, 0);
  };

  if (!quizData) return <div>Loading...</div>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-wrapper">
        <h1>{quizData.title}</h1>
        {showResults ? (
          <div>
            <h2>Your Score: {calculateScore()} / {quizData.questions.length}</h2>
            <button onClick={handleNextQuiz}>
              {currentSkillIndex < skills.length - 1 ? "Next Quiz" : "Finish"}
            </button>
            <h3>Correct Answers:</h3>
            <ul>
              {quizData.questions.map((question, index) => (
                <li key={index} className="result-item">
                  <strong>Q: {question.questionText}</strong><br />
                  Correct Answer: {question.options[question.correctAnswerIndex]}<br />
                  Your Answer: {selectedAnswers[index] !== undefined
                    ? question.options[selectedAnswers[index]]
                    : "Not Answered"}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p><strong>{currentQuestion.questionText}</strong></p>
            <p>Single Selection (Choose one answer)</p>

            <div className="option-container">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={index}
                    checked={selectedAnswers[currentQuestionIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>

            <div className="navigation-buttons">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              {currentQuestionIndex < quizData.questions.length - 1 ? (
                <button onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button onClick={handleShowResults}>
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizComponent;
