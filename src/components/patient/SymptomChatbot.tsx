
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface SymptomChatbotProps {
  onSymptomsUpdate: (symptoms: any[]) => void;
}

const SymptomChatbot: React.FC<SymptomChatbotProps> = ({ onSymptomsUpdate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  const questions = [
    {
      question: "What type of pain are you experiencing?",
      options: ["Sharp pain", "Dull ache", "Throbbing", "Sensitivity", "No pain"]
    },
    {
      question: "When do you feel the pain most?",
      options: ["While eating", "With hot drinks", "With cold drinks", "When biting down", "Constantly"]
    },
    {
      question: "How would you rate the pain intensity?",
      options: ["Mild (1-3)", "Moderate (4-6)", "Severe (7-10)"]
    },
    {
      question: "How long have you had these symptoms?",
      options: ["Just started", "Few days", "1-2 weeks", "More than a month"]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the chatbot flow
      const symptoms = questions.map((q, i) => ({
        question: q.question,
        answer: newAnswers[i]
      }));
      onSymptomsUpdate(symptoms);
      setIsActive(false);
    }
  };

  const startChatbot = () => {
    setIsActive(true);
    setCurrentStep(0);
    setAnswers([]);
  };

  const resetChatbot = () => {
    setIsActive(false);
    setCurrentStep(0);
    setAnswers([]);
    onSymptomsUpdate([]);
  };

  if (!isActive && answers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tell us about your symptoms
          </h3>
          <p className="text-gray-600 mb-4">
            Our AI assistant will ask you a few questions to better understand your condition
          </p>
          <Button onClick={startChatbot} className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Start Symptom Assessment</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isActive) {
    const question = questions[currentStep];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>Symptom Assessment ({currentStep + 1}/{questions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">{question.question}</p>
          </div>
          
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          
          {answers.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Previous Answers:</h4>
              <div className="space-y-1">
                {answers.map((answer, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    <span className="font-medium">{questions[index].question}</span>
                    <br />
                    <span className="text-blue-600">{answer}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show completed assessment
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-500" />
            <span>Assessment Complete ✅</span>
          </span>
          <Button variant="outline" size="sm" onClick={resetChatbot}>
            Retake Assessment
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{questions[index].question}</p>
              <p className="text-sm text-blue-600 mt-1">{answer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomChatbot;
