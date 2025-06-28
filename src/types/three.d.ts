declare module '@react-three/fiber' {
  import { ReactThreeFiber } from '@react-three/fiber';
  export * from '@react-three/fiber';
  
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
        mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
        meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
        ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
        directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      }
    }
  }
}

declare module '@react-three/drei' {
  export * from '@react-three/drei';
}

declare module 'three' {
  export * from 'three';
}

// GLTF model types
declare module '*.glb' {
  const content: any;
  export default content;
}

declare module '*.gltf' {
  const content: any;
  export default content;
} 