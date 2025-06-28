import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThreeDModelModal from '@/components/patient/ThreeDModelModal';

const Tooth3DViewer = () => {
  const navigate = useNavigate();
  const [selectedTooth, setSelectedTooth] = useState('');
  const [show3DModal, setShow3DModal] = useState(true);

  const handleToothSelect = (tooth: string) => {
    setSelectedTooth(tooth);
  };

  const handleClose = () => {
    setShow3DModal(false);
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">3D Tooth Selection</h1>
          <p className="text-gray-600">Select the affected tooth using our interactive 3D model</p>
        </div>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Box className="h-5 w-5" />
            <span>How to Use</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">3D View Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Interactive 3D mouth model</li>
                <li>• Click on any tooth to select it</li>
                <li>• Rotate and zoom the model</li>
                <li>• Visual feedback for selected teeth</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Tooth Numbering:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upper right: 11-18</li>
                <li>• Upper left: 21-28</li>
                <li>• Lower left: 31-38</li>
                <li>• Lower right: 41-48</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Selection */}
      {selectedTooth && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Selected Tooth</h3>
                <p className="text-blue-700">{selectedTooth}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTooth('')}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setShow3DModal(true)}
          className="flex items-center space-x-2"
        >
          <Box className="h-4 w-4" />
          <span>Open 3D Model</span>
        </Button>
        <Button
          onClick={() => {
            if (selectedTooth) {
              // You can add logic here to save the selection or navigate to booking
              navigate('/patient/book-appointment', { 
                state: { selectedTooth } 
              });
            } else {
              setShow3DModal(true);
            }
          }}
        >
          {selectedTooth ? 'Continue to Booking' : 'Select a Tooth'}
        </Button>
      </div>

      {/* 3D Model Modal */}
      <ThreeDModelModal
        isOpen={show3DModal}
        onClose={handleClose}
        selectedTooth={selectedTooth}
        onToothSelect={handleToothSelect}
      />
    </div>
  );
};

export default Tooth3DViewer; 