import { useGameStore, TextureType } from '../store/gameStore'
import { Cube } from './Cube'

export function Cubes() {
  const cubes = useGameStore((state) => state.cubes)

  return (
    <>
      {cubes.map((cube) => (
        <Cube
          key={cube.id}
          id={cube.id}
          position={cube.position}
          texture={cube.texture}
        />
      ))}
    </>
  )
}
