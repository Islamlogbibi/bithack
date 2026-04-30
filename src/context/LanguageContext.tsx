import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type Language = 'fr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, fallback?: string) => string
  tr: (text: string) => string
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    'role.student': 'Etudiant',
    'role.teacher': 'Enseignant',
    'role.admin': 'Administration',
    'role.dean': 'Doyen',
    'common.logout': 'Deconnexion',
    'common.language': 'Langue',
    'language.fr': 'Francais',
    'language.en': 'English',
    'language.ar': 'العربية',
    'sidebar.dashboard': 'Tableau de bord',
    'sidebar.schedule': 'Emploi du Temps',
    'sidebar.justifications': 'Justifications',
    'topbar.notifications': 'Notifications',
    'title.deanSpace': 'Espace Doyen',
    'title.schedule': 'Emploi du Temps',
    'title.justifications': 'Justifications',
    'title.default': 'PUI Smart Campus',
    'login.universityEmail': 'Email universitaire',
    'login.password': 'Mot de passe',
    'login.login': 'Se connecter',
    'login.connecting': 'Connexion...',
    'notfound.title': 'Page introuvable',
    'notfound.description': "La page que vous cherchez n'existe pas ou a ete deplacee.",
    'notfound.back': "Retour a l'accueil",
  },
  en: {
    'role.student': 'Student',
    'role.teacher': 'Teacher',
    'role.admin': 'Administration',
    'role.dean': 'Dean',
    'common.logout': 'Logout',
    'common.language': 'Language',
    'language.fr': 'French',
    'language.en': 'English',
    'language.ar': 'Arabic',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.schedule': 'Schedule',
    'sidebar.justifications': 'Justifications',
    'topbar.notifications': 'Notifications',
    'title.deanSpace': 'Dean Area',
    'title.schedule': 'Schedule',
    'title.justifications': 'Justifications',
    'title.default': 'PUI Smart Campus',
    'login.universityEmail': 'University email',
    'login.password': 'Password',
    'login.login': 'Sign in',
    'login.connecting': 'Signing in...',
    'notfound.title': 'Page Not Found',
    'notfound.description': 'The page you are looking for does not exist or has been moved.',
    'notfound.back': 'Back to Home',
  },
  ar: {
    'role.student': 'طالب',
    'role.teacher': 'استاذ',
    'role.admin': 'الادارة',
    'role.dean': 'العميد',
    'common.logout': 'تسجيل الخروج',
    'common.language': 'اللغة',
    'language.fr': 'الفرنسية',
    'language.en': 'الانجليزية',
    'language.ar': 'العربية',
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.schedule': 'الجدول الزمني',
    'sidebar.justifications': 'المبررات',
    'topbar.notifications': 'الاشعارات',
    'title.deanSpace': 'فضاء العميد',
    'title.schedule': 'الجدول الزمني',
    'title.justifications': 'المبررات',
    'title.default': 'PUI Smart Campus',
    'login.universityEmail': 'البريد الجامعي',
    'login.password': 'كلمة المرور',
    'login.login': 'تسجيل الدخول',
    'login.connecting': 'جاري تسجيل الدخول...',
    'notfound.title': 'الصفحة غير موجودة',
    'notfound.description': 'الصفحة التي تبحث عنها غير موجودة او تم نقلها.',
    'notfound.back': 'العودة الى الصفحة الرئيسية',
  },
}

const PHRASE_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  'Tableau de bord': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'Vue d\'ensemble': { en: 'Overview', ar: 'نظرة عامة' },
  'Emploi du Temps': { en: 'Schedule', ar: 'الجدول الزمني' },
  'Mes Notes': { en: 'My Grades', ar: 'علاماتي' },
  'Présences': { en: 'Attendance', ar: 'الحضور' },
  'Mes Présences': { en: 'My Attendance', ar: 'حضوري' },
  'Ressources': { en: 'Resources', ar: 'الموارد' },
  'Ressources Pédagogiques': { en: 'Learning Resources', ar: 'الموارد التعليمية' },
  'Ressources Partagées': { en: 'Shared Resources', ar: 'الموارد المشتركة' },
  'Assistant IA': { en: 'AI Assistant', ar: 'المساعد الذكي' },
  'Validations': { en: 'Validations', ar: 'المصادقات' },
  'Validations en attente': { en: 'Pending Validations', ar: 'المصادقات المعلقة' },
  'Alertes Absences': { en: 'Absence Alerts', ar: 'تنبيهات الغياب' },
  'Justifications': { en: 'Justifications', ar: 'المبررات' },
  'Students': { en: 'Students', ar: 'الطلبة' },
  'Professors': { en: 'Professors', ar: 'الاساتذة' },
  'Specialities': { en: 'Specialities', ar: 'التخصصات' },
  'Charge Horaire': { en: 'Workload', ar: 'الحجم الساعي' },
  'Saisie des Notes': { en: 'Grade Entry', ar: 'ادخال العلامات' },
  'Saisie Notes': { en: 'Grade Entry', ar: 'ادخال العلامات' },
  'Appel par QR Code': { en: 'QR Attendance', ar: 'تسجيل الحضور عبر QR' },
  'Présences QR': { en: 'QR Attendance', ar: 'حضور QR' },
  'Scanner QR': { en: 'QR Scanner', ar: 'ماسح QR' },
  'Messages': { en: 'Messages', ar: 'الرسائل' },
  'Déconnexion': { en: 'Logout', ar: 'تسجيل الخروج' },
  'Connexion rapide (démonstration)': { en: 'Quick Login (demo)', ar: 'دخول سريع (تجريبي)' },
  'Remplir': { en: 'Fill', ar: 'ملء' },
  'Se connecter': { en: 'Sign in', ar: 'تسجيل الدخول' },
  'Connexion...': { en: 'Signing in...', ar: 'جاري تسجيل الدخول...' },
  'Email universitaire': { en: 'University email', ar: 'البريد الجامعي' },
  'Mot de passe': { en: 'Password', ar: 'كلمة المرور' },
  'Rechercher un étudiant...': { en: 'Search for a student...', ar: 'ابحث عن طالب...' },
  'Rechercher un enseignant...': { en: 'Search for a teacher...', ar: 'ابحث عن استاذ...' },
  'Ajouter étudiant': { en: 'Add student', ar: 'اضافة طالب' },
  'Supprimer': { en: 'Delete', ar: 'حذف' },
  'Fermer': { en: 'Close', ar: 'اغلاق' },
  'Confirmer la validation': { en: 'Confirm validation', ar: 'تأكيد القبول' },
  'Confirmer le refus': { en: 'Confirm rejection', ar: 'تأكيد الرفض' },
  'Annuler': { en: 'Cancel', ar: 'الغاء' },
  'Décision': { en: 'Decision', ar: 'القرار' },
  'Valider': { en: 'Approve', ar: 'قبول' },
  'Rejeter': { en: 'Reject', ar: 'رفض' },
  'Commentaire (optionnel)': { en: 'Comment (optional)', ar: 'تعليق (اختياري)' },
  'Toutes les justifications': { en: 'All justifications', ar: 'كل المبررات' },
  'En attente': { en: 'Pending', ar: 'قيد الانتظار' },
  'Validées': { en: 'Approved', ar: 'مقبولة' },
  'Rejetées': { en: 'Rejected', ar: 'مرفوضة' },
  'Page introuvable': { en: 'Page Not Found', ar: 'الصفحة غير موجودة' },
  'Retour a l\'accueil': { en: 'Back to Home', ar: 'العودة الى الصفحة الرئيسية' },
  'Email ou mot de passe incorrect.': { en: 'Invalid email or password.', ar: 'البريد او كلمة المرور غير صحيحة.' },
  'Etudiant': { en: 'Student', ar: 'طالب' },
  'Enseignant': { en: 'Teacher', ar: 'استاذ' },
  'Administration': { en: 'Administration', ar: 'الادارة' },
  'Doyen': { en: 'Dean', ar: 'العميد' },
  'Langue': { en: 'Language', ar: 'اللغة' },
  'Francais': { en: 'French', ar: 'الفرنسية' },
  'Rechercher un étudiant...': { en: 'Search for a student...', ar: 'ابحث عن طالب...' },
  'Rechercher un enseignant...': { en: 'Search for a teacher...', ar: 'ابحث عن استاذ...' },
  'Specialité': { en: 'Field', ar: 'التخصص' },
  'Specialité': { en: 'Field', ar: 'التخصص' },
  'Module': { en: 'Course', ar: 'المقياس' },
  'Niveau': { en: 'Level', ar: 'المستوى' },
  'Section': { en: 'Section', ar: 'القسم' },
  'Groupe': { en: 'Group', ar: 'الفوج' },
  'Ajouter étudiant': { en: 'Add student', ar: 'اضافة طالب' },
  'Voir la liste des étudiants': { en: 'View students list', ar: 'عرض قائمة الطلبة' },
  'Liste des étudiants': { en: 'Students list', ar: 'قائمة الطلبة' },
  'Aucun étudiant pour ce filtre.': { en: 'No student for this filter.', ar: 'لا يوجد طلبة لهذا المرشح.' },
  'Selectionnez un etudiant pour voir ses informations.': { en: 'Select a student to view details.', ar: 'اختر طالبا لعرض معلوماته.' },
  'Informations etudiant': { en: 'Student information', ar: 'معلومات الطالب' },
  'Nom:': { en: 'Name:', ar: 'الاسم:' },
  'Matricule:': { en: 'ID:', ar: 'رقم التسجيل:' },
  'Departement:': { en: 'Department:', ar: 'القسم:' },
  'Filiere:': { en: 'Field:', ar: 'التخصص:' },
  'Niveau:': { en: 'Level:', ar: 'المستوى:' },
  'Section/Groupe:': { en: 'Section/Group:', ar: 'القسم/الفوج:' },
  'Moyenne:': { en: 'Average:', ar: 'المعدل:' },
  'Absences:': { en: 'Absences:', ar: 'الغيابات:' },
  'Validation de justification': { en: 'Justification review', ar: 'مراجعة التبرير' },
  'Etudiant': { en: 'Student', ar: 'طالب' },
  'Cours': { en: 'Course', ar: 'المقياس' },
  'Commentaire': { en: 'Comment', ar: 'تعليق' },
  'Commentaire (optionnel)': { en: 'Comment (optional)', ar: 'تعليق (اختياري)' },
  'Ajouter un commentaire pour l\'étudiant...': { en: 'Add a comment for the student...', ar: 'اضف تعليقا للطالب...' },
  'Traiter': { en: 'Process', ar: 'معالجة' },
  'Fichier:': { en: 'File:', ar: 'الملف:' },
  'Exporter PDF': { en: 'Export PDF', ar: 'تصدير PDF' },
  'Exporter iCal': { en: 'Export iCal', ar: 'تصدير iCal' },
  'Vue globale de toutes les sessions — Semestre 2 · 2024/2025': { en: 'Global view of all sessions — Semester 2 · 2024/2025', ar: 'عرض شامل لكل الحصص — السداسي 2 · 2024/2025' },
  'Dimanche': { en: 'Sunday', ar: 'الاحد' },
  'Lundi': { en: 'Monday', ar: 'الاثنين' },
  'Mardi': { en: 'Tuesday', ar: 'الثلاثاء' },
  'Mercredi': { en: 'Wednesday', ar: 'الاربعاء' },
  'Jeudi': { en: 'Thursday', ar: 'الخميس' },
  'Samedi': { en: 'Saturday', ar: 'السبت' },
  'Cours': { en: 'Lecture', ar: 'محاضرة' },
  'Enseignant du departement': { en: 'Department teachers', ar: 'اساتذة القسم' },
  'Enseignants du departement': { en: 'Department teachers', ar: 'اساتذة القسم' },
  'Departement selectionne:': { en: 'Selected department:', ar: 'القسم المحدد:' },
  'Aucun enseignant pour ce departement.': { en: 'No teacher in this department.', ar: 'لا يوجد اساتذة في هذا القسم.' },
  'Parcours etudiants': { en: 'Student navigation', ar: 'تتبع الطلبة' },
  'Liste des etudiants': { en: 'Students list', ar: 'قائمة الطلبة' },
  'Aucun etudiant pour ce filtre.': { en: 'No student for this filter.', ar: 'لا يوجد طلبة لهذا المرشح.' },
  'Aucun': { en: 'None', ar: 'لا يوجد' },
  'Faculte': { en: 'Faculty', ar: 'الكلية' },
  'Vous avez acces aux departements, enseignants et etudiants de votre faculte.': { en: 'You have access to departments, teachers and students of your faculty.', ar: 'لديك صلاحية الوصول الى اقسام واساتذة وطلبة كليتك.' },
  'Departements de la faculte': { en: 'Faculty departments', ar: 'اقسام الكلية' },
  'Saisi': { en: 'Entered', ar: 'مُدخل' },
  'Soumis': { en: 'Submitted', ar: 'مُرسل' },
  'Validé': { en: 'Validated', ar: 'مُصادق' },
  'Publié': { en: 'Published', ar: 'منشور' },
  'En attente': { en: 'Pending', ar: 'قيد الانتظار' },
  'Historique': { en: 'History', ar: 'السجل' },
  'Urgent': { en: 'Urgent', ar: 'عاجل' },
  'Standard': { en: 'Standard', ar: 'عادي' },
  'SLA dépassé !': { en: 'SLA exceeded!', ar: 'تم تجاوز SLA!' },
  'Doit être publié dans': { en: 'Must be published in', ar: 'يجب النشر خلال' },
  'Soumis le': { en: 'Submitted on', ar: 'تم الارسال في' },
  'il y a': { en: 'ago', ar: 'منذ' },
  'Absence': { en: 'Absence', ar: 'غياب' },
  'Présence': { en: 'Attendance', ar: 'حضور' },
  'Profil': { en: 'Profile', ar: 'الملف الشخصي' },
  'Paramètres': { en: 'Settings', ar: 'الاعدادات' },
  'Télécharger': { en: 'Download', ar: 'تحميل' },
  'Rechercher...': { en: 'Search...', ar: 'بحث...' },
  'Aucune donnée disponible': { en: 'No data available', ar: 'لا توجد بيانات متاحة' },
  'Aucune correspondance disponible pour ce choix.': { en: 'No match available for this selection.', ar: 'لا توجد نتائج لهذا الاختيار.' },
  'PGA sélectionné': { en: 'Selected GPA', ar: 'المعدل المحدد' },
  'Sélection année': { en: 'Select year', ar: 'اختر السنة' },
  'Sélection semestre': { en: 'Select semester', ar: 'اختر السداسي' },
  'Nouvelle ressource publiée par Dr. Meziani': { en: 'New resource published by Dr. Meziani', ar: 'تم نشر مورد جديد من طرف د. مزياني' },
  '4 absences détectées en Algorithmique': { en: '4 absences detected in Algorithms', ar: 'تم رصد 4 غيابات في الخوارزميات' },
  'Note de Base de Données soumise': { en: 'Database grade submitted', ar: 'تم ارسال علامة قواعد البيانات' },
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const originalTextByNodeRef = useRef<WeakMap<Text, string>>(new WeakMap())
  const [language, setLanguage] = useState<Language>(() => {
    const raw = localStorage.getItem('pui_language')
    if (raw === 'fr' || raw === 'en' || raw === 'ar') return raw
    return 'fr'
  })

  useEffect(() => {
    localStorage.setItem('pui_language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    const originalTextByNode = originalTextByNodeRef.current
    const reverseEn = new Map<string, string>()
    const reverseAr = new Map<string, string>()
    Object.entries(PHRASE_TRANSLATIONS).forEach(([fr, values]) => {
      reverseEn.set(values.en, fr)
      reverseAr.set(values.ar, fr)
    })

    const toFrenchCanonical = (text: string) => reverseEn.get(text) ?? reverseAr.get(text) ?? text

    const translateOne = (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return text
      if (language === 'fr') return text
      const canonical = toFrenchCanonical(trimmed)
      const hit = PHRASE_TRANSLATIONS[canonical]
      if (!hit) return text
      const translated = language === 'en' ? hit.en : hit.ar
      return text.replace(trimmed, translated)
    }

    const applyNode = (node: Text) => {
      if (!node.parentElement) return
      const tag = node.parentElement.tagName
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return

      const original = originalTextByNode.get(node) ?? toFrenchCanonical(node.nodeValue ?? '')
      if (!originalTextByNode.has(node)) {
        originalTextByNode.set(node, original)
      }
      node.nodeValue = translateOne(original)
    }

    const walk = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let current = walker.nextNode()
      while (current) {
        applyNode(current as Text)
        current = walker.nextNode()
      }
    }

    walk(document.body)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          applyNode(mutation.target as Text)
          continue
        }
        mutation.addedNodes.forEach((added) => walk(added))
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [language])

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t: (key, fallback) => TRANSLATIONS[language][key] ?? fallback ?? key,
      tr: (text) => {
        if (language === 'fr') return text
        const hit = PHRASE_TRANSLATIONS[text]
        if (!hit) return text
        return language === 'en' ? hit.en : hit.ar
      },
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
