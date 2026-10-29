import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CAPTURE_ACTIONS, type CaptureAction } from '../constants/generators';
import { colors, radius } from '../constants/theme';
import { processCapture, type Capture } from '../services/generation';
import { GenerateButton } from './generate-button';
import { OptionChips } from './option-chips';
import { Reveal } from './reveal';
import { ResultCard, type ResultStatus } from './result-card';

type CaptureMode = 'photo' | 'video';

const MODE_OPTIONS: { mode: CaptureMode; label: string }[] = [
  { mode: 'photo', label: 'Photo' },
  { mode: 'video', label: 'Vidéo' },
];

const MAX_VIDEO_SECONDS = 30;

export function CameraScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  const [mode, setMode] = useState<CaptureMode>('photo');
  const [recording, setRecording] = useState(false);
  const [capture, setCapture] = useState<Capture | null>(null);
  const [action, setAction] = useState<CaptureAction>('text');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const cameraGranted = cameraPermission?.granted ?? false;
  const microphoneNeeded = mode === 'video';
  const microphoneGranted = microphonePermission?.granted ?? false;

  const selectedActionLabel = CAPTURE_ACTIONS.find((item) => item.id === action)?.label ?? '';

  async function handleGrantPermissions() {
    setError(null);
    await requestCameraPermission();
    if (microphoneNeeded) {
      await requestMicrophonePermission();
    }
  }

  async function handleShutter() {
    const camera = cameraRef.current;
    if (!camera) return;
    setError(null);

    if (mode === 'photo') {
      try {
        const photo = await camera.takePictureAsync({ quality: 0.8 });
        if (photo) setCapture({ kind: 'photo', uri: photo.uri });
      } catch {
        setError('La photo n’a pas pu être prise. Réessayez.');
      }
      return;
    }

    if (recording) {
      camera.stopRecording();
      return;
    }

    setRecording(true);
    try {
      const video = await camera.recordAsync({ maxDuration: MAX_VIDEO_SECONDS });
      if (video) setCapture({ kind: 'video', uri: video.uri });
    } catch {
      setError('La vidéo n’a pas pu être enregistrée. Réessayez.');
    } finally {
      setRecording(false);
    }
  }

  function handleRetake() {
    setCapture(null);
    setStatus('idle');
    setMessage(undefined);
    setError(null);
  }

  async function handleSend() {
    if (!capture) return;
    setStatus('loading');
    setError(null);
    try {
      const response = await processCapture({ action, capture });
      setMessage(response.content ?? response.message);
      setStatus('done');
    } catch {
      setStatus('idle');
      setError('L’envoi a échoué. Réessayez.');
    }
  }

  function handleModeChange(label: string) {
    if (recording) return;
    const next = MODE_OPTIONS.find((option) => option.label === label);
    if (next) setMode(next.mode);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
      <Reveal>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Fermer la caméra"
            style={styles.iconButton}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Caméra</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.modeRow}>
          <OptionChips
            options={MODE_OPTIONS.map((option) => option.label)}
            selected={MODE_OPTIONS.find((option) => option.mode === mode)?.label ?? 'Photo'}
            onSelect={handleModeChange}
          />
        </View>
      </Reveal>

      {capture ? (
        <Reveal delay={60} style={styles.previewWrap}>
          <View style={styles.preview}>
            {capture.kind === 'photo' ? (
              <Image source={{ uri: capture.uri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Ionicons name="videocam-outline" size={40} color={colors.primaryBright} />
                <Text style={styles.videoPlaceholderText}>Vidéo capturée</Text>
              </View>
            )}
          </View>
          <Pressable onPress={handleRetake} accessibilityRole="button" style={styles.retakeButton}>
            <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
            <Text style={styles.retakeText}>Reprendre</Text>
          </Pressable>
        </Reveal>
      ) : (
        <Reveal delay={60} style={styles.cameraWrap}>
          {cameraGranted && (!microphoneNeeded || microphoneGranted) ? (
            <View style={styles.camera}>
              <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" mode={mode === 'photo' ? 'picture' : 'video'} />
              <View style={styles.shutterWrap}>
                <Pressable
                  onPress={handleShutter}
                  accessibilityRole="button"
                  accessibilityLabel={mode === 'photo' ? 'Prendre la photo' : recording ? 'Arrêter l’enregistrement' : 'Démarrer l’enregistrement'}
                  style={styles.shutterOuter}>
                  <View
                    style={[
                      styles.shutterInner,
                      mode === 'video' && styles.shutterVideo,
                      recording && styles.shutterRecording,
                    ]}
                  />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.permission}>
              <Ionicons name="camera-outline" size={40} color={colors.textMuted} />
              <Text style={styles.permissionText}>
                WELI a besoin de la caméra{microphoneNeeded ? ' et du micro' : ''} pour continuer.
              </Text>
              <Pressable onPress={handleGrantPermissions} accessibilityRole="button" style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>Autoriser</Text>
              </Pressable>
            </View>
          )}
        </Reveal>
      )}

      {capture ? (
        <Reveal delay={120} style={styles.actions}>
          <Text style={styles.sectionLabel}>QUE VOULEZ-VOUS FAIRE ?</Text>
          <OptionChips
            options={CAPTURE_ACTIONS.map((item) => item.label)}
            selected={selectedActionLabel}
            onSelect={(label) => {
              const next = CAPTURE_ACTIONS.find((item) => item.label === label);
              if (next) setAction(next.id);
            }}
          />
          <GenerateButton
            label="Envoyer"
            loading={status === 'loading'}
            onPress={handleSend}
          />
          <ResultCard
            status={status}
            emptyText="Le résultat apparaîtra ici."
            message={message}
          />
        </Reveal>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  modeRow: {
    alignItems: 'flex-start',
  },
  cameraWrap: {
    flex: 1,
  },
  camera: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  shutterWrap: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.text,
  },
  shutterVideo: {
    backgroundColor: colors.primaryBright,
  },
  shutterRecording: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  permission: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  permissionText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  permissionButton: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  permissionButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  previewWrap: {
    flex: 1,
    gap: 10,
  },
  preview: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  videoPlaceholderText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  retakeText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  error: {
    color: colors.primaryBright,
    fontSize: 13,
    textAlign: 'center',
  },
});
