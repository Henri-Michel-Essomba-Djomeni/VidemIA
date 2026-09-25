import Link from "next/link";

export default function CGVPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Retour à l'accueil</Link>
      <h1>Conditions générales de vente</h1>
      <p className="legal-updated">Dernière mise à jour : 17 septembre 2026</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent l'utilisation du service VidemIA,
        qui génère automatiquement des vidéos éducatives courtes (script, voix
        off, sous-titres) à partir d'un sujet fourni par l'utilisateur.
      </p>

      <h2>2. Offre gratuite et offre payante</h2>
      <p>
        Chaque compte bénéficie d'une vidéo gratuite. Au-delà, l'utilisateur
        peut acheter des packs de crédits pour générer des vidéos
        supplémentaires. Le détail des offres et de leurs prix est affiché
        dans l'application au moment de l'achat.
      </p>

      <h2>3. Paiement</h2>
      <p>
        Les paiements sont traités par notre prestataire CamerPay, via Orange
        Money, MTN Mobile Money ou carte bancaire. VidemIA ne stocke aucune
        donnée de paiement (numéro de carte, code Mobile Money) — celles-ci
        sont traitées exclusivement par CamerPay.
      </p>

      <h2>4. Livraison du service</h2>
      <p>
        Le service est immatériel : la vidéo générée est mise à disposition
        de l'utilisateur directement dans l'application, dès la fin du
        traitement.
      </p>

      <h2>5. Absence de droit de rétractation après génération</h2>
      <p>
        Le service étant un contenu numérique produit immédiatement à la
        demande de l'utilisateur, aucun remboursement n'est possible pour une
        vidéo générée avec succès, sauf disposition contraire prévue à notre
        politique de remboursement.
      </p>

      <h2>6. Modification du service</h2>
      <p>
        VidemIA peut faire évoluer ses fonctionnalités, ses styles visuels ou
        ses tarifs à tout moment. Les crédits déjà achetés restent utilisables
        selon les conditions en vigueur au moment de leur utilisation.
      </p>

      <h2>7. Droit applicable</h2>
      <p>
        Les présentes conditions sont régies par le droit camerounais et les
        Actes uniformes OHADA.
      </p>
    </main>
  );
}