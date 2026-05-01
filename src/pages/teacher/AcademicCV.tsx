import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Plus, Trash2, Sparkles, Link as LinkIcon, 
  Share2, Copy, X, Zap, Upload, FileText, Save,
  CheckCircle, Award, BookOpen, GraduationCap, Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { TeacherUser } from '../../types/domain';
import { apiPost } from '../../lib/api';

// Premium animation styles injected via style tag
const animationStyles = `
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1), 0 4px 20px rgba(59, 130, 246, 0.05); }
    50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2), 0 4px 30px rgba(59, 130, 246, 0.1); }
  }
  .animate-glow { animation: glow 3s ease-in-out infinite; }
  
  .cv-preview-scroll::-webkit-scrollbar { width: 6px; }
  .cv-preview-scroll::-webkit-scrollbar-track { background: transparent; }
  .cv-preview-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  .dark .cv-preview-scroll::-webkit-scrollbar-thumb { background: #334155; }
`;

export default function AcademicCV() {
  const { user } = useAuth();
  const teacher = user as TeacherUser;

  const [cvData, setCVData] = useState({
    personalInfo: {
      fullName: teacher.name,
      email: teacher.email,
      department: teacher.department,
      specialization: teacher.subjects[0] || 'Enseignant Chercheur'
    },
    picture: null as string | null,
    summary: teacher.academicCvJson?.summary || '',
    publications: teacher.academicCvJson?.publications || [
      { id: 1, title: '', authors: '', year: '', journal: '', pdfFile: null as string | null }
    ],
    teaching: teacher.academicCvJson?.teaching || [
      { id: 1, courseName: teacher.subjects[0] || '', year: '2024-2025' }
    ],
    skills: teacher.academicCvJson?.skills || ['Recherche académique', 'Pédagogie'],
    links: {
      orcid: teacher.academicCvJson?.orcid || '',
      scholar: teacher.academicCvJson?.scholar || ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pubPdfInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = animationStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiPost('/teachers/cv', {
        summary: cvData.summary,
        publications: cvData.publications,
        teaching: cvData.teaching,
        skills: cvData.skills,
        orcid: cvData.links.orcid,
        scholar: cvData.links.scholar
      });
      // Mock success for now since we don't have the specific backend endpoint yet
      // In a real app, the teacher profile would be re-fetched or updated in context
      setTimeout(() => setIsSaving(false), 800);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCVData({ ...cvData, picture: event.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handlePublicationPdfUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPubs = cvData.publications.map(p => 
          p.id === id ? { ...p, pdfFile: event.target?.result as string } : p
        );
        setCVData({ ...cvData, publications: newPubs });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPdf = () => {
    const { personalInfo, summary, publications, teaching, skills, links, picture } = cvData;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>CV Académique – ${personalInfo.fullName}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: system-ui, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; }
    .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
    .pic { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #3b82f6; }
    .name { font-size: 32px; font-weight: 800; margin: 0; color: #0f172a; }
    .spec { font-size: 16px; font-weight: 700; color: #3b82f6; margin: 5px 0; }
    .dept { font-size: 14px; color: #64748b; margin: 0; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: 800; border-left: 4px solid #3b82f6; padding-left: 12px; margin-bottom: 15px; }
    .item { margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
    .item-title { font-weight: 700; margin: 0; }
    .item-meta { font-size: 13px; color: #64748b; margin: 4px 0; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: #f1f5f9; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    ${picture ? `<img src="${picture}" class="pic" />` : ''}
    <h1 class="name">${personalInfo.fullName}</h1>
    <p class="spec">${personalInfo.specialization}</p>
    <p class="dept">${personalInfo.department}</p>
    <p style="font-size: 13px; color: #64748b; margin-top: 10px;">📧 ${personalInfo.email}</p>
  </div>
  
  <div class="section">
    <h2 class="section-title">Résumé Professionnel</h2>
    <p style="font-size: 14px; text-align: justify;">${summary || 'Aucun résumé.'}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Publications</h2>
    ${publications.filter(p => p.title).map(p => `
      <div class="item">
        <p class="item-title">${p.title}</p>
        <p class="item-meta">${p.authors ? p.authors + ' • ' : ''}${p.journal} (${p.year})</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">Compétences</h2>
    <div class="skills">${skills.map(s => `<span class="skill">${s}</span>`).join('')}</div>
  </div>

  <script>window.onload = () => { window.print(); setTimeout(window.close, 500); };</script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const generateAISummary = () => {
    const options = [
      "Enseignant-chercheur passionné par l'innovation pédagogique et la recherche avancée. Expert dans le développement de solutions intelligentes et l'accompagnement des étudiants vers l'excellence académique.",
      "Spécialiste académique avec une solide expérience en recherche fondamentale et appliquée. Reconnu pour ma capacité à vulgariser des concepts complexes et à diriger des projets de recherche d'envergure internationale.",
      "Expert en ${cvData.personalInfo.specialization}, alliant rigueur scientifique et approche didactique moderne. Auteur de nombreuses publications et engagé dans le rayonnement scientifique de l'université."
    ];
    setCVData({ ...cvData, summary: options[Math.floor(Math.random() * options.length)] });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-card/50 p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Academic CV Builder</h1>
          <p className="text-muted-foreground font-medium mt-1">Créez un profil professionnel prestigieux</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-bold hover:bg-muted transition-all"
          >
            <Share2 size={18} />
            Partager
          </button>
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-bold hover:bg-muted transition-all"
          >
            <Download size={18} />
            Exporter PDF
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Editor */}
        <div className="space-y-6">
          {/* Photo & Info */}
          <section className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative group">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center cursor-pointer group-hover:border-primary transition-all overflow-hidden"
                >
                  {cvData.picture ? (
                    <img src={cvData.picture} className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={24} className="text-muted-foreground group-hover:text-primary" />
                  )}
                </div>
                {cvData.picture && (
                  <button 
                    onClick={() => setCVData({...cvData, picture: null})}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  value={cvData.personalInfo.fullName}
                  onChange={e => setCVData({...cvData, personalInfo: {...cvData.personalInfo, fullName: e.target.value}})}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Nom complet"
                />
                <input 
                  type="text" 
                  value={cvData.personalInfo.specialization}
                  onChange={e => setCVData({...cvData, personalInfo: {...cvData.personalInfo, specialization: e.target.value}})}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Spécialisation / Titre"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Département</label>
                <input 
                  type="text" 
                  value={cvData.personalInfo.department}
                  onChange={e => setCVData({...cvData, personalInfo: {...cvData.personalInfo, department: e.target.value}})}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-xs outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Email</label>
                <input 
                  type="email" 
                  value={cvData.personalInfo.email}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-xs outline-none cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </section>

          {/* AI Summary */}
          <section className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Résumé Professionnel
              </h3>
              <button 
                onClick={generateAISummary}
                className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full hover:bg-amber-500/20 transition-all"
              >
                Générer par IA
              </button>
            </div>
            <textarea 
              value={cvData.summary}
              onChange={e => setCVData({...cvData, summary: e.target.value})}
              rows={4}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Décrivez votre parcours et vos ambitions..."
            />
          </section>

          {/* Publications */}
          <section className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Award size={18} className="text-primary" />
                Publications & Recherche
              </h3>
              <button 
                onClick={() => setCVData({...cvData, publications: [...cvData.publications, {id: Date.now(), title: '', authors: '', year: '', journal: ''}]})}
                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {cvData.publications.map((pub, idx) => (
                <div key={pub.id} className="relative p-4 bg-secondary/30 border border-border rounded-xl group">
                  <button 
                    onClick={() => setCVData({...cvData, publications: cvData.publications.filter(p => p.id !== pub.id)})}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={pub.title}
                      onChange={e => {
                        const newPubs = [...cvData.publications];
                        newPubs[idx].title = e.target.value;
                        setCVData({...cvData, publications: newPubs});
                      }}
                      className="w-full bg-transparent border-none p-0 text-sm font-bold placeholder:text-muted-foreground/30 focus:ring-0"
                      placeholder="Titre de la publication"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        value={pub.journal}
                        onChange={e => {
                          const newPubs = [...cvData.publications];
                          newPubs[idx].journal = e.target.value;
                          setCVData({...cvData, publications: newPubs});
                        }}
                        className="bg-transparent border-none p-0 text-xs text-primary focus:ring-0"
                        placeholder="Journal / Conférence"
                      />
                      <input 
                        type="text" 
                        value={pub.year}
                        onChange={e => {
                          const newPubs = [...cvData.publications];
                          newPubs[idx].year = e.target.value;
                          setCVData({...cvData, publications: newPubs});
                        }}
                        className="bg-transparent border-none p-0 text-xs text-muted-foreground text-right focus:ring-0"
                        placeholder="Année"
                      />
                    </div>
                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="hidden" 
                          ref={el => pubPdfInputRefs.current[pub.id] = el}
                          onChange={e => handlePublicationPdfUpload(pub.id, e)}
                        />
                        <button 
                          onClick={() => pubPdfInputRefs.current[pub.id]?.click()}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                            pub.pdfFile ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <FileText size={12} />
                          {pub.pdfFile ? 'PDF Modifié' : 'Joindre PDF'}
                        </button>
                        {pub.pdfFile && (
                          <span className="text-[10px] text-muted-foreground font-medium italic">Fichier joint</span>
                        )}
                      </div>
                      {pub.pdfFile && (
                        <button 
                          onClick={() => {
                            const newPubs = [...cvData.publications];
                            newPubs[idx].pdfFile = null;
                            newPubs[idx].pdfObjectUrl = null;
                            setCVData({...cvData, publications: newPubs});
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setCVData({...cvData, publications: [...cvData.publications, {id: Date.now(), title: '', authors: '', year: '', journal: '', pdfFile: null}]})}
              className="w-full mt-4 px-4 py-3 border-2 border-dashed border-slate-300 text-slate-700 dark:text-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/30 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={18} />
              Ajouter une Publication
            </button>
          </section>

          {/* Links */}
          <section className="bg-card border border-border rounded-2xl p-7 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <LinkIcon size={18} className="text-primary" />
              Identifiants de Recherche
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-secondary px-4 py-2 rounded-xl border border-border focus-within:border-primary/50 transition-all">
                <Zap size={16} className="text-amber-500" />
                <input 
                  type="text" 
                  value={cvData.links.orcid}
                  onChange={e => setCVData({...cvData, links: {...cvData.links, orcid: e.target.value}})}
                  className="bg-transparent border-none p-0 text-sm flex-1 focus:ring-0"
                  placeholder="ORCID ID (ex: 0000-0002-1825-0097)"
                />
              </div>
              <div className="flex items-center gap-3 bg-secondary px-4 py-2 rounded-xl border border-border focus-within:border-primary/50 transition-all">
                <GraduationCap size={16} className="text-blue-500" />
                <input 
                  type="text" 
                  value={cvData.links.scholar}
                  onChange={e => setCVData({...cvData, links: {...cvData.links, scholar: e.target.value}})}
                  className="bg-transparent border-none p-0 text-sm flex-1 focus:ring-0"
                  placeholder="Lien Google Scholar"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Real-time Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-glow">
            <div className="p-8 md:p-12 space-y-10 max-h-[calc(100vh-200px)] overflow-y-auto cv-preview-scroll">
              {/* Preview Header */}
              <div className="text-center space-y-6">
                {cvData.picture && (
                  <div className="flex justify-center">
                    <img src={cvData.picture} className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-xl" />
                  </div>
                )}
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    {cvData.personalInfo.fullName || 'Votre Nom'}
                  </h1>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {cvData.personalInfo.specialization}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {cvData.personalInfo.department}
                  </p>
                </div>
                <div className="flex justify-center gap-4 flex-wrap">
                  {cvData.links.orcid && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-600 dark:text-slate-400">
                      ORCID: {cvData.links.orcid}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-600 dark:text-slate-400">
                    📧 {cvData.personalInfo.email}
                  </span>
                </div>
              </div>

              {/* Preview Summary */}
              {cvData.summary && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                    Résumé
                    <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed text-justify">
                    {cvData.summary}
                  </p>
                </div>
              )}

              {/* Preview Publications */}
              {cvData.publications.filter(p => p.title).length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                    Publications
                    <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                  </h3>
                  <div className="space-y-6">
                    {cvData.publications.filter(p => p.title).map((pub, idx) => (
                      <div key={pub.id} className="relative pl-6 border-l-2 border-blue-100 dark:border-blue-900">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{pub.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {pub.journal} <span className="mx-2">•</span> {pub.year}
                            </p>
                          </div>
                          {pub.pdfFile && (
                            <button 
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = pub.pdfFile!;
                                link.download = `Publication-${pub.year}.pdf`;
                                link.click();
                              }}
                              className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-all shadow-sm"
                              title="Télécharger le PDF"
                            >
                              <Download size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Skills */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                  Compétences
                  <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview Footer */}
              <div className="pt-10 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Généré par PUI Academic CV Builder • {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-8 w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black mb-2">Partager votre Profil</h2>
              <p className="text-muted-foreground text-sm mb-6 font-medium">Obtenez un lien public pour vos collègues et recruteurs.</p>
              <div className="bg-secondary p-4 rounded-2xl flex items-center justify-between border border-border mb-6">
                <code className="text-xs font-bold text-primary truncate mr-4">pui.univ-bm.dz/cv/${teacher.name.toLowerCase().replace(/ /g, '-')}</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`pui.univ-bm.dz/cv/${teacher.name.toLowerCase().replace(/ /g, '-')}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="p-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20"
                >
                  {copiedLink ? <CheckCircle size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-4 bg-foreground text-background rounded-2xl font-black hover:opacity-90 transition-all"
              >
                Terminé
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
