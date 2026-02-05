import { useCallback, useState, useMemo } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore, TextureType } from '../store/gameStore'

const textureColors: Record<TextureType, string> = {
  dirt: '#8B5A2B',
  grass: '#4CAF50',
  stone: '#808080',
  wood: '#A0522D',
  sand: '#F4D03F',
}

const textureTopColors: Record<TextureType, string> = {
  dirt: '#6B4423',
  grass: '#2E7D32',
  stone: '#696969',
  wood: '#8B4513',
  sand: '#E6C32F',
}

interface CubeProps {
  id: string
  position: [number, number, number]
  texture: TextureType
}

export function Cube({ id, position, texture }: CubeProps) {
  const addCube = useGameStore((state) => state.addCube)
  const removeCube = useGameStore((state) => state.removeCube)
  const [hovered, setHovered] = useState(false)

  const materials = useMemo(() => {
    const sideColor = textureColors[texture]
    const topColor = textureTopColors[texture]

    return [
      new THREE.MeshStandardMaterial({ color: sideColor }), // right
      new THREE.MeshStandardMaterial({ color: sideColor }), // left
      new THREE.MeshStandardMaterial({ color: topColor }), // top
      new THREE.MeshStandardMaterial({ color: sideColor }), // bottom
      new THREE.MeshStandardMaterial({ color: sideColor }), // front
      new THREE.MeshStandardMaterial({ color: sideColor }), // back
    ]
  }, [texture])

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()

      // Alt/Option + click to remove
      if (e.altKey) {
        removeCube(id)
        return
      }

      // Regular click to add
      if (e.face) {
        const normal = e.face.normal
        const [x, y, z] = position
        addCube(
          Math.round(x + normal.x),
          Math.round(y + normal.y),
          Math.round(z + normal.z)
        )
      }
    },
    [addCube, removeCube, id, position]
  )

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        position={position}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
        material={materials}
      >
        <boxGeometry args={[1, 1, 1]} />
        {hovered && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.01, 1.01, 1.01)]} />
            <lineBasicMaterial color="#ffffff" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
    </RigidBody>
  )
}
