import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SPECIALITIES_TREE } from '../../data/users'

export default function AdminSpecialities() {
  const speciality = SPECIALITIES_TREE[0]
  const [level, setLevel] = useState('L3')
  const [section, setSection] = useState('A')
  const [group, setGroup] = useState('G1')

  const selectedGroup = useMemo(() => {
    const foundLevel = speciality.levels.find((item) => item.level === level)
    const foundSection = foundLevel?.sections.find((item) => item.section === section)
    return foundSection?.groups.find((item) => item.group === group)
  }, [group, level, section, speciality.levels])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {speciality.levels.map((item) => <option key={item.level}>{item.level}</option>)}
        </select>
        <select value={section} onChange={(e) => setSection(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {speciality.levels.find((item) => item.level === level)?.sections.map((item) => <option key={item.section}>{item.section}</option>)}
        </select>
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {speciality.levels.find((item) => item.level === level)?.sections.find((item) => item.section === section)?.groups.map((item) => <option key={item.group}>{item.group}</option>)}
        </select>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground">{speciality.speciality} · {level} · Section {section} · {group}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Étudiants du groupe</p>
            <div className="space-y-1">
              {selectedGroup?.students.map((student) => <p key={student} className="text-sm text-foreground">{student}</p>)}
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Modules</p>
            <div className="space-y-1">
              {selectedGroup?.modules.map((module) => <p key={module} className="text-sm text-foreground">{module}</p>)}
            </div>
          </div>
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Enseignants</p>
            <div className="space-y-1">
              {selectedGroup?.teachers.map((teacher) => <p key={teacher} className="text-sm text-foreground">{teacher}</p>)}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
