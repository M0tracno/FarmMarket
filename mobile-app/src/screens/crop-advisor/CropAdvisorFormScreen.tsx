import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppIcon, AppText } from '@/components';

import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SIZES,
  SPACING,
} from '@/theme';

const MAX_PHOTOS = 5;
const MAX_VIDEOS = 3;

type MediaKind = 'photo' | 'video';

const ASSETS = {
  plus: require('../../../assets/images/crop-advisor/plus-bold.png'),
} as const;

const COPY = {
  title: 'Describe your issue',
  cropName: 'Crop Name',
  issue: 'Issue',
  description: 'Describe the problem',
  photos: `Add Photos (max ${MAX_PHOTOS})`,
  videos: `Add Videos (max ${MAX_VIDEOS})`,
  photoLabel: 'Image',
  videoLabel: 'Video',
  submit: 'Submit Request',
} as const;

interface CropAdvisorInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
}

function CropAdvisorInput({
  label,
  value,
  onChangeText,
  multiline = false,
  style,
  placeholder,
}: CropAdvisorInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <AppText variant="bodyMedium" style={styles.inputLabel}>
        {label}
      </AppText>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.muted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.formInput,
          focused && styles.formInputFocused,
          multiline && styles.formTextArea,
          style,
        ]}
      />
    </View>
  );
}

export interface CropAdvisorFormScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={10}
        onPress={onBack}
        style={styles.backButton}
      >
        <AppIcon name="back" size="lg" color={COLORS.text.primary} />
      </Pressable>

      <AppText variant="bodyMedium" align="center" style={styles.headerTitle}>
        {title}
      </AppText>
    </View>
  );
}

interface MediaSlotProps {
  kind: MediaKind;
  asset?: ImagePicker.ImagePickerAsset;
  onPress: () => void;
  onRemove?: () => void;
}

function MediaSlot({
  kind,
  asset,
  onPress,
  onRemove,
}: MediaSlotProps) {
  const isPhoto = kind === 'photo';

  return (
    <View style={styles.mediaSlotWrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={asset ? `Replace selected ${kind}` : `Add ${kind}`}
        style={({ pressed }) => [
          styles.mediaSlot,
          pressed && styles.mediaSlotPressed,
          asset && styles.mediaSlotSelected,
        ]}
        onPress={onPress}
      >
        {asset ? (
          isPhoto ? (
            <Image
              source={{ uri: asset.uri }}
              style={styles.selectedMediaPreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.selectedVideoPreview}>
              <View style={styles.videoCheck}>
                <AppIcon name="check" size="sm" color={COLORS.text.inverse} />
              </View>
              <AppText
                variant="bodyMedium"
                align="center"
                style={styles.selectedVideoText}
              >
                Video selected
              </AppText>
            </View>
          )
        ) : (
          <>
            <Image source={ASSETS.plus} style={styles.plusIcon} resizeMode="contain" />
            <AppText variant="body" style={styles.mediaLabel}>
              {isPhoto ? COPY.photoLabel : COPY.videoLabel}
            </AppText>
          </>
        )}
      </Pressable>

      {asset && onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${kind}`}
          hitSlop={8}
          onPress={onRemove}
          style={styles.removeButton}
        >
          <AppIcon name="close" size="xs" color={COLORS.text.inverse} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function CropAdvisorFormScreen({ onBack, onSubmit }: CropAdvisorFormScreenProps) {
  const [cropName, setCropName] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [videos, setVideos] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pickMedia = async (kind: MediaKind, replaceIndex?: number) => {
    const currentItems = kind === 'photo' ? photos : videos;
    const limit = kind === 'photo' ? MAX_PHOTOS : MAX_VIDEOS;

    if (replaceIndex === undefined && currentItems.length >= limit) {
      Alert.alert(
        'Limit reached',
        `You can upload a maximum of ${limit} ${kind === 'photo' ? 'images' : 'videos'}.`,
      );
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow access to your media library to select files.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: kind === 'photo' ? ['images'] : ['videos'],
        allowsMultipleSelection: false,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedAsset = result.assets[0];
      const expectedType = kind === 'photo' ? 'image' : 'video';

      if (selectedAsset.type !== expectedType) {
        Alert.alert(
          'Invalid media',
          `Please select ${kind === 'photo' ? 'an image' : 'a video'} only.`,
        );
        return;
      }

      if (replaceIndex !== undefined) {
        if (kind === 'photo') {
          setPhotos((current) =>
            current.map((item, index) => (index === replaceIndex ? selectedAsset : item)),
          );
        } else {
          setVideos((current) =>
            current.map((item, index) => (index === replaceIndex ? selectedAsset : item)),
          );
        }
        return;
      }

      if (kind === 'photo') {
        setPhotos((current) =>
          current.length >= MAX_PHOTOS ? current : [...current, selectedAsset],
        );
      } else {
        setVideos((current) =>
          current.length >= MAX_VIDEOS ? current : [...current, selectedAsset],
        );
      }
    } catch (error) {
      console.error('Crop Advisor media picker error:', error);
      Alert.alert(
        'Unable to select media',
        'Something went wrong while opening your media library. Please try again.',
      );
    }
  };

  const getMediaSlots = (
    items: ImagePicker.ImagePickerAsset[],
    limit: number,
  ) => {
    const slotCount = Math.min(limit, Math.max(2, items.length + 1));
    return Array.from({ length: slotCount }, (_, index) => items[index]);
  };

  const removeMedia = (kind: MediaKind, index: number) => {
    if (kind === 'photo') {
      setPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index));
    } else {
      setVideos((current) => current.filter((_, itemIndex) => itemIndex !== index));
    }
  };

  const validateForm = () => {
    if (!cropName.trim()) {
      Alert.alert('Crop name required', 'Please enter the crop name before submitting the request.');
      return false;
    }

    if (!issue.trim()) {
      Alert.alert('Issue required', 'Please enter the crop issue before submitting the request.');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Description required', 'Please describe the crop problem before submitting the request.');
      return false;
    }

    if (photos.length === 0) {
      Alert.alert(
        'Photo required',
        'Please upload at least one image of the crop problem before submitting your request.',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <ScreenHeader title={COPY.title} onBack={onBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
          <CropAdvisorInput
            label={COPY.cropName}
            value={cropName}
            onChangeText={setCropName}
          />

          <CropAdvisorInput
            label={COPY.issue}
            value={issue}
            onChangeText={setIssue}
          />

          <CropAdvisorInput
            label={COPY.description}
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.descriptionInput}
          />

          <AppText variant="bodyMedium" style={styles.sectionLabel}>
            {COPY.photos}
          </AppText>

          <View style={styles.mediaRow}>
            {getMediaSlots(photos, MAX_PHOTOS).map((asset, index) => (
              <MediaSlot
                key={`photo-${index}`}
                kind="photo"
                asset={asset}
                onPress={() => pickMedia('photo', asset ? index : undefined)}
                onRemove={asset ? () => removeMedia('photo', index) : undefined}
              />
            ))}
          </View>

          <AppText variant="bodyMedium" style={styles.sectionLabel}>
            {COPY.videos}
          </AppText>

          <View style={styles.mediaRow}>
            {getMediaSlots(videos, MAX_VIDEOS).map((asset, index) => (
              <MediaSlot
                key={`video-${index}`}
                kind="video"
                asset={asset}
                onPress={() => pickMedia('video', asset ? index : undefined)}
                onRemove={asset ? () => removeMedia('video', index) : undefined}
              />
            ))}
          </View>

          <AppButton
            title={COPY.submit}
            onPress={handleSubmit}
            fullWidth
            style={styles.formButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  flex: {
    flex: 1,
  },

  header: {
    height: SIZES.headerHeight,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
    zIndex: 5,
  },

  backButton: {
    position: 'absolute',
    left: SPACING.xxs,
    width: 89,
    height: SIZES.smallIconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.md,
  },

  formContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 30,
    paddingBottom: SPACING.xxl,
    gap: 20,
  },

  inputLabel: {
    marginBottom: 10,
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.medium,
  },

  formInput: {
    height: 44,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.cropAdvisorBorder,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
  },

  formInputFocused: {
    borderColor: COLORS.cropAdvisor,
    borderWidth: 1.5,
  },

  formTextArea: {
    height: 87,
    paddingTop: 12,
    paddingBottom: 12,
  },

  descriptionInput: {
    marginBottom: 0,
  },

  sectionLabel: {
    marginBottom: -4,
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.medium,
  },

  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xl,
  },

  mediaSlotWrapper: {
    width: '45%',
    height: 190,
    position: 'relative',
  },

  mediaSlot: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: COLORS.cropAdvisor,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  mediaSlotPressed: {
    opacity: 0.75,
  },

  mediaSlotSelected: {
    borderColor: COLORS.cropAdvisor,
  },

  selectedMediaPreview: {
    width: '100%',
    height: '100%',
  },

  selectedVideoPreview: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cropAdvisorBackground,
  },

  videoCheck: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cropAdvisor,
    marginBottom: 12,
  },

  selectedVideoText: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
  },

  plusIcon: {
    width: 36,
    height: 36,
    marginBottom: 20,
  },

  mediaLabel: {
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
  },

  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text.primary,
    zIndex: 4,
  },

  formButton: {
    width: '100%',
    backgroundColor: COLORS.cropAdvisor,
  },
});
