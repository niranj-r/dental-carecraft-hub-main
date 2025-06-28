import { useGLTF } from '@react-three/drei'

export default function ModelViewer({ selected, onSelect }) {
  const { nodes } = useGLTF('/models/Mouth.glb')

  return (
    <group scale={0.2} position={[0, -1, 0]}>
      {Object.entries(nodes).map(([key, node]) => {
        if (node.isMesh) {
          const isSelected = key === selected
          return (
            <mesh
              key={key}
              geometry={node.geometry}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(key)
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'default')}
            >
              <meshStandardMaterial
                color={isSelected ? '#7D799F' : 'white'}
              />
            </mesh>
          )
        }
        return null
      })}
    </group>
  )
}
