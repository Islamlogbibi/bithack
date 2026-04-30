import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { STUDENTS_DIRECTORY } from '../../data/users'

export default function AdminStudents() {
  const [query, setQuery] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('all')
  const [selectedModule, setSelectedModule] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedSection, setSelectedSection] = useState('all')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<typeof STUDENTS_DIRECTORY[number] | null>(null)
  const [selectedYear, setSelectedYear] = useState('2024-2025')
  const [selectedSemester, setSelectedSemester] = useState('S1')
  const [students, setStudents] = useState(STUDENTS_DIRECTORY)

  const filtered = useMemo(
    () => students.filter((student) =>
      `${student.name} ${student.matricule}`.toLowerCase().includes(query.toLowerCase()) &&
      (selectedSpeciality === 'all' || student.speciality === selectedSpeciality) &&
      (selectedModule === 'all' || student.module === selectedModule) &&
      (selectedLevel === 'all' || student.level === selectedLevel) &&
      (selectedSection === 'all' || student.section === selectedSection) &&
      (selectedGroup === 'all' || student.group === selectedGroup)
    ),
    [query, selectedSpeciality, selectedModule, selectedLevel, selectedSection, selectedGroup, students]
  )

  const gpaValue = selectedStudent?.gpaByPeriod.find((entry) => entry.year === selectedYear && entry.semester === selectedSemester)?.gpa

  const addStudent = () => {
    const newId = students.length ? Math.max(...students.map((item) => item.id)) + 1 : 1
    setStudents((prev) => [
      ...prev,
      {
        id: newId,
        name: `Nouvel étudiant ${newId}`,
        matricule: `NEW${newId}`,
        faculty: 'Faculté des Sciences et Technologies',
        department: 'Informatique',
        speciality: 'Informatique',
        module: 'Algorithmique',
        level: 'L3',
        section: 'A',
        group: 'G1',
        average: 0,
        absences: 0,
        notes: [],
        gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 0 }, { year: '2024-2025', semester: 'S2', gpa: 0 }],
      },
    ])
  }

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
    if (selectedStudent?.id === id) setSelectedStudent(null)
  }

  return (
    <>
      <div className="mb-6 space-y-3">
        <div className="max-w-lg relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un étudiant..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select aria-label="Filtre spécialité" value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm">
            <option value="all">Specialité</option>
            <option value="Informatique">Informatique</option>
          </select>
          <select aria-label="Filtre module" value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm">
            <option value="all">Module</option>
            <option value="Algorithmique">Algorithmique</option>
            <option value="Réseaux">Réseaux</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Base de Données">Base de Données</option>
          </select>
          <select aria-label="Filtre niveau" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm">
            <option value="all">Niveau</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
          <select aria-label="Filtre section" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm">
            <option value="all">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <select aria-label="Filtre groupe" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm">
            <option value="all">Groupe</option>
            <option value="G1">G1</option>
            <option value="G2">G2</option>
            <option value="G3">G3</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={addStudent} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Ajouter étudiant</button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <button onClick={() => setSelectedStudent(student)} className="text-left">
                <p className="font-semibold text-foreground hover:text-primary transition-colors">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.matricule} · {student.speciality} · {student.module} · {student.level} · Section {student.section} · {student.group}</p>
              </button>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="text-muted-foreground">Moyenne:</span> <span className="font-semibold text-primary">{student.average.toFixed(1)}</span></p>
                <p><span className="text-muted-foreground">Absences:</span> <span className="font-semibold">{student.absences}</span></p>
              </div>
              <button onClick={() => deleteStudent(student.id)} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-500 text-xs font-semibold">Supprimer</button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{selectedStudent.name} — PGA</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-sm text-muted-foreground hover:text-foreground">Fermer</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select aria-label="Sélection année" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-secondary text-sm">
                <option>2023-2024</option>
                <option>2024-2025</option>
              </select>
              <select aria-label="Sélection semestre" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-secondary text-sm">
                <option>S1</option>
                <option>S2</option>
              </select>
            </div>
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-sm text-muted-foreground">PGA sélectionné</p>
              <p className="text-2xl font-bold text-primary mt-1">{(gpaValue ?? 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
