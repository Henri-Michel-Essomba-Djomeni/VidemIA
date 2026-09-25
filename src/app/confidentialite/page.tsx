import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Retour à l'accueil</Link>
      <h1>Politique de confidentialité</h1>
      <p className="legal-updated">Dernière mise à jour : 17 septembre 2026</p>

      <h2>Données collectées</h2>
      <ul>
        <li>Adresse email et mot de passe (chiffré), ou informations de compte Google/GitHub si vous vous connectez via ces services</li>
        <li>Les sujets de vidéos que vous soumettez et les vidéos générées, associés à votre compte</li>
        <li>Les informations nécessaires au traitement des paiements (transmises directement à CamerPay, jamais stockées par VidemIA)</li>
      </ul>

      <h2>Finalité</h2>
      <p>
        Ces données servent uniquement à faire fonctionner le service :
        authentification, génération de vidéos, historique personnel, gestion
        des crédits et des paiements.
      </p>

      <h2>Partage avec des tiers</h2>
      <p>
        Vos données de connexion peuvent être partagées avec Google ou GitHub
        si vous utilisez ces méthodes de connexion. Vos données de paiement
        sont traitées par CamerPay. VidemIA ne vend ni ne partage vos données
        à des fins publicitaires.
      </p>

      <h2>Conservation</h2>
      <p>
        Vos données sont conservées tant que votre compte est actif. Vous
        pouvez demander leur suppression à tout moment.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément à la loi camerounaise n° 2010/012 du 21 décembre 2010
        relative à la cybersécurité et à la cybercriminalité, vous disposez
        d'un droit d'accès, de rectification et de suppression de vos
        données. Pour l'exercer, contactez-nous à{" "}
        <a href="mailto:essombadjomeni@gmail.com">essombadjomeni@gmail.com</a>.
      </p>
    </main>
  );
}