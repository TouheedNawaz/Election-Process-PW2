import { useState, useEffect, useCallback } from 'react';
import { staticQuizBank } from '../data/quizBank';
import { generateQuizQuestion } from '../services/api';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({}); // { index: { selectedOption, isCorrect } }
  
  const TOTAL_QUESTIONS = 5; // Keep it short for the hackathon
  
  // Shuffle array utility
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const initQuiz = useCallback(async () => {
    setIsLoading(true);
    setScore(0);
    setCurrentIndex(0);
    setIsFinished(false);
    setAnswers({});

    try {
      // We will mix 3 static questions and 2 AI-generated questions
      const selectedStatic = shuffle(staticQuizBank).slice(0, 3);
      
      // Fetch 2 AI questions
      const aiPromise1 = generateQuizQuestion('India', 'medium', 'electoral bodies');
      const aiPromise2 = generateQuizQuestion('Pakistan', 'medium', 'voting systems');
      
      let aiQuestions = [];
      try {
         const results = await Promise.all([aiPromise1, aiPromise2]);
         aiQuestions = results.map((q, i) => ({
           id: `ai-${i}`,
           question: q.question,
           options: shuffle(q.options), // shuffle AI options just in case
           correctAnswer: q.correctAnswer,
           explanation: q.explanation || "AI Generated Question",
           isAi: true
         }));
      } catch (aiErr) {
         console.warn("AI Quiz generation failed, falling back to static only", aiErr);
         aiQuestions = staticQuizBank.filter(q => !selectedStatic.find(s => s.id === q.id)).slice(0, 2);
      }

      const finalQuestions = shuffle([...selectedStatic, ...aiQuestions]);
      setQuestions(finalQuestions);

    } catch (err) {
      console.error("Error initializing quiz:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initQuiz();
  }, [initQuiz]);

  const answerQuestion = (selectedOption) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { selectedOption, isCorrect }
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    score,
    isFinished,
    isLoading,
    answerData: answers[currentIndex],
    answerQuestion,
    nextQuestion,
    restartQuiz: initQuiz
  };
};
