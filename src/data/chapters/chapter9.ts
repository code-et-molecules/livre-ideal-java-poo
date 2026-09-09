import { Chapter } from '../../types';

export const chapter9: Chapter = {
  id: 'chapitre-9',
  number: 9,
  title: "Les entrées/sorties et la persistance de fichiers",
  subtitle: "Fichiers texte CSV, API moderne java.nio.file, analyseurs de données et séparation de couches",
  estimatedPages: 7,
  competencyGoal: "Lire, parser, valider et sauvegarder des données structurées dans des fichiers texte au format CSV en exploitant les fonctionnalités modernes de java.nio.file et Files.",
  introduction: "Tant que votre programme Java s'exécute, vos objets prospèrent dans la mémoire vive. Mais aussitôt que la machine virtuelle s'arrête ou que l'ordinateur s'éteint, l'ensemble des données du tas s'évapore instantanément. Pour qu'une application de gestion collégiale soit véritablement utile, elle doit assurer la **persistance** de son état d'une session de travail à l'autre. Dans ce deuxième cours de programmation, nous n'abordons pas encore les bases de données SQL relationnelles lourdes (réservées à la session 3) : nous étudions la persistance par fichiers plats structurés (fichiers texte délimités CSV) en utilisant la puissante API moderne « java.nio.file ».",
  sections: [
    {
      id: 'sec-9-1',
      title: "1. L'API moderne NIO.2 : Path et Files versus l'ancienne classe File",
      estimatedPages: 1.8,
      contentMarkdown: `L'ancienne classe historique \`java.io.File\` introduite en 1996 présentait de nombreuses lacunes (absence de gestion d'exceptions précises sur les échecs de suppression, mauvaise gestion des liens symboliques).

Depuis Java 7, l'API **NIO.2** (\`java.nio.file\`) s'impose comme le standard universel grâce à deux éléments clés :
* **\`Path\`** : interface représentant un chemin d'accès abstrait et multiplateforme dans le système de fichiers (supporte indifféremment les séparateurs \`/\` de Linux/macOS et \`\\\\\` de Windows).
* **\`Files\`** : boîte à outils utilitaire statique fournissant des méthodes tout-en-un pour lire, écrire, copier ou vérifier l'existence de fichiers avec une concision et une sécurité remarquables.

\`\`\`java
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

// Construction d'un chemin normalisé
Path cheminDonnees = Paths.get("donnees", "etudiants.csv");

// Vérification de sécurité
if (Files.exists(cheminDonnees)) {
    System.out.println("Taille du fichier : " + Files.size(cheminDonnees) + " octets.");
}
\`\`\``,
      quebecPedagogicalNote: "L'utilisation de la classe obsolète java.io.File est vivement découragée au cégep au profit de java.nio.file.Path et java.nio.file.Files."
    },
    {
      id: 'sec-9-2',
      title: "2. Lecture et analyse d'un fichier CSV : le processus de parsing",
      estimatedPages: 2.2,
      contentMarkdown: `Le format CSV (*Comma-Separated Values*) est le format d'échange textuel le plus répandu pour importer et exporter des données entre systèmes collégiaux (comme Clara, Omnivox ou Excel).

### Le flux séquentiel de désérialisation :
1. Lire le fichier ligne par ligne à l'aide de \`Files.readAllLines(path, StandardCharsets.UTF_8)\` ou d'un flux \`BufferedReader\`.
2. Ignorer la ligne d'en-tête contenant les noms de colonnes.
3. Découper chaque ligne en jetons textuels avec la méthode \`ligne.split(\";\")\` ou \`ligne.split(\",\")\`.
4. Valider le nombre exact de colonnes reçues.
5. Convertir les types textuels primitifs (\`Integer.parseInt()\`, \`Double.parseDouble()\`).
6. Instancier l'objet métier via son constructeur validant (qui interceptera toute valeur corrompue).
7. Ajouter l'objet sain dans la collection en mémoire.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'LecteurEtudiantsCsv.java',
          code: `import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class LecteurEtudiantsCsv {
    public static List<Etudiant> chargerEtudiants(Path cheminFichier) throws IOException {
        List<Etudiant> liste = new ArrayList<>();
        List<String> lignes = Files.readAllLines(cheminFichier, StandardCharsets.UTF_8);

        // On saute l'en-tête d'indice 0
        for (int i = 1; i < lignes.size(); i++) {
            String ligne = lignes.get(i).trim();
            if (ligne.isEmpty()) continue;

            String[] jetons = ligne.split(";");
            if (jetons.length != 3) {
                System.err.println("Avertissement : ligne " + (i + 1) + " ignorée (colonnes invalides).");
                continue;
            }

            String da = jetons[0].trim();
            String nom = jetons[1].trim();
            double coteR = Double.parseDouble(jetons[2].trim());

            try {
                Etudiant etudiant = new Etudiant(da, nom, coteR);
                liste.add(etudiant);
            } catch (IllegalArgumentException e) {
                System.err.println("Ligne rejetée pour données invalides : " + e.getMessage());
            }
        }
        return liste;
    }
}`,
          explanation: "La méthode combine lecture sécurisée en UTF-8, tolérance aux lignes vides et validation métier pour chaque ligne traitée."
        }
      ]
    },
    {
      id: 'sec-9-3',
      title: "3. Écriture atomique et sérialisation textuelle",
      estimatedPages: 1.8,
      contentMarkdown: `Pour sauvegarder une collection d'objets dans un fichier CSV, le processus inverse est appliqué :
1. Parcourir la collection en mémoire.
2. Formater chaque objet sous forme d'une ligne textuelle délimitée (\`da;nom;coteR\`).
3. Écrire le contenu avec \`Files.write()\` en spécifiant les options d'ouverture (\`StandardOpenOption.CREATE\`, \`StandardOpenOption.TRUNCATE_EXISTING\`).

### Prévention des conflits d'encodage :
Au Québec, les noms de famille et de municipalités comportent fréquemment des accents (Tremblay, Béchard, Lévis). Vous devez **toujours forcer l'encodage StandardCharsets.UTF_8** lors de la lecture et de l'écriture pour éviter l'apparition des fameux caractères corrompus d'affichage.`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'SauvegardeEtudiantsCsv.java',
          code: `import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

public class EnregistreurDonnees {
    public static void sauvegarder(Path chemin, List<Etudiant> etudiants) throws IOException {
        List<String> lignes = new ArrayList<>();
        // En-tête de colonnes CSV
        lignes.add("DA;Nom;CoteR");

        for (Etudiant e : etudiants) {
            String ligneCsv = String.format("%s;%s;%.2f", e.getDa(), e.getNom(), e.getCoteR());
            lignes.add(ligneCsv);
        }

        Files.write(chemin, lignes, StandardCharsets.UTF_8,
            StandardOpenOption.CREATE,
            StandardOpenOption.TRUNCATE_EXISTING,
            StandardOpenOption.WRITE);
    }
}`,
          explanation: "StandardOpenOption.TRUNCATE_EXISTING garantit que le fichier est proprement réécrit sans laisser d'anciennes données fantômes à la fin."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-9-1',
      number: '9.1',
      title: "Module d'importation du catalogue de la coopérative étudiante",
      difficulty: 'Intermédiaire',
      contextQuebec: "La coopérative du cégep reçoit son inventaire hebdomadaire de manuels et fournitures sous la forme d'un fichier texte nommé « inventaire_coop.csv ». Le système doit lire ce fichier et charger les articles dans une collection.",
      instructions: [
        "Créez la classe « ArticleCoop » avec code-barres, description, prix unitaire et quantité en stock.",
        "Rédigez la méthode statique « chargerDepuisFichier(Path chemin) » lisant le fichier ligne par ligne.",
        "Gérez avec rigueur les erreurs de conversion numérique (NumberFormatException) si une ligne contient un prix corrompu.",
        "Retournez la liste des articles validés."
      ],
      tips: [
        "Utilisez Files.lines(chemin, StandardCharsets.UTF_8) ou Files.readAllLines.",
        "Interceptez NumberFormatException autour du parseDouble pour ne pas faire planter tout le chargement."
      ],
      starterCode: `// Écrivez la méthode de chargement du catalogue CSV`,
      solutionCode: `import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class GestionnaireCatalogueCoop {
    public static List<ArticleCoop> chargerDepuisFichier(Path chemin) throws IOException {
        if (!Files.exists(chemin)) {
            throw new IllegalArgumentException("Le fichier d'inventaire est introuvable : " + chemin);
        }

        List<ArticleCoop> articles = new ArrayList<>();
        List<String> lignes = Files.readAllLines(chemin, StandardCharsets.UTF_8);

        for (int i = 1; i < lignes.size(); i++) {
            String ligne = lignes.get(i).trim();
            if (ligne.isEmpty()) continue;

            String[] champs = ligne.split(";");
            if (champs.length < 4) continue;

            try {
                String codeBarres = champs[0].trim();
                String description = champs[1].trim();
                double prix = Double.parseDouble(champs[2].trim());
                int quantite = Integer.parseInt(champs[3].trim());

                articles.add(new ArticleCoop(codeBarres, description, prix, quantite));
            } catch (NumberFormatException e) {
                System.err.println("Ligne " + (i + 1) + " rejetée pour format numérique erroné : " + ligne);
            }
        }
        return articles;
    }
}

class ArticleCoop {
    private final String codeBarres;
    private final String description;
    private final double prix;
    private final int quantite;

    public ArticleCoop(String codeBarres, String description, double prix, int quantite) {
        this.codeBarres = codeBarres;
        this.description = description;
        this.prix = prix;
        this.quantite = quantite;
    }

    public String getCodeBarres() { return codeBarres; }
    public String getDescription() { return description; }
    public double getPrix() { return prix; }
    public int getQuantite() { return quantite; }
}`,
      explanation: "L'encapsulation de l'analyse dans un bloc try-catch dédié protège l'application : une ligne mal formatée est ignorée avec journalisation sans interrompre le chargement des autres articles sains."
    }
  ],
  quiz: [
    {
      id: 'q-9-1',
      question: "Pourquoi est-il indispensable de préciser explicitement StandardCharsets.UTF_8 lors de la lecture et de l'écriture de fichiers texte en Java ?",
      options: [
        "Pour chiffrer le fichier contre le piratage informatique.",
        "Parce que sinon Java utilise l'encodage par défaut du système d'exploitation, ce qui corrompt les caractères accentués français québécois lors d'un transfert entre Windows, macOS ou Linux.",
        "Parce que sans UTF-8, le fichier ne peut pas être ouvert dans un navigateur Web.",
        "Pour obliger le disque dur à tourner plus rapidement."
      ],
      correctIndex: 1,
      explanation: "L'encodage par défaut sous Windows français était historiquement Windows-1252, alors que Linux et macOS utilisent UTF-8. Forcer UTF-8 garantit l'interopérabilité totale de vos fichiers de données."
    }
  ],
  summaryChecklist: [
    "J'utilise les classes modernes java.nio.file.Path et java.nio.file.Files au lieu de l'ancienne classe File.",
    "Je spécifie systématiquement l'encodage StandardCharsets.UTF_8 sur toutes mes entrées/sorties textuelles.",
    "Je gère avec tolérance les anomalies de parsing (champs manquants ou corrompus) sans faire planter l'application entière."
  ]
};
