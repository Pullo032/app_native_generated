import type { Href } from 'expo-router';

import type { IconName } from './generators';

export type ToolId = 'studio' | 'reformulate' | 'sentiment' | 'ner';

export type ToolNavItem = {
  id: ToolId;
  href: Href;
  label: string;
  description: string;
  icon: IconName;
  section: 'studio' | 'analyse';
};

export const TOOL_NAV: ToolNavItem[] = [
  {
    id: 'studio',
    href: '/',
    label: 'Studio',
    description: 'Texte, photo, vidéo, PDF',
    icon: 'sparkles-outline',
    section: 'studio',
  },
  {
    id: 'reformulate',
    href: '/reformulate',
    label: 'Reformulation',
    description: 'Réécrire avec un ton et un style',
    icon: 'sync-outline',
    section: 'analyse',
  },
  {
    id: 'sentiment',
    href: '/sentiment',
    label: 'Sentiment',
    description: 'Détecter le ressenti d’un texte',
    icon: 'heart-outline',
    section: 'analyse',
  },
  {
    id: 'ner',
    href: '/ner',
    label: 'NER',
    description: 'Extraire personnes, lieux, orgs',
    icon: 'pricetags-outline',
    section: 'analyse',
  },
];

export const REFORMULATE_TONES = ['Neutre', 'Formel', 'Amical', 'Créatif'];
export const REFORMULATE_STYLES = ['Simple', 'Professionnel', 'Journalistique', 'Marketing'];
export const REFORMULATE_MAX_TOKENS = ['64', '128', '256'];
export const REFORMULATE_BEAMS = ['2', '4', '8'];
