import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, Trash2, X, Save, GraduationCap } from 'lucide-react'
import { getStudents, apiPost, apiDelete } from '../../lib/api'

export default function AdminStudents() {
  const [query, setQuery] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('all')
  const [selectedModule, setSelectedModule] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedSection, setSelectedSection] = useState('all')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    matricule: '',
    speciality: 'Informatique',
    level: 'L3',
    section: 'A',
    groupName: 'Group A'
  })

  const refreshStudents = () => {
    setLoading(true)
    getStudents()
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data.map(s => ({
            id: s.id,
            name: s.user?.fullName || 'Inconnu',
            email: s.user?.email,
            matricule: s.matricule,
            speciality: s.speciality,
            level: s.level,
            section: s.section,
            group: s.groupName,
            average: s.average,
            absences: s.absences || 0,
            gpaByPeriod: s.gpaByPeriodJson || []
          })))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refreshStudents()
  }, [])

  const filtered = useMemo(
    () => students.filter((student) =>
      `${student.name} ${student.matricule}`.toLowerCase().includes(query.toLowerCase()) &&
      (selectedSpeciality === 'all' || student.speciality === selectedSpeciality) &&
      (selectedLevel === 'all' || student.level === selectedLevel) &&
      (selectedSection === 'all' || student.section === selectedSection) &&
      (selectedGroup === 'all' || student.group === selectedGroup)
    ),
    [query, selectedSpeciality, selectedLevel, selectedSection, selectedGroup, students]
  )

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiPost('/students', {
        fullName: newStudent.name,
        email: newStudent.email || `student.${newStudent.matricule}@pui.dz`,
        matricule: newStudent.matricule,
        speciality: newStudent.speciality,
        level: newStudent.level,
        section: newStudent.section,
        groupName: newStudent.groupName,
        password: 'password123' // default password
      })
      setIsAdding(false)
      setNewStudent({ name: '', email: '', matricule: '', speciality: 'Informatique', level: 'L3', section: 'A', groupName: 'Group A' })
      refreshStudents()
    } catch (err) {
      console.error('Error adding student:', err)
      alert('Erreur lors de l\'ajout de l\'étudiant')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet étudiant ?')) return
    try {
      await apiDelete(`/students/${id}`)
      refreshStudents()
    } catch (err) {
      console.error('Error deleting student:', err)
    }
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-lg relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom ou matricule..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <UserPlus size={18} />
            Nouvel Étudiant
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm outline-none">
            <option value="all">Tous les niveaux</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm outline-none">
            <option value="all">Toutes les sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm outline-none">
            <option value="all">Tous les groupes</option>
            <option value="Group A">Group A</option>
            <option value="Group B">Group B</option>
          </select>
          <select value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-sm outline-none">
            <option value="all">Toutes les spécialités</option>
            <option value="Informatique">Informatique</option>
            <option value="SI">SI</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-2xl text-muted-foreground">
            Aucun étudiant trouvé
          </div>
        ) : filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-bold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    {student.matricule} • {student.level} {student.speciality} • Section {student.section} • {student.group}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Moyenne</p>
                  <p className={`text-sm font-bold ${student.average >= 10 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {student.average.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Absences</p>
                  <p className="text-sm font-bold text-foreground">{student.absences}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <UserPlus size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Ajouter un étudiant</h3>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">NOM COMPLET</label>
                    <input
                      required
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Ex: Amine Benali"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">MATRICULE</label>
                    <input
                      required
                      value={newStudent.matricule}
                      onChange={(e) => setNewStudent({...newStudent, matricule: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Ex: 20240001"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground ml-1">EMAIL (OPTIONNEL)</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="laisser vide pour auto-générer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">NIVEAU</label>
                    <select
                      value={newStudent.level}
                      onChange={(e) => setNewStudent({...newStudent, level: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-sm outline-none"
                    >
                      <option>L1</option><option>L2</option><option>L3</option>
                      <option>M1</option><option>M2</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground ml-1">GROUPE</label>
                    <select
                      value={newStudent.groupName}
                      onChange={(e) => setNewStudent({...newStudent, groupName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-sm outline-none"
                    >
                      <option>Group A</option><option>Group B</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-3 bg-secondary text-foreground rounded-2xl font-bold hover:bg-border transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
