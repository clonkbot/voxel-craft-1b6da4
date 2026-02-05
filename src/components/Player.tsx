import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { CapsuleCollider, RigidBody, RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const MOVE_SPEED = 5
const JUMP_FORCE = 8

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null!)
  const isOnGround = useRef(true)
  const [, getKeys] = useKeyboardControls()

  useFrame((state) => {
    if (!rigidBodyRef.current) return

    const keys = getKeys() as { forward: boolean; back: boolean; left: boolean; right: boolean; jump: boolean }
    const { forward, back, left, right, jump } = keys

    const velocity = rigidBodyRef.current.linvel()

    // Get camera direction
    const camera = state.camera
    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()

    const sideDirection = new THREE.Vector3()
    sideDirection.crossVectors(camera.up, direction).normalize()

    // Calculate movement
    const moveDirection = new THREE.Vector3(0, 0, 0)

    if (forward) moveDirection.add(direction)
    if (back) moveDirection.sub(direction)
    if (left) moveDirection.add(sideDirection)
    if (right) moveDirection.sub(sideDirection)

    if (moveDirection.length() > 0) {
      moveDirection.normalize()
    }

    rigidBodyRef.current.setLinvel(
      {
        x: moveDirection.x * MOVE_SPEED,
        y: velocity.y,
        z: moveDirection.z * MOVE_SPEED,
      },
      true
    )

    // Jump
    if (jump && isOnGround.current) {
      rigidBodyRef.current.setLinvel(
        {
          x: velocity.x,
          y: JUMP_FORCE,
          z: velocity.z,
        },
        true
      )
      isOnGround.current = false
    }

    // Check if on ground (simple check)
    if (velocity.y > -0.1 && velocity.y < 0.1) {
      isOnGround.current = true
    }

    // Update camera position
    const position = rigidBodyRef.current.translation()
    camera.position.set(position.x, position.y + 0.7, position.z)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 10, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
    >
      <CapsuleCollider args={[0.5, 0.3]} />
    </RigidBody>
  )
}
