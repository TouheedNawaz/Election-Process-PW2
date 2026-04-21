import React from 'react';
import QuizEngine from '../components/Quiz/QuizEngine';
import '../components/Quiz/Quiz.css';

const Quiz = () => {
  return (
    <div className="quiz-page container">
      <div className="quiz-page-header">
        <h1>Civic Knowledge Quiz</h1>
        <p>Test your understanding of the democratic processes across South Asia. Contains a mix of curated questions and AI-generated challenges!</p>
      </div>
      
      <div className="quiz-content-area">
        <QuizEngine />
      </div>
    </div>
  );
};

export default Quiz;
