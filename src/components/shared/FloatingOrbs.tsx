import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function FloatingOrbs() {
  const { theme } = useTheme()

  if (theme === 'light') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-25" />
      </div>
    )
  }

  const orbs = [
    { x: '10%', y: '15%', size: 320, color: 'rgba(59,130,246,0.12)', duration: 8 },
    { x: '70%', y: '60%', size: 280, color: 'rgba(99,102,241,0.10)', duration: 10 },
    { x: '40%', y: '75%', size: 200, color: 'rgba(59,130,246,0.08)', duration: 12 },
    { x: '85%', y: '10%', size: 240, color: 'rgba(99,102,241,0.09)', duration: 9 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  )
}
