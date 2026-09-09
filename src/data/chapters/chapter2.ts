import { Chapter } from '../../types';

export const chapter2: Chapter = {
  id: 'chapitre-2',
  number: 2,
  title: "Anatomie d'une classe et cycle de vie d'un objet",
  subtitle: "Constructeurs multiples, initialisation d'état, autoréférence this et membres de classe statiques",
  estimatedPages: 7,
  competencyGoal: "Concevoir des classes Java complètes avec constructeurs surchargés et chaînés (this), distinguer rigoureusement les membres d'instance des membres de classe (static), et documenter le code en respectant les normes Javadoc québécoises.",
  introduction: "Si l'objet est l'entité vivante et dynamique résidant dans la mémoire de votre ordinateur, la classe en constitue le plan architectural (*blueprint*). Dans ce chapitre, nous explorons en détail l'anatomie interne d'une classe Java : la déclaration méthodique de ses champs d'instance, le rôle capital des constructeurs dans la naissance d'un objet intègre, l'usage judicieux de l'autoréférence « this » et la frontière essentielle entre ce qui appartient à une instance spécifique et ce qui relève de la classe tout entière via le modificateur « static ».",
  sections: [
    {
      id: 'sec-2-1',
      title: "1. La structure standardisée d'une classe Java professionnelle",
      estimatedPages: 1.5,
      contentMarkdown: `Dans les départements d'informatique au cégep ainsi que dans l'industrie québécoise, les fichiers de code source respectent un ordonnancement strict pour assurer la maintenabilité et la lisibilité du projet.

Une classe Java bien structurée s'organise toujours selon l'ordre chronologique suivant :
1. **En-tête Javadoc** : description de la responsabilité de la classe, nom de l'auteur et numéro de version.
2. **Constantes de classe publiques ou privées** (\`public static final\` / \`private static final\`).
3. **Variables de classe statiques privées** (\`private static\`).
4. **Variables d'instance privées** (\`private\`).
5. **Constructeurs** (constructeur principal exhaustif, puis constructeurs secondaires chaînés).
6. **Méthodes métier publiques** (services offerts aux autres classes).
7. **Accesseurs et mutateurs** (\`getters\` et \`setters\` défensifs).
8. **Méthodes standard redéfinies** (\`toString()\`, \`equals()\`, \`hashCode()\`).
9. **Méthodes auxiliaires privées** (fonctions d'aide interne au calcul).`,
      quebecPedagogicalNote: "Le non-respect de cet agencement standard dans vos remises de travaux pratiques entraîne fréquemment des pénalités de lisibilité pouvant atteindre 10 % de la note globale du laboratoire."
    },
    {
      id: 'sec-2-2',
      title: "2. Les constructeurs et le chaînage d'initialisation avec this()",
      estimatedPages: 2,
      contentMarkdown: `Un constructeur est un bloc d'initialisation particulier dont la vocation unique est de placer un objet nouvellement instancié dans un état initial valide et cohérent.

### Règles fondamentales des constructeurs en Java :
* Il porte **strictement le même nom** que la classe, en respectant la casse.
* Il ne possède **aucun type de retour**, pas même \`void\` (l'ajout de \`void\` le transformerait silencieusement en une banale méthode ordinaire).
* Si vous n'écrivez aucun constructeur, le compilateur génère automatiquement un **constructeur par défaut** sans paramètre. Cependant, dès que vous déclarez au moins un constructeur personnalisé, ce constructeur par défaut disparaît immédiatement.

### La surcharge et le chaînage avec \`this(...)\`
Il est courant d'offrir plusieurs manières de créer un objet : un constructeur complet recevant tous les attributs, et un ou plusieurs constructeurs simplifiés attribuant des valeurs par défaut raisonnables.
Pour éviter de dupliquer la logique de validation, on utilise l'instruction \`this(...)\` pour appeler un constructeur depuis un autre constructeur de la même classe. Cette instruction doit obligatoirement être la **toute première ligne** du constructeur appelant.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'LivreBibliotheque.java',
          code: `/**
 * Représente un ouvrage physique dans la bibliothèque du cégep.
 * Démontre la surcharge propre de constructeurs et le chaînage via this().
 */
public class LivreBibliotheque {
    private final String isbn;
    private String titre;
    private String auteur;
    private int nombreExemplaires;

    /**
     * Constructeur principal exhaustif.
     * C'est ici et nulle part ailleurs que réside la validation.
     */
    public LivreBibliotheque(String isbn, String titre, String auteur, int nombreExemplaires) {
        if (isbn == null || !isbn.matches("^\\\\d{3}-\\\\d{10}$")) {
            throw new IllegalArgumentException("L'ISBN doit respecter le format 978-XXXXXXXXXX.");
        }
        if (titre == null || titre.trim().isEmpty()) {
            throw new IllegalArgumentException("Le titre du livre ne peut être vide.");
        }
        if (auteur == null || auteur.trim().isEmpty()) {
            throw new IllegalArgumentException("L'auteur doit être spécifié.");
        }
        if (nombreExemplaires < 0) {
            throw new IllegalArgumentException("Le nombre d'exemplaires ne peut être négatif.");
        }

        this.isbn = isbn;
        this.titre = titre.trim();
        this.auteur = auteur.trim();
        this.nombreExemplaires = nombreExemplaires;
    }

    /**
     * Constructeur de commodité : par défaut, un nouvel ouvrage arrive avec 1 exemplaire.
     */
    public LivreBibliotheque(String isbn, String titre, String auteur) {
        // Délégation au constructeur principal : aucun code dupliqué !
        this(isbn, titre, auteur, 1);
    }

    public String getIsbn() { return isbn; }
    public String getTitre() { return titre; }
    public String getAuteur() { return auteur; }
    public int getNombreExemplaires() { return nombreExemplaires; }
}`,
          explanation: "Remarquez comment le deuxième constructeur délègue entièrement la responsabilité d'initialisation au premier via this(isbn, titre, auteur, 1)."
        }
      ]
    },
    {
      id: 'sec-2-3',
      title: "3. Membres d'instance versus membres statiques de classe",
      estimatedPages: 1.8,
      contentMarkdown: `L'un des écueils majeurs pour les étudiantes et étudiants provenant du premier cours procédural est la tentation d'apposer le mot-clé \`static\` sur toutes leurs méthodes et variables.

### Membre d'instance (sans \`static\`) :
* Chaque objet créé possède son **propre exemplaire distinct** de la variable dans le tas.
* Pour y accéder, il est obligatoire d'avoir instancié un objet préalable (\`monLivre.getTitre()\`).
* Les méthodes d'instance ont accès au mot-clé \`this\`.

### Membre de classe (avec \`static\`) :
* Il n'existe qu'un **seul et unique exemplaire** de la variable en mémoire, partagé par toutes les instances de la classe ainsi que par la classe elle-même.
* La variable est logée dans l'espace statique de la JVM (appelé le *Metaspace*).
* On y accède directement via le nom de la classe (\`Math.sqrt()\`, \`Etudiant.getCompteurInscriptions()\`).
* Une méthode statique n'appartient à aucun objet particulier : elle n'a donc **jamais accès à \`this\`**, ni aux variables d'instance directes !`,
      diagrams: [
        {
          title: "Partage de la mémoire : attribut statique unique vs attributs d'instance",
          type: 'uml',
          asciiOrSvg: `ESPACE STATIQUE (Metaspace)
+-------------------------------------------------+
| Classe Etudiant                                 |
| - compteurTotalEtudiants = 2                    |
+-------------------------------------------------+
                         ^
                         | (Partagé par toutes les instances)
TAS (Heap)               |
+---------------------+  |    +---------------------+
| Objet Etudiant @0x1 | -+    | Objet Etudiant @0x2 |
| - numeroDA: 2241001 |       | - numeroDA: 2241002 |
| - nom: "Tremblay"   |       | - nom: "Bouchard"   |
+---------------------+       +---------------------+`,
          caption: "Chaque étudiant possède son propre numéro de DA, mais le compteur global est unique et partagé."
        }
      ]
    },
    {
      id: 'sec-2-4',
      title: "4. La redéfinition de la méthode toString() pour le débogage",
      estimatedPages: 1.7,
      contentMarkdown: `Par défaut, lorsque vous transmettez un objet à \`System.out.println(monObjet)\`, Java invoque la méthode \`toString()\` héritée de la classe parente ultime \`java.lang.Object\`. Le résultat par défaut est rébarbatif : le nom complet de la classe suivi d'un arobase et du code de hachage hexadécimal de l'objet en mémoire (par exemple \`Etudiant@6d06d69c\`).

Dans tout projet collégial de qualité, vous devez redéfinir proprement cette méthode afin d'obtenir une représentation textuelle conviviale et riche d'informations pour vos traces de débogage.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'ExempleToString.java',
          code: `@Override
public String toString() {
    return String.format("LivreBibliotheque [ISBN=%s, Titre='%s', Auteur='%s', Exemplaires=%d]",
        this.isbn, this.titre, this.auteur, this.nombreExemplaires);
}`,
          explanation: "L'utilisation de String.format() ou des blocs de texte permet de produire une sortie parfaitement alignée et facile à inspecter lors des sessions de débogage."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-2-1',
      number: '2.1',
      title: "Génération automatique d'identifiants séquentiels via une variable statique",
      difficulty: 'Intermédiaire',
      contextQuebec: "La coopérative étudiante du cégep souhaite attribuer automatiquement un numéro de facture unique et consécutif (ex: FACT-2026-0001, FACT-2026-0002) à chaque nouvelle transaction sans risque de doublon.",
      instructions: [
        "Créez la classe « FactureCoop » comportant la date, le montant total avant taxes et le numéro séquentiel unique.",
        "Utilisez une variable statique privée pour mémoriser le dernier numéro de facture émis.",
        "Implémentez un constructeur recevant le montant et attribuant automatiquement l'identifiant.",
        "Ajoutez une méthode métier « calculerTotalAvecTaxes() » appliquant rigoureusement les taxes québécoises combinées (TPS de 5 % et TVQ de 9,975 %).",
        "Redéfinissez la méthode « toString() » pour afficher la facture formatée en dollars canadiens."
      ],
      tips: [
        "En comptabilité québécoise, les taux exacts sont : TPS = 0.05 et TVQ = 0.09975.",
        "Utilisez String.format(\"FACT-2026-%04d\", prochainNumero) pour garantir le remplissage de zéros à gauche."
      ],
      starterCode: `public class FactureCoop {
    // Complétez ici : variables statiques et d'instance
}`,
      solutionCode: `public class FactureCoop {
    // Constantes de taxes au Québec
    public static final double TAUX_TPS = 0.05;
    public static final double TAUX_TVQ = 0.09975;

    // Compteur de classe partagé par toutes les factures
    private static int compteurSequentiel = 0;

    // Attributs d'instance propres à chaque transaction
    private final String numeroFacture;
    private double montantSousTotal;

    public FactureCoop(double montantSousTotal) {
        if (montantSousTotal < 0.0) {
            throw new IllegalArgumentException("Le sous-total ne peut pas être négatif.");
        }
        // Incrémentation atomique du compteur partagé
        compteurSequentiel++;
        this.numeroFacture = String.format("FACT-2026-%04d", compteurSequentiel);
        this.montantSousTotal = montantSousTotal;
    }

    public double calculerTPS() {
        return this.montantSousTotal * TAUX_TPS;
    }

    public double calculerTVQ() {
        return this.montantSousTotal * TAUX_TVQ;
    }

    public double calculerGrandTotal() {
        return this.montantSousTotal + calculerTPS() + calculerTVQ();
    }

    public static int getNombreTotalFacturesEmises() {
        return compteurSequentiel;
    }

    public String getNumeroFacture() { return numeroFacture; }
    public double getMontantSousTotal() { return montantSousTotal; }

    @Override
    public String toString() {
        return String.format("Facture #%s | Sous-total : %.2f $ | TPS : %.2f $ | TVQ : %.2f $ | TOTAL : %.2f $",
            this.numeroFacture, this.montantSousTotal, calculerTPS(), calculerTVQ(), calculerGrandTotal());
    }
}`,
      explanation: "L'attribut compteurSequentiel étant statique, chaque appel au constructeur voit la valeur précédente s'incrémenter. La variable d'instance numeroFacture est marquée final pour empêcher toute altération après émission."
    }
  ],
  quiz: [
    {
      id: 'q-2-1',
      question: "Pourquoi est-il interdit d'écrire l'expression `this.monChamp` à l'intérieur d'une méthode déclarée `public static void` ?",
      options: [
        "Parce que le mot-clé this est réservé exclusivement aux fichiers d'interface graphique Swing.",
        "Parce qu'une méthode statique s'exécute dans le contexte de la classe et non d'une instance spécifique : il n'existe aucun objet courant 'this' associé.",
        "Parce que le compilateur Java efface automatiquement tous les champs à la fin de la méthode.",
        "C'est faux, le mot-clé this est totalement autorisé dans les méthodes statiques."
      ],
      correctIndex: 1,
      explanation: "Une méthode statique est rattachée à la classe, pas à un objet physique dans le tas. En l'absence d'instance concrète lors de l'appel, la référence réflexive this n'a aucun sens mathématique ni logique."
    }
  ],
  summaryChecklist: [
    "Je sais structurer un fichier source Java selon l'ordre professionnel recommandé au cégep.",
    "Je maîtrise la surcharge de constructeurs et le chaînage efficace au moyen de l'instruction this().",
    "Je distingue sans ambiguïté une variable d'instance (spécifique à un objet) d'une variable de classe statique (partagée globalement)."
  ]
};
