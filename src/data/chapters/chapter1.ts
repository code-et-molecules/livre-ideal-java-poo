import { Chapter } from '../../types';

export const chapter1: Chapter = {
  id: 'chapitre-1',
  number: 1,
  title: "Du procédural à l'orienté objet : la rupture de paradigme",
  subtitle: "Comprendre la transition fondamentale entre traitement séquentiel et collaboration d'entités logiques autonomes",
  estimatedPages: 7,
  competencyGoal: "Différencier le paradigme procédural du paradigme orienté objet, maîtriser la distinction entre variables primitives et variables de référence, et modéliser le comportement de la mémoire (pile et tas).",
  introduction: "En programmation procédurale, telle que vous l'avez pratiquée en langage C, Python ou Java procédural lors du premier cours, le logiciel est perçu comme une gigantesque recette de cuisine. Les données sont des ingrédients passifs (variables scalaires ou tableaux), et les fonctions sont les étapes actives de transformation. Cette approche fonctionne convenablement pour de petits scripts ou des calculs mathématiques purs. Cependant, dès qu'une application de gestion d'envergure doit être maintenue par plusieurs personnes, les données éparpillées deviennent vulnérables à des modifications incohérentes. La programmation orientée objet (POO) inverse cette perspective : les données et les opérations qui les manipulent sont fusionnées au sein d'une même capsule sémantique appelée « objet ».",
  sections: [
    {
      id: 'sec-1-1',
      title: "1. Les limites architecturales du modèle procédural classique",
      estimatedPages: 1.5,
      contentMarkdown: `Imaginons la gestion des dossiers étudiants dans un cégep comportant 6 000 personnes inscrites. En procédural, un programmeur débutant tendrait à créer une constellation de tableaux parallèles :
* \`String[] numerosDA\` (numéros de demande d'admission)
* \`String[] noms\`
* \`String[] prenoms\`
* \`double[] moyennesGenerales\`
* \`boolean[] statutsFinissant\`

Cette approche présente trois failles critiques de génie logiciel :
1. **Désynchronisation accidentelle** : si une fonction de tri réorganise le tableau des moyennes sans réordonner simultanément et rigoureusement les cinq autres tableaux, les dossiers scolaires sont irrémédiablement corrompus.
2. **Absence d'invariance d'état** : n'importe quelle portion du code source peut assigner directement une moyenne générale de \`-45.0\` ou \`108.5\`, car aucune entité centrale ne protège la légitimité des valeurs.
3. **Explosion des paramètres de fonctions** : chaque sous-programme doit recevoir en paramètre une dizaine de variables élémentaires, rendant les signatures de méthodes illisibles et propices aux erreurs d'inversion d'arguments.

L'orienté objet apporte une réponse élégante : nous ne manipulons plus des tableaux disjoints, mais une collection d'entités complètes, autonomes et responsables de leur propre cohérence.`,
      quebecPedagogicalNote: "Dans le devis ministériel québécois, la compétence de modélisation exige que l'étudiant sache regrouper logiquement les données associées à une entité métier avant de songer à l'algorithme de traitement."
    },
    {
      id: 'sec-1-2',
      title: "2. Le modèle mental de l'objet : état, comportement et identité",
      estimatedPages: 1.8,
      contentMarkdown: `Dans le paradigme objet, un objet est défini par la conjonction indissociable de trois caractéristiques canoniques :

### L'état (*state*)
L'état d'un objet correspond à l'ensemble des valeurs de ses propriétés internes à un instant précis de l'exécution. En Java, ces propriétés sont appelées des **attributs** ou **variables d'instance**. Par exemple, pour un objet représentant un cours au cégep, son état peut être constitué de :
* Son code de cours (\`"420-201-RE"\`)
* Son titre (\`"Programmation orientée objet"\`)
* Son nombre maximal de places (\`32\`)
* Le nombre actuel d'inscrits (\`29\`)

### Le comportement (*behavior*)
Le comportement regroupe l'ensemble des actions que l'objet est capable d'accomplir ou des services qu'il peut rendre aux autres composants du système. Ce comportement est incarné par des **méthodes d'instance**.
Contrairement à une fonction procédurale classique, une méthode d'instance possède un accès privilégié et direct à l'état interne de l'objet auquel elle appartient. Elle peut lire cet état, le modifier sous condition, ou refuser une opération illicite (par exemple refuser une inscription si le cours est déjà complet).

### L'identité (*identity*)
Chaque objet créé en mémoire possède une identité propre et unique qui le distingue formellement de tous les autres objets de l'univers d'exécution, même si ceux-ci partagent un état rigoureusement identique.
En Java, deux objets distincts créés avec l'opérateur \`new\` résideront à deux adresses physiques différentes dans le tas (*heap*). Ils ont la même valeur d'attributs, mais ce ne sont pas les mêmes instances.`,
      diagrams: [
        {
          title: "Les trois composantes fondamentales d'un objet logiciel",
          type: 'uml',
          asciiOrSvg: `+-------------------------------------------------------------+
|                       OBJET LOGICIEL                        |
+-------------------------------------------------------------+
| 1. IDENTITÉ      : Adresse mémoire unique dans le tas (Heap)|
| 2. ÉTAT          : Valeurs courantes des attributs privés   |
| 3. COMPORTEMENT  : Méthodes d'instance régissant l'état     |
+-------------------------------------------------------------+`,
          caption: "Un objet encapsule ses données et fournit une interface publique pour interagir avec elles."
        }
      ]
    },
    {
      id: 'sec-1-3',
      title: "3. La mémoire dans la machine virtuelle : pile d'exécution et tas dynamique",
      estimatedPages: 2,
      contentMarkdown: `Pour comprendre le fonctionnement de Java en profondeur et éviter les bogues les plus pernicieux, tout étudiant en informatique doit visualiser le modèle de mémoire de la JVM. La mémoire vive allouée à votre programme est scindée en deux grands espaces :

### La pile d'exécution (*call stack*)
* Structure de données de type LIFO (*Last In, First Out*).
* Chaque appel de méthode empile un cadre d'activation (*stack frame*).
* Contient les paramètres formels de la méthode et les variables locales.
* Stocke la valeur brute des huit types primitifs de Java (\`byte\`, \`short\`, \`int\`, \`long\`, \`float\`, \`double\`, \`boolean\`, \`char\`).
* Stocke les **adresses de référence** (pointeurs sécurisés) vers les objets, mais **jamais le corps de l'objet lui-même**.
* Lorsqu'une méthode se termine, son cadre est instantanément libéré à coût CPU nul.

### Le tas dynamique (*managed heap*)
* Vaste zone de mémoire partagée gérée dynamiquement par la machine virtuelle.
* C'est là et nulle part ailleurs que résident tous les objets créés à l'aide du mot-clé \`new\`, ainsi que tous les tableaux.
* Un objet dans le tas demeure vivant tant qu'il existe au moins une référence active depuis la pile ou depuis un autre objet racine.
* Lorsqu'un objet n'est plus atteignable, il devient éligible au **ramasse-miettes** (*garbage collector*), qui récupère la mémoire de manière asynchrone.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'DemonstrationMemoire.java',
          code: `public class DemonstrationMemoire {
    public static void main(String[] args) {
        // Variable primitive : la valeur brute 100 est stockée dans la pile
        int noteMaximale = 100;

        // Variable de référence : "etudiantA" réside dans la pile
        // L'objet "new Etudiant(...)" est créé dans le tas à l'adresse 0x24A
        Etudiant etudiantA = new Etudiant("2245689", "Tremblay", "Alexandre");

        // Alias de référence : etudiantB ne crée PAS de nouvel objet !
        // etudiantB reçoit une COPIE de l'adresse (0x24A)
        Etudiant etudiantB = etudiantA;

        // Modifier l'objet via etudiantB modifie l'unique instance dans le tas
        etudiantB.setNom("Bouchard");

        // Affiche "Bouchard", car etudiantA et etudiantB pointent sur la même cible !
        System.out.println(etudiantA.getNom());
    }
}`,
          explanation: "La variable etudiantB n'est pas un clone de etudiantA, mais un simple pseudonyme pointant vers la même boîte en mémoire vive."
        }
      ]
    },
    {
      id: 'sec-1-4',
      title: "4. Première modélisation : de la structure de données à la classe autonome",
      estimatedPages: 1.7,
      contentMarkdown: `Pour concrétiser la rupture avec le procédural, examinons la transformation d'un enregistrement passif en une véritable classe Java dotée d'intelligence et d'intégrité métier.

Voici le modèle de départ pour modéliser une note scolaire dans le système de gestion d'un collège :`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'EvaluationCegep.java',
          code: `/**
 * Classe représentant une évaluation sommative au cégep.
 * Démontre la validation immédiate et l'autonomie de l'entité.
 */
public class EvaluationCegep {
    // 1. Attributs privés constituant l'état
    private String titre;
    private double ponderation; // En pourcentage (ex: 25.0 pour 25%)
    private double noteObtenue;  // Note sur 100

    // 2. Constructeur garantissant l'intégrité dès la création
    public EvaluationCegep(String titre, double ponderation, double noteObtenue) {
        setTitre(titre);
        setPonderation(ponderation);
        setNoteObtenue(noteObtenue);
    }

    // 3. Méthodes de validation métier
    public void setTitre(String titre) {
        if (titre == null || titre.trim().isEmpty()) {
            throw new IllegalArgumentException("Le titre de l'évaluation ne peut pas être vide.");
        }
        this.titre = titre.trim();
    }

    public void setPonderation(double ponderation) {
        if (ponderation <= 0.0 || ponderation > 100.0) {
            throw new IllegalArgumentException("La pondération doit être comprise entre 0 et 100 %.");
        }
        this.ponderation = ponderation;
    }

    public void setNoteObtenue(double noteObtenue) {
        if (noteObtenue < 0.0 || noteObtenue > 100.0) {
            throw new IllegalArgumentException("La note obtenue doit se situer entre 0.0 et 100.0.");
        }
        this.noteObtenue = noteObtenue;
    }

    // 4. Comportement métier calculé
    public double calculerPointsContribues() {
        return (this.noteObtenue * this.ponderation) / 100.0;
    }

    public boolean estReussie() {
        return this.noteObtenue >= 60.0;
    }

    // Accesseurs en lecture
    public String getTitre() { return titre; }
    public double getPonderation() { return ponderation; }
    public double getNoteObtenue() { return noteObtenue; }
}`,
          explanation: "La classe refuse activement toute création d'objet dans un état incohérent. Si un programme tente de passer une note de -10, une exception est immédiatement déclenchée."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-1-1',
      number: '1.1',
      title: "Diagnostic d'un code procédural et refactorisation vers l'orienté objet",
      difficulty: 'Débutant',
      contextQuebec: "Un ancien script du bureau de l'aide pédagogique individuelle (API) d'un cégep gère les cotes de priorité de choix de cours par une multitude de tableaux imbriqués sans aucune protection.",
      instructions: [
        "Identifiez les trois failles majeures du script procédural fourni ci-dessous.",
        "Proposez une classe Java nommée « DemandeChoixCours » regroupant les attributs (numéro d'admission, code de cours demandé, statut de priorité).",
        "Ajoutez un comportement « estPrioritaire() » qui retourne vrai uniquement si le code de priorité est 1 ou 2.",
        "Validez que le numéro d'admission comporte exactement 7 chiffres décimaux (format collégial québécois)."
      ],
      tips: [
        "En Java, utilisez la méthode .matches(\"\\\\d{7}\") sur une chaîne pour tester l'exactitude des 7 chiffres.",
        "Ne laissez aucun attribut public !"
      ],
      starterCode: `// Code procédural initial défaillant à corriger
public class AncienSystemeAPI {
    public static void main(String[] args) {
        String[] da = {"1940201", "2150334"};
        String[] cours = {"420-201-RE", "420-B20-RO"};
        int[] priorites = {1, 3};
        
        // Tout le monde peut corrompre les données sans garde-fou
        priorites[0] = -999;
    }
}`,
      solutionCode: `public class DemandeChoixCours {
    private String numeroDA;
    private String codeCours;
    private int niveauPriorite; // 1 = Finissant, 2 = Régulier, 3 = Hors programme

    public DemandeChoixCours(String numeroDA, String codeCours, int niveauPriorite) {
        setNumeroDA(numeroDA);
        setCodeCours(codeCours);
        setNiveauPriorite(niveauPriorite);
    }

    public void setNumeroDA(String numeroDA) {
        if (numeroDA == null || !numeroDA.matches("^\\\\d{7}$")) {
            throw new IllegalArgumentException("Le numéro de DA doit être composé de 7 chiffres exacts.");
        }
        this.numeroDA = numeroDA;
    }

    public void setCodeCours(String codeCours) {
        if (codeCours == null || codeCours.trim().length() < 8) {
            throw new IllegalArgumentException("Le code ministériel du cours est invalide.");
        }
        this.codeCours = codeCours.trim().toUpperCase();
    }

    public void setNiveauPriorite(int niveauPriorite) {
        if (niveauPriorite < 1 || niveauPriorite > 3) {
            throw new IllegalArgumentException("Le niveau de priorité doit valoir 1, 2 ou 3.");
        }
        this.niveauPriorite = niveauPriorite;
    }

    public boolean estPrioritaire() {
        return this.niveauPriorite <= 2;
    }

    public String getNumeroDA() { return numeroDA; }
    public String getCodeCours() { return codeCours; }
    public int getNiveauPriorite() { return niveauPriorite; }
}`,
      explanation: "La refactorisation orientée objet remplace les tableaux éclatés par une unité autonome. L'expression régulière assure l'intégrité du numéro de DA selon les standards ministériels québécois."
    },
    {
      id: 'ex-1-2',
      number: '1.2',
      title: "Traçage mémoire précis : pile d'activation et tas dynamique",
      difficulty: 'Intermédiaire',
      contextQuebec: "Lors d'un examen intra au cégep, une question classique consiste à dessiner l'état exact de la mémoire après l'exécution d'un bloc d'instructions manipulant des références.",
      instructions: [
        "Analysez pas à pas le fragment de code Java proposé ci-dessous.",
        "Établissez le nombre total d'objets alloués dans le tas (Heap).",
        "Déterminez le nombre de références actives pointant sur chaque objet à la fin de la méthode.",
        "Indiquez si un objet devient orphelin et éligible au ramasse-miettes (Garbage Collector)."
      ],
      tips: [
        "N'oubliez pas que chaque invocation de 'new' crée obligatoirement une nouvelle instance dans le tas.",
        "Une assignation de variable de référence copie l'adresse, elle ne duplique pas l'objet !"
      ],
      starterCode: `Etudiant e1 = new Etudiant("1111111", "Roy");
Etudiant e2 = new Etudiant("2222222", "Gagnon");
Etudiant e3 = e1;
e1 = new Etudiant("3333333", "Caron");
e2 = null;`,
      solutionCode: `// Analyse pas à pas de l'état mémoire :
// Ligne 1 : "new Etudiant(1111111)" -> Objet A créé dans le tas @0x10. Variable pile e1 = @0x10.
// Ligne 2 : "new Etudiant(2222222)" -> Objet B créé dans le tas @0x20. Variable pile e2 = @0x20.
// Ligne 3 : e3 = e1 -> Variable pile e3 = @0x10. L'objet A a maintenant DEUX références actives (e1 et e3).
// Ligne 4 : "new Etudiant(3333333)" -> Objet C créé dans le tas @0x30. Variable pile e1 = @0x30.
//           L'objet A a toujours UNE référence active (e3).
// Ligne 5 : e2 = null -> Variable pile e2 ne pointe plus nulle part.
//           L'objet B (@0x20) ne possède PLUS AUCUNE référence active !
//
// BILAN FINAL :
// Nombre d'objets alloués : 3 (Objets A, B et C).
// Objets encore accessibles : Objet A (via e3) et Objet C (via e1).
// Objet éligible au ramasse-miettes : Objet B (Gagnon), car aucune variable ne le rattache au graphe des racines.`,
      explanation: "Cet exercice illustre parfaitement la séparation entre la référence (dans la pile) et l'instance concrète (dans le tas). L'objet B devient un orphelin mémoire aussitôt que la référence e2 est écrasée par la valeur null."
    }
  ],
  quiz: [
    {
      id: 'q-1-1',
      question: "Qu'advient-il d'un objet alloué dans le tas dès lors qu'aucune variable de référence ne conserve son adresse ?",
      options: [
        "Il provoque immédiatement une erreur d'exécution de type NullPointerException.",
        "Il demeure éternellement en mémoire jusqu'à ce que l'ordinateur soit physiquement redémarré.",
        "Il devient automatiquement éligible à la récupération par le ramasse-miettes (Garbage Collector).",
        "Il est sauvegardé d'office dans un fichier temporaire sur le disque dur."
      ],
      correctIndex: 2,
      explanation: "Le ramasse-miettes de la machine virtuelle Java parcourt périodiquement le tas. Tout bloc mémoire non atteignable depuis les racines d'exécution (la pile d'appels ou les variables statiques) est détruit pour réclamer l'espace mémoire."
    },
    {
      id: 'q-1-2',
      question: "Soit l'instruction `Etudiant a = new Etudiant(); Etudiant b = a;`. Que réalise précisément cette deuxième affectation ?",
      options: [
        "Elle effectue une copie profonde en dupliquant tous les attributs de l'objet dans un second emplacement mémoire.",
        "Elle copie la valeur de l'adresse de référence de 'a' dans la variable 'b', de sorte que les deux variables désignent la même instance.",
        "Elle détruit la variable 'a' pour la renommer en 'b'.",
        "Elle crée un lien symbolique dans le système de fichiers."
      ],
      correctIndex: 1,
      explanation: "En Java, les variables désignant des objets contiennent des adresses de référence. L'opérateur '=' recopie toujours la valeur brute contenue dans la pile (ici, l'adresse mémoire), créant un alias."
    }
  ],
  summaryChecklist: [
    "Je sais expliquer pourquoi le regroupement des données et des comportements au sein d'un objet élimine les risques de désynchronisation.",
    "Je distingue sans hésiter les variables primitives (valeur dans la pile) et les variables de référence (adresse dans la pile pointant sur le tas).",
    "Je suis capable de tracer l'état de la mémoire (Stack et Heap) pour un fragment de code Java comportant des alias et des instances multiples."
  ]
};
