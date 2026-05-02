import React, { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react';
import RoadmapPanel from './RoadmapPanel';
import './VoterWizard.css';

const questions = [
  {
    id: 'country',
    question: "Which country are you checking eligibility for?",
    options: [
      { label: "India", value: "india" },
      { label: "Pakistan", value: "pakistan" },
      { label: "Bangladesh", value: "bangladesh" }
    ]
  },
  {
    id: 'age',
    question: "Are you 18 years of age or older?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" }
    ]
  },
  {
    id: 'citizenship',
    question: "Are you a citizen of the selected country?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "NRI/Overseas", value: "nri" }
    ]
  },
  {
    id: 'soundMind',
    question: "Have you ever been disqualified by a court (e.g., due to unsoundness of mind or corrupt practices)?",
    options: [
      { label: "No, I have not", value: "no" },
      { label: "Yes", value: "yes" }
    ]
  }
];

const EligibilityWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [finalAnswers, setFinalAnswers] = useState(null);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      // Small delay for UI smoothness
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (resultAnswers) => {
    const finalAnswers = resultAnswers;
    setFinalAnswers(finalAnswers);
    if (resultAnswers.age === 'no') {
      setResult({
        status: 'ineligible',
        title: 'Not Yet Eligible',
        message: 'You must be at least 18 years old to vote.',
        icon: <AlertCircle size={48} className="result-icon text-amber" />
      });
      return;
    }

    if (resultAnswers.citizenship === 'no') {
      setResult({
        status: 'ineligible',
        title: 'Citizenship Required',
        message: 'Voting is restricted to citizens of the respective country.',
        icon: <XCircle size={48} className="result-icon text-red" />
      });
      return;
    }
    
    if (resultAnswers.soundMind === 'yes') {
      setResult({
        status: 'ineligible',
        title: 'Disqualified',
        message: 'Individuals disqualified by a competent court under election laws are ineligible to vote.',
        icon: <XCircle size={48} className="result-icon text-red" />
      });
      return;
    }

    if (resultAnswers.citizenship === 'nri') {
      setResult({
        status: 'partial',
        title: 'Special Registration Required',
        message: resultAnswers.country === 'india' 
          ? 'NRIs can vote, but you must register as an Overseas Elector and vote in person at your registered constituency.'
          : 'Overseas voting rules apply. Please check your local consulate for current postal or internet voting provisions.',
        icon: <AlertCircle size={48} className="result-icon text-amber" />,
        link: resultAnswers.country === 'india' ? 'https://eci.gov.in/voter/overseas-voters/' : '#'
      });
      return;
    }

    // Default eligible
    let link = 'https://eci.gov.in';
    let body = 'Election Commission of India';
    if (resultAnswers.country === 'pakistan') { link = 'https://ecp.gov.pk'; body = 'Election Commission of Pakistan'; }
    if (resultAnswers.country === 'bangladesh') { link = 'http://www.ecs.gov.bd'; body = 'Election Commission Bangladesh'; }

    setResult({
      status: 'eligible',
      title: 'You are Eligible to Vote!',
      message: 'Based on your answers, you meet the basic criteria. Ensure your name is on the Electoral Roll.',
      icon: <CheckCircle size={48} className="result-icon text-emerald" />,
      link: link,
      linkText: `Register with ${body}`
    });
  };

  const resetWizard = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
    setFinalAnswers(null);
  };

  const currentQ = questions[currentStep];

  return (
    <div className="wizard-container card">
      <div className="wizard-header">
        <h3>Voter Eligibility Checker</h3>
        {!result && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep) / questions.length) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {!result ? (
        <div className="wizard-question-area">
          <p className="question-text">{currentQ.question}</p>
          <div className="options-grid">
            {currentQ.options.map(opt => (
              <button 
                key={opt.value}
                className={`wizard-option-btn ${answers[currentQ.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`wizard-result-area ${result.status}`}>
          {result.icon}
          <h4 className="result-title">{result.title}</h4>
          <p className="result-message">{result.message}</p>
          
          <div className="result-actions">
            {result.link && (
              <a href={result.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {result.linkText || 'Learn More'} <ArrowRight size={16} />
              </a>
            )}
            <button onClick={resetWizard} className="btn btn-ghost reset-btn">
              <RotateCcw size={16} /> Start Over
            </button>
          </div>

          {/* Personalized AI Roadmap — shown for eligible & partial users */}
          {(result.status === 'eligible' || result.status === 'partial') && finalAnswers && (
            <RoadmapPanel answers={finalAnswers} />
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityWizard;
