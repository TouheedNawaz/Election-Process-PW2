import React from 'react';
import { CheckCircle, XCircle, Bot } from 'lucide-react';
import './Quiz.css';

const QuizCard = ({ question, answerData, onAnswer, onNext }) => {
  const isAnswered = !!answerData;

  return (
    <div className="quiz-card card">
      {question.isAi && (
        <div className="ai-badge">
          <Bot size={14} /> AI Generated
        </div>
      )}
      
      <h3 className="quiz-question">{question.question}</h3>
      
      <div className="quiz-options">
        {question.options.map((option, idx) => {
          let statusClass = '';
          if (isAnswered) {
            if (option === question.correctAnswer) {
              statusClass = 'correct';
            } else if (option === answerData.selectedOption) {
              statusClass = 'incorrect';
            } else {
              statusClass = 'disabled';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              className={`quiz-option-btn ${statusClass}`}
              onClick={() => onAnswer(option)}
            >
              <span className="option-text">{option}</span>
              {isAnswered && option === question.correctAnswer && <CheckCircle size={20} className="status-icon" />}
              {isAnswered && option === answerData.selectedOption && option !== question.correctAnswer && <XCircle size={20} className="status-icon" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`quiz-feedback ${answerData.isCorrect ? 'correct-bg' : 'incorrect-bg'}`}>
          <div className="feedback-header">
            {answerData.isCorrect ? (
              <><CheckCircle size={24} /> <h4>Correct!</h4></>
            ) : (
              <><XCircle size={24} /> <h4>Incorrect</h4></>
            )}
          </div>
          <p className="feedback-explanation">{question.explanation}</p>
          <button className="btn btn-primary next-btn" onClick={onNext}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
