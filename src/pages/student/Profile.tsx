import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, 
  Clock, Edit2, Save, X, Camera, Award, Users,
  GraduationCap, FileText
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StudentUser } from '../../data/users'

// Extended student info (in real app, this would come from API)
interface ExtendedStudentInfo {
  dateOfBirth: string
  placeOfBirth: string
  phone: string
  address: string
}

const MOCK_EXTENDED_INFO: ExtendedStudentInfo = {
  dateOfBirth: '1998-05-15',
  placeOfBirth: 'Annaba, Algérie',
  phone: '+213 555 123 456',
  address: '12 Rue Didouche Mourad, Annaba 23000',
}

export default function StudentProfile() {
  const { user } = useAuth()
  const student = user as StudentUser

  const [isEditing, setIsEditing] = useState(false)
  const [extendedInfo, setExtendedInfo] = useState<ExtendedStudentInfo>(MOCK_EXTENDED_INFO)
  const [editedInfo, setEditedInfo] = useState<ExtendedStudentInfo>(MOCK_EXTENDED_INFO)

  const handleEdit = () => {
    setEditedInfo(extendedInfo)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedInfo(extendedInfo)
  }

  const handleSave = () => {
    setExtendedInfo(editedInfo)
    setIsEditing(false)
  }

  const handleChange = (field: keyof ExtendedStudentInfo, value: string) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }))
  }

  const infoFields: { label: string; value: string; icon: React.ReactNode; field?: keyof ExtendedStudentInfo }[] = [
    { label: 'Matricule', value: student.matricule, icon: <FileText size={16} /> },
    { label: 'Email', value: student.email, icon: <Mail size={16} /> },
    { label: 'Téléphone', value: extendedInfo.phone, icon: <Phone size={16} />, field: 'phone' },
    { label: 'Date de naissance', value: new Date(extendedInfo.dateOfBirth).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), icon: <Calendar size={16} />, field: 'dateOfBirth' },
    { label: 'Lieu de naissance', value: extendedInfo.placeOfBirth, icon: <MapPin size={16} />, field: 'placeOfBirth' },
    { label: 'Adresse', value: extendedInfo.address, icon: <MapPin size={16} />, field: 'address' },
    { label: 'Groupe', value: student.group, icon: <Users size={16} /> },
    { label: 'Année', value: student.year, icon: <GraduationCap size={16} /> },
  ]



  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 text-center"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <Camera size={14} className="text-primary-foreground" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{student.year}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">{student.gpa}</p>
                <p className="text-xs text-muted-foreground">Moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {Object.values(student.absences).reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Absences</p>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="mt-6 w-full py-2.5 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Modifier le profil
              </button>
            )}
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-5 mt-4"
          >
            <h3 className="font-semibold text-foreground mb-4">Informations académiques</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Crédits validés</span>
                <span className="text-sm font-medium text-foreground">21</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Modules validés</span>
                <span className="text-sm font-medium text-foreground">5/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rang</span>
                <span className="text-sm font-medium text-foreground">12/28</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <User size={18} className="text-primary" />
                Informations personnelles
              </h3>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Save size={16} className="text-green-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoFields.map((field) => (
                <div key={field.label} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    {field.icon}
                    <span className="text-xs">{field.label}</span>
                  </div>
                  {isEditing && field.field ? (
                    field.field === 'dateOfBirth' ? (
                      <input
                        type="date"
                        value={editedInfo[field.field as keyof ExtendedStudentInfo] as string}
                        onChange={(e) => handleChange(field.field as keyof ExtendedStudentInfo, e.target.value)}
                        className="w-full px-2 py-1 bg-card border border-border rounded text-sm text-foreground"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editedInfo[field.field as keyof ExtendedStudentInfo] as string}
                        onChange={(e) => handleChange(field.field as keyof ExtendedStudentInfo, e.target.value)}
                        className="w-full px-2 py-1 bg-card border border-border rounded text-sm text-foreground"
                      />
                    )
                  ) : (
                    <p className="text-sm font-medium text-foreground">{field.value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}