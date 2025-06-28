import React, { Suspense, useState, useEffect } from 'react';

interface ThreeSceneProps {
  selectedTooth: string;
  onToothSelect: (tooth: string) => void;
}

// Fallback component when 3D fails to load
const FallbackToothDiagram: React.FC<ThreeSceneProps> = ({ selectedTooth, onToothSelect }) => {
  const teeth = [
    // Upper teeth (right to left)
    { id: 'Tooth_18', name: '18', position: { top: '20%', right: '10%' } },
    { id: 'Tooth_17', name: '17', position: { top: '15%', right: '15%' } },
    { id: 'Tooth_16', name: '16', position: { top: '10%', right: '20%' } },
    { id: 'Tooth_15', name: '15', position: { top: '8%', right: '25%' } },
    { id: 'Tooth_14', name: '14', position: { top: '5%', right: '30%' } },
    { id: 'Tooth_13', name: '13', position: { top: '3%', right: '35%' } },
    { id: 'Tooth_12', name: '12', position: { top: '2%', right: '40%' } },
    { id: 'Tooth_11', name: '11', position: { top: '2%', right: '45%' } },
    { id: 'Tooth_21', name: '21', position: { top: '2%', left: '45%' } },
    { id: 'Tooth_22', name: '22', position: { top: '2%', left: '40%' } },
    { id: 'Tooth_23', name: '23', position: { top: '3%', left: '35%' } },
    { id: 'Tooth_24', name: '24', position: { top: '5%', left: '30%' } },
    { id: 'Tooth_25', name: '25', position: { top: '8%', left: '25%' } },
    { id: 'Tooth_26', name: '26', position: { top: '10%', left: '20%' } },
    { id: 'Tooth_27', name: '27', position: { top: '15%', left: '15%' } },
    { id: 'Tooth_28', name: '28', position: { top: '20%', left: '10%' } },
    
    // Lower teeth (left to right)
    { id: 'Tooth_38', name: '38', position: { bottom: '20%', left: '10%' } },
    { id: 'Tooth_37', name: '37', position: { bottom: '15%', left: '15%' } },
    { id: 'Tooth_36', name: '36', position: { bottom: '10%', left: '20%' } },
    { id: 'Tooth_35', name: '35', position: { bottom: '8%', left: '25%' } },
    { id: 'Tooth_34', name: '34', position: { bottom: '5%', left: '30%' } },
    { id: 'Tooth_33', name: '33', position: { bottom: '3%', left: '35%' } },
    { id: 'Tooth_32', name: '32', position: { bottom: '2%', left: '40%' } },
    { id: 'Tooth_31', name: '31', position: { bottom: '2%', left: '45%' } },
    { id: 'Tooth_41', name: '41', position: { bottom: '2%', right: '45%' } },
    { id: 'Tooth_42', name: '42', position: { bottom: '2%', right: '40%' } },
    { id: 'Tooth_43', name: '43', position: { bottom: '3%', right: '35%' } },
    { id: 'Tooth_44', name: '44', position: { bottom: '5%', right: '30%' } },
    { id: 'Tooth_45', name: '45', position: { bottom: '8%', right: '25%' } },
    { id: 'Tooth_46', name: '46', position: { bottom: '10%', right: '20%' } },
    { id: 'Tooth_47', name: '47', position: { bottom: '15%', right: '15%' } },
    { id: 'Tooth_48', name: '48', position: { bottom: '20%', right: '10%' } },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Mouth outline */}
      <div className="absolute inset-4 border-4 border-gray-300 rounded-full bg-white opacity-50"></div>
      
      {/* Teeth */}
      {teeth.map((tooth) => (
        <button
          key={tooth.id}
          className={`absolute w-6 h-8 rounded-sm border-2 transition-all duration-200 hover:scale-110 ${
            selectedTooth === tooth.id
              ? 'bg-purple-500 border-purple-600 text-white'
              : 'bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300'
          }`}
          style={tooth.position}
          onClick={() => onToothSelect(tooth.id)}
          title={tooth.id}
        >
          <span className="text-xs font-medium">{tooth.name}</span>
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
  );
};

const ThreeScene: React.FC<ThreeSceneProps> = ({ selectedTooth, onToothSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate loading time and check for 3D support
    const timer = setTimeout(() => {
      try {
        // Check if WebGL is supported
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          throw new Error('WebGL not supported');
        }
        setLoading(false);
      } catch (error) {
        console.error('3D not supported:', error);
        setError(true);
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading 3D model...</div>
      </div>
    );
  }

  // For now, always show fallback due to React Three Fiber compatibility issues
  return <FallbackToothDiagram selectedTooth={selectedTooth} onToothSelect={onToothSelect} />;
};

export default ThreeScene; 