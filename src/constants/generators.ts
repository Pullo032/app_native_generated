import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type GeneratorType = 'text' | 'photo' | 'video' | 'pdf';

export type GeneratorOptionGroup = {
  label: string;
  options: string[];
};

export type GeneratorConfig = {
  type: GeneratorType;
  href: Href;
  tabLabel: string;
  tabIcon: IconName;
  eyebrow: string;
  title: string;
  subtitle: string;
  placeholder: string;
  actionLabel: string;
  emptyResultText: string;
  tip: string;
  optionGroups: GeneratorOptionGroup[];
};

export const GENERATORS: Record<GeneratorType, GeneratorConfig> = {
  text: {
    type: 'text',
    href: '/',
    tabLabel: 'Texte',
    tabIcon: 'language-outline',
    eyebrow: 'GÉNÉRATEUR DE TEXTE',
    title: 'Écrivez en quelques secondes',
    subtitle: 'Décrivez ce dont vous avez besoin, WELI rédige le texte pour vous.',
    placeholder: 'Ex : un article de blog sur les bienfaits du sommeil...',
    actionLabel: 'Générer le texte',
    emptyResultText: 'Votre texte généré apparaîtra ici.',
    tip: 'Précisez le public visé et le ton souhaité pour un meilleur résultat.',
    optionGroups: [
      { label: 'Ton', options: ['Neutre', 'Formel', 'Amical', 'Créatif'] },
      { label: 'Longueur', options: ['Court', 'Moyen', 'Long'] },
    ],
  },
  photo: {
    type: 'photo',
    href: '/photo',
    tabLabel: 'Photo',
    tabIcon: 'image-outline',
    eyebrow: 'GÉNÉRATEUR DE PHOTO',
    title: 'Créez des images uniques',
    subtitle: 'Imaginez une scène, WELI la transforme en image.',
    placeholder: 'Ex : un paysage de montagne au coucher du soleil...',
    actionLabel: 'Générer la photo',
    emptyResultText: 'Votre image générée apparaîtra ici.',
    tip: 'Ajoutez la lumière, le cadrage et l’ambiance pour un rendu plus précis.',
    optionGroups: [
      { label: 'Style', options: ['Réaliste', 'Illustration', 'Minimaliste', 'Cinéma'] },
      { label: 'Format', options: ['Carré', 'Portrait', 'Paysage'] },
    ],
  },
  video: {
    type: 'video',
    href: '/video',
    tabLabel: 'Vidéo',
    tabIcon: 'videocam-outline',
    eyebrow: 'GÉNÉRATEUR DE VIDÉO',
    title: 'Donnez vie à vos idées',
    subtitle: 'Décrivez la scène, WELI crée une courte vidéo.',
    placeholder: 'Ex : une vague qui se brise sur une plage au ralenti...',
    actionLabel: 'Générer la vidéo',
    emptyResultText: 'Votre vidéo générée apparaîtra ici.',
    tip: 'Décrivez les mouvements de caméra et l’action principale.',
    optionGroups: [
      { label: 'Durée', options: ['5 s', '10 s', '15 s'] },
      { label: 'Format', options: ['16:9', '9:16', '1:1'] },
    ],
  },
  pdf: {
    type: 'pdf',
    href: '/pdf',
    tabLabel: 'PDF',
    tabIcon: 'document-text-outline',
    eyebrow: 'GÉNÉRATEUR DE PDF',
    title: 'Produisez vos documents',
    subtitle: 'Indiquez le sujet, WELI prépare un document PDF structuré.',
    placeholder: 'Ex : un rapport mensuel de ventes avec tableaux...',
    actionLabel: 'Générer le PDF',
    emptyResultText: 'Votre document PDF apparaîtra ici.',
    tip: 'Indiquez les sections attendues pour obtenir une structure claire.',
    optionGroups: [
      { label: 'Mise en page', options: ['Simple', 'Rapport', 'Présentation'] },
      { label: 'Langue', options: ['Français', 'English', 'Español'] },
    ],
  },
};

export const GENERATOR_TABS: GeneratorConfig[] = [
  GENERATORS.text,
  GENERATORS.photo,
  GENERATORS.video,
  GENERATORS.pdf,
];
