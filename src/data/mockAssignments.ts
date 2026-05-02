export interface Assignment {
  id: number
  title: string
  description: string
  module: string
  teacherName: string
  deadline: string
  createdAt: string
  groups?: string[]
}

export const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: "Rapport de projet Algorithmique",
    description: "Rédigez un rapport détaillé sur l'implémentation de l'algorithme de tri que vous avez développé pendant les séances de TP. Le rapport doit inclure l'analyse de complexité, les tests effectués et les conclusions.",
    module: "Algorithmique",
    teacherName: "Dr. Karim Meziani",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    groups: ["G1", "G2"]
  },
  {
    id: 2,
    title: "Modélisation UML - Diagramme de classes",
    description: "Créez un diagramme de classes UML complet pour le système de gestion de bibliothèque. Incluez toutes les classes, leurs attributs, méthodes et relations. Utilisez un outil de modélisation professionnel.",
    module: "Programmation Orientée Objet",
    teacherName: "Dr. Mourad Bakri",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    groups: ["G1"]
  },
  {
    id: 3,
    title: "Analyse de base de données",
    description: "Analysez le schéma de base de données fourni et proposez des optimisations. Identifiez les clés étrangères manquantes, les index à créer et les requêtes à optimiser.",
    module: "Base de données",
    teacherName: "Dr. Karim Meziani",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    groups: ["G1", "G2"]
  },
  {
    id: 4,
    title: "Étude de cas Intelligence Artificielle",
    description: "Réalisez une étude comparative de deux algorithmes d'apprentissage automatique (SVM vs Random Forest) sur un jeu de données de votre choix. Présentez les résultats avec graphiques et interprétation.",
    module: "Intelligence Artificielle",
    teacherName: "Dr. Mourad Bakri",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    groups: ["G1"]
  },
  {
    id: 5,
    title: "Configuration réseau - Rapport technique",
    description: "Documentez la configuration d'un réseau local avec VLAN, DHCP et sécurité. Incluez les schémas, configurations Cisco et tests de connectivité.",
    module: "Réseaux Informatiques",
    teacherName: "Dr. Karim Meziani",
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (overdue)
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    groups: ["G1", "G2"]
  }
]

// Mock submissions for testing
export interface AssignmentSubmission {
  id: number
  assignmentId: number
  studentId: number
  studentName: string
  fileName: string
  fileContent: string
  submittedAt: string
  status: 'pending' | 'reviewed' | 'graded'
  grade?: number
  feedback?: string
}

export const mockSubmissions: AssignmentSubmission[] = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 1,
    studentName: "Sara Ben Ali",
    fileName: "rapport_algo_sara.pdf",
    fileContent: "mock-base64-content",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 2,
    assignmentId: 3,
    studentId: 1,
    studentName: "Sara Ben Ali",
    fileName: "analyse_bd_sara.docx",
    fileContent: "mock-base64-content",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'reviewed',
    grade: 16,
    feedback: "Excellent travail d'analyse. Quelques suggestions pour l'optimisation des index."
  }
]