import React from 'react';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import QuizCard from './QuizCard';
import './Quiz.css';

const QuizEngine = () => {
  const { 
    questions, currentIndex, currentQuestion, score, 
    isFinished, isLoading, answerData, answerQuestion, nextQuestion, restartQuiz 
  } = useQuiz();

  if (isLoading) {
    return (
      <div className="quiz-loading card">
        <Loader2 size={48} className="spinner text-blue" />
        <p>Assembling your quiz... Generating some questions with AI.</p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    let message = "Good effort! Keep learning about the electoral process.";
    if (percentage === 100) message = "Perfect Score! You are a Civic Master!";
    else if (percentage >= 60) message = "Great job! You have a solid understanding.";

    return (
      <div className="quiz-result card">
        <Trophy size={64} className="text-amber result-icon-large" />
        <h2>Quiz Complete!</h2>
        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="score-total">/ {questions.length}</span>
        </div>
        <p className="result-message">{message}</p>
        <button className="btn btn-primary btn-large" onClick={restartQuiz}>
          <RotateCcw size={20} /> Play Again
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="quiz-engine-container">
      <div className="quiz-header">
        <div className="quiz-progress-text">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="quiz-score-text">
          Score: {score}
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      <QuizCard 
        question={currentQuestion}
        answerData={answerData}
        onAnswer={answerQuestion}
        onNext={nextQuestion}
      />
    </div>
  );
};

export default QuizEngine;
