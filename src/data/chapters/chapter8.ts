import { Chapter } from '../../types';

export const chapter8: Chapter = {
  id: 'chapitre-8',
  number: 8,
  title: "Le traitement des exceptions et la robustesse applicative",
  subtitle: "Dépilement d'appels, exceptions vérifiées versus non vérifiées, blocs try-with-resources et exceptions métier personnalisées",
  estimatedPages: 7,
  competencyGoal: "Sécuriser les applications logicielles contre les anomalies d'exécution, maîtriser la hiérarchie Throwable de Java et concevoir des exceptions métier claires pour le domaine collégial.",
  introduction: "Dans un monde idéal, les utilisateurs ne commettraient jamais de fautes de frappe, les serveurs de bases de données ne connaîtraient aucune panne réseau et les fichiers sur disque existeraient toujours au format attendu. Dans le monde réel de l'ingénierie logicielle, ces aléas sont quotidiens. Trop d'étudiants se contentent d'insérer des « try-catch » vides pour faire taire le compilateur, créant ce que l'on nomme des « trous noirs » qui avalent les erreurs et rendent les systèmes impossibles à déboguer. Ce chapitre aborde la gestion d'exceptions professionnelle : comprendre le mécanisme de propagation dans la pile, distinguer les exceptions vérifiées des exceptions d'exécution et créer vos propres types d'erreurs métier.",
  sections: [
    {
      id: 'sec-8-1',
      title: "1. La mécanique de propagation des exceptions et le déroulement de la pile",
      estimatedPages: 1.8,
      contentMarkdown: `Lorsqu'une condition anormale se produit en cours d'exécution, la machine virtuelle Java interrompt le flux séquentiel normal et instancie un objet dérivé de \`java.lang.Throwable\`.

### Le déroulement de la pile (*stack unwinding*)
1. La méthode courante s'arrête net.
2. Si aucun bloc \`try-catch\` approprié n'encadre l'instruction fautive, la méthode est immédiatement dépilée de la pile d'exécution.
3. L'exception est transmise à la méthode appelante, qui tente à son tour de l'attraper.
4. Ce processus se propage en cascade jusqu'au sommet de la pile (\`main\`).
5. Si personne n'intercepte l'exception, le thread courant s'arrête brutalement en imprimant la fameuse trace de pile (*stack trace*).`,
      diagrams: [
        {
          title: "Propagation d'une exception dans la pile d'appels",
          type: 'memory',
          asciiOrSvg: `1. main() appelle traiterInscription()
2. traiterInscription() appelle validerAge()
3. validerAge() détecte une anomalie et fait : throw new AgeInvalideException()
   [validerAge()]        -> Dépilage immédiat (pas de catch)
   [traiterInscription()]-> Dépilage immédiat (pas de catch)
   [main()]              -> Bloc catch trouvé ! Reprise du contrôle sécurisée`,
          caption: "L'exception remonte la pile jusqu'au premier gestionnaire 'catch' compatible."
        }
      ]
    },
    {
      id: 'sec-8-2',
      title: "2. La hiérarchie des erreurs : checked versus unchecked exceptions",
      estimatedPages: 2,
      contentMarkdown: `Toutes les anomalies en Java dérivent de la classe \`Throwable\`, scindée en trois branches majeures :

### 1. Les erreurs système critiques (\`java.lang.Error\`)
Représentent des désastres matériels ou système irrécupérables (ex: \`OutOfMemoryError\`, \`StackOverflowError\`). Votre code ne doit **jamais** tenter de les intercepter.

### 2. Les exceptions non vérifiées (\`RuntimeException\`)
Aussi appelées *unchecked exceptions*. Elles signalent des **erreurs de logique de programmation** qui auraient pu et dû être évitées par des tests préventifs dans le code source :
* \`NullPointerException\` (oubli de vérification de nullité)
* \`IndexOutOfBoundsException\` (dépassement d'indice de tableau ou de liste)
* \`IllegalArgumentException\` (valeur de paramètre absurde transmise à une méthode)
Le compilateur ne force pas leur déclaration ni leur capture.

### 3. Les exceptions vérifiées (*checked exceptions*, directes de \`Exception\`)
Représentent des **aléas extérieurs inévitables** indépendants de la volonté du programmeur (panne réseau, fichier inexistant sur disque \`FileNotFoundException\`, etc.).
Le compilateur Java applique la règle d'airain dite « *Catch or Declare* » : vous devez obligatoirement soit entourer l'appel d'un bloc \`try-catch\`, soit ajouter la clause \`throws\` dans la signature de votre méthode.`,
      quebecPedagogicalNote: "Dans le standard d'enseignement québécois, masquer une exception par un 'catch (Exception e) {}' vide constitue une faute éliminatoire immédiate en examen de laboratoire."
    },
    {
      id: 'sec-8-3',
      title: "3. La fermeture garantie des ressources avec le try-with-resources",
      estimatedPages: 1.8,
      contentMarkdown: `Avant Java 7, la libération des ressources système (fichiers ouverts, flux réseaux) imposait des blocs \`finally\` alambiqués et risqués. Depuis lors, la syntaxe moderne dite **\`try-with-resources\`** automatise intégralement cette tâche pour toute classe implémentant l'interface \`AutoCloseable\`.

Même si une exception brutale survient au milieu de la lecture, la machine virtuelle garantit la fermeture propre du descripteur de fichier avant de propager l'erreur.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'LectureSecuriseeRessources.java',
          code: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ChargeurConfigurationCegep {
    public static void lireParametres(String cheminFichier) {
        // La ressource déclarée entre parenthèses sera AUTOMATIQUEMENT fermée
        try (BufferedReader lecteur = new BufferedReader(new FileReader(cheminFichier))) {
            String ligne;
            while ((ligne = lecteur.readLine()) != null) {
                System.out.println("Paramètre chargé : " + ligne);
            }
        } catch (IOException e) {
            System.err.println("Erreur d'accès au fichier collégial : " + e.getMessage());
        }
    }
}`,
          explanation: "La méthode close() de BufferedReader est invoquée sans faute à la sortie du bloc try, évitant toute fuite de ressources système sur le serveur."
        }
      ]
    },
    {
      id: 'sec-8-4',
      title: "4. La création d'exceptions métier personnalisées",
      estimatedPages: 1.7,
      contentMarkdown: `Dans un logiciel de gestion collégiale, lancer une banale \`Exception\` générique est un signe de négligence. Créer vos propres classes d'exceptions apporte une clarté sémantique incomparable à vos architectures :`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'PrealableNonReussiException.java',
          code: `/**
 * Exception métier levée lorsqu'un étudiant tente de s'inscrire à un cours
 * sans avoir réussi le préalable ministériel obligatoire.
 */
public class PrealableNonReussiException extends Exception {
    private final String codeCoursVise;
    private final String codeCoursPrealable;

    public PrealableNonReussiException(String codeCoursVise, String codeCoursPrealable) {
        super(String.format("Inscription impossible au cours %s : le cours préalable %s n'est pas réussi.",
            codeCoursVise, codeCoursPrealable));
        this.codeCoursVise = codeCoursVise;
        this.codeCoursPrealable = codeCoursPrealable;
    }

    public String getCodeCoursVise() { return codeCoursVise; }
    public String getCodeCoursPrealable() { return codeCoursPrealable; }
}`,
          explanation: "En héritant de Exception, cette classe devient une exception vérifiée. L'interface utilisateur est ainsi contrainte de gérer ce scénario précis pour informer l'étudiant."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-8-1',
      number: '8.1',
      title: "Gestion défensive des inscriptions aux cours du cégep",
      difficulty: 'Intermédiaire',
      contextQuebec: "Le système d'inscription aux cours (Omnivox) doit valider la capacité maximale d'un laboratoire de programmation (30 places) et refuser toute inscription surnuméraire par une exception métier dédiée.",
      instructions: [
        "Créez l'exception personnalisée « GroupeCompletException » étendant Exception.",
        "Concevez la classe « GroupeCours » avec son titre, sa capacité maximale et une liste d'étudiants inscrits.",
        "Dans la méthode « inscrireEtudiant(Etudiant e) », levez « GroupeCompletException » si le nombre d'inscrits atteint la capacité.",
        "Écrivez un programme de test démontrant l'interception et le traitement propre de l'exception."
      ],
      tips: [
        "Transmettez un message explicite au constructeur super(message) pour faciliter le débogage.",
        "N'oubliez pas d'indiquer 'throws GroupeCompletException' dans la signature de inscrireEtudiant."
      ],
      starterCode: `// Écrivez l'exception GroupeCompletException et la classe GroupeCours`,
      solutionCode: `import java.util.ArrayList;
import java.util.List;

public class GroupeCompletException extends Exception {
    public GroupeCompletException(String codeGroupe, int capaciteMax) {
        super("Le groupe " + codeGroupe + " a atteint sa capacité maximale (" + capaciteMax + " places).");
    }
}

class GroupeCours {
    private final String codeGroupe;
    private final int capaciteMax;
    private final List<String> etudiantsDA;

    public GroupeCours(String codeGroupe, int capaciteMax) {
        if (capaciteMax <= 0) throw new IllegalArgumentException("Capacité invalide.");
        this.codeGroupe = codeGroupe;
        this.capaciteMax = capaciteMax;
        this.etudiantsDA = new ArrayList<>();
    }

    public void inscrireEtudiant(String da) throws GroupeCompletException {
        if (this.etudiantsDA.size() >= this.capaciteMax) {
            throw new GroupeCompletException(this.codeGroupe, this.capaciteMax);
        }
        this.etudiantsDA.add(da);
    }

    public int getNombreInscrits() { return this.etudiantsDA.size(); }
}`,
      explanation: "L'exception métier GroupeCompletException formalise le contrat : le sous-programme signale l'impossibilité d'exécuter la demande et délègue la réaction à l'interface d'inscription."
    }
  ],
  quiz: [
    {
      id: 'q-8-1',
      question: "Quelle est la principale différence entre une exception qui hérite de RuntimeException et une qui hérite directement de Exception ?",
      options: [
        "RuntimeException est plus lente à exécuter.",
        "Les sous-classes de RuntimeException sont des exceptions non vérifiées (unchecked) que le compilateur n'oblige pas à capturer avec try-catch.",
        "Exception ne fonctionne pas avec le mot-clé throw.",
        "RuntimeException supprime automatiquement le fichier source lors d'une erreur."
      ],
      correctIndex: 1,
      explanation: "Les exceptions dérivées de RuntimeException représentent des fautes de programmation évitables (comme NullPointerException) : Java dispense donc le développeur de la clause obligatoire throws."
    }
  ],
  summaryChecklist: [
    "Je ne laisse jamais un bloc catch vide dans mes remises de travaux pratiques.",
    "Je distingue les erreurs logiques évitables (RuntimeException) des aléas externes incontournables (checked Exception).",
    "J'utilise systématiquement la syntaxe try-with-resources pour manipuler des fichiers ou des flux réseau."
  ]
};
