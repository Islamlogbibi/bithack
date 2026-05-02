import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSpecialitiesTree, getStudents } from '../../lib/api'

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
  const [studentsList, setStudentsList] = useState<any[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)

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

  useEffect(() => {
    if (!specialityName || !level || !section || !group) {
      setStudentsList([])
      return
    }
    setLoadingStudents(true)
    getStudents({ speciality: specialityName, level, section, group })
      .then((data) => {
        setStudentsList(Array.isArray(data) ? data : [])
      })
      .catch(console.error)
      .finally(() => setLoadingStudents(false))
  }, [specialityName, level, section, group])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <select aria-label="Sélection spécialité" value={specialityName} onChange={(e) => { setSpecialityName(e.target.value); setLevel(''); setSection(''); setGroup(''); }} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="" disabled>Spécialité</option>
          {tree.map((item) => <option key={item.speciality}>{item.speciality}</option>)}
        </select>
        <select aria-label="Sélection niveau" value={level} onChange={(e) => { setLevel(e.target.value); setSection(''); setGroup(''); }} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="" disabled>Niveau</option>
          {speciality?.levels?.map((item: any) => <option key={item.level}>{item.level}</option>)}
        </select>
        <select aria-label="Sélection section" value={section} onChange={(e) => { setSection(e.target.value); setGroup(''); }} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="" disabled>Section</option>
          {speciality?.levels?.find((item: any) => item.level === level)?.sections?.map((item: any) => <option key={item.section}>{item.section}</option>)}
        </select>
        <select aria-label="Sélection groupe" value={group} onChange={(e) => setGroup(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="" disabled>Groupe</option>
          {speciality?.levels?.find((item: any) => item.level === level)?.sections?.find((item: any) => item.section === section)?.groups?.map((item: any) => <option key={item.group}>{item.group}</option>)}
        </select>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground">{speciality?.speciality} · {level} · Section {section} · {group}</h3>
        <div className="mt-4 overflow-hidden border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Étudiant</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest border-l border-border">Matricule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingStudents ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-sm text-muted-foreground">Chargement des étudiants...</td>
                </tr>
              ) : studentsList.length > 0 ? (
                studentsList.map((s) => (
                  <tr key={s.id || s.matricule} className="bg-card hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-primary">
                          {s.user?.fullName?.charAt(0) || '?'}
                        </div>
                        <p className="font-bold text-foreground">{s.user?.fullName || 'Étudiant sans nom'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-muted-foreground border-l border-border">{s.matricule}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-sm text-muted-foreground">Aucun étudiant disponible pour ce choix.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  )
}
