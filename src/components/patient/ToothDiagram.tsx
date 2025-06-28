import React, { Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import the toothNameMap from public directory
const toothNameMap: { [key: string]: string } = {
  Tooth_11: 'Upper Right Central Incisor',
  Tooth_12: 'Upper Right Lateral Incisor',
  Tooth_13: 'Upper Right Canine',
  Tooth_14: 'Upper Right First Premolar',
  Tooth_15: 'Upper Right Second Premolar',
  Tooth_16: 'Upper Right First Molar',
  Tooth_17: 'Upper Right Second Molar',
  Tooth_18: 'Upper Right Third Molar (Wisdom Tooth)',

  Tooth_21: 'Upper Left Central Incisor',
  Tooth_22: 'Upper Left Lateral Incisor',
  Tooth_23: 'Upper Left Canine',
  Tooth_24: 'Upper Left First Premolar',
  Tooth_25: 'Upper Left Second Premolar',
  Tooth_26: 'Upper Left First Molar',
  Tooth_27: 'Upper Left Second Molar',
  Tooth_28: 'Upper Left Third Molar',

  Tooth_31: 'Lower Left Central Incisor',
  Tooth_32: 'Lower Left Lateral Incisor',
  Tooth_33: 'Lower Left Canine',
  Tooth_34: 'Lower Left First Premolar',
  Tooth_35: 'Lower Left Second Premolar',
  Tooth_36: 'Lower Left First Molar',
  Tooth_37: 'Lower Left Second Molar',
  Tooth_38: 'Lower Left Third Molar',

  Tooth_41: 'Lower Right Central Incisor',
  Tooth_42: 'Lower Right Lateral Incisor',
  Tooth_43: 'Lower Right Canine',
  Tooth_44: 'Lower Right First Premolar',
  Tooth_45: 'Lower Right Second Premolar',
  Tooth_46: 'Lower Right First Molar',
  Tooth_47: 'Lower Right Second Molar',
  Tooth_48: 'Lower Right Third Molar',

  Zunge_Plane012: 'Tongue',
  Gums_node: 'Gums',
};

interface ToothDiagramProps {
  onToothSelect: (tooth: string) => void;
  selectedTooth: string;
}

// Lazy load the 3D scene component
const ThreeScene = lazy(() => import('./ThreeScene'));

const ToothDiagram: React.FC<ToothDiagramProps> = ({ onToothSelect, selectedTooth }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Click on the affected tooth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tooth Diagram */}
          <div className="relative w-full h-96 bg-gradient-to-b from-pink-50 to-pink-100 rounded-lg border-2 border-gray-200">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Loading 3D model...</div>
              </div>
            }>
              <ThreeScene selectedTooth={selectedTooth} onToothSelect={onToothSelect} />
            </Suspense>
          </div>
          
          {/* Instructions - positioned below the diagram */}
          <div className="bg-white bg-opacity-95 rounded-lg p-3 text-sm border border-gray-200">
            <p className="text-gray-700 mb-2">
              <strong>Instructions:</strong>
            </p>
            <ul className="text-gray-600 space-y-1">
              <li>• Click on any tooth to select it</li>
              <li>• Drag to rotate the view</li>
              <li>• Scroll to zoom in/out</li>
            </ul>
          </div>
        </div>
        
        {selectedTooth && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Selected: <span className="font-medium">{toothNameMap[selectedTooth] || selectedTooth}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToothDiagram;
