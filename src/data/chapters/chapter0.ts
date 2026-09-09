import { Chapter } from '../../types';

export const chapter0: Chapter = {
  id: 'avant-propos',
  number: 'Avant-propos',
  title: "Le cadre d'apprentissage collégial québécois",
  subtitle: "Guide méthodologique et pédagogique pour réussir le deuxième cours de programmation au cégep",
  estimatedPages: 4,
  competencyGoal: "Comprendre les exigences du devis ministériel 420.B0 et adopter une méthode de travail professionnelle en laboratoire de programmation.",
  introduction: "Bienvenue dans le deuxième cours de programmation de votre parcours au collégial en Techniques de l'informatique. Lors de votre première session, vous avez développé des réflexes algorithmiques essentiels : déclarer des variables primitives, élaborer des boucles, concevoir des sous-programmes et manipuler des tableaux unidimensionnels ou bidimensionnels. Ce premier bagage procédural est indispensable, mais il atteint rapidement ses limites dès que la taille et la complexité des systèmes d'information augmentent. Le présent cours marque un tournant majeur : vous abandonnez la vision linéaire de la machine pour adopter la pensée orientée objet, le paradigme dominant de l'industrie logicielle.",
  sections: [
    {
      id: 'sec-0-1',
      title: "1. La place du cours dans la grille de cheminement collégial",
      estimatedPages: 1.5,
      contentMarkdown: `Dans la grille de cheminement type du diplôme d'études collégiales (DEC) en Techniques de l'informatique (programme 420.B0), le cours de programmation orientée objet occupe une place charnière. Il s'agit généralement d'un cours de 75 ou 90 heures (pondération 3-2-3 ou 2-3-3, soit 3 heures de théorie, 2 heures de laboratoire supervisé et 3 heures de travail personnel par semaine).

Ce cours agit comme un prérequis absolu pour l'ensemble des cours avancés des sessions subséquentes :
* **Structures de données et algorithmes avancés** (session 3) : arbres, graphes, tables de hachage personnalisées.
* **Développement d'applications Web transactionnelles** (session 3 et 4) : services d'arrière-plan, API REST en Java avec Spring Boot.
* **Développement d'applications mobiles** (session 4) : programmation native sous Android.
* **Projet de fin d'études et stage en entreprise** (session 6) : conception de systèmes d'envergure industrielle.

Une maîtrise approximative des notions d'objets, de références ou de polymorphisme se traduit invariablement par des difficultés majeures dans les cours ultérieurs. C'est pourquoi ce manuel insiste autant sur la rigueur conceptuelle que sur l'expérimentation pratique en laboratoire.`,
      quebecPedagogicalNote: "Au cégep, la pondération 3-2-3 implique que pour chaque heure passée en classe, vous devez consacrer au moins une heure d'effort autonome à la maison ou dans les laboratoires libres du département."
    },
    {
      id: 'sec-0-2',
      title: "2. Les compétences ministérielles et les critères de performance",
      estimatedPages: 1.5,
      contentMarkdown: `L'évaluation dans les cégeps québécois repose sur l'approche par compétences définie par le ministère de l'Enseignement supérieur. Pour ce cours, l'élément de compétence central consiste à : « Développer des composantes logicielles orientées objet ».

Ce devis ministériel se traduit par six critères de performance précis que votre professeure ou votre professeur appliquera lors des évaluations sommatives :
1. **Conformité de l'architecture aux spécifications fonctionnelles** : capacité à traduire un diagramme de classes UML en classes Java cohérentes.
2. **Encapsulation stricte et protection des données** : interdiction d'exposer les champs privés sans validation systématique des invariants.
3. **Exploitation appropriée de l'héritage et des interfaces** : refus de la duplication de code et application juste du polymorphisme.
4. **Gestion préventive des exceptions** : arrêt des plantages inopinés lors de saisies invalides ou de lectures de fichiers corrompus.
5. **Lisibilité et respect des normes départementales de codage** : conventions de nommage Java, commentaires Javadoc complets et indentation soignée.
6. **Autonomie dans le débogage et la traçabilité** : utilisation méthodique du débogueur interactif et analyse des piles d'appels (*stack traces*).`,
      quebecPedagogicalNote: "Dans la majorité des départements d'informatique au Québec, une note inférieure à 60 % à la moyenne pondérée des examens individuels entraîne l'échec automatique du cours, même si les notes de projets d'équipe sont élevées."
    },
    {
      id: 'sec-0-3',
      title: "3. L'environnement technique de travail : JDK et outillage moderne",
      estimatedPages: 1,
      contentMarkdown: `Pour tirer le maximum de ce cours, votre poste de travail doit être configuré avec un environnement moderne et stable :
* **Kit de développement Java (JDK)** : nous utilisons une version à support à long terme (LTS), soit Java 17 ou Java 21 (par exemple la distribution Eclipse Temurin ou Amazon Corretto).
* **Environnement de développement intégré (EDI)** : IntelliJ IDEA (édition éducative ou communautaire), Eclipse IDE ou Visual Studio Code avec le pack d'extensions Java.
* **Système de gestion de versions** : Git pour l'archivage de vos remises et la traçabilité de vos laboratoires.
* **Outil de construction standard** : Apache Maven ou Gradle pour la gestion des dépendances et l'automatisation des tests JUnit.

Chaque exemple de ce livre a été testé avec le compilateur Java 21 standard en activant les avertissements maximaux de compilation (\`-Xlint:all\`).`,
      codeSnippets: [
        {
          language: 'bash',
          filename: 'VerificationEnvironnement.sh',
          code: `# Vérification de la version du compilateur dans le terminal
javac --version
# Sortie attendue : javac 21.0.x ou javac 17.0.x

# Vérification de la machine virtuelle Java (JVM)
java --version
# Sortie attendue : OpenJDK Runtime Environment (build 21.0.x+...)`,
          explanation: "Assurez-vous que les commandes javac et java pointent exactement sur la même version du JDK dans vos variables d'environnement système."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-0-1',
      number: '0.1',
      title: "Vérification de la chaîne d'outils et compilation manuelle en ligne de commande",
      difficulty: 'Débutant',
      contextQuebec: "Lors de la première séance de laboratoire au département d'informatique, chaque étudiante et étudiant doit valider son poste de travail avant d'ouvrir un EDI lourd.",
      instructions: [
        "Créez un dossier nommé « lab00-verification » sur votre compte étudiant ou votre disque local.",
        "Rédigez un fichier source minimal nommé « DiagnosticCegep.java » sans recourir à un EDI.",
        "Compilez le programme manuellement avec l'outil « javac » en ligne de commande.",
        "Exécutez le fichier de pseudo-code binaire « DiagnosticCegep.class » avec la commande « java ».",
        "Observez l'affichage de la version de la machine virtuelle et de l'encodage par défaut."
      ],
      tips: [
        "N'oubliez pas que le nom de la classe publique doit correspondre au caractère près au nom du fichier source.",
        "Sous Windows, vérifiez que l'invite de commande utilise l'encodage UTF-8 pour afficher correctement les accents québécois."
      ],
      starterCode: `public class DiagnosticCegep {
    public static void main(String[] args) {
        // Complétez ici pour afficher les propriétés système du JDK
    }
}`,
      solutionCode: `public class DiagnosticCegep {
    public static void main(String[] args) {
        System.out.println("=== Diagnostic de l'environnement collégial ===");
        System.out.println("Version de Java : " + System.getProperty("java.version"));
        System.out.println("Fournisseur du JDK : " + System.getProperty("java.vendor"));
        System.out.println("Système d'exploitation : " + System.getProperty("os.name"));
        System.out.println("Répertoire de travail : " + System.getProperty("user.dir"));
        System.out.println("Encodage des caractères : " + System.getProperty("file.encoding"));
        System.out.println("Diagnostic réussi : votre poste est prêt pour la session !");
    }
}`,
      explanation: "Cet exercice confirme que le compilateur (javac) et la machine virtuelle (java) sont correctement enregistrés dans la variable d'environnement PATH. L'accès aux propriétés système permet de détecter immédiatement d'éventuels conflits d'encodage de caractères (par exemple UTF-8 contre Windows-1252)."
    }
  ],
  quiz: [
    {
      id: 'q-0-1',
      question: "Quelle est la principale différence entre le JRE (Java Runtime Environment) et le JDK (Java Development Kit) ?",
      options: [
        "Le JRE permet de compiler le code source, tandis que le JDK ne sert qu'à exécuter les fichiers binaires.",
        "Le JDK contient à la fois la machine virtuelle, les bibliothèques d'exécution et les outils de développement comme le compilateur javac.",
        "Le JRE est réservé aux serveurs Linux, alors que le JDK ne fonctionne que sur Windows et macOS.",
        "Il n'y a aucune différence, ce sont deux appellations commerciales pour le même logiciel."
      ],
      correctIndex: 1,
      explanation: "Le JDK (Java Development Kit) est la boîte à outils complète du développeur. Il englobe le JRE (machine virtuelle JVM et bibliothèques standard de l'API) en y ajoutant le compilateur (javac), le visualiseur de documentation (javadoc) et les outils d'archivage (jar)."
    }
  ],
  summaryChecklist: [
    "J'ai vérifié que mon poste personnel et mon compte de laboratoire disposent d'un JDK 17 ou 21 LTS fonctionnel.",
    "Je comprends que le cours de programmation orientée objet est le pivot central de la 1re année en Techniques de l'informatique.",
    "Je sais compiler et exécuter un programme Java en ligne de commande sans dépendre exclusivement d'un EDI."
  ]
};
