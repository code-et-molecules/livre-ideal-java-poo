import { Chapter } from '../../types';

export const chapter6: Chapter = {
  id: 'chapitre-6',
  number: 6,
  title: "Le polymorphisme dynamique, les classes abstraites et les interfaces",
  subtitle: "Liaison tardive, programmation par contrat, interfaces multiples et découplage architectural",
  estimatedPages: 8,
  competencyGoal: "Maîtriser le mécanisme de liaison tardive (polymorphisme dynamique), concevoir des classes abstraites incomplètes et implémenter des interfaces pour découpler les modules logiciels selon les règles de l'art.",
  introduction: "Le mot « polymorphisme » dérive du grec ancien et signifie littéralement « qui peut prendre plusieurs formes ». Dans l'univers de la programmation orientée objet, le polymorphisme est le pouvoir suprême qui confère à votre code une flexibilité et une extensibilité incomparables. Au lieu d'écrire des chaînes interminables d'instructions conditionnelles « if-else » ou « switch » pour tester le type concret de chaque donnée, le polymorphisme permet d'envoyer un message générique à un groupe d'objets hétérogènes, chacun réagissant conformément à sa nature propre. Dans ce chapitre, nous explorons la liaison tardive (*late binding*), les classes abstraites et les interfaces logicielles.",
  sections: [
    {
      id: 'sec-6-1',
      title: "1. Le polymorphisme d'assignation et la liaison tardive",
      estimatedPages: 2,
      contentMarkdown: `Deux concepts jumeaux rendent le polymorphisme possible en Java :

### 1. Le polymorphisme de sous-typage (type statique vs type dynamique)
* **Type statique (ou déclaré)** : c'est le type associé à la variable lors de sa déclaration dans le code source. Il est inspecté par le compilateur au moment de la compilation.
* **Type dynamique (ou réel)** : c'est la classe exacte de l'objet physiquement instancié dans le tas au moyen de \`new\` lors de l'exécution.

\`\`\`java
// Type statique : EquipementInformatique | Type dynamique : ImprimanteReseau
EquipementInformatique equipement = new ImprimanteReseau("HP-Laser-DepInfo", 45);
\`\`\`

### 2. La liaison tardive (*late binding* ou *dynamic dispatch*)
Lorsque vous écrivez l'appel \`equipement.executerDiagnostic()\`, comment la machine virtuelle sait-elle quel bloc d'instructions exécuter ?
En Java, par défaut, la résolution de méthode s'effectue dynamiquement au moment de l'exécution en consultant la table des méthodes virtuelles (*vtable*) de l'objet réel logé dans le tas. Même si la variable est de type générique \`EquipementInformatique\`, c'est la méthode spécialisée de \`ImprimanteReseau\` qui s'exécutera automatiquement !`,
      quebecPedagogicalNote: "L'abandon des 'if (type == 1) ... else if (type == 2)' au profit du polymorphisme d'objets est le critère d'excellence par excellence dans la correction des projets intégrateurs de 2e session au cégep."
    },
    {
      id: 'sec-6-2',
      title: "2. Les classes abstraites : le canevas architectural inachevé",
      estimatedPages: 2,
      contentMarkdown: `Une **classe abstraite** (déclarée avec le mot-clé \`abstract\`) est une classe conceptuelle qui ne peut **jamais être instanciée directement** avec l'opérateur \`new\`. Elle sert de fondation commune à une famille de classes dérivées.

### Pourquoi concevoir une classe abstraite ?
* Elle permet de partager des attributs concrets et du code commun entre plusieurs sous-classes.
* Elle peut contenir des **méthodes abstraites** (sans corps, terminées par un point-virgule) : ces méthodes représentent une obligation contractuelle. Toute sous-classe concrète a le devoir impérieux d'en fournir l'implémentation, sous peine de ne pas pouvoir être instanciée.

\`\`\`java
// Classe abstraite collégiale
public abstract class MembrePersonnel {
    private final String matricule;
    private final String nom;

    public MembrePersonnel(String matricule, String nom) {
        this.matricule = matricule;
        this.nom = nom;
    }

    // Méthode concrète partagée
    public String getNomComplet() { return this.nom; }

    // Méthode abstraite : chaque corps d'emploi calcule sa paie différemment
    public abstract double calculerRemunerationSession();
}
\`\`\``,
      diagrams: [
        {
          title: "Hiérarchie avec classe abstraite en UML (nom en italique)",
          type: 'uml',
          asciiOrSvg: `+-----------------------------------------------+
|             /MembrePersonnel/                 |
+-----------------------------------------------+
| - matricule : String                          |
| - nom : String                                |
+-----------------------------------------------+
| + getNomComplet() : String                    |
| /+ calculerRemunerationSession() : double/    |
+-----------------------------------------------+
                       ^
                       |
       +---------------+---------------+
       |                               |
+----------------------+    +-----------------------+
|  ProfesseurCegep     |    |   TechnicienReseau    |
+----------------------+    +-----------------------+
| + calculerRemun...() |    | + calculerRemun...()  |
+----------------------+    +-----------------------+`,
          caption: "En UML, le texte en italique (ou /nom/) désigne un élément abstrait."
        }
      ]
    },
    {
      id: 'sec-6-3',
      title: "3. Les interfaces Java : le contrat de service pur et le découplage",
      estimatedPages: 2.2,
      contentMarkdown: `En Java, l'héritage multiple de classes est formellement prohibé (une classe ne peut étendre qu'une seule et unique classe mère avec \`extends\`). Pour surmonter cette restriction sans subir les dérives de l'héritage multiple (comme le célèbre problème du diamant), Java propose les **interfaces**.

### Qu'est-ce qu'une interface ?
Une interface est un contrat formel qui spécifie **ce qu'un objet sait faire**, sans imposer **comment il le fait**.
* Une interface déclare des signatures de méthodes que toute classe réalisant l'interface (mot-clé \`implements\`) s'engage solennellement à respecter.
* Une classe peut implémenter **un nombre illimité d'interfaces** (\`implements Serializable, Comparable<T>, Notifiable\`).
* Les interfaces offrent un découplage total : une classe de paiement peut interagir avec une interface \`ServiceFacturation\` sans avoir la moindre idée de la classe concrète qui l'exécute en coulisses.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'NotificationInterfaceExemple.java',
          code: `// Interface contractuelle
public interface ServiceNotification {
    void envoyerAlerte(String destinataire, String message);
}

// Implémentation concrète par SMS
public class ServiceSmsOmnivox implements ServiceNotification {
    @Override
    public void envoyerAlerte(String destinataire, String message) {
        System.out.println("[SMS Omnivox vers " + destinataire + "] : " + message);
    }
}

// Implémentation concrète par courriel collégial
public class ServiceCourrielCegep implements ServiceNotification {
    @Override
    public void envoyerAlerte(String destinataire, String message) {
        System.out.println("[Courriel à " + destinataire + "@cegep.qc.ca] : " + message);
    }
}

// Gestionnaire découplé ne dépendant QUE de l'interface !
public class GestionnaireAlertesUrgentes {
    private final ServiceNotification service;

    // Injection de dépendance par le constructeur
    public GestionnaireAlertesUrgentes(ServiceNotification service) {
        this.service = service;
    }

    public void alerterTempeteNeige(String groupeEtudiants) {
        service.envoyerAlerte(groupeEtudiants, "Avis météo : cours suspendus en raison du blizzard.");
    }
}`,
          explanation: "La classe GestionnaireAlertesUrgentes ne sait même pas si l'alerte part par SMS ou par courriel. On peut changer de fournisseur sans modifier une seule ligne de code du gestionnaire."
        }
      ]
    },
    {
      id: 'sec-6-4',
      title: "4. L'interface standard Comparable et le tri d'objets métier",
      estimatedPages: 1.8,
      contentMarkdown: `Comment ordonner une liste d'étudiants selon leur cote R, ou un ensemble de cours selon leur numéro d'étape ? En Java, la méthode canonique consiste à implémenter l'interface générique standard \`Comparable<T>\`.

Cette interface impose la méthode :
\`public int compareTo(T autre)\`

### Valeurs de retour de compareTo() :
* **Nombre négatif (< 0)** : \`this\` est plus petit que \`autre\` (doit être placé avant dans le tri).
* **Zéro (== 0)** : \`this\` et \`autre\` sont équivalents selon le critère d'ordonnancement.
* **Nombre positif (> 0)** : \`this\` est plus grand que \`autre\` (doit être placé après).`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'EtudiantComparable.java',
          code: `public class CandidatCegep implements Comparable<CandidatCegep> {
    private final String da;
    private final String nom;
    private final double coteR;

    public CandidatCegep(String da, String nom, double coteR) {
        this.da = da;
        this.nom = nom;
        this.coteR = coteR;
    }

    @Override
    public int compareTo(CandidatCegep autre) {
        // Tri décroissant pour favoriser les cotes R les plus élevées en premier
        return Double.compare(autre.coteR, this.coteR);
    }

    public double getCoteR() { return coteR; }
    public String getNom() { return nom; }
}`,
          explanation: "En implémentant Comparable, un simple appel à Collections.sort(maListeDeCandidats) trie instantanément la liste sans aucun algorithme manuel de tri à bulles."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-6-1',
      number: '6.1',
      title: "Système de tarification des plateaux sportifs collégiaux par polymorphisme",
      difficulty: 'Avancé',
      contextQuebec: "Le centre d'activités physiques du cégep (CAP) loue divers plateaux sportifs : gymnase simple, mur d'escalade et terrain synthétique extérieur. Chaque plateau a une formule tarifaire spécifique et applique un rabais pour les associations étudiantes.",
      instructions: [
        "Créez la classe abstraite « PlateauSportif » avec nom du plateau, tarif de base horaire et méthode abstraite « calculerTarifTotal(int heures, boolean estEtudiantCegep) ».",
        "Implémentez « Gymnase » : applique 15 % de rabais aux étudiants du cégep.",
        "Implémentez « MurEscalade » : ajoute des frais fixes obligatoires de 35 $ pour l'équipement d'assurage, puis applique 20 % de rabais étudiant sur les heures.",
        "Rédigez une méthode statique recevant une liste polymorphe de plateaux hétérogènes et calculant les recettes journalières totales."
      ],
      tips: [
        "La boucle de calcul ne doit contenir AUCUN test 'instanceof' ! Laissez la liaison dynamique faire le travail.",
        "Assurez-vous que les heures soient strictement positives."
      ],
      starterCode: `// Écrivez la classe abstraite PlateauSportif et ses dérivées Gymnase et MurEscalade`,
      solutionCode: `import java.util.List;

public abstract class PlateauSportif {
    private final String identifiant;
    private final double tarifHoraireBase;

    public PlateauSportif(String identifiant, double tarifHoraireBase) {
        if (tarifHoraireBase <= 0.0) throw new IllegalArgumentException("Tarif invalide.");
        this.identifiant = identifiant;
        this.tarifHoraireBase = tarifHoraireBase;
    }

    public abstract double calculerTarifTotal(int heures, boolean estEtudiantCegep);

    public String getIdentifiant() { return identifiant; }
    public double getTarifHoraireBase() { return tarifHoraireBase; }
}

class Gymnase extends PlateauSportif {
    public Gymnase(String id, double tarifBase) {
        super(id, tarifBase);
    }

    @Override
    public double calculerTarifTotal(int heures, boolean estEtudiantCegep) {
        if (heures <= 0) throw new IllegalArgumentException("Heures invalides.");
        double sousTotal = getTarifHoraireBase() * heures;
        return estEtudiantCegep ? sousTotal * 0.85 : sousTotal; // 15% de rabais cégep
    }
}

class MurEscalade extends PlateauSportif {
    public static final double FRAIS_SECURITE = 35.0;

    public MurEscalade(String id, double tarifBase) {
        super(id, tarifBase);
    }

    @Override
    public double calculerTarifTotal(int heures, boolean estEtudiantCegep) {
        if (heures <= 0) throw new IllegalArgumentException("Heures invalides.");
        double coutHeures = getTarifHoraireBase() * heures;
        if (estEtudiantCegep) {
            coutHeures *= 0.80; // 20% de rabais étudiant
        }
        return coutHeures + FRAIS_SECURITE;
    }
}

class SimulateurRevenusCAP {
    // Démonstration du polymorphisme pur : aucune instruction conditionnelle de type !
    public static double calculerRecettesGlobales(List<PlateauSportif> plateaux, int heures, boolean rabaisEtudiant) {
        double total = 0.0;
        for (PlateauSportif p : plateaux) {
            total += p.calculerTarifTotal(heures, rabaisEtudiant);
        }
        return total;
    }
}`,
      explanation: "La méthode calculerRecettesGlobales ignore la classe exacte des objets. Si le cégep ajoute demain une classe PiscineOlympique, la boucle fonctionnera sans modifier une seule ligne existante (principe ouvert/fermé)."
    }
  ],
  quiz: [
    {
      id: 'q-6-1',
      question: "Quelle est la caractéristique principale d'une méthode abstraite en Java ?",
      options: [
        "Elle s'exécute deux fois plus vite qu'une méthode classique.",
        "Elle ne possède aucun corps d'implémentation et force les sous-classes concrètes à la redéfinir.",
        "Elle est obligatoirement déclarée statique et privée.",
        "Elle ne peut accepter que des paramètres de type chaîne de caractères."
      ],
      correctIndex: 1,
      explanation: "Une méthode abstraite définit une signature contractuelle sans accolades de code. Elle délègue obligatoirement l'implémentation algorithmique aux classes dérivées concrètes."
    }
  ],
  summaryChecklist: [
    "Je comprends que le polymorphisme exécute la méthode du type dynamique de l'objet dans le tas, et non du type statique de la variable.",
    "Je sais concevoir des classes abstraites pour factoriser du code tout en imposant des méthodes obligatoires aux classes dérivées.",
    "J'utilise les interfaces pour découpler mes classes et implémenter l'interface Comparable pour le tri d'objets."
  ]
};
