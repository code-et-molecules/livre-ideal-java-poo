export interface BookMetadata {
  title: string;
  subtitle: string;
  targetAudience: string;
  programCode: string;
  courseTitle: string;
  edition: string;
  totalEstimatedPages: number;
  authorNote: string;
  ministerialCompetencies: {
    code: string;
    description: string;
    elements: string[];
  }[];
}

export const BOOK_METADATA: BookMetadata = {
  title: "Livre idéal - Java POO",
  subtitle: "Guide de référence pédagogique pour le deuxième cours de programmation en Techniques de l'informatique au cégep",
  targetAudience: "Étudiantes et étudiants de première année au cégep, deuxième session collégiale",
  programCode: "420.B0 - Techniques de l'informatique",
  courseTitle: "Programmation orientée objet en Java (420-201-RE / 420-B20-RO)",
  edition: "Édition collégiale québécoise 2026 - Conforme Java 17/21 LTS",
  totalEstimatedPages: 74,
  authorNote: "Ce manuel a été rédigé spécifiquement pour répondre aux exigences du devis ministériel québécois de l'enseignement collégial. Il propose une progression rigoureuse, ancrée dans des contextes réels du milieu collégial québécois, avec une insistance particulière sur la traçabilité en mémoire, l'encapsulation défensive et l'architecture logicielle propre.",
  ministerialCompetencies: [
    {
      code: "00Q2",
      description: "Développer des composantes logicielles orientées objet",
      elements: [
        "Analyser les spécifications et modéliser les classes à l'aide de diagrammes UML",
        "Appliquer rigoureusement les principes d'encapsulation, d'héritage et de polymorphisme",
        "Exploiter les collections dynamiques de la bibliothèque standard de Java",
        "Mettre en place une gestion d'exceptions préventive et défensive",
        "Persister des données dans des fichiers texte structurés",
        "Vérifier et déboguer le code à l'aide de tests unitaires et de traçage mémoire"
      ]
    }
  ]
};
