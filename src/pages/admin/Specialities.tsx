import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getSpecialitiesTree } from '../../lib/api'
import { useEffect } from 'react'

export default function AdminSpecialities() {
  const [tree, setTree] = useState<any[]>([])
  const [specialityName, setSpecialityName] = useState('')
  const speciality = useMemo(
    () => tree.find((item) => item.speciality === specialityName) ?? tree[0],
    [specialityName, tree]
  )
  const [level, setLevel] = useState('')
  const [section, setSection] = useState('')
  const [group, setGroup] = useState('')
  const [showStudentsPopup, setShowStudentsPopup] = useState(false)

  useEffect(() => {
    getSpecialitiesTree().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setTree(data)
        setSpecialityName(data[0].speciality)
        setLevel(data[0].levels[0]?.level || '')
        setSection(data[0].levels[0]?.sections[0]?.section || '')
        setGroup(data[0].levels[0]?.sections[0]?.groups[0]?.group || '')
      }
    }).catch(console.error)
  }, [])

  const selectedGroup = useMemo(() => {
    const foundLevel = speciality?.levels?.find((item: any) => item.level === level)
    const foundSection = foundLevel?.sections?.find((item: any) => item.section === section)
    return foundSection?.groups?.find((item: any) => item.group === group)
  }, [group, level, section, speciality])

  const teacherModuleRows = useMemo(() => {
    if (!selectedGroup) return []
    return selectedGroup.teachers.map((teacher, index) => ({
      teacher,
      module: selectedGroup.modules[index] ?? selectedGroup.modules[selectedGroup.modules.length - 1] ?? '—',
    }))
  }, [selectedGroup])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <select aria-label="Sélection spécialité" value={specialityName} onChange={(e) => setSpecialityName(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {tree.map((item) => <option key={item.speciality}>{item.speciality}</option>)}
        </select>
        <select aria-label="Sélection niveau" value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {speciality?.levels?.map((item: any) => <option key={item.level}>{item.level}</option>)}
        </select>
        <select aria-label="Sélection section" value={section} onChange={(e) => setSection(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {speciality?.levels?.find((item: any) => item.level === level)?.sections?.map((item: any) => <option key={item.section}>{item.section}</option>)}
        </select>
        <select aria-label="Sélection groupe" value={group} onChange={(e) => setGroup(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          {speciality?.levels?.find((item: any) => item.level === level)?.sections?.find((item: any) => item.section === section)?.groups?.map((item: any) => <option key={item.group}>{item.group}</option>)}
        </select>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground">{speciality?.speciality} · {level} · Section {section} · {group}</h3>
        <div className="mt-4 overflow-hidden border border-border rounded-xl">
          <div className="grid grid-cols-2 bg-secondary/70 border-b border-border">
            <div className="p-3 text-xs font-semibold text-muted-foreground">Enseignant</div>
            <div className="p-3 text-xs font-semibold text-muted-foreground border-l border-border">Module</div>
          </div>
          <div className="divide-y divide-border">
            {teacherModuleRows.map((row) => (
              <div key={`${row.teacher}-${row.module}`} className="p-3 bg-card">
                <div className="grid grid-cols-2">
                  <p className="text-sm font-semibold text-foreground">{row.teacher}</p>
                  <p className="text-sm text-foreground border-l border-border pl-3">{row.module}</p>
                </div>
              </div>
            ))}
            {!teacherModuleRows.length && (
              <div className="p-4 text-sm text-muted-foreground">Aucune correspondance disponible pour ce choix.</div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowStudentsPopup(true)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Voir la liste des étudiants
          </button>
        </div>
      </motion.div>

      {showStudentsPopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">Liste des étudiants</h4>
              <button
                onClick={() => setShowStudentsPopup(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Fermer
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {speciality?.speciality} · {level} · Section {section} · {group}
            </p>
            <div className="space-y-1">
              {selectedGroup?.students?.map((student: any) => (
                <p key={student} className="px-2 py-1 rounded-md bg-secondary border border-border text-xs text-foreground">
                  {student}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
