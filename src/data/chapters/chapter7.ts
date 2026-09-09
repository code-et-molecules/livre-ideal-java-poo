import { Chapter } from '../../types';

export const chapter7: Chapter = {
  id: 'chapitre-7',
  number: 7,
  title: "Les structures de données dynamiques du Java Collections Framework",
  subtitle: "Listes dynamiques, ensembles sans doublons, dictionnaires associatifs et généricité de types",
  estimatedPages: 8,
  competencyGoal: "Sélectionner et exploiter avec discernement la bonne structure de données (List, Set, Map) du framework de collections Java pour résoudre des problèmes collégiaux de gestion de données.",
  introduction: "Dans le premier cours d'informatique, les tableaux primitifs (\`int[]\`, \`String[]\`) constituaient votre seul moyen de regrouper des données en mémoire. Cependant, leur taille fixe immuable dès l'allocation devient vite un fardeau intolérable : que faire lorsque le 33e étudiant s'inscrit dans un cours dont le tableau comptait 32 cases ? Le framework de collections Java (*Java Collections Framework* ou JCF) fournit une panoplie de structures de données sophistiquées, extensibles, optimisées et prêtes à l'emploi. Dans ce chapitre, nous explorons les trois grandes familles de collections : les listes ordonnées, les ensembles sans doublons et les dictionnaires associatifs.",
  sections: [
    {
      id: 'sec-7-1',
      title: "1. La hiérarchie du Java Collections Framework et la programmation par interface",
      estimatedPages: 1.8,
      contentMarkdown: `La règle d'or universelle lors de l'utilisation des collections en Java consiste à **déclarer les variables par leur type interface** et à **instancier par une classe concrète**.

\`\`\`java
// EXCELLENT : programmation par interface
List<Etudiant> etudiants = new ArrayList<>();
Map<String, Cours> registreCours = new HashMap<>();

// À ÉVITER : typage statique rigide couplé à l'implémentation
ArrayList<Etudiant> etudiants = new ArrayList<>();
\`\`\`

Cette pratique permet de remplacer ultérieurement \`ArrayList\` par \`LinkedList\` ou \`HashMap\` par \`TreeMap\` sans changer une seule ligne du reste de votre code applicatif.`,
      diagrams: [
        {
          title: "Arbre de la hiérarchie simplifiée du Java Collections Framework",
          type: 'uml',
          asciiOrSvg: `               <<interface>>
                 Collection
               /            \\
              /              \\
     <<interface>>        <<interface>>          <<interface>>
         List                  Set                    Map
       /      \\                 |                      |
      /        \\                |                      |
 ArrayList   LinkedList      HashSet                HashMap`,
          caption: "List et Set descendent de Collection, tandis que Map forme une branche distincte basée sur des couples clé-valeur."
        }
      ]
    },
    {
      id: 'sec-7-2',
      title: "2. Les listes séquentielles : ArrayList versus LinkedList",
      estimatedPages: 2,
      contentMarkdown: `Une **\`List\`** est une collection ordonnée qui préserve rigoureusement la séquence d'insertion des éléments et autorise les doublons.

### \`ArrayList<E>\` : le choix par défaut dans 95 % des cas
* Repose sous le capot sur un tableau redimensionnable continu en mémoire vive.
* **Accès par index (\`get(i)\`)** : instantané en temps constant **O(1)**.
* **Ajout en fin de liste (\`add(e)\`)** : extrêmement rapide (amorti **O(1)**).
* **Insertion ou suppression au début ou au milieu** : coûteux (**O(n)**), car tous les éléments suivants doivent être physiquement décalés d'une case mémoire.

### \`LinkedList<E>\` : la liste doublement chaînée
* Chaque élément est encapsulé dans un nœud contenant deux pointeurs (vers le nœud précédent et le nœud suivant).
* Insertion et suppression ultra-rapides en tête ou queue de liste (**O(1)**).
* Accès par index très lent (**O(n)**), car la JVM doit parcourir les maillons un par un.`,
      quebecPedagogicalNote: "Dans les laboratoires de 1re année, utilisez systématiquement ArrayList, sauf si l'énoncé du professeur exige explicitement une file ou une pile via LinkedList."
    },
    {
      id: 'sec-7-3',
      title: "3. Les ensembles sans doublon : Set et HashSet",
      estimatedPages: 2,
      contentMarkdown: `Un **\`Set\`** modélise un ensemble mathématique au sens strict :
1. Il **interdit formellement les doublons** : si vous tentez d'insérer un élément déjà présent, l'opération est refusée sans lever d'erreur (\`add()\` retourne \`false\`).
2. \`HashSet\` **ne garantit aucun ordre particulier** lors de l'itération.

### Comment HashSet détecte-t-il les doublons ?
\`HashSet\` s'appuie sur le tandem \`hashCode()\` et \`equals()\` étudié au chapitre 5 :
* Il calcule d'abord le \`hashCode()\` de l'objet pour localiser le compartiment mémoire (*bucket*).
* Si le compartiment contient déjà des objets, il exécute \`equals()\` sur ceux-ci.
* Si \`equals()\` renvoie vrai, l'objet entrant est rejeté comme doublon !`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'DetectionDoublonsSet.java',
          code: `import java.util.HashSet;
import java.util.Set;

public class RegistreAdmissions {
    public static void main(String[] args) {
        Set<String> demandesAdmissionsDA = new HashSet<>();

        // Ajout de dossiers d'admission collégiaux
        demandesAdmissionsDA.add("2340101");
        demandesAdmissionsDA.add("2340102");
        
        // Tentative d'insertion d'un doublon accidentel
        boolean aEteAjoute = demandesAdmissionsDA.add("2340101");

        System.out.println("Ajout réussi ? " + aEteAjoute); // Affiche false !
        System.out.println("Taille totale de l'ensemble : " + demandesAdmissionsDA.size()); // Affiche 2
    }
}`,
          explanation: "Un Set élimine automatiquement les doublons sans qu'il soit nécessaire d'écrire une boucle de recherche manuelle."
        }
      ]
    },
    {
      id: 'sec-7-4',
      title: "4. Les dictionnaires associatifs : Map et HashMap",
      estimatedPages: 2.2,
      contentMarkdown: `Une **\`Map<K, V>\`** (ou table associative) associe des paires formées d'une **clé unique (K)** et d'une **valeur (V)**.

### Caractéristiques de la HashMap :
* Les clés sont obligatoirement **uniques** (une clé remplace la précédente si elle est réinsérée).
* Les valeurs peuvent être dupliquées.
* La recherche d'une valeur à partir de sa clé (\`map.get(cle)\`) est quasi instantanée (**O(1)** en moyenne), même si le dictionnaire compte 100 000 dossiers !`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'AnnuaireCegepHashMap.java',
          code: `import java.util.HashMap;
import java.util.Map;

public class AnnuaireDepartemental {
    public static void main(String[] args) {
        // Clé = Code de cours collégial (String) | Valeur = Nom du cours (String)
        Map<String, String> coursInformatique = new HashMap<>();

        coursInformatique.put("420-101-RE", "Algorithmique et programmation procédurale");
        coursInformatique.put("420-201-RE", "Programmation orientée objet");
        coursInformatique.put("420-301-RE", "Structures de données");

        // Recherche directe par clé : aucun parcours séquentiel nécessaire
        String nom = coursInformatique.get("420-201-RE");
        System.out.println("Cours trouvé : " + nom);

        // Itération propre sur les entrées de la map
        for (Map.Entry<String, String> entree : coursInformatique.entrySet()) {
            System.out.println(entree.getKey() + " -> " + entree.getValue());
        }
    }
}`,
          explanation: "La HashMap remplace avantageusement deux tableaux parallèles synchronisés et offre des performances de recherche imbattables."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-7-1',
      number: '7.1',
      title: "Gestionnaire des casiers d'étudiants de la vie étudiante du cégep",
      difficulty: 'Intermédiaire',
      contextQuebec: "La direction des affaires étudiantes gère l'attribution des casiers dans les ailes A et B du collège. Chaque casier possède un numéro unique (ex: \"A-204\") et peut être attribué à deux étudiants partenaires au maximum.",
      instructions: [
        "Créez une classe « RegistreCasiers » exploitant une Map<String, List<String>> reliant chaque casier à la liste des numéros de DA de ses occupants.",
        "Implémentez la méthode « attribuerCasier(String numeroCasier, String numeroDA) » en vérifiant que le casier ne compte pas plus de 2 occupants.",
        "Implémentez la méthode « libererCasier(String numeroCasier) ».",
        "Ajoutez une méthode retournant la liste de tous les casiers actuellement complets (avec 2 occupants)."
      ],
      tips: [
        "Utilisez map.computeIfAbsent(casier, k -> new ArrayList<>()) pour initialiser élégamment la liste des occupants si le casier est vide.",
        "Vérifiez que le DA ne s'inscrit pas deux fois dans le même casier !"
      ],
      starterCode: `// Écrivez la classe RegistreCasiers avec Map<String, List<String>>`,
      solutionCode: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RegistreCasiers {
    // Clé = numéro du casier (ex: "B-102") | Valeur = liste des DA des occupants
    private final Map<String, List<String>> casiers;

    public RegistreCasiers() {
        this.casiers = new HashMap<>();
    }

    public void attribuerCasier(String numeroCasier, String numeroDA) {
        if (numeroCasier == null || numeroDA == null) {
            throw new IllegalArgumentException("Paramètres de casier invalides.");
        }

        List<String> occupants = this.casiers.computeIfAbsent(numeroCasier, k -> new ArrayList<>());

        if (occupants.size() >= 2) {
            throw new IllegalStateException("Le casier " + numeroCasier + " est déjà plein (2 étudiants maximum).");
        }

        if (occupants.contains(numeroDA)) {
            throw new IllegalArgumentException("L'étudiant " + numeroDA + " est déjà inscrit dans ce casier.");
        }

        occupants.add(numeroDA);
    }

    public void libererCasier(String numeroCasier) {
        this.casiers.remove(numeroCasier);
    }

    public List<String> obtenirCasiersComplets() {
        List<String> complets = new ArrayList<>();
        for (Map.Entry<String, List<String>> entree : this.casiers.entrySet()) {
            if (entree.getValue().size() == 2) {
                complets.add(entree.getKey());
            }
        }
        return complets;
    }
}`,
      explanation: "L'utilisation combinée d'une Map et de listes dynamiques gère naturellement les relations un-à-plusieurs sans limitation artificielle de taille."
    }
  ],
  quiz: [
    {
      id: 'q-7-1',
      question: "Quelle collection Java devez-vous privilégier pour garantir qu'aucun doublon ne puisse exister dans une liste d'adresses courriel ?",
      options: [
        "Une ArrayList<String>",
        "Une LinkedList<String>",
        "Un HashSet<String>",
        "Un tableau primitif String[]"
      ],
      correctIndex: 2,
      explanation: "L'interface Set (implémentée par HashSet) garantit mathématiquement l'unicité de ses éléments grâce aux méthodes hashCode() et equals()."
    }
  ],
  summaryChecklist: [
    "Je déclare mes variables avec le type d'interface (List, Set, Map) plutôt qu'avec la classe concrète.",
    "Je sais choisir entre ArrayList (accès rapide par index), HashSet (unicité stricte sans doublon) et HashMap (recherche instantanée par clé).",
    "Je maîtrise le parcours d'une Map à l'aide de sa vue entrySet()."
  ]
};
