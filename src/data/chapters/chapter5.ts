import { Chapter } from '../../types';

export const chapter5: Chapter = {
  id: 'chapitre-5',
  number: 5,
  title: "L'héritage et la réutilisation de code",
  subtitle: "Spécialisation sémantique, invocation de super, redéfinition méthodique et maîtrise de la classe Object",
  estimatedPages: 8,
  competencyGoal: "Concevoir des hiérarchies de classes cohérentes respectant la relation « est-un », invoquer adéquatement les constructeurs et méthodes parents via super, et redéfinir correctement equals() et hashCode().",
  introduction: "L'héritage est l'un des mécanismes les plus célèbres de la programmation orientée objet, mais il est aussi l'un des plus fréquemment mal employés par les débutants. Utilisé judicieusement, il permet de factoriser du code commun, de créer des modèles conceptuels puissants et d'établir une taxonomie claire au sein de votre domaine d'affaires. Mal employé, il engendre des hiérarchies rigides et fragiles violant les principes élémentaires de conception. Dans ce chapitre, nous examinons la sémantique rigoureuse de l'héritage en Java, le rôle de la classe racine universelle « java.lang.Object », et les règles incontournables d'égalité logique.",
  sections: [
    {
      id: 'sec-5-1',
      title: "1. La sémantique de l'héritage : le test infaillible du « est-un » (*is-a*)",
      estimatedPages: 1.8,
      contentMarkdown: `Avant d'écrire le moindre mot-clé \`extends\` dans un projet collégial, vous devez obligatoirement soumettre votre réflexion au test sémantique du **« est-un »** :
* Une sous-classe doit être une spécialisation authentique et totale de sa super-classe.
* Tout ce qui est vrai pour la classe mère doit demeurer vrai sans concession pour la classe fille (principe de substitution de Liskov).

### Exemples d'héritages valides au cégep :
* Un \`Enseignant\` **est une** \`Personne\`.
* Un \`EtudiantRegulier\` **est un** \`Etudiant\`.
* Un \`PortatifPret\` **est un** \`EquipementInformatique\`.

### Contre-exemple et erreur classique :
* Une \`ClasseCours\` n'est PAS un \`Etudiant\` (une classe de cours ne « spécialise » pas un étudiant, elle **contient** des étudiants : c'est une relation d'agrégation ou de composition, jamais d'héritage !).`,
      quebecPedagogicalNote: "Dans les critères d'évaluation au cégep, l'utilisation abusive de l'héritage là où une simple association ou composition s'imposait est considérée comme une faute conceptuelle grave."
    },
    {
      id: 'sec-5-2',
      title: "2. Le mot-clé super et la transmission de relais dans les constructeurs",
      estimatedPages: 2,
      contentMarkdown: `Lorsqu'une sous-classe hérite d'une super-classe, la mémoire physique d'un objet dérivé dans le tas contient à la fois les attributs hérités de la mère et les attributs spécifiques de la fille.

Par conséquent, **avant que le constructeur de la fille ne puisse initialiser ses propres champs, le constructeur de la classe mère doit obligatoirement avoir été exécuté**.

### Règles impératives de \`super(...)\` :
1. L'appel \`super(...)\` doit figurer sur la **toute première ligne** du constructeur de la sous-classe.
2. Si vous n'écrivez pas explicitement \`super(...)\`, le compilateur insère automatiquement \`super()\` sans paramètre. Si la classe mère ne possède pas de constructeur sans paramètre accessible, votre code refuse de compiler avec une erreur explicite.
3. Le mot-clé \`super\` permet également à une méthode fille de réutiliser le comportement de la mère tout en le complétant (\`super.maMethode()\`).`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'HierarchiePersonnelCegep.java',
          code: `// Super-classe mère
public class MembreCommunaute {
    private final String nom;
    private final String courriel;

    public MembreCommunaute(String nom, String courriel) {
        if (nom == null || nom.isBlank()) throw new IllegalArgumentException("Nom obligatoire.");
        if (courriel == null || !courriel.contains("@cegep.qc.ca")) {
            throw new IllegalArgumentException("Le courriel doit être une adresse officielle du cégep.");
        }
        this.nom = nom.trim();
        this.courriel = courriel.trim().toLowerCase();
    }

    public String getNom() { return nom; }
    public String getCourriel() { return courriel; }
}

// Sous-classe fille spécialisée
public class EnseignantInformatique extends MembreCommunaute {
    private final String bureauDepartemental;
    private double chargeEnseignementHeures;

    public EnseignantInformatique(String nom, String courriel, String bureau, double chargeHeures) {
        // 1. Initialisation obligatoire de la partie mère en toute première instruction
        super(nom, courriel);

        // 2. Initialisation des spécificités locales
        if (bureau == null || bureau.isBlank()) throw new IllegalArgumentException("Bureau requis.");
        if (chargeHeures < 0.0) throw new IllegalArgumentException("Charge horaire invalide.");

        this.bureauDepartemental = bureau.trim();
        this.chargeEnseignementHeures = chargeHeures;
    }

    public String getBureauDepartemental() { return bureauDepartemental; }
    public double getChargeEnseignementHeures() { return chargeEnseignementHeures; }
}`,
          explanation: "La sous-classe ne réinvente pas la validation du nom ni du courriel : elle s'appuie en toute confiance sur le contrat établi par super()."
        }
      ]
    },
    {
      id: 'sec-5-3',
      title: "3. La redéfinition de méthodes avec l'annotation @Override",
      estimatedPages: 2,
      contentMarkdown: `La **redéfinition** (*method overriding*) consiste, pour une sous-classe, à proposer sa propre version d'une méthode déjà présente chez son parent.

### Conditions strictes de la redéfinition en Java :
* La méthode fille doit posséder **rigoureusement le même nom**.
* Elle doit avoir **la même liste exacte de paramètres** (ordre et types).
* Son type de retour doit être identique (ou covariant, c'est-à-dire un sous-type).
* La visibilité ne peut pas être plus restrictive (une méthode \`public\` chez la mère ne peut pas devenir \`private\` chez la fille).

### L'annotation \`@Override\` : votre bouclier contre les fautes de frappe
Apposez **systématiquement** l'annotation \`@Override\` au-dessus de chaque méthode redéfinie. Si vous commettez une minuscule faute d'orthographe (par exemple \`toSting()\` au lieu de \`toString()\`), le compilateur s'arrêtera net et vous signalera l'erreur, évitant des heures de débogage frustrant.`,
      quebecPedagogicalNote: "L'omission de l'annotation @Override lors de la redéfinition de méthodes est systématiquement pénalisée dans les devoirs remis au cégep."
    },
    {
      id: 'sec-5-4',
      title: "4. L'anatomie de la classe Object : equals() et hashCode()",
      estimatedPages: 2.2,
      contentMarkdown: `Toute classe en Java hérite tacitement de \`java.lang.Object\`. Parmi les méthodes héritées, le duo \`equals()\` et \`hashCode()\` est crucial.

### L'opérateur == versus la méthode equals() :
* **\`==\`** compare l'égalité des valeurs contenues dans la pile. Pour deux variables d'objets, \`==\` teste l'**identité physique** (pointent-elles vers la même adresse mémoire exacte dans le tas ?).
* **\`equals()\`** doit être redéfinie pour comparer l'**égalité sémantique** ou logique (deux étudiants différents en mémoire ayant le même numéro de DA représentent-ils le même dossier scolaire québécois ?).

### Le contrat sacré entre equals() et hashCode() :
Si deux objets sont considérés égaux selon la méthode \`equals()\`, ils **doivent impérativement retourner le même code de hachage numérique via \`hashCode()\`**. Si vous brisez cette règle, vos objets seront introuvables et mystérieusement perdus au sein des collections de type \`HashSet\` ou \`HashMap\` !`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'ImplementationEquals.java',
          code: `import java.util.Objects;

public class EtudiantCegep {
    private final String numeroDA;
    private String nom;

    public EtudiantCegep(String numeroDA, String nom) {
        this.numeroDA = numeroDA;
        this.nom = nom;
    }

    @Override
    public boolean equals(Object obj) {
        // 1. Même référence physique en mémoire ?
        if (this == obj) return true;

        // 2. Objet null ou de classe différente ?
        if (obj == null || getClass() != obj.getClass()) return false;

        // 3. Transtypage sécurisé et comparaison de la clé d'identité métier (DA)
        EtudiantCegep other = (EtudiantCegep) obj;
        return Objects.equals(this.numeroDA, other.numeroDA);
    }

    @Override
    public int hashCode() {
        // Hachage calculé sur le même champ déterminant l'égalité
        return Objects.hash(this.numeroDA);
    }
}`,
          explanation: "La méthode standardisée en 3 étapes garantit la réflexivité, la symétrie, la transitivité et la cohérence requises par les spécifications de Java."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-5-1',
      number: '5.1',
      title: "Hiérarchie de gestion des bourses d'études au cégep",
      difficulty: 'Intermédiaire',
      contextQuebec: "La fondation du cégep octroie deux types de bourses annuelles aux étudiants : les bourses d'excellence académique (basées sur la cote R) et les bourses d'implication communautaire et sportive (basées sur un nombre d'heures de bénévolat validé).",
      instructions: [
        "Créez la classe mère « BourseEtude » contenant l'identifiant, le bénéficiaire et le montant de base.",
        "Créez la sous-classe « BourseExcellence » ajoutant la cote R de l'étudiant, avec une bonification de 250 $ si la cote R dépasse 33.0.",
        "Créez la sous-classe « BourseImplication » ajoutant le nombre d'heures de bénévolat, avec une majoration de 10 $ par heure attestée.",
        "Redéfinissez la méthode « calculerMontantFinal() » dans chaque classe fille en utilisant super."
      ],
      tips: [
        "Rendez les attributs de la classe mère 'private' et utilisez des accesseurs protégés ou publics.",
        "Pensez à invoquer super(identifiant, beneficiaire, montantBase) dès la première ligne des constructeurs dérivés."
      ],
      starterCode: `// Développez la hiérarchie BourseEtude, BourseExcellence et BourseImplication`,
      solutionCode: `public class BourseEtude {
    private final String idBourse;
    private final String nomBeneficiaire;
    private final double montantBase;

    public BourseEtude(String idBourse, String nomBeneficiaire, double montantBase) {
        if (montantBase <= 0.0) throw new IllegalArgumentException("Le montant de base doit être positif.");
        this.idBourse = idBourse;
        this.nomBeneficiaire = nomBeneficiaire;
        this.montantBase = montantBase;
    }

    public double calculerMontantFinal() {
        return this.montantBase;
    }

    public String getIdBourse() { return idBourse; }
    public String getNomBeneficiaire() { return nomBeneficiaire; }
    public double getMontantBase() { return montantBase; }
}

class BourseExcellence extends BourseEtude {
    private final double coteR;

    public BourseExcellence(String id, String nom, double montantBase, double coteR) {
        super(id, nom, montantBase);
        if (coteR < 0.0 || coteR > 50.0) throw new IllegalArgumentException("Cote R invalide.");
        this.coteR = coteR;
    }

    @Override
    public double calculerMontantFinal() {
        double montant = super.calculerMontantFinal();
        if (this.coteR >= 33.0) {
            montant += 250.0; // Bonification d'excellence québécoise
        }
        return montant;
    }

    public double getCoteR() { return coteR; }
}

class BourseImplication extends BourseEtude {
    private final int heuresBenevolat;

    public BourseImplication(String id, String nom, double montantBase, int heures) {
        super(id, nom, montantBase);
        if (heures < 0) throw new IllegalArgumentException("Les heures ne peuvent être négatives.");
        this.heuresBenevolat = heures;
    }

    @Override
    public double calculerMontantFinal() {
        return super.calculerMontantFinal() + (this.heuresBenevolat * 10.0);
    }

    public int getHeuresBenevolat() { return heuresBenevolat; }
}`,
      explanation: "Cette hiérarchie respecte scrupuleusement le principe de substitution : toute instance de BourseExcellence peut être manipulée là où une BourseEtude générique est attendue."
    }
  ],
  quiz: [
    {
      id: 'q-5-1',
      question: "Pourquoi est-il crucial de redéfinir la méthode hashCode() dès lors que l'on redéfinit la méthode equals() ?",
      options: [
        "Pour que le compilateur Java puisse compresser le fichier binaire .class sur le disque.",
        "Parce que deux objets considérés égaux par equals() doivent obligatoirement produire le même code de hachage pour fonctionner dans les collections comme HashSet et HashMap.",
        "Pour permettre l'affichage du mot de passe de l'utilisateur dans les journaux système.",
        "C'est une ancienne obligation de Java 1.1 qui n'a plus d'impact aujourd'hui."
      ],
      correctIndex: 1,
      explanation: "Les tables de hachage regroupent les objets dans des compartiments calculés à partir de hashCode(). Si deux objets égaux possèdent des hashCodes divergents, la collection cherchera dans le mauvais compartiment et échouera à retrouver l'élément."
    }
  ],
  summaryChecklist: [
    "J'applique l'héritage uniquement lorsqu'une relation authentique « est-un » relie les entités métier.",
    "J'appelle explicitement super(...) en première ligne des constructeurs de toutes mes sous-classes.",
    "Je redéfinis conjointement et méthodiquement equals() et hashCode() pour toute classe métier nécessitant une comparaison logique."
  ]
};
