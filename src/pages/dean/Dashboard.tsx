import { useMemo, useState } from 'react'
import { Building2, GraduationCap, UserRound } from 'lucide-react'
import { getTeachers, getStudents } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'

type StudentRow = any

const LEVELS = ['L1', 'L2', 'L3', 'M1', 'M2']

export default function DeanDashboard() {
  const { user } = useAuth()
  const facultyName = user?.role === 'dean' ? user.faculty : ''

  const [PROFESSORS, setProfessors] = useState<any[]>([])
  const [STUDENTS_DIRECTORY, setStudentsDirectory] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getTeachers(), getStudents()]).then(([teachersData, studentsData]) => {
      if (Array.isArray(teachersData)) {
        setProfessors(teachersData.map(t => ({
          id: t.id,
          name: t.user?.fullName || 'Inconnu',
          faculty: t.user?.faculty || 'Nouvelles Technologies',
          department: t.department,
          courses: t.subjectsJson || [],
          email: t.user?.email || ''
        })))
      }
      if (Array.isArray(studentsData)) {
        setStudentsDirectory(studentsData.map(s => ({
          id: s.id,
          name: s.user?.fullName || 'Inconnu',
          matricule: s.matricule,
          faculty: s.displayFaculty || 'Nouvelles Technologies',
          department: s.displayDepartment || 'Informatique',
          speciality: s.speciality,
          level: s.level,
          section: s.section,
          group: s.groupName,
          average: s.average,
          absences: s.absences || 0
        })))
      }
    }).catch(console.error)
  }, [])

  const facultyDepartments = useMemo(() => {
    const departments = STUDENTS_DIRECTORY
      .filter((student) => student.faculty === facultyName)
      .map((student) => student.department)
    return Array.from(new Set(departments))
  }, [facultyName])

  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedField, setSelectedField] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  const currentDepartment = selectedDepartment || facultyDepartments[0] || ''

  const teachersInFaculty = useMemo(
    () => PROFESSORS.filter((professor) => professor.faculty === facultyName),
    [facultyName]
  )

  const departmentTeachers = useMemo(
    () => teachersInFaculty.filter((teacher) => teacher.department === currentDepartment),
    [currentDepartment, teachersInFaculty]
  )

  const fieldsInDepartment = useMemo(() => {
    const fields = STUDENTS_DIRECTORY
      .filter((student) => student.faculty === facultyName && student.department === currentDepartment)
      .map((student) => student.speciality)
    return Array.from(new Set(fields))
  }, [currentDepartment, facultyName])

  const currentField = selectedField || fieldsInDepartment[0] || ''
  const currentLevel = selectedLevel || LEVELS[0]

  const studentsByFilters = useMemo(
    () =>
      STUDENTS_DIRECTORY.filter(
        (student) =>
          student.faculty === facultyName &&
          student.department === currentDepartment &&
          student.speciality === currentField &&
          student.level === currentLevel
      ),
    [currentDepartment, currentField, currentLevel, facultyName]
  )

  const selectedStudent: StudentRow | null = useMemo(
    () => studentsByFilters.find((student) => student.id === selectedStudentId) ?? null,
    [selectedStudentId, studentsByFilters]
  )

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs text-muted-foreground">Faculte</p>
        <h2 className="text-xl font-semibold text-foreground mt-1">{facultyName}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Vous avez acces aux departements, enseignants et etudiants de votre faculte.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Departements de la faculte</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {facultyDepartments.map((department) => (
            <button
              key={department}
              onClick={() => {
                setSelectedDepartment(department)
                setSelectedField('')
                setSelectedLevel('')
                setSelectedStudentId(null)
              }}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                currentDepartment === department
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-foreground'
              }`}
            >
              {department}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserRound size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Enseignants du departement</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Departement selectionne: {currentDepartment || 'Aucun'}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {departmentTeachers.map((teacher) => (
            <div key={teacher.id} className="border border-border rounded-lg p-3 bg-secondary/50">
              <p className="font-semibold text-foreground">{teacher.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{teacher.department}</p>
              <p className="text-xs text-muted-foreground mt-2">Cours: {teacher.courses.join(', ')}</p>
              <p className="text-xs text-muted-foreground mt-1">{teacher.email}</p>
            </div>
          ))}
          {!departmentTeachers.length && (
            <p className="text-sm text-muted-foreground">Aucun enseignant pour ce departement.</p>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Parcours etudiants</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            aria-label="Selection departement"
            value={currentDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value)
              setSelectedField('')
              setSelectedStudentId(null)
            }}
            className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm"
          >
            {facultyDepartments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select
            aria-label="Selection filiere"
            value={currentField}
            onChange={(e) => {
              setSelectedField(e.target.value)
              setSelectedStudentId(null)
            }}
            className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm"
          >
            {fieldsInDepartment.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>

          <select
            aria-label="Selection niveau"
            value={currentLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value)
              setSelectedStudentId(null)
            }}
            className="px-3 py-2 bg-secondary border border-border rounded-xl text-sm"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl p-3">
            <p className="text-sm font-semibold text-foreground mb-3">Liste des etudiants</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {studentsByFilters.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg border ${
                    selectedStudent?.id === student.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/40'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.matricule}</p>
                </button>
              ))}
              {!studentsByFilters.length && (
                <p className="text-sm text-muted-foreground">Aucun etudiant pour ce filtre.</p>
              )}
            </div>
          </div>

          <div className="border border-border rounded-xl p-3">
            <p className="text-sm font-semibold text-foreground mb-3">Informations etudiant</p>
            {selectedStudent ? (
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Nom:</span> {selectedStudent.name}</p>
                <p><span className="text-muted-foreground">Matricule:</span> {selectedStudent.matricule}</p>
                <p><span className="text-muted-foreground">Departement:</span> {selectedStudent.department}</p>
                <p><span className="text-muted-foreground">Filiere:</span> {selectedStudent.speciality}</p>
                <p><span className="text-muted-foreground">Niveau:</span> {selectedStudent.level}</p>
                <p><span className="text-muted-foreground">Section/Groupe:</span> {selectedStudent.section} / {selectedStudent.group}</p>
                <p><span className="text-muted-foreground">Moyenne:</span> {selectedStudent.average.toFixed(2)}</p>
                <p><span className="text-muted-foreground">Absences:</span> {selectedStudent.absences}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Selectionnez un etudiant pour voir ses informations.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
