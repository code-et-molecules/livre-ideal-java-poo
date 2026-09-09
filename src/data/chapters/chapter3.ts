import { Chapter } from '../../types';

export const chapter3: Chapter = {
  id: 'chapitre-3',
  number: 3,
  title: "L'encapsulation rigoureuse et la robustesse des invariants",
  subtitle: "Modificateurs de visibilité, validation défensive, fuite de références et records immutables",
  estimatedPages: 8,
  competencyGoal: "Maîtriser le principe d'encapsulation, préserver les invariants de classe, neutraliser les fuites de références d'objets mutables par la copie défensive, et exploiter les types records introduits dans les versions modernes de Java.",
  introduction: "L'encapsulation est le pilier central sur lequel repose toute la sécurité logicielle de la programmation orientée objet. Trop souvent réduite à la simple génération automatique de « getters » et « setters » par les raccourcis de l'EDI, la véritable encapsulation est un contrat d'intégrité absolu : un objet ne doit jamais, sous aucun prétexte, autoriser le monde extérieur à le placer dans un état corrompu, incohérent ou invalide. Dans ce chapitre, nous explorons les techniques avancées pour verrouiller vos classes, prévenir le piège subtil des fuites de références mutables et concevoir des objets parfaitement immutables.",
  sections: [
    {
      id: 'sec-3-1',
      title: "1. Le principe du masquage de l'information et les quatre niveaux de visibilité",
      estimatedPages: 1.8,
      contentMarkdown: `Le principe du masquage de l'information (*information hiding*), théorisé par David Parnas, postule qu'un module logiciel doit dissimuler au reste du système ses choix d'implémentation internes et ne révéler qu'une interface minimale de services stables.

Java propose quatre modificateurs d'accès rigoureusement hiérarchisés :
1. **\`private\`** : accessible exclusivement à l'intérieur du corps de la classe elle-même. C'est le niveau par défaut obligatoire pour tous les attributs d'instance en milieu collégial.
2. **Visibilité par défaut (ou *package-private*, sans mot-clé)** : accessible par toutes les classes situées dans le même paquetage (*package*). À éviter pour les données d'instance.
3. **\`protected\`** : accessible au sein du même paquetage ainsi que par toutes les sous-classes dérivées, même situées dans d'autres paquetages.
4. **\`public\`** : accessible sans aucune restriction depuis n'importe quel composant de l'application. Seules les méthodes formant l'interface de service et les constantes immuables (\`public static final\`) doivent être publiques.`,
      quebecPedagogicalNote: "Dans tous les laboratoires de programmation en cégep, déclarer un attribut d'instance 'public' sans justification architecturale exceptionnelle entraîne une pénalité immédiate de plusieurs points sur le critère de sécurité du code."
    },
    {
      id: 'sec-3-2',
      title: "2. Les invariants de classe et la programmation défensive",
      estimatedPages: 2,
      contentMarkdown: `Un **invariant de classe** est une assertion mathématique ou logique concernant l'état d'un objet qui doit être vérifiée de manière permanente :
* Avant l'entrée dans n'importe quelle méthode publique.
* Immédiatement après la fin de l'exécution de n'importe quel constructeur ou méthode publique.

Par exemple, pour un compte d'impression étudiant au cégep :
* Le solde de crédits de pages ne peut jamais être strictement négatif (\`solde >= 0\`).
* Le quota mensuel alloué ne peut excéder 500 pages.

Pour faire respecter ces invariants, chaque mutateur (*setter*) ainsi que chaque constructeur doit intercepter les paramètres anormaux et lever immédiatement une exception explicite (comme \`IllegalArgumentException\` ou \`IllegalStateException\`) avant que l'état interne ne soit altéré.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'CompteImpressionEtudiant.java',
          code: `public class CompteImpressionEtudiant {
    public static final int QUOTA_MAXIMAL_PAGES = 500;

    private final String numeroDA;
    private int pagesRestantes;

    public CompteImpressionEtudiant(String numeroDA, int pagesInitiales) {
        if (numeroDA == null || !numeroDA.matches("^\\\\d{7}$")) {
            throw new IllegalArgumentException("Numéro de DA invalide.");
        }
        this.numeroDA = numeroDA;
        // Validation via le mutateur privé interne pour garantir l'invariant
        setPagesRestantes(pagesInitiales);
    }

    public void rechargerCredits(int nombrePages) {
        if (nombrePages <= 0) {
            throw new IllegalArgumentException("Le nombre de pages rechargées doit être supérieur à zéro.");
        }
        if (this.pagesRestantes + nombrePages > QUOTA_MAXIMAL_PAGES) {
            throw new IllegalStateException("Le rechargement dépasse le quota maximal autorisé de " + QUOTA_MAXIMAL_PAGES + " pages.");
        }
        this.pagesRestantes += nombrePages;
    }

    public void imprimerDocument(int nombrePages) {
        if (nombrePages <= 0) {
            throw new IllegalArgumentException("Le document doit comporter au moins 1 page.");
        }
        if (nombrePages > this.pagesRestantes) {
            throw new IllegalStateException("Solde insuffisant : " + this.pagesRestantes + " pages disponibles, demande de " + nombrePages + ".");
        }
        this.pagesRestantes -= nombrePages;
    }

    private void setPagesRestantes(int pages) {
        if (pages < 0 || pages > QUOTA_MAXIMAL_PAGES) {
            throw new IllegalArgumentException("Le solde doit être compris entre 0 et " + QUOTA_MAXIMAL_PAGES + ".");
        }
        this.pagesRestantes = pages;
    }

    public String getNumeroDA() { return numeroDA; }
    public int getPagesRestantes() { return pagesRestantes; }
}`,
          explanation: "Remarquez que la méthode setPagesRestantes() est privée : l'extérieur ne peut pas changer le solde arbitrairement, mais doit passer par les méthodes métier imprimerDocument() ou rechargerCredits()."
        }
      ]
    },
    {
      id: 'sec-3-3',
      title: "3. Le piège redoutable des fuites d'encapsulation par référence mutable",
      estimatedPages: 2.2,
      contentMarkdown: `C'est l'un des bogues les plus subtils et destructeurs en Java. Beaucoup d'étudiants croient qu'en rendant un champ \`private\` et en écrivant un simple accesseur \`public Date getDateNaissance() { return this.dateNaissance; }\`, l'encapsulation est parfaitement respectée. C'est une illusion complète dès lors que l'objet retourné est **mutable** (modifiable) !

### Pourquoi l'encapsulation fuit-elle ?
Lorsque votre accesseur retourne la référence directe vers un tableau ou vers un objet mutable interne :
* L'appelant extérieur reçoit une copie de l'adresse mémoire du tas.
* Il peut alors exécuter des méthodes de modification sur cet objet externe.
* L'état interne de votre classe est corrompu à distance, à l'insu de vos validations et sans que votre classe n'en soit jamais avertie !

### La parade absolue : la copie défensive (*defensive copy*)
Pour toute structure mutable reçue en paramètre dans un constructeur ou retournée par un accesseur :
1. **À l'entrée (constructeur)** : instanciez un nouvel objet ou tableau indépendant et recopiez-y les valeurs avant de l'assigner à votre attribut privé.
2. **À la sortie (getter)** : retournez un clone ou une copie fraîche de votre structure de données interne, ou encapsulez-la dans une vue non modifiable (\`Collections.unmodifiableList()\`).`,
      diagrams: [
        {
          title: "Fuite d'encapsulation vs copie défensive étanche",
          type: 'memory',
          asciiOrSvg: `CAS 1 : FUITE D'ENCAPSULATION (DANGEREUX)
Appelant externe ---> [Référence directe @0x55] ---> [Tableau de notes interne]
(L'appelant peut écrire notes[0] = -50 en contournant tous les contrôles !)

CAS 2 : COPIE DÉFENSIVE ÉTANCHE (SÉCURISÉ)
Classe interne  ---> [Tableau original @0x55] (Inviolable dans l'objet)
Appelant getter <--- [Copie dupliquée @0x99] (L'appelant peut gribouiller sans danger)`,
          caption: "La copie défensive isole complètement la mémoire interne de l'objet."
        }
      ]
    },
    {
      id: 'sec-3-4',
      title: "4. Les types enregistrements (records) en Java moderne",
      estimatedPages: 2,
      contentMarkdown: `Depuis Java 16, le langage intègre une fonctionnalité majeure pour modéliser des transporteurs de données purs et immuables : les **records** (enregistrements).

Un record est une forme condensée de classe dont tous les champs sont implicitement \`private final\`. Le compilateur génère automatiquement pour vous :
* Le constructeur canonique avec tous les paramètres
* Les accesseurs en lecture (sans le préfixe \`get\`, par exemple \`monRecord.codeCours()\`)
* Les méthodes \`equals()\`, \`hashCode()\` et \`toString()\` cohérentes basées sur la valeur de tous les champs

Les records sont parfaits au cégep pour modéliser des données de configuration, des paires clé-valeur ou des résultats intermédiaires d'algorithmes.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'HoraireCoursRecord.java',
          code: `/**
 * Modélisation d'une plage horaire de cours au cégep sous forme de record.
 * Garantie d'immutabilité absolue par le compilateur.
 */
public record PlageHoraire(String jourSemaine, int heureDebut, int heureFin) {
    // Constructeur compact permettant de valider les invariants
    public PlageHoraire {
        if (jourSemaine == null || jourSemaine.isBlank()) {
            throw new IllegalArgumentException("Le jour de la semaine est obligatoire.");
        }
        if (heureDebut < 8 || heureFin > 18 || heureDebut >= heureFin) {
            throw new IllegalArgumentException("Plage horaire collégiale invalide (doit être entre 8h et 18h).");
        }
    }

    public int getDureeHeures() {
        return heureFin - heureDebut;
    }
}`,
          explanation: "En seulement 10 lignes, le record offre une classe immuable, résistante aux bogues et d'une concision exemplaire."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-3-1',
      number: '3.1',
      title: "Neutralisation d'une fuite d'encapsulation dans un relevé de notes collégial",
      difficulty: 'Intermédiaire',
      contextQuebec: "Un stagiaire a conçu une classe « DossierScolaire » contenant un tableau de notes d'évaluations. Cependant, l'application Web du cégep permet à un utilisateur malveillant de modifier ses notes rétroactivement sans passer par la méthode officielle d'approbation.",
      instructions: [
        "Identifiez où se produit la fuite d'encapsulation dans le code fourni.",
        "Implémentez la copie défensive dans le constructeur afin qu'une modification ultérieure du tableau passé en argument n'affecte pas l'objet.",
        "Implémentez la copie défensive dans la méthode « getNotes() » pour empêcher toute écriture externe.",
        "Ajoutez une méthode calculant la moyenne exacte de l'étudiant."
      ],
      tips: [
        "Pour dupliquer un tableau primitif double[], utilisez la méthode notes.clone() ou Arrays.copyOf(notes, notes.length).",
        "N'oubliez pas de tester le cas où le tableau reçu en paramètre est nul ou vide."
      ],
      starterCode: `// Code vulnérable présentant une fuite sévère d'encapsulation
public class DossierScolaire {
    private final String da;
    private double[] notes;

    public DossierScolaire(String da, double[] notes) {
        this.da = da;
        this.notes = notes; // ALERTE : Fuite à l'entrée !
    }

    public double[] getNotes() {
        return this.notes;  // ALERTE : Fuite à la sortie !
    }
}`,
      solutionCode: `import java.util.Arrays;

public class DossierScolaire {
    private final String da;
    private final double[] notes;

    public DossierScolaire(String da, double[] notes) {
        if (da == null || !da.matches("^\\\\d{7}$")) {
            throw new IllegalArgumentException("Numéro de DA collégial invalide.");
        }
        if (notes == null || notes.length == 0) {
            throw new IllegalArgumentException("Le dossier doit comporter au moins une note.");
        }
        
        // 1. Copie défensive à l'entrée : création d'un tableau indépendant
        this.da = da;
        this.notes = new double[notes.length];
        for (int i = 0; i < notes.length; i++) {
            if (notes[i] < 0.0 || notes[i] > 100.0) {
                throw new IllegalArgumentException("Toutes les notes doivent être situées entre 0 et 100.");
            }
            this.notes[i] = notes[i];
        }
    }

    // 2. Copie défensive à la sortie : l'appelant reçoit un nouveau tableau clone
    public double[] getNotes() {
        return this.notes.clone();
    }

    public double calculerMoyenne() {
        double somme = 0.0;
        for (double note : this.notes) {
            somme += note;
        }
        return somme / this.notes.length;
    }

    public String getDa() {
        return da;
    }
}`,
      explanation: "Grâce à this.notes.clone() et à la recopie manuelle avec vérification dans le constructeur, aucune modification sur les tableaux extérieurs ne peut altérer l'intégrité du relevé de notes."
    }
  ],
  quiz: [
    {
      id: 'q-3-1',
      question: "Pourquoi l'utilisation du mot-clé `final` sur un champ de type tableau (ex : `private final int[] tab`) ne suffit-elle PAS à garantir l'immutabilité ?",
      options: [
        "Parce que le mot-clé final est ignoré par la machine virtuelle Java sur les tableaux.",
        "Parce que final empêche uniquement de réassigner la variable vers un autre tableau, mais les cases individuelles du tableau demeurent modifiables.",
        "Parce que les tableaux sont automatiquement convertis en listes dynamiques mutables.",
        "Parce que le mot-clé final ne fonctionne que sur les chaînes de caractères de type String."
      ],
      correctIndex: 1,
      explanation: "Sur une variable de référence, 'final' verrouille uniquement l'adresse mémoire contenue dans la référence. L'objet pointé dans le tas reste pleinement mutable : on peut écrire 'tab[0] = 999' sans la moindre erreur de compilation."
    }
  ],
  summaryChecklist: [
    "J'applique le modificateur 'private' sur l'ensemble de mes attributs d'instance sans exception.",
    "Je valide systématiquement les invariants d'état dans mes constructeurs et mes mutateurs en levant des exceptions appropriées.",
    "Je neutralise les fuites de références sur les objets mutables et tableaux en procédant à des copies défensives rigoureuses à l'entrée et à la sortie."
  ]
};
