import { useEffect } from 'react'
import { useGameStore, TextureType } from '../store/gameStore'

const blocks: { type: TextureType; color: string; topColor: string; label: string }[] = [
  { type: 'grass', color: '#4CAF50', topColor: '#2E7D32', label: 'Grass' },
  { type: 'dirt', color: '#8B5A2B', topColor: '#6B4423', label: 'Dirt' },
  { type: 'stone', color: '#808080', topColor: '#696969', label: 'Stone' },
  { type: 'wood', color: '#A0522D', topColor: '#8B4513', label: 'Wood' },
  { type: 'sand', color: '#F4D03F', topColor: '#E6C32F', label: 'Sand' },
]

export function HUD() {
  const texture = useGameStore((state) => state.texture)
  const setTexture = useGameStore((state) => state.setTexture)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key)
      if (key >= 1 && key <= 5) {
        setTexture(blocks[key - 1].type)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setTexture])

  return (
    <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex gap-1 md:gap-2 p-2 md:p-3 bg-stone-900/90 backdrop-blur-md border border-amber-900/40 rounded-xl shadow-2xl">
        {blocks.map((block, index) => (
          <button
            key={block.type}
            onClick={() => setTexture(block.type)}
            className={`
              relative w-12 h-12 md:w-14 md:h-14 rounded-lg transition-all duration-200
              border-2 group overflow-hidden
              ${
                texture === block.type
                  ? 'border-amber-400 shadow-lg shadow-amber-500/30 scale-110'
                  : 'border-stone-700/50 hover:border-stone-500 hover:scale-105'
              }
            `}
            title={`${block.label} (${index + 1})`}
          >
            {/* 3D block representation */}
            <div className="absolute inset-1 md:inset-1.5">
              {/* Top face */}
              <div
                className="absolute top-0 left-0 right-0 h-1/3 rounded-t-sm transform skew-x-0"
                style={{ backgroundColor: block.topColor }}
              />
              {/* Front face */}
              <div
                className="absolute bottom-0 left-0 right-0 h-2/3 rounded-b-sm"
                style={{ backgroundColor: block.color }}
              />
              {/* Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-sm" />
            </div>

            {/* Key number */}
            <span className="absolute top-0.5 right-1 text-[9px] md:text-[10px] font-mono text-stone-500 group-hover:text-stone-300">
              {index + 1}
            </span>

            {/* Selection indicator */}
            {texture === block.type && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-400 rotate-45" />
            )}
          </button>
        ))}
      </div>

      {/* Decorative mining elements */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-600/50 to-amber-900/50 rounded-full" />
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-600/50 to-amber-900/50 rounded-full" />
    </div>
  )
}
