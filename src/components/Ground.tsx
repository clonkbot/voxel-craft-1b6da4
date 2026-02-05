import { RigidBody } from '@react-three/rapier'

export function Ground() {
  return (
    <RigidBody type="fixed" friction={1}>
      <mesh receiveShadow position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a1612" />
      </mesh>
    </RigidBody>
  )
}
