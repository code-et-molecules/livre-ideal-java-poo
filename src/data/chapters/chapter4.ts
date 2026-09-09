import { Chapter } from '../../types';

export const chapter4: Chapter = {
  id: 'chapitre-4',
  number: 4,
  title: "La modélisation des relations : association, agrégation, composition et UML",
  subtitle: "Concevoir des architectures logicielles multi-classes et maîtriser les nuances sémantiques de la notation UML",
  estimatedPages: 7,
  competencyGoal: "Traduire des besoins fonctionnels en diagrammes de classes UML normalisés, implémenter les relations d'association, d'agrégation et de composition en Java avec les multiplicités appropriées.",
  introduction: "Dans une application professionnelle, les classes n'évoluent jamais en vase clos : elles collaborent, délèguent des responsabilités et s'assemblent pour bâtir des systèmes complexes. Cependant, relier deux classes exige une compréhension fine de la nature de leur relation. S'agit-il d'un simple lien d'utilisation temporaire ? D'un regroupement d'objets indépendants ? Ou d'une relation de possession vitale et exclusive ? Dans ce chapitre, nous explorons le langage de modélisation unifié (UML) et apprenons à implémenter fidèlement chaque type de lien en Java.",
  sections: [
    {
      id: 'sec-4-1',
      title: "1. Les fondements du diagramme de classes UML",
      estimatedPages: 1.8,
      contentMarkdown: `Le diagramme de classes de l'UML (*Unified Modeling Language*) est le schéma technique de référence utilisé par les analystes et les développeurs pour représenter visuellement la structure statique d'un logiciel avant ou pendant l'écriture du code.

### Anatomie d'un rectangle de classe UML :
Un classe est divisée en trois compartiments verticaux superposés :
1. **Compartiment supérieur** : le nom de la classe (en gras, centré).
2. **Compartiment intermédiaire** : la liste des attributs, sous la forme normalisée :
   \`visibilité nom : type [multiplicité] = valeurInitiale\`
3. **Compartiment inférieur** : la liste des opérations (méthodes), sous la forme :
   \`visibilité nom(paramètre1 : type, ...) : typeRetour\`

### Symboles de visibilité officiels :
* \`+\` : \`public\`
* \`-\` : \`private\`
* \`#\` : \`protected\`
* \`~\` : visibilité paquetage (*package-private*)`,
      diagrams: [
        {
          title: "Notation standard d'une classe en UML",
          type: 'uml',
          asciiOrSvg: `+-----------------------------------------------------------+
|                          Etudiant                         |
+-----------------------------------------------------------+
| - numeroDA : String                                       |
| - nom : String                                            |
| - moyenneCumulative : double = 0.0                        |
+-----------------------------------------------------------+
| + Etudiant(da : String, nom : String)                     |
| + calculerCoteR(moyenneGroupe : double) : double          |
| + getNumeroDA() : String                                  |
+-----------------------------------------------------------+`,
          caption: "Chaque symbole correspond rigoureusement à une instruction de code en langage Java."
        }
      ]
    },
    {
      id: 'sec-4-2',
      title: "2. L'association simple : navigation, multiplicités et cardinalités",
      estimatedPages: 2,
      contentMarkdown: `Une **association** modélise une relation sémantique générale entre deux classes autonomes (« un objet de type A connaît ou utilise un objet de type B »).

### Multiplicités courantes :
* \`1\` : exactement un et un seul.
* \`0..1\` : zéro ou un (relation optionnelle).
* \`*\` ou \`0..*\` : zéro, un ou plusieurs (généralement implémenté avec un tableau ou une liste dynamique \`ArrayList\`).
* \`1..*\` : au moins un ou plusieurs (exige une validation empêchant la liste d'être vide).

### Directionnalité :
* **Unidirectionnelle** (flèche simple) : la classe source possède une référence vers la classe cible, mais la cible ignore totalement l'existence de la source.
* **Bidirectionnelle** (trait simple sans flèche) : chaque classe maintient une référence croisée vers l'autre, ce qui exige une synchronisation manuelle rigoureuse des pointeurs pour éviter les états asymétriques.`,
      quebecPedagogicalNote: "Au cégep, privilégiez toujours les associations unidirectionnelles tant qu'un besoin métier strict n'impose pas la bidirectionnalité. Cela réduit considérablement le couplage entre vos classes."
    },
    {
      id: 'sec-4-3',
      title: "3. Agrégation versus composition : le grand test du cycle de vie",
      estimatedPages: 2.2,
      contentMarkdown: `La distinction entre l'**agrégation** et la **composition** est une question phare des examens collégiaux québécois et un concept clé de conception logicielle.

### L'agrégation (losange blanc évidé ◇) : la relation « tout-partie » faible
* Représente une relation où le contenant regroupe des composants, mais **les composants ont une existence autonome**.
* Si l'objet contenant est détruit, les objets composants **survivent** en mémoire.
* *Exemple collégial québécois* : un cours de cégep (contenant) et ses étudiants inscrits (parties). Si la section de cours \`420-201-RE-01\` est annulée faute d'inscriptions suffisantes, les étudiants ne cessent pas d'exister ! Ils demeurent inscrits au collège et peuvent être transférés dans un autre groupe.

### La composition (losange noir plein ◆) : la relation « tout-partie » forte
* Représente une relation de possession stricte, exclusive et indissociable.
* Le composant n'a **aucun sens en dehors du contenant** et ne peut appartenir à deux contenants distincts simultanément.
* Si le contenant est détruit, tous ses composants sont **immédiatement détruits avec lui** (co-destruction de cycle de vie).
* *Exemple collégial* : un examen départemental de programmation et ses questions d'évaluation. La « Question 3 » de l'examen final de décembre 2026 n'a aucune existence autonome : si l'examen est supprimé de la base de données, ses questions constitutives disparaissent avec lui.`,
      diagrams: [
        {
          title: "Comparatif UML : agrégation faible vs composition forte",
          type: 'uml',
          asciiOrSvg: `AGRÉGATION (Losange blanc) : Cycle de vie indépendant
+---------+              +----------+
|  Cours  | <>---------> | Etudiant |
+---------+ 1        *   +----------+
(Si le cours est annulé, les étudiants survivent)

COMPOSITION (Losange noir) : Cycle de vie dépendant
+---------+              +----------+
| Examen  | <*---------> | Question |
+---------+ 1        *   +----------+
(Si l'examen est détruit, toutes ses questions sont détruites)`,
          caption: "Le losange est toujours placé du côté du contenant (l'agrégat)."
        }
      ]
    },
    {
      id: 'sec-4-4',
      title: "4. Implémentation Java robuste d'une relation de composition",
      estimatedPages: 1.5,
      contentMarkdown: `Pour implémenter fidèlement une composition en Java, la classe contenante doit prendre l'entière responsabilité de l'instanciation de ses composants, et ne jamais exposer directement les références internes :`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'CompositionExemple.java',
          code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ExamenCegep {
    private final String titre;
    // Composition : la liste et les questions sont gérées exclusivement ici
    private final List<QuestionExamen> questions;

    public ExamenCegep(String titre) {
        if (titre == null || titre.isBlank()) {
            throw new IllegalArgumentException("Le titre de l'examen est obligatoire.");
        }
        this.titre = titre.trim();
        this.questions = new ArrayList<>();
    }

    /**
     * Pour respecter la composition, c'est l'Examen qui fabrique ses propres Questions !
     */
    public void ajouterQuestion(String enonce, int points) {
        // Instanciation interne contrôlée
        QuestionExamen nouvelleQuestion = new QuestionExamen(enonce, points);
        this.questions.add(nouvelleQuestion);
    }

    /**
     * Protection par vue non modifiable : interdit à l'extérieur de modifier la liste
     */
    public List<QuestionExamen> getQuestions() {
        return Collections.unmodifiableList(this.questions);
    }

    public int calculerTotalPoints() {
        int total = 0;
        for (QuestionExamen q : this.questions) {
            total += q.getPoints();
        }
        return total;
    }
}`,
          explanation: "La classe ExamenCegep agit comme la gardienne suprême de ses questions. L'extérieur ne peut ni insérer arbitrairement des objets de l'extérieur, ni corrompre la collection."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-4-1',
      number: '4.1',
      title: "Modélisation du centre de dépannage informatique d'un cégep",
      difficulty: 'Intermédiaire',
      contextQuebec: "Le département d'informatique gère une clinique de dépannage pour les étudiants. Un technicien en informatique reçoit des tickets d'assistance. Chaque ticket contient une ou plusieurs interventions horodatées.",
      instructions: [
        "Identifiez la nature exacte de la relation entre un « BilletAssistance » et ses « Interventions » (agrégation ou composition ? Justifiez votre choix).",
        "Concevez la classe « Intervention » comportant la description du problème et le temps passé en minutes.",
        "Concevez la classe « BilletAssistance » garantissant la création interne des interventions.",
        "Ajoutez une méthode calculant la durée totale de soutien offerte pour un billet donné."
      ],
      tips: [
        "Une intervention n'a aucun sens si le billet d'assistance associé est supprimé. Il s'agit donc d'une composition stricte !",
        "Empêchez la durée en minutes d'être négative ou égale à zéro."
      ],
      starterCode: `// Écrivez les classes Intervention et BilletAssistance`,
      solutionCode: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BilletAssistance {
    private final String idBillet;
    private final String descriptionGenerale;
    // Composition : cycle de vie lié
    private final List<Intervention> interventions;

    public BilletAssistance(String idBillet, String descriptionGenerale) {
        if (idBillet == null || idBillet.isBlank()) {
            throw new IllegalArgumentException("Identifiant de billet invalide.");
        }
        this.idBillet = idBillet;
        this.descriptionGenerale = descriptionGenerale;
        this.interventions = new ArrayList<>();
    }

    public void consignerIntervention(String detail, int dureeMinutes) {
        // Fabrication de l'objet composant à l'intérieur du contenant
        Intervention intervention = new Intervention(detail, dureeMinutes);
        this.interventions.add(intervention);
    }

    public int getDureeTotaleMinutes() {
        int cumul = 0;
        for (Intervention i : this.interventions) {
            cumul += i.getDureeMinutes();
        }
        return cumul;
    }

    public List<Intervention> getInterventions() {
        return Collections.unmodifiableList(this.interventions);
    }
}

class Intervention {
    private final String detail;
    private final int dureeMinutes;

    public Intervention(String detail, int dureeMinutes) {
        if (detail == null || detail.isBlank()) {
            throw new IllegalArgumentException("Le détail de l'intervention ne peut être vide.");
        }
        if (dureeMinutes <= 0) {
            throw new IllegalArgumentException("La durée doit être strictement positive.");
        }
        this.detail = detail;
        this.dureeMinutes = dureeMinutes;
    }

    public String getDetail() { return detail; }
    public int getDureeMinutes() { return dureeMinutes; }
}`,
      explanation: "Il s'agit d'une composition pure : les interventions sont co-créées et encapsulées hermétiquement à l'intérieur du billet d'assistance."
    }
  ],
  quiz: [
    {
      id: 'q-4-1',
      question: "Quelle différence sémantique majeure sépare l'agrégation de la composition en UML ?",
      options: [
        "L'agrégation ne fonctionne qu'avec des nombres entiers, alors que la composition supporte les nombres décimaux.",
        "Dans la composition, les composants sont détruits si le contenant est détruit, alors que dans l'agrégation, les composants survivent indépendamment.",
        "L'agrégation s'applique uniquement aux bases de données SQL relationnelles.",
        "Il n'y a aucune différence en mémoire d'exécution, ce sont de purs synonymes stylistiques."
      ],
      correctIndex: 1,
      explanation: "La composition (losange noir plein) impose une co-destruction de cycle de vie et une appartenance exclusive, tandis que l'agrégation (losange blanc évidé) relie des objets ayant chacun leur cycle de vie propre."
    }
  ],
  summaryChecklist: [
    "Je sais lire et dessiner un diagramme de classes UML avec les visibilités (+, -, #) et multiplicités (1, 0..1, 1..*).",
    "Je comprends la nuance fondamentale entre une agrégation (cycle de vie indépendant) et une composition (cycle de vie lié et possession exclusive).",
    "Je sais implémenter en Java des collections internes non modifiables avec Collections.unmodifiableList() pour prévenir la corruption de relations."
  ]
};
