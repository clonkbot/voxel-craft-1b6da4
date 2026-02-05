import { Canvas } from '@react-three/fiber'
import { KeyboardControls, PointerLockControls, Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Suspense, useMemo } from 'react'
import { Ground } from './components/Ground'
import { Player } from './components/Player'
import { Cubes } from './components/Cubes'
import { HUD } from './components/HUD'
import { useGameStore } from './store/gameStore'

export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  jump: 'jump',
}

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
    ],
    []
  )

  const texture = useGameStore((state) => state.texture)

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: '#1a1612' }}>
      <KeyboardControls map={map}>
        <Canvas
          shadows
          gl={{ antialias: false }}
          camera={{ fov: 70, near: 0.1, far: 1000 }}
        >
          <Sky sunPosition={[100, 80, 100]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[100, 100, 50]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={500}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <fog attach="fog" args={['#87CEEB', 50, 200]} />
          <Suspense fallback={null}>
            <Physics gravity={[0, -30, 0]}>
              <Player />
              <Ground />
              <Cubes />
            </Physics>
          </Suspense>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>

      <HUD />

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/70 transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70 transform -translate-x-1/2" />
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <div className="bg-stone-900/80 backdrop-blur-sm border border-amber-900/50 rounded-lg p-3 md:p-4 shadow-2xl">
          <h2 className="font-display text-amber-400 text-xs md:text-sm tracking-widest mb-2 uppercase">Controls</h2>
          <div className="space-y-1 font-mono text-[10px] md:text-xs text-stone-400">
            <p><span className="text-amber-500">WASD</span> — Move</p>
            <p><span className="text-amber-500">SPACE</span> — Jump</p>
            <p><span className="text-amber-500">CLICK</span> — Place block</p>
            <p><span className="text-amber-500">ALT+CLICK</span> — Remove block</p>
            <p><span className="text-amber-500">1-5</span> — Select block</p>
          </div>
        </div>
      </div>

      {/* Current Block Indicator */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <div className="bg-stone-900/80 backdrop-blur-sm border border-amber-900/50 rounded-lg p-3 md:p-4 shadow-2xl">
          <p className="font-display text-amber-400 text-xs md:text-sm tracking-widest uppercase">Selected</p>
          <p className="font-mono text-stone-200 text-sm md:text-base mt-1 capitalize">{texture}</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 z-10 text-center">
        <p className="font-mono text-[10px] md:text-xs text-stone-600/80 tracking-wide">
          Requested by <span className="text-stone-500">@0xPaulius</span> · Built by <span className="text-stone-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

export default App
