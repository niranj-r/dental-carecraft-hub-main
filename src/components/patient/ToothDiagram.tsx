
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToothDiagramProps {
  onToothSelect: (tooth: string) => void;
  selectedTooth: string;
}

const ToothDiagram: React.FC<ToothDiagramProps> = ({ onToothSelect, selectedTooth }) => {
  const teeth = [
    // Upper teeth
    { id: 'UR8', name: 'UR8', position: { top: '20%', right: '10%' } },
    { id: 'UR7', name: 'UR7', position: { top: '15%', right: '15%' } },
    { id: 'UR6', name: 'UR6', position: { top: '10%', right: '20%' } },
    { id: 'UR5', name: 'UR5', position: { top: '8%', right: '25%' } },
    { id: 'UR4', name: 'UR4', position: { top: '5%', right: '30%' } },
    { id: 'UR3', name: 'UR3', position: { top: '3%', right: '35%' } },
    { id: 'UR2', name: 'UR2', position: { top: '2%', right: '40%' } },
    { id: 'UR1', name: 'UR1', position: { top: '2%', right: '45%' } },
    { id: 'UL1', name: 'UL1', position: { top: '2%', left: '45%' } },
    { id: 'UL2', name: 'UL2', position: { top: '2%', left: '40%' } },
    { id: 'UL3', name: 'UL3', position: { top: '3%', left: '35%' } },
    { id: 'UL4', name: 'UL4', position: { top: '5%', left: '30%' } },
    { id: 'UL5', name: 'UL5', position: { top: '8%', left: '25%' } },
    { id: 'UL6', name: 'UL6', position: { top: '10%', left: '20%' } },
    { id: 'UL7', name: 'UL7', position: { top: '15%', left: '15%' } },
    { id: 'UL8', name: 'UL8', position: { top: '20%', left: '10%' } },
    // Lower teeth
    { id: 'LR8', name: 'LR8', position: { bottom: '20%', right: '10%' } },
    { id: 'LR7', name: 'LR7', position: { bottom: '15%', right: '15%' } },
    { id: 'LR6', name: 'LR6', position: { bottom: '10%', right: '20%' } },
    { id: 'LR5', name: 'LR5', position: { bottom: '8%', right: '25%' } },
    { id: 'LR4', name: 'LR4', position: { bottom: '5%', right: '30%' } },
    { id: 'LR3', name: 'LR3', position: { bottom: '3%', right: '35%' } },
    { id: 'LR2', name: 'LR2', position: { bottom: '2%', right: '40%' } },
    { id: 'LR1', name: 'LR1', position: { bottom: '2%', right: '45%' } },
    { id: 'LL1', name: 'LL1', position: { bottom: '2%', left: '45%' } },
    { id: 'LL2', name: 'LL2', position: { bottom: '2%', left: '40%' } },
    { id: 'LL3', name: 'LL3', position: { bottom: '3%', left: '35%' } },
    { id: 'LL4', name: 'LL4', position: { bottom: '5%', left: '30%' } },
    { id: 'LL5', name: 'LL5', position: { bottom: '8%', left: '25%' } },
    { id: 'LL6', name: 'LL6', position: { bottom: '10%', left: '20%' } },
    { id: 'LL7', name: 'LL7', position: { bottom: '15%', left: '15%' } },
    { id: 'LL8', name: 'LL8', position: { bottom: '20%', left: '10%' } },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Click on the affected tooth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 bg-gradient-to-b from-pink-50 to-pink-100 rounded-lg border-2 border-gray-200">
          {/* Mouth outline */}
          <div className="absolute inset-4 border-4 border-gray-300 rounded-full bg-white opacity-50"></div>
          
          {/* Teeth */}
          {teeth.map((tooth) => (
            <button
              key={tooth.id}
              className={`absolute w-6 h-8 rounded-sm border-2 transition-all duration-200 hover:scale-110 ${
                selectedTooth === tooth.id
                  ? 'bg-red-500 border-red-600 text-white'
                  : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300'
              }`}
              style={tooth.position}
              onClick={() => onToothSelect(tooth.id)}
              title={`Tooth ${tooth.name}`}
            >
              <span className="text-xs font-medium">{tooth.name.slice(-2)}</span>
            </button>
          ))}
          
          {/* Labels */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
            Upper Jaw
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
            Lower Jaw
          </div>
        </div>
        
        {selectedTooth && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Selected: <span className="font-medium">Tooth {selectedTooth}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToothDiagram;
