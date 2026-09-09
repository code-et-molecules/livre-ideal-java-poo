import { Chapter } from '../../types';

export const chapter10: Chapter = {
  id: 'chapitre-10',
  number: 10,
  title: "Le grand projet intégrateur de fin de session : « Le système de gestion de la coopérative étudiante collégiale (CoopCégep) »",
  subtitle: "Cahier des charges complet, architecture Modèle-Vue-Contrôleur, barème d'évaluation ministériel et code source intégral",
  estimatedPages: 11,
  competencyGoal: "Intégrer et synthétiser l'ensemble des compétences du cours (encapsulation, polymorphisme, collections, exceptions, fichiers) au sein d'une application complète répondant à un barème d'évaluation collégial québécois.",
  introduction: "Au terme des quinze semaines de cours au cégep, l'épreuve synthèse certificative prend la forme d'un grand projet d'intégration réalisé en équipe de deux ou individuellement. Ce projet représente généralement entre 25 % et 35 % de la note finale du cours. Dans ce chapitre de clôture, nous abordons l'énoncé complet d'un projet réaliste et complet : le système transactionnel de la coopérative étudiante du collège (« CoopCégep »). Nous en détaillons le cahier des charges, les diagrammes de classes UML, la séparation architecturale en couches, la grille d'évaluation ministérielle et la solution Java intégrale commentée.",
  sections: [
    {
      id: 'sec-10-1',
      title: "1. Le cahier des charges fonctionnel de l'épreuve synthèse",
      estimatedPages: 2.2,
      contentMarkdown: `La coopérative étudiante dessert une population collégiale de 4 500 membres. L'application en mode console doit gérer trois volets transactionnels :

### Volet 1 : Gestion des membres et adhésions
* Deux catégories de membres : **Étudiant membre** (qui paie une cotisation unique de 20 $ et bénéficie de 15 % de rabais coopératif) et **Membre du personnel** (aucun frais d'adhésion, rabais fixe de 10 %).
* Les membres non adhérents paient le plein prix régulier sans rabais.
* Recherche de membre instantanée par numéro de DA collégial ou numéro d'employé.

### Volet 2 : Gestion de l'inventaire et des articles
* Les articles sont scindés en deux catégories polymorphes :
  * **Manuels de cours obligatoires** (spécifient le code de cours collégial associé, ex: "420-201-RE", et sont exempts de la taxe provinciale TVQ sur les livres imprimés au Québec).
  * **Matériel informatique et fournitures** (soumis aux deux taxes complètes : TPS de 5 % et TVQ de 9,975 %).
* Contrôle strict des stocks : une vente ne peut être conclue si la quantité en réserve est insuffisante.

### Volet 3 : Facturation et persistance
* Émission d'une facture détaillée avec ventilation des taxes et calcul du grand total en dollars canadiens.
* Sauvegarde automatique des factures et réécriture de l'inventaire mis à jour dans des fichiers CSV délimités à la fermeture du programme.`,
      quebecPedagogicalNote: "Dans le réseau des cégeps, la taxation sur les livres constitue un cas classique d'évaluation pour valider la bonne compréhension de la spécialisation par héritage : les livres imprimés sont détaxés de TVQ au Québec (seule la TPS s'applique)."
    },
    {
      id: 'sec-10-2',
      title: "2. Le diagramme de classes d'architecture et la grille ministérielle",
      estimatedPages: 2,
      contentMarkdown: `L'application est structurée selon le patron architectural Modèle-Vue-Contrôleur (MVC) épuré pour le mode console :
* **Couche Modèle (\`modele\`)** : \`Article\`, \`ManuelScolaire\`, \`FournitureInformatique\`, \`Membre\`, \`MembreEtudiant\`, \`Facture\`, \`LigneFacture\`.
* **Couche Données (\`donnees\`)** : \`GestionnaireInventaireDao\` pour la lecture et l'écriture des fichiers CSV.
* **Couche Contrôleur (\`controleur\`)** : \`CoopControleur\` coordonnant les transactions d'affaires.
* **Couche Présentation (\`vue\`)** : \`ConsoleMenuVue\` pour les interactions textuelles avec l'opérateur.

### Barème d'évaluation officiel type (sur 100 points) :
1. **Modélisation UML et respect de la POO (25 pts)** : hiérarchie d'héritage juste, encapsulation défensive, aucune variable publique.
2. **Polymorphisme dynamique (20 pts)** : calcul des taxes et des rabais membres sans chaînes conditionnelles \`if-else\`.
3. **Collections et structures de données (15 pts)** : usage judicieux de \`List\` et \`Map\`.
4. **Gestion préventive des exceptions (15 pts)** : aucune panne imprévue lors de saisies ou de ruptures de stock.
5. **Persistance des données CSV (15 pts)** : intégrité des fichiers d'inventaire et encodage UTF-8.
6. **Qualité du code et documentation Javadoc (10 pts)** : conventions Java, lisibilité et clarté.`,
      diagrams: [
        {
          title: "Diagramme de classes UML du système CoopCégep",
          type: 'uml',
          asciiOrSvg: `            +------------------------------------+
            |          /Article/                 |
            +------------------------------------+
            | - codeArticle : String             |
            | - description : String             |
            | - prixBase : double                |
            | - quantiteEnStock : int            |
            +------------------------------------+
            | /+ calculerTaxeTVQ() : double/     |
            | + calculerTaxeTPS() : double       |
            +------------------------------------+
                      ^                 ^
                      |                 |
     +----------------+                 +----------------+
     |                                                   |
+--------------------------+               +--------------------------+
|      ManuelScolaire      |               |  FournitureInformatique  |
+--------------------------+               +--------------------------+
| - codeCours : String     |               | - garantieMois : int     |
+--------------------------+               +--------------------------+
| + calculerTaxeTVQ() : 0$ |               | + calculerTaxeTVQ() : 9.975%
+--------------------------+               +--------------------------+`,
          caption: "Le calcul de la taxe provinciale TVQ est un exemple pur de méthode abstraite polymorphe."
        }
      ]
    },
    {
      id: 'sec-10-3',
      title: "3. Implémentation complète du modèle d'affaires (code source)",
      estimatedPages: 3.5,
      contentMarkdown: `Voici l'ossature fondamentale du modèle métier du projet CoopCégep, démontrant l'application combinée de tous les chapitres de ce manuel :`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'modele/Article.java',
          code: `package ca.qc.cegep.coop.modele;

/**
 * Classe abstraite de base représentant tout article vendu à la coopérative.
 */
public abstract class Article {
    public static final double TAUX_TPS = 0.05;

    private final String codeArticle;
    private final String description;
    private final double prixBase;
    private int quantiteEnStock;

    public Article(String code, String description, double prixBase, int quantite) {
        if (code == null || code.isBlank()) throw new IllegalArgumentException("Code d'article obligatoire.");
        if (description == null || description.isBlank()) throw new IllegalArgumentException("Description requise.");
        if (prixBase <= 0.0) throw new IllegalArgumentException("Le prix doit être strictement positif.");
        if (quantite < 0) throw new IllegalArgumentException("La quantité ne peut pas être négative.");

        this.codeArticle = code.trim().toUpperCase();
        this.description = description.trim();
        this.prixBase = prixBase;
        this.quantiteEnStock = quantite;
    }

    public void reduireStock(int quantite) {
        if (quantite <= 0) throw new IllegalArgumentException("Quantité demandée invalide.");
        if (quantite > this.quantiteEnStock) {
            throw new IllegalStateException("Stock insuffisant pour l'article " + this.codeArticle + " (Disponible : " + this.quantiteEnStock + ").");
        }
        this.quantiteEnStock -= quantite;
    }

    public void reapprovisionner(int quantite) {
        if (quantite <= 0) throw new IllegalArgumentException("Quantité de réapprovisionnement invalide.");
        this.quantiteEnStock += quantite;
    }

    public double calculerTaxeTPS() {
        return this.prixBase * TAUX_TPS;
    }

    /**
     * Méthode polymorphe : au Québec, les livres scolaires sont exemptés de TVQ.
     */
    public abstract double calculerTaxeTVQ();

    public String getCodeArticle() { return codeArticle; }
    public String getDescription() { return description; }
    public double getPrixBase() { return prixBase; }
    public int getQuantiteEnStock() { return quantiteEnStock; }
}`,
          explanation: "La méthode reduireStock() verrouille l'invariant d'état : le stock ne peut jamais basculer dans les valeurs négatives."
        },
        {
          language: 'java',
          filename: 'modele/ManuelScolaire.java',
          code: `package ca.qc.cegep.coop.modele;

public class ManuelScolaire extends Article {
    private final String codeCoursAssocie;

    public ManuelScolaire(String code, String description, double prix, int quantite, String codeCours) {
        super(code, description, prix, quantite);
        if (codeCours == null || codeCours.isBlank()) {
            throw new IllegalArgumentException("Le code de cours collégial est obligatoire.");
        }
        this.codeCoursAssocie = codeCours.trim().toUpperCase();
    }

    @Override
    public double calculerTaxeTVQ() {
        // Exemption fiscale québécoise sur les livres imprimés
        return 0.0;
    }

    public String getCodeCoursAssocie() { return codeCoursAssocie; }
}`,
          explanation: "ManuelScolaire applique la loi fiscale québécoise par simple redéfinition polymorphe retournant 0.0 $."
        },
        {
          language: 'java',
          filename: 'modele/FournitureInformatique.java',
          code: `package ca.qc.cegep.coop.modele;

public class FournitureInformatique extends Article {
    public static final double TAUX_TVQ = 0.09975;
    private final int garantieMois;

    public FournitureInformatique(String code, String description, double prix, int quantite, int garantieMois) {
        super(code, description, prix, quantite);
        if (garantieMois < 0) throw new IllegalArgumentException("Garantie invalide.");
        this.garantieMois = garantieMois;
    }

    @Override
    public double calculerTaxeTVQ() {
        return getPrixBase() * TAUX_TVQ;
    }

    public int getGarantieMois() { return garantieMois; }
}`,
          explanation: "FournitureInformatique applique fidèlement la TVQ provinciale de 9,975 %."
        }
      ]
    },
    {
      id: 'sec-10-4',
      title: "4. Le moteur transactionnel de caisse et la persistance",
      estimatedPages: 3.3,
      contentMarkdown: `La classe \`FactureCoop\` matérialise l'agrégation et la composition du panier d'achats avec calcul précis des remises et taxes :`,
      codeSnippets: [
        {
          language: 'java',
          filename: 'modele/FactureCoop.java',
          code: `package ca.qc.cegep.coop.modele;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FactureCoop {
    private final String idFacture;
    private final double tauxRabaisMembre; // Ex: 0.15 pour 15% de rabais
    private final List<LigneVente> lignes;

    public record LigneVente(Article article, int quantite) {
        public double calculerSousTotalBrut() {
            return article.getPrixBase() * quantite;
        }
    }

    public FactureCoop(String idFacture, double tauxRabaisMembre) {
        this.idFacture = idFacture;
        this.tauxRabaisMembre = Math.max(0.0, Math.min(1.0, tauxRabaisMembre));
        this.lignes = new ArrayList<>();
    }

    public void ajouterArticle(Article article, int quantite) {
        // Déduction préventive immédiate du stock
        article.reduireStock(quantite);
        this.lignes.add(new LigneVente(article, quantite));
    }

    public double calculerSousTotalAvantRabais() {
        double sousTotal = 0.0;
        for (LigneVente lv : lignes) {
            sousTotal += lv.calculerSousTotalBrut();
        }
        return sousTotal;
    }

    public double calculerMontantEconomiseRabais() {
        return calculerSousTotalAvantRabais() * this.tauxRabaisMembre;
    }

    public double calculerSousTotalNet() {
        return calculerSousTotalAvantRabais() - calculerMontantEconomiseRabais();
    }

    public double calculerTotalTPS() {
        double tps = 0.0;
        double facteurApresRabais = 1.0 - this.tauxRabaisMembre;
        for (LigneVente lv : lignes) {
            tps += (lv.article().calculerTaxeTPS() * lv.quantite()) * facteurApresRabais;
        }
        return tps;
    }

    public double calculerTotalTVQ() {
        double tvq = 0.0;
        double facteurApresRabais = 1.0 - this.tauxRabaisMembre;
        for (LigneVente lv : lignes) {
            tvq += (lv.article().calculerTaxeTVQ() * lv.quantite()) * facteurApresRabais;
        }
        return tvq;
    }

    public double calculerGrandTotalPayer() {
        return calculerSousTotalNet() + calculerTotalTPS() + calculerTotalTVQ();
    }

    public List<LigneVente> getLignes() {
        return Collections.unmodifiableList(this.lignes);
    }

    public String getIdFacture() { return idFacture; }
}`,
          explanation: "La facture coordonne l'ensemble des règles fiscales, applique le rabais membre de façon proportionnelle et maintient les lignes dans une liste immuable."
        }
      ]
    }
  ],
  exercises: [
    {
      id: 'ex-10-1',
      number: '10.1',
      title: "Élaboration des tests unitaires JUnit 5 pour la validation des rabais et taxes",
      difficulty: 'Projet intégrateur',
      contextQuebec: "Dans l'épreuve synthèse certificative, chaque équipe d'étudiants au cégep doit remettre une batterie de tests unitaires automatisés validant la conformité mathématique de la facturation sous JUnit 5.",
      instructions: [
        "Rédigez un cas de test vérifiant qu'un manuel scolaire ne génère strictement aucun montant de taxe TVQ.",
        "Rédigez un cas de test vérifiant que l'achat d'un article en quantité supérieure au stock disponible lève bien une exception IllegalStateException.",
        "Validez que le rabais membre de 15 % s'applique fidèlement sur le sous-total avant le calcul des taxes."
      ],
      tips: [
        "Utilisez assertThrows(IllegalStateException.class, () -> ...) pour tester les exceptions sous JUnit 5.",
        "Utilisez assertEquals(valeurAttendue, valeurCalculee, 0.001) pour tester des valeurs à virgule flottante avec une marge d'erreur acceptable."
      ],
      starterCode: `// Écrivez la classe de tests JUnit 5 TestFacturationCoop`,
      solutionCode: `import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TestFacturationCoop {
    private ManuelScolaire livreJava;
    private FournitureInformatique cleUsb;

    @BeforeEach
    public void initialiser() {
        livreJava = new ManuelScolaire("LIV-01", "Manuel Java POO", 60.00, 10, "420-201-RE");
        cleUsb = new FournitureInformatique("USB-01", "Clé USB 64 Go", 20.00, 5, 12);
    }

    @Test
    public void testExemptionTvqManuelScolaire() {
        assertEquals(0.0, livreJava.calculerTaxeTVQ(), 0.001,
            "Le manuel scolaire collégial québécois doit être exempté de TVQ.");
        assertEquals(3.0, livreJava.calculerTaxeTPS(), 0.001,
            "La TPS de 5% doit s'appliquer sur 60.00$ (3.00$).");
    }

    @Test
    public void testRuptureDeStockDeclencheException() {
        assertThrows(IllegalStateException.class, () -> {
            livreJava.reduireStock(11); // Disponible: 10
        }, "Une demande excédant le stock doit lever IllegalStateException.");
    }

    @Test
    public void testCalculRabaisMembreEtudiant() {
        FactureCoop facture = new FactureCoop("FACT-TEST", 0.15); // 15% rabais membre
        facture.ajouterArticle(livreJava, 1); // 60.00 $

        assertEquals(60.00, facture.calculerSousTotalAvantRabais(), 0.001);
        assertEquals(9.00, facture.calculerMontantEconomiseRabais(), 0.001); // 60 * 0.15 = 9.00
        assertEquals(51.00, facture.calculerSousTotalNet(), 0.001); // 60 - 9 = 51.00
    }
}`,
      explanation: "Ces tests automatisés permettent de vérifier en quelques millisecondes que les règles de gestion d'affaires les plus complexes demeurent intactes au fil des modifications."
    }
  ],
  quiz: [
    {
      id: 'q-10-1',
      question: "Dans le cadre de l'épreuve synthèse collégiale, quelle est la raison primordiale d'isoler le code d'affichage console de la logique de calcul d'affaires ?",
      options: [
        "Pour que l'application puisse être recompilée sur une console de jeu vidéo.",
        "Pour permettre de remplacer ultérieurement l'interface console par une interface graphique Swing ou une API Web sans réécrire la logique d'affaires.",
        "Parce que Java interdit d'utiliser System.out.println dans une classe de calcul.",
        "Pour réduire le poids des fichiers sources sur la clé USB de l'étudiant."
      ],
      correctIndex: 1,
      explanation: "Le découplage architectural (séparation des responsabilités) assure la pérennité du logiciel : le moteur métier (Modèle) reste stable, peu importe la technologie d'affichage (Vue) choisie."
    }
  ],
  summaryChecklist: [
    "J'ai compris comment articuler l'ensemble des concepts de la POO dans un projet logiciel d'envergure cégep.",
    "Je sais structurer mon application selon le patron MVC pour séparer les données, la logique d'affaires et l'interface utilisateur.",
    "Je suis prêt(e) à aborder avec succès le cours de Structures de données et le cours de Développement Web transactionnel de 2e année !"
  ]
};
