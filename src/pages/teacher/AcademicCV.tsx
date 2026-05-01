import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, Link as LinkIcon, Plus, Trash2, Save, ExternalLink, GraduationCap, Award } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser } from '../../types/domain'

interface Publication {
  title: string
  year: number
  journal: string
}

export default function AcademicCV() {
  const { user } = useAuth()
  const teacher = user as TeacherUser
  
  const [orcid, setOrcid] = useState(teacher.academicCvJson?.orcid || '')
  const [scopus, setScopus] = useState(teacher.academicCvJson?.scopus || '')
  const [publications, setPublications] = useState<Publication[]>(teacher.academicCvJson?.publications || [])
  const [isSaving, setIsSaving] = useState(false)

  const addPublication = () => {
    setPublications([...publications, { title: '', year: new Date().getFullYear(), journal: '' }])
  }

  const removePublication = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index))
  }

  const updatePublication = (index: number, field: keyof Publication, value: string | number) => {
    const newPubs = [...publications]
    newPubs[index] = { ...newPubs[index], [field]: value }
    setPublications(newPubs)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // In a real app, we would call an API here
    // await apiPost('/teacher/cv', { orcid, scopus, publications })
    setTimeout(() => {
      setIsSaving(false)
      alert('Profil académique mis à jour avec succès !')
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profil Académique & CV</h1>
          <p className="text-muted-foreground mt-1">Gérez vos identifiants de recherche et vos publications</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          Enregistrer
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identifiers */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <LinkIcon size={18} className="text-primary" />
              Identifiants
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">ORCID ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={orcid}
                    onChange={(e) => setOrcid(e.target.value)}
                    placeholder="0000-0000-0000-0000"
                    className="w-full pl-3 pr-10 py-2 bg-secondary border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  {orcid && (
                    <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Scopus Author ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={scopus}
                    onChange={(e) => setScopus(e.target.value)}
                    placeholder="57193563400"
                    className="w-full pl-3 pr-10 py-2 bg-secondary border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  {scopus && (
                    <a href={`https://www.scopus.com/authid/detail.uri?authorId=${scopus}`} target="_blank" rel="noreferrer" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award size={18} className="text-primary" />
              Stats de recherche
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary rounded-lg text-center">
                <p className="text-xl font-bold text-foreground">12</p>
                <p className="text-[10px] text-muted-foreground uppercase">H-Index</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg text-center">
                <p className="text-xl font-bold text-foreground">450</p>
                <p className="text-[10px] text-muted-foreground uppercase">Citations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Publications */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                <Book size={20} className="text-primary" />
                Publications Récentes
              </h3>
              <button
                onClick={addPublication}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <Plus size={14} />
                Ajouter
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {publications.length === 0 ? (
                  <div className="py-12 text-center">
                    <GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Aucune publication enregistrée</p>
                  </div>
                ) : (
                  publications.map((pub, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="group relative p-4 bg-secondary/50 border border-border rounded-xl hover:border-primary/30 transition-all"
                    >
                      <button
                        onClick={() => removePublication(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          value={pub.title}
                          onChange={(e) => updatePublication(index, 'title', e.target.value)}
                          placeholder="Titre de la publication"
                          className="w-full bg-transparent border-none p-0 font-semibold text-foreground placeholder:text-muted-foreground/50 focus:ring-0 text-sm"
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={pub.journal}
                              onChange={(e) => updatePublication(index, 'journal', e.target.value)}
                              placeholder="Journal / Conférence"
                              className="w-full bg-transparent border-none p-0 text-xs text-primary placeholder:text-muted-foreground/50 focus:ring-0"
                            />
                          </div>
                          <div className="w-20">
                            <input
                              type="number"
                              value={pub.year}
                              onChange={(e) => updatePublication(index, 'year', parseInt(e.target.value))}
                              placeholder="Année"
                              className="w-full bg-transparent border-none p-0 text-xs text-muted-foreground text-right placeholder:text-muted-foreground/50 focus:ring-0"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
