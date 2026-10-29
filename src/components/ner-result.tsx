import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import type { NerEntity, NerResponse } from '../services/nlp';
import { colors, radius } from '../constants/theme';

type EntityMeta = {
  label: string;
  color: string;
  bgTint: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ENTITY_CONFIG: Record<string, EntityMeta> = {
  PER: {
    label: 'Personne',
    color: '#31C191',
    bgTint: 'rgba(49, 193, 145, 0.18)',
    icon: 'person-outline',
  },
  LOC: {
    label: 'Lieu',
    color: '#38BDF8',
    bgTint: 'rgba(56, 189, 248, 0.18)',
    icon: 'location-outline',
  },
  ORG: {
    label: 'Organisation',
    color: '#F59E0B',
    bgTint: 'rgba(245, 158, 11, 0.18)',
    icon: 'business-outline',
  },
  MISC: {
    label: 'Divers',
    color: '#A78BFA',
    bgTint: 'rgba(167, 139, 250, 0.18)',
    icon: 'pricetag-outline',
  },
};

export function NerResult({ result }: { result: NerResponse }) {
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    result.entities.forEach((e) => set.add(e.label));
    return Array.from(set);
  }, [result.entities]);

  const filteredEntities = useMemo(() => {
    if (!selectedType) return result.entities;
    return result.entities.filter((e) => e.label === selectedType);
  }, [result.entities, selectedType]);

  const handleCopy = async () => {
    const lines = result.entities.map(
      (e) => `• [${e.label}] ${e.text} (${Math.round(e.score * 100)}%)`
    );
    await Clipboard.setStringAsync(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!result.entities || result.entities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="information-circle-outline" size={24} color={colors.textMuted} />
        <Text style={styles.emptyText}>Aucune entité nommée détectée dans ce texte.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {/* Top summary row */}
      <View style={styles.topRow}>
        <Text style={styles.summary}>
          {result.entities.length} entité{result.entities.length > 1 ? 's' : ''} trouvée
          {result.entities.length > 1 ? 's' : ''}
        </Text>

        <Pressable
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copier les entités"
          style={[styles.copyButton, copied && styles.copyButtonDone]}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={13}
            color={copied ? colors.text : colors.mint}
          />
          <Text style={[styles.copyText, copied && styles.copyTextDone]}>
            {copied ? 'Copié !' : 'Copier'}
          </Text>
        </Pressable>
      </View>

      {/* Inline highlighted text representation */}
      {result.input_text ? (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>TEXTE ANNOTÉ</Text>
          <HighlightedText inputText={result.input_text} entities={result.entities} />
        </View>
      ) : null}

      {/* Filter filters if multiple types exist */}
      {availableTypes.length > 1 ? (
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setSelectedType(null)}
            style={[
              styles.filterPill,
              selectedType === null && styles.filterPillActive,
            ]}>
            <Text
              style={[
                styles.filterPillText,
                selectedType === null && styles.filterPillTextActive,
              ]}>
              Tous ({result.entities.length})
            </Text>
          </Pressable>

          {availableTypes.map((type) => {
            const meta = ENTITY_CONFIG[type];
            const count = result.entities.filter((e) => e.label === type).length;
            const active = selectedType === type;
            return (
              <Pressable
                key={type}
                onPress={() => setSelectedType(active ? null : type)}
                style={[
                  styles.filterPill,
                  active && {
                    backgroundColor: meta?.color ?? colors.primaryBright,
                    borderColor: meta?.color ?? colors.primaryBright,
                  },
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    active && { color: colors.background, fontWeight: '800' },
                  ]}>
                  {type} ({count})
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {/* Entity cards list */}
      <View style={styles.cardsList}>
        {filteredEntities.map((entity, idx) => (
          <EntityCard key={`${entity.start}-${entity.end}-${idx}`} entity={entity} />
        ))}
      </View>
    </View>
  );
}

function HighlightedText({
  inputText,
  entities,
}: {
  inputText: string;
  entities: NerEntity[];
}) {
  const sorted = useMemo(
    () => [...entities].sort((a, b) => a.start - b.start),
    [entities]
  );

  const parts: { text: string; entity?: NerEntity }[] = [];
  let cursor = 0;

  for (const ent of sorted) {
    if (ent.start > cursor) {
      parts.push({ text: inputText.slice(cursor, ent.start) });
    }
    if (ent.start >= cursor) {
      parts.push({ text: inputText.slice(ent.start, ent.end), entity: ent });
      cursor = Math.max(cursor, ent.end);
    }
  }

  if (cursor < inputText.length) {
    parts.push({ text: inputText.slice(cursor) });
  }

  return (
    <Text style={styles.annotatedText}>
      {parts.map((p, idx) => {
        if (!p.entity) {
          return <Text key={idx}>{p.text}</Text>;
        }
        const meta = ENTITY_CONFIG[p.entity.label];
        const color = meta?.color ?? colors.primaryBright;
        const bg = meta?.bgTint ?? 'rgba(49, 193, 145, 0.2)';
        return (
          <Text
            key={idx}
            style={[
              styles.highlightInline,
              {
                backgroundColor: bg,
                color,
              },
            ]}>
            {` ${p.text} `}
          </Text>
        );
      })}
    </Text>
  );
}

function EntityCard({ entity }: { entity: NerEntity }) {
  const meta = ENTITY_CONFIG[entity.label] ?? {
    label: entity.label,
    color: colors.primaryBright,
    bgTint: 'rgba(49, 193, 145, 0.18)',
    icon: 'pricetag-outline' as const,
  };

  return (
    <View style={[styles.card, { borderLeftColor: meta.color }]}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.tag,
            { backgroundColor: meta.bgTint, borderColor: meta.color },
          ]}>
          <Ionicons name={meta.icon} size={12} color={meta.color} />
          <Text style={[styles.tagCode, { color: meta.color }]}>
            {entity.label}
          </Text>
          <Text style={styles.tagLabel}>• {meta.label}</Text>
        </View>

        <Text style={styles.scoreBadge}>
          {Math.round(entity.score * 100)}% de confiance
        </Text>
      </View>

      <Text style={styles.entityName}>{entity.text}</Text>

      <Text style={styles.positionText}>
        Position : car. {entity.start} à {entity.end}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summary: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyButtonDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryBright,
  },
  copyText: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '700',
  },
  copyTextDone: {
    color: colors.text,
  },
  previewBox: {
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  previewTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  annotatedText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 24,
  },
  highlightInline: {
    fontWeight: '700',
    borderRadius: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryBright,
  },
  filterPillText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  cardsList: {
    gap: 10,
  },
  card: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tagCode: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tagLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  scoreBadge: {
    color: colors.mint,
    fontSize: 11,
    fontWeight: '700',
  },
  entityName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  positionText: {
    color: colors.textDisabled,
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
