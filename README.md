# VidemIA

Génération automatique de vidéos éducatives par IA — projet du groupe nOX-00.

## Structure du projet

```
src/
  app/
    page.tsx              → interface : saisie du sujet, déclenchement de la génération
    api/generate/route.ts → orchestre le pipeline complet (script → voix → sous-titres → rendu)
  lib/pipeline/
    generateScript.ts      → sujet -> script (à brancher sur un LLM)
    generateVoice.ts       → script -> voix off (à brancher sur une API TTS)
    generateSubtitles.ts   → voix -> sous-titres synchronisés (à brancher sur une transcription)
    renderVideo.ts         → assemble tout via Remotion -> vidéo finale
  remotion/
    Root.tsx                     → déclare tous les styles visuels disponibles
    compositions/StyleEnergy.tsx → premier template visuel (inspiré de la vidéo exemple)
  types/                  → types partagés
```

Chaque étape du pipeline est aujourd'hui un **stub** (fonction qui renvoie une valeur vide,
avec un `TODO` expliquant quoi brancher). C'est volontaire : on peut tester l'interface,
la structure et le style visuel dès maintenant, puis brancher une API à la fois sans
tout casser.

## Démarrage (en local, chez toi)

Ce squelette a été généré sans accès internet ici, donc les dépendances ne sont
pas installées. Chez toi :

```bash
npm install
```

Puis pour lancer l'appli web (formulaire de génération) :

```bash
npm run dev
```

Pour prévisualiser un style visuel Remotion tout seul, sans passer par le pipeline
complet (utile pour itérer sur l'animation) :

```bash
npm run remotion:studio
```

## Prochaines étapes (dans l'ordre conseillé)

1. Brancher `generateScript.ts` sur l'API Claude (script structuré à partir du sujet).
2. Brancher `generateVoice.ts` sur une API TTS (ElevenLabs ou équivalent).
3. Brancher `generateSubtitles.ts` sur une transcription avec horodatage mot-à-mot.
4. Remplacer le placeholder visuel de `StyleEnergy.tsx` par la vraie animation
   (particules/énergie), et lui faire consommer les vrais sous-titres synchronisés
   au lieu du texte statique actuel.
5. Une fois ce premier pipeline validé de bout en bout : ajouter les styles
   visuels suivants (nouvelle composition Remotion + entrée dans `Root.tsx`),
   puis l'authentification et le système de crédits (gratuit / payant).

Variables d'environnement nécessaires : voir `.env.example`.
