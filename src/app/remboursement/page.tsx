import Link from "next/link";

export default function RemboursementPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Retour à l'accueil</Link>
      <h1>Politique de remboursement</h1>
      <p className="legal-updated">Dernière mise à jour : 17 septembre 2026</p>

      <h2>Vidéo non générée suite à une erreur technique</h2>
      <p>
        Si une génération de vidéo échoue à cause d'un problème technique de
        notre côté, le crédit utilisé est automatiquement recrédité sur votre
        compte — vous n'avez aucune démarche à faire.
      </p>

      <h2>Vidéo générée avec succès</h2>
      <p>
        Une fois une vidéo générée et livrée avec succès, elle est considérée
        comme un service rendu. Aucun remboursement n'est possible pour un
        changement d'avis sur le contenu produit.
      </p>

      <h2>Achat de crédits non utilisé</h2>
      <p>
        Un pack de crédits acheté mais non utilisé peut faire l'objet d'une
        demande de remboursement dans les 7 jours suivant l'achat, en nous
        contactant à <a href="mailto:essombadjomeni@gmail.com">essombadjomeni@gmail.com</a>.
        Passé ce délai, les crédits restent valides sans limite de durée mais
        ne sont plus remboursables.
      </p>

      <h2>Litige avec CamerPay</h2>
      <p>
        En cas de contestation d'un prélèvement, vous pouvez également nous
        contacter directement afin que nous examinions votre situation avant
        toute démarche de contestation formelle auprès de votre opérateur de
        paiement.
      </p>
    </main>
  );
}