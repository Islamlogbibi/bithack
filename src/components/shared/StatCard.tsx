import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  icon: React.ReactNode
  color: string
  bgColor: string
  delay?: number
  badge?: string
  badgeColor?: string
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
      else setCount(target)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])
  return count
}

export default function StatCard({ title, value, suffix = '', icon, color, bgColor, delay = 0, badge, badgeColor }: StatCardProps) {
  const numValue = typeof value === 'number' ? value : 0
  const count = useCountUp(numValue)
  const displayValue = typeof value === 'number' ? count : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(59,130,246,0.15)' }}
      className="relative bg-card border border-border rounded-xl p-5 cursor-default overflow-hidden"
    >
      <div className={`absolute inset-0 opacity-5 ${bgColor}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-bold ${color}`}>{displayValue}</span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${bgColor} bg-opacity-20`}>
          <span className={color}>{icon}</span>
        </div>
      </div>
      {badge && (
        <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </motion.div>
  )
}
