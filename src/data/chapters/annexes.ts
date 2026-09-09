import { Chapter } from '../../types';

export const annexes: Chapter = {
  id: 'annexes',
  number: 'Annexes',
  title: "Ressources de référence et guide de survie du département d'informatique",
  subtitle: "Lexique officiel québécois de l'OQLF et catalogue de résolution des erreurs courantes",
  estimatedPages: 6,
  competencyGoal: "Adopter la terminologie officielle en français de l'informatique québécoise et diagnostiquer en autonomie les erreurs de compilation et d'exécution les plus courantes.",
  introduction: "Les annexes de ce manuel constituent votre boîte à outils d'intervention rapide lors des séances de laboratoire libre ou lors des révisions d'examens. Vous y trouverez d'abord le lexique francophone recommandé par l'Office québécois de la langue française (OQLF) pour la programmation orientée objet, suivi du répertoire méthodique de résolution des erreurs les plus fréquentes rencontrées par les étudiants de première année.",
  sections: [
    {
      id: 'sec-ann-1',
      title: "1. Lexique officiel français / anglais de la programmation orientée objet (OQLF)",
      estimatedPages: 2.5,
      contentMarkdown: `Au Québec, la formation collégiale valorise la maîtrise de la terminologie technique en langue française. Voici les équivalences canoniques :

| Terme français recommandé (OQLF) | Terme anglais courant | Description synthétique |
| :--- | :--- | :--- |
| **Attribut / Variable d'instance** | *Field / Instance variable* | Donnée représentant une composante de l'état interne d'un objet. |
| **Méthode d'instance** | *Instance method* | Fonction membre définissant le comportement exécutable d'un objet. |
| **Accesseur / Mutateur** | *Getter / Setter* | Méthodes contrôlant la lecture et l'écriture sécurisée d'un attribut privé. |
| **Instanciation** | *Instantiation* | Création concrète d'un nouvel objet dans le tas mémoire à l'aide de \`new\`. |
| **Redéfinition** | *Overriding* | Remplacement d'une méthode parente par une version spécialisée (\`@Override\`). |
| **Surcharge** | *Overloading* | Définition de plusieurs méthodes du même nom avec des signatures de paramètres distinctes. |
| **Liaison tardive / dynamique** | *Dynamic dispatch / Late binding* | Choix à l'exécution de la version de méthode à invoquer selon le type réel de l'objet. |
| **Transtypage** | *Type casting* | Conversion explicite d'une référence d'un type vers un sous-type ou super-type. |
| **Ramasse-miettes** | *Garbage collector* | Processus d'arrière-plan de la JVM recyclant la mémoire des objets inatteignables. |
| **Pile d'exécution** | *Call stack* | Espace mémoire stockant les cadres d'activation des méthodes et les variables primitives locales. |
| **Tas dynamique** | *Managed heap* | Vaste espace mémoire où résident tous les objets instanciés et leurs tableaux. |
| **Copie défensive** | *Defensive copy* | Duplication protectrice d'un objet mutable à l'entrée ou la sortie d'une classe. |`,
      quebecPedagogicalNote: "Dans les rapports d'analyse logicielle et les examens théoriques départementaux au cégep, l'utilisation des termes français conformes à l'OQLF est évaluée."
    },
    {
      id: 'sec-ann-2',
      title: "2. Guide de survie : les 8 erreurs d'exécution les plus fréquentes et comment les résoudre",
      estimatedPages: 3.5,
      contentMarkdown: `### 1. \`NullPointerException\` (NPE)
* **Symptôme** : la machine virtuelle s'arrête en signalant une tentative d'accéder à un membre via une référence valant \`null\`.
* **Causes fréquentes** : oubli d'instancier un tableau d'objets, variable d'instance jamais initialisée dans le constructeur, retour \`null\` inattendu d'une recherche dans une \`Map\`.
* **Remède** : tracez la ligne exacte indiquée par la trace de pile. Avant d'écrire \`objet.methode()\`, assurez-vous que \`objet != null\`, ou adoptez les conteneurs \`Optional<T>\`.

### 2. \`ArrayIndexOutOfBoundsException\` ou \`IndexOutOfBoundsException\`
* **Symptôme** : tentative de lecture à un indice négatif ou supérieur ou égal à la taille.
* **Causes fréquentes** : boucle \`for (int i = 0; i <= tab.length; i++)\` (remplacez \`<=\` par \`<\`), ou tentative d'accès à \`liste.get(0)\` sur une liste vide.

### 3. \`ClassCastException\`
* **Symptôme** : tentative de transtypage illégal entre deux types incompatibles dans la hiérarchie d'héritage.
* **Remède** : utilisez l'opérateur moderne de filtrage par motif :
  \`\`\`java
  if (personne instanceof Enseignant e) {
      // 'e' est automatiquement transtypé et disponible ici de manière sûre !
      System.out.println(e.getBureauDepartemental());
  }
  \`\`\`

### 4. \`StackOverflowError\`
* **Symptôme** : la pile d'appels sature et déborde.
* **Causes fréquentes** : récursion sans condition de sortie ou appel mutuel infini entre deux méthodes (souvent entre \`toString()\` de deux classes bidirectionnelles liées !).

### 5. \`ConcurrentModificationException\`
* **Symptôme** : suppression d'un élément d'une liste pendant qu'on la parcourt avec une boucle « for-each ».
* **Remède** : utilisez la méthode moderne \`liste.removeIf(element -> element.estExpire())\` ou un \`Iterator\` explicite avec \`it.remove()\`.

### 6. Éléments perdus dans un \`HashSet\` ou \`HashMap\`
* **Symptôme** : vous avez inséré un objet dans un ensemble, mais \`set.contains(monObjet)\` retourne mystérieusement \`false\` !
* **Cause** : la classe a redéfini \`equals()\` mais a omis de redéfinir \`hashCode()\`, brisant le contrat de hachage.

### 7. « Variable locale might not have been initialized » (erreur de compilation)
* **Cause** : contrairement aux attributs d'instance qui reçoivent une valeur par défaut automatique (0, false, null), les variables locales dans une méthode ne sont **jamais** initialisées par Java. Vous devez leur attribuer une valeur initiale avant toute lecture.

### 8. \`NoSuchElementException\` sur le \`Scanner\`
* **Cause** : fermeture prématurée de \`scanner.close()\` sur \`System.in\`, ce qui ferme définitivement le flux d'entrée standard pour tout le reste du programme.
* **Règle d'or** : ne fermez jamais un Scanner enveloppant \`System.in\` à l'intérieur d'une sous-méthode !`,
      quebecPedagogicalNote: "Conservez cette fiche de diagnostic sous la main lors de toutes vos séances de travaux pratiques en laboratoire !"
    }
  ],
  exercises: [],
  quiz: [
    {
      id: 'q-ann-1',
      question: "Pourquoi est-il déconseillé de fermer un Scanner avec 'scanner.close()' si celui-ci a été créé sur System.in ?",
      options: [
        "Parce que cela provoque une surchauffe du processeur.",
        "Parce que fermer ce Scanner ferme définitivement le flux standard System.in de la JVM : aucune autre saisie clavier ne sera possible dans toute l'application.",
        "Parce que Java ne le permet pas et produit une erreur de compilation immédiate.",
        "C'est une recommandation erronée, il faut absolument le fermer immédiatement."
      ],
      correctIndex: 1,
      explanation: "L'instruction scanner.close() ferme le flux sous-jacent. Si ce flux est System.in, l'entrée standard du terminal devient définitivement inaccessible jusqu'à l'arrêt complet du programme."
    }
  ],
  summaryChecklist: [
    "J'utilise le vocabulaire francophone recommandé par l'OQLF pour décrire mes architectures orientées objet.",
    "Je sais interpréter une trace de pile (stack trace) pour repérer la ligne précise d'une NullPointerException.",
    "Je respecte scrupuleusement la règle de redéfinition conjointe de equals() et hashCode()."
  ]
};
