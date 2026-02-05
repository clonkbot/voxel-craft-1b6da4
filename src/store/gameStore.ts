import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type TextureType = 'dirt' | 'grass' | 'stone' | 'wood' | 'sand'

interface Cube {
  id: string
  position: [number, number, number]
  texture: TextureType
}

interface GameState {
  cubes: Cube[]
  texture: TextureType
  addCube: (x: number, y: number, z: number) => void
  removeCube: (id: string) => void
  setTexture: (texture: TextureType) => void
}

const generateInitialTerrain = (): Cube[] => {
  const cubes: Cube[] = []

  for (let x = -8; x <= 8; x++) {
    for (let z = -8; z <= 8; z++) {
      // Create varied terrain height using simple noise
      const height = Math.floor(
        Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2 +
        Math.sin(x * 0.1 + z * 0.1) * 1.5
      )

      // Add grass on top
      cubes.push({
        id: nanoid(),
        position: [x, height, z],
        texture: 'grass',
      })

      // Add dirt below grass
      for (let y = height - 1; y >= height - 2; y--) {
        cubes.push({
          id: nanoid(),
          position: [x, y, z],
          texture: 'dirt',
        })
      }

      // Add stone below dirt
      for (let y = height - 3; y >= -3; y--) {
        cubes.push({
          id: nanoid(),
          position: [x, y, z],
          texture: 'stone',
        })
      }
    }
  }

  // Add some trees
  const treePositions = [
    [3, 0, 3],
    [-5, 0, 2],
    [6, 0, -4],
    [-3, 0, -6],
  ]

  treePositions.forEach(([tx, _, tz]) => {
    const baseHeight = Math.floor(
      Math.sin(tx * 0.3) * Math.cos(tz * 0.3) * 2 +
      Math.sin(tx * 0.1 + tz * 0.1) * 1.5
    ) + 1

    // Tree trunk
    for (let y = baseHeight; y < baseHeight + 4; y++) {
      cubes.push({
        id: nanoid(),
        position: [tx, y, tz],
        texture: 'wood',
      })
    }
  })

  return cubes
}

export const useGameStore = create<GameState>((set) => ({
  cubes: generateInitialTerrain(),
  texture: 'grass',
  addCube: (x, y, z) =>
    set((state) => ({
      cubes: [
        ...state.cubes,
        {
          id: nanoid(),
          position: [x, y, z],
          texture: state.texture,
        },
      ],
    })),
  removeCube: (id) =>
    set((state) => ({
      cubes: state.cubes.filter((cube) => cube.id !== id),
    })),
  setTexture: (texture) => set({ texture }),
}))
