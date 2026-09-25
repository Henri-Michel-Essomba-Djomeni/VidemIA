import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Retour à l'accueil</Link>
      <h1>Mentions légales</h1>
      <p className="legal-updated">Dernière mise à jour : 17 septembre 2026</p>

      <h2>Éditeur du site</h2>
      <p>
        VidemIA est édité par Essomba Djomeni Henri Michel, personne physique
        exerçant en entreprise individuelle, basé au Cameroun.
      </p>
      <p>Contact : <a href="mailto:essombadjomeni@gmail.com">essombadjomeni@gmail.com</a></p>

      <h2>Hébergement</h2>
      <p>
        [À compléter une fois l'hébergement définitif choisi — nom et adresse
        de l'hébergeur du site et des données.]
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La marque VidemIA, son identité visuelle et son contenu appartiennent
        à Essomba Djomeni Henri Michel (nOX-00). Toute reproduction sans
        autorisation est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        VidemIA génère du contenu vidéo à partir de sujets fournis par
        l'utilisateur, en s'appuyant sur des modèles d'intelligence
        artificielle. L'exactitude du contenu généré n'est pas garantie ;
        l'utilisateur reste responsable de vérifier et d'utiliser
        les vidéos produites de manière appropriée.
      </p>
    </main>
  );
}