import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// Declare THREE.js global
declare global {
  interface Window {
    THREE: any;
  }
}

interface ThreeDModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTooth: string;
  onToothSelect: (tooth: string) => void;
}

// Simple 3D Model Viewer using Three.js directly
const ThreeDModelViewer: React.FC<{ selectedTooth: string; onToothSelect: (tooth: string) => void }> = ({ 
  selectedTooth, 
  onToothSelect 
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let animationId: number;

    const createSimple3D = async () => {
      try {
        setDebugInfo('Starting 3D creation...');

        // Load Three.js if needed
        if (!window.THREE) {
          setDebugInfo('Loading Three.js...');
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const THREE = window.THREE;
        setDebugInfo('Three.js loaded, creating scene...');

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 0, 15);
        cameraRef.current = camera;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 500);
        renderer.setClearColor(0x87CEEB, 1);
        rendererRef.current = renderer;

        // Get container
        const container = containerRef.current;
        if (!container) {
          throw new Error('Container not found');
        }

        setDebugInfo('Setting up container...');
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        setDebugInfo('Creating teeth...');

        // Create a simple mouth shape with teeth
        const teeth = [];
        const toothGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.5);

        // Create upper teeth in a semi-circle
        for (let i = 0; i < 8; i++) {
          const angle = (i - 3.5) * 0.3;
          const radius = 4;
          const x = Math.sin(angle) * radius;
          const y = 2 + Math.cos(angle) * 0.5;
          const z = Math.cos(angle) * radius;

          const tooth = new THREE.Mesh(
            toothGeometry,
            new THREE.MeshLambertMaterial({ color: 0xffffff })
          );
          tooth.position.set(x, y, z);
          tooth.rotation.y = angle;
          tooth.userData = { toothId: `Tooth_${11 + i}` };
          teeth.push(tooth);
          scene.add(tooth);
        }

        // Create lower teeth in a semi-circle
        for (let i = 0; i < 8; i++) {
          const angle = (i - 3.5) * 0.3;
          const radius = 4;
          const x = Math.sin(angle) * radius;
          const y = -2 - Math.cos(angle) * 0.5;
          const z = Math.cos(angle) * radius;

          const tooth = new THREE.Mesh(
            toothGeometry,
            new THREE.MeshLambertMaterial({ color: 0xffffff })
          );
          tooth.position.set(x, y, z);
          tooth.rotation.y = angle;
          tooth.userData = { toothId: `Tooth_${31 + i}` };
          teeth.push(tooth);
          scene.add(tooth);
        }

        // Add click event
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event: MouseEvent) => {
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(teeth);

          if (intersects.length > 0) {
            const clickedTooth = intersects[0].object;
            if (clickedTooth.userData.toothId) {
              onToothSelect(clickedTooth.userData.toothId);
            }
          }
        };

        renderer.domElement.addEventListener('click', onMouseClick);

        setDebugInfo('Starting animation...');

        // Animation loop
        const animate = () => {
          if (!mounted) return;
          animationId = requestAnimationFrame(animate);

          // Update tooth colors based on selection
          teeth.forEach(tooth => {
            const material = tooth.material as any;
            if (tooth.userData.toothId === selectedTooth) {
              material.color.setHex(0xFF6B6B); // Red for selected
            } else {
              material.color.setHex(0xffffff); // White for unselected
            }
          });

          // Rotate the entire scene slowly
          scene.rotation.y += 0.01;

          renderer.render(scene, camera);
        };

        animate();
        setModelLoaded(true);
        setDebugInfo('3D model loaded successfully!');

        // Cleanup
        return () => {
          mounted = false;
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          if (renderer && renderer.domElement) {
            renderer.domElement.removeEventListener('click', onMouseClick);
            renderer.dispose();
          }
        };
      } catch (err) {
        if (mounted) {
          console.error('3D Model Error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load 3D model');
          setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    };

    createSimple3D();

    return () => {
      mounted = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [selectedTooth, onToothSelect]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-red-600 text-center">
          <p className="text-lg font-medium mb-2">3D Model Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Debug: {debugInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Click on a tooth to select it</p>
        {debugInfo && (
          <p className="text-xs text-blue-600">{debugInfo}</p>
        )}
      </div>
      
      <div 
        ref={containerRef} 
        className="w-[500px] h-[500px] bg-sky-200 border-2 border-gray-300 rounded-lg flex items-center justify-center"
        style={{ minHeight: '500px' }}
      >
        {!modelLoaded && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading 3D model...</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {selectedTooth ? `Selected: ${selectedTooth}` : 'No tooth selected'}
        </p>
      </div>
    </div>
  );
};

// Fallback tooth diagram for when 3D is not available
const FallbackToothDiagram: React.FC<{ selectedTooth: string; onToothSelect: (tooth: string) => void }> = ({ 
  selectedTooth, 
  onToothSelect 
}) => {
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
    <div className="relative w-full h-96">
      {/* Mouth outline */}
      <div className="absolute inset-4 border-4 border-gray-300 rounded-full bg-white opacity-50"></div>
      
      {/* Teeth */}
      {teeth.map((tooth) => (
        <button
          key={tooth.id}
          className={`absolute w-8 h-10 rounded-sm border-2 transition-all duration-200 hover:scale-110 ${
            selectedTooth === tooth.id
              ? 'bg-red-500 border-red-600 text-white'
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

const ThreeDModelModal: React.FC<ThreeDModelModalProps> = ({
  isOpen,
  onClose,
  selectedTooth,
  onToothSelect
}) => {
  const [use3D, setUse3D] = useState(false);
  const [threeJsLoaded, setThreeJsLoaded] = useState(false);

  useEffect(() => {
    // Check if Three.js is available
    if (typeof window !== 'undefined') {
      // Try to load Three.js from CDN if not available
      if (!window.THREE) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
          setThreeJsLoaded(true);
          setUse3D(true);
        };
        script.onerror = () => {
          setThreeJsLoaded(false);
          setUse3D(false);
        };
        document.head.appendChild(script);
      } else {
        setThreeJsLoaded(true);
        setUse3D(true);
      }
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>3D Tooth Selection</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Select the affected tooth using our interactive 3D model. Click on any tooth to select it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={use3D ? "default" : "outline"}
                size="sm"
                onClick={() => setUse3D(true)}
                disabled={!threeJsLoaded}
              >
                3D View
              </Button>
              <Button
                variant={!use3D ? "default" : "outline"}
                size="sm"
                onClick={() => setUse3D(false)}
              >
                2D View
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              Selected: {selectedTooth || 'None'}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50 flex justify-center" style={{ minHeight: '600px' }}>
            {use3D ? (
              <ThreeDModelViewer selectedTooth={selectedTooth} onToothSelect={onToothSelect} />
            ) : (
              <FallbackToothDiagram selectedTooth={selectedTooth} onToothSelect={onToothSelect} />
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreeDModelModal; 