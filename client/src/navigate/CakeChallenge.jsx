import React, { useEffect, useState } from 'react';
import './CakeChallenge.css';

const allOptions = {
  בסיס: ['שוקולד', 'וניל', 'לימון', 'גזר', 'רד וולווט', 'קוקוס'],
  קרם: ['קצפת', 'גנאש', 'מסקרפונה', 'חמאת בוטנים', 'שוקולד לבן', 'ריבה'],
  תוספת: ['פירות יער', 'שוקולד צ’יפס', 'סוכריות צבעוניות', 'אגוזים', 'מרשמלו', 'פירות יבשים']
};

const steps = Object.keys(allOptions);

function getRandomRequest() {
  const request = {};
  steps.forEach(step => {
    const options = allOptions[step];
    const random = options[Math.floor(Math.random() * options.length)];
    request[step] = random;
  });
  return request;
}

export default function CakeChallenge() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [request, setRequest] = useState(getRandomRequest());
  const [timer, setTimer] = useState(5);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (isFinished) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleSelect(randomChoice(allOptions[currentStep]));
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [stepIndex, isFinished]);

  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function handleSelect(choice) {
    const newSelections = { ...selections, [currentStep]: choice };
    setSelections(newSelections);

    if (stepIndex === steps.length - 1) {
      setIsFinished(true);
    } else {
      setStepIndex(stepIndex + 1);
      setTimer(5);
    }
  }

  function restartGame() {
    setSelections({});
    setStepIndex(0);
    setIsFinished(false);
    setRequest(getRandomRequest());
    setTimer(5);
  }

  const success = isFinished && steps.every(step => selections[step] === request[step]);

  return (
    <div className="cake-challenge-container">
      <h2>הזמנת לקוח:</h2>
      <ul className="client-request">
        {steps.map(step => (
          <li key={step}><strong>{step}:</strong> {request[step]}</li>
        ))}
      </ul>

      {!isFinished ? (
        <div className="cake-step fade-in">
          <h3>בחר/י {currentStep} (נשארו {timer} שניות):</h3>
          <div className="cake-options">
            {allOptions[currentStep].map(option => (
              <button
                key={option}
                className="cake-option-btn"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="cake-result fade-in">
          <h3>{success ? '🎉 הצלחת להרכיב את העוגה המושלמת!' : '😅 לא בדיוק מה שהלקוח רצה...'}</h3>
          <h4>העוגה שלך:</h4>
          <ul>
            {steps.map(step => (
              <li key={step}>
                <strong>{step}:</strong> {selections[step]}
              </li>
            ))}
          </ul>
          <button className="cake-restart-btn" onClick={restartGame}>נסה שוב 🔁</button>
        </div>
      )}
    </div>
  );
}