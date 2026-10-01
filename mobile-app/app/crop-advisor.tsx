// Requires: pnpm expo install expo-image-picker
// This file keeps the Crop Advisor flow in one Expo Router screen.

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
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
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
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

/**
 * Crop Advisor limits
 */
const MAX_PHOTOS = 5;
const MAX_VIDEOS = 3;

/**
 * These are fallback display values only.
 *
 * The phone number can be supplied through the route:
 * /crop-advisor?phoneNumber=...
 */
const DEFAULT_CALL_WINDOW = '2 hours';
const DEFAULT_PHONE_NUMBER = '+91 12345 67890';

type Screen = 'intro' | 'form' | 'success';

type MediaKind = 'photo' | 'video';

const ASSETS = {
  advisor: require('@/assets/crop-advisor/advisor.png'),
  decorations: require('@/assets/crop-advisor/decorations.png'),
  farmer: require('@/assets/crop-advisor/farmer.png'),
  plus: require('@/assets/crop-advisor/plus-bold.png'),
  warning: require('@/assets/crop-advisor/warning-circle.png'),
  phone: require('@/assets/crop-advisor/phone-call.png'),
  clock: require('@/assets/crop-advisor/clock-countdown.png'),
  check: require('@/assets/crop-advisor/check-circle-fill.png'),
} as const;

/**
 * Screen copy is kept together instead of being scattered
 * throughout the JSX.
 */


const COPY = {
  intro: {
    title: 'Crop Advisor',
    description:
      'Facing a crop problem? Upload photos or videos and get expert guidance to keep your crops healthy and productive.',
    continue: 'Continue',
  },

  form: {
    title: 'Describe your issue',

    cropName: 'Crop Name',
    issue: 'Issue',
    description: 'Describe the problem',

    photos: `Add Photos (max ${MAX_PHOTOS})`,
    videos: `Add Videos (max ${MAX_VIDEOS})`,

    photoLabel: 'Image',
    videoLabel: 'Video',

    submit: 'Submit Request',
  },

  success: {
    title: 'Submitted Successfully',

    requestTitle: 'Request Submitted!',

    description:
      'Thank you! Our agriculture expert has received your request and will review it.',

    callWithin: 'We will call you within',

    receiveCall: 'You will receive a call on',

    whatsapp:
      'We will share the time with you on WhatsApp and SMS.',

    done: 'Done',
  },
} as const;

// input screen --------------------------

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
  return (
    <View>
      <AppText
        variant="bodyMedium"
        style={styles.inputLabel}
      >
        {label}
      </AppText>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.muted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.formInput,
          multiline && styles.formTextArea,
          style,
        ]}
      />
    </View>
  );
}


// Header screen --------------------------


interface ScreenHeaderProps {
  title?: string;
  onBack: () => void;
}

function ScreenHeader({
  title,
  onBack,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={10}
        onPress={onBack}
        style={styles.backButton}
      >
         {/* reused the arrow back icon from the app's icon set, with medium size and primary text color */}
        <AppIcon
          name="back"
          size="md"
          color={COLORS.text.primary}
        />
      </Pressable>

      {title ? (
        <AppText
          variant="bodyMedium"
          align="center"
          style={styles.headerTitle}
        >
          {title}
        </AppText>
      ) : null}
    </View>
  );
}

// media slot-------------------------------------

interface MediaSlotProps {
  kind: MediaKind;
  asset?: ImagePicker.ImagePickerAsset;
  onPress: () => void;
}

function MediaSlot({
  kind,
  asset,
  onPress,
}: MediaSlotProps) {
  const isPhoto = kind === 'photo';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        asset
          ? `Replace selected ${kind}`
          : `Add ${kind}`
      }
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
              <AppIcon
                name="check"
                size="sm"
                color={COLORS.text.inverse}
              />
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
          <Image
            source={ASSETS.plus}
            style={styles.plusIcon}
            resizeMode="contain"
          />

          <AppText
            variant="body"
            style={styles.mediaLabel}
          >
            {isPhoto
              ? COPY.form.photoLabel
              : COPY.form.videoLabel}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

// Main Screen ----------------------------------

export default function CropAdvisorScreen() {
  const { width } = useWindowDimensions();

  const params =
    useLocalSearchParams<{
      phoneNumber?: string;
    }>();

  const [screen, setScreen] =
    useState<Screen>('intro');

  const [cropName, setCropName] =
    useState('');

  const [issue, setIssue] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [photos, setPhotos] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);

  const [videos, setVideos] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);

  /**
   * Route parameter takes precedence.
   */

  const phoneNumber = useMemo(
    () =>
      params.phoneNumber?.trim() ||
      DEFAULT_PHONE_NUMBER,
    [params.phoneNumber],
  );

  // Media Picker  + Form validation ---------------------------------


  const pickMedia = async (
    kind: MediaKind,
    replaceIndex?: number,
  ) => {
    const currentItems =
      kind === 'photo' ? photos : videos;

    const limit =
      kind === 'photo' ? MAX_PHOTOS : MAX_VIDEOS;

    // A new slot cannot be opened after the section reaches its limit.

    if (
      replaceIndex === undefined &&
      currentItems.length >= limit
    ) {
      Alert.alert(
        'Limit reached',
        `You can upload a maximum of ${limit} ${
          kind === 'photo' ? 'images' : 'videos'
        }.`,
      );
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow access to your media library to select files.',
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            kind === 'photo'
              ? ['images']
              : ['videos'],
          allowsMultipleSelection: false,
          allowsEditing: false,
          quality: 1,
        });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedAsset = result.assets[0];

      // Keep the check even though mediaTypes restricts the picker.
      // This prevents an unexpected media type from entering the
      // opposite section.


      const expectedType =
        kind === 'photo' ? 'image' : 'video';

      if (selectedAsset.type !== expectedType) {
        Alert.alert(
          'Invalid media',
          `Please select ${
            kind === 'photo' ? 'an image' : 'a video'
          } only.`,
        );
        return;
      }

      if (replaceIndex !== undefined) {
        if (kind === 'photo') {
          setPhotos((current) =>
            current.map((item, index) =>
              index === replaceIndex
                ? selectedAsset
                : item,
            ),
          );
        } else {
          setVideos((current) =>
            current.map((item, index) =>
              index === replaceIndex
                ? selectedAsset
                : item,
            ),
          );
        }

        return;
      }

      if (kind === 'photo') {
        setPhotos((current) => {
          if (current.length >= MAX_PHOTOS) {
            return current;
          }

          return [...current, selectedAsset];
        });
      } else {
        setVideos((current) => {
          if (current.length >= MAX_VIDEOS) {
            return current;
          }

          return [...current, selectedAsset];
        });
      }
    } catch (error) {
      console.error(
        'Crop Advisor media picker error:',
        error,
      );

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
      
    /*
     * Keep two cards visible initially to match the design.
     *
     * Once media is selected, show the selected cards and one
     * additional "+" card until the maximum is reached.       
     */

    const slotCount = Math.min(
      limit,
      Math.max(2, items.length + 1),
    );

    return Array.from(
      { length: slotCount },
      (_, index) => items[index],
    );
  };

  const validateForm = () => {
    if (!cropName.trim()) {
      Alert.alert(
        'Crop name required',
        'Please enter the crop name before submitting the request.',
      );
      return false;
    }

    if (!issue.trim()) {
      Alert.alert(
        'Issue required',
        'Please enter the crop issue before submitting the request.',
      );
      return false;
    }

    if (!description.trim()) {
      Alert.alert(
        'Description required',
        'Please describe the crop problem before submitting the request.',
      );
      return false;
    }

    if (photos.length === 0) {
      Alert.alert(
        'Photo required',
        'Please add at least one image of the crop problem.',
      );
      return false;
    }

    if (videos.length === 0) {
      Alert.alert(
        'Video required',
        'Please add at least one video of the crop problem.',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setScreen('success');
  };

  // Navigation ------------------------------------

  const handleBack = () => {
    if (screen === 'form') {
      setScreen('intro');
      return;
    }

    if (screen === 'success') {
      setScreen('form');
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  };

  // Intro -------------------------------------------

  if (screen === 'intro') {
    return (
      <View style={styles.root}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.surface}
        />

        <ScreenHeader onBack={handleBack} />

        <View style={styles.introBody}>
          <ImageBackground
            source={ASSETS.decorations}
            resizeMode="stretch"
            style={[
              styles.decorations,
              {
                width,
              },
            ]}
          />

          <View style={styles.introCopy}>
            <AppText
              variant="title"
              align="center"
              style={styles.introTitle}
            >
              {COPY.intro.title}
            </AppText>

            <AppText
              variant="body"
              align="center"
              style={styles.introDescription}
            >
              {COPY.intro.description}
            </AppText>
          </View>

          <Image
            source={ASSETS.advisor}
            resizeMode="contain"
            style={styles.advisorImage}
          />

          <Image
            source={ASSETS.farmer}
            resizeMode="contain"
            style={styles.farmerImage}
          />

          <AppButton
            title={COPY.intro.continue}
            onPress={() => setScreen('form')}
            fullWidth
            style={[
              styles.purpleButton,
              styles.introButton,
            ]}
          />
        </View>
      </View>
    );
  }

  // Form --------------------------------------------

  if (screen === 'form') {
    return (
      <View style={styles.root}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.surface}
        />

        <ScreenHeader
          title={COPY.form.title}
          onBack={handleBack}
        />

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
          style={styles.flex}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.formContent
            }
          >
            {/* Crop name */}

            <CropAdvisorInput
              label={COPY.form.cropName}
              value={cropName}
              onChangeText={setCropName}
            />

            {/* Issue */}

            <CropAdvisorInput
              label={COPY.form.issue}
              value={issue}
              onChangeText={setIssue}
            />

            {/* Description */}

            <CropAdvisorInput
              label={COPY.form.description}
              value={description}
              onChangeText={setDescription}
              multiline
              style={styles.descriptionInput}
            />

            {/* Photos */}

            <AppText
              variant="bodyMedium"
              style={styles.sectionLabel}
            >
              {COPY.form.photos}
            </AppText>

            <View style={styles.mediaRow}>
              {getMediaSlots(photos, MAX_PHOTOS).map(
                (asset, index) => (
                  <MediaSlot
                    key={`photo-${index}`}
                    kind="photo"
                    asset={asset}
                    onPress={() =>
                      pickMedia(
                        'photo',
                        asset ? index : undefined,
                      )
                    }
                  />
                ),
              )}
            </View>

            {/* Videos */}

            <AppText
              variant="bodyMedium"
              style={styles.sectionLabel}
            >
              {COPY.form.videos}
            </AppText>

            <View style={styles.mediaRow}>
              {getMediaSlots(videos, MAX_VIDEOS).map(
                (asset, index) => (
                  <MediaSlot
                    key={`video-${index}`}
                    kind="video"
                    asset={asset}
                    onPress={() =>
                      pickMedia(
                        'video',
                        asset ? index : undefined,
                      )
                    }
                  />
                ),
              )}
            </View>

            {/* Submit */}

            <AppButton
              title={COPY.form.submit}
              onPress={handleSubmit}
              fullWidth
              style={styles.formButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // Success -------------------------------------------

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.surface}
      />

      <ScreenHeader
        title={COPY.success.title}
        onBack={handleBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.successContent
        }
      >
        {/* Success icon */}

        <Image
          source={ASSETS.check}
          style={styles.checkIcon}
          resizeMode="contain"
        />

        {/* Heading */}

        <AppText
          variant="heading"
          align="center"
          style={styles.requestTitle}
        >
          {COPY.success.requestTitle}
        </AppText>

        {/* Description */}

        <AppText
          variant="body"
          align="center"
          style={styles.successDescription}
        >
          {COPY.success.description}
        </AppText>

        {/* Information card */}

        <View style={styles.successCard}>
          <SuccessRow
            icon={ASSETS.clock}
            label={COPY.success.callWithin}
            value={DEFAULT_CALL_WINDOW}
          />

          <SuccessRow
            icon={ASSETS.phone}
            label={COPY.success.receiveCall}
            value={phoneNumber}
          />
        </View>

        {/* WhatsApp / SMS message */}

        <View style={styles.whatsappCard}>
          <Image
            source={ASSETS.warning}
            style={styles.successRowIcon}
            resizeMode="contain"
          />

          <AppText
            variant="caption"
            color={COLORS.cropAdvisor}
            style={styles.whatsappText}
          >
            {COPY.success.whatsapp}
          </AppText>
        </View>

        {/* Done */}

        <AppButton
          title={COPY.success.done}
          onPress={() => setScreen('intro')}
          fullWidth
          size="small"
          style={styles.doneButton}
        />
      </ScrollView>
    </View>
  );
}

// Success row -------------------------------------

interface SuccessRowProps {
  icon: ImageSourcePropType;
  label: string;
  value: string;
}

function SuccessRow({
  icon,
  label,
  value,
}: SuccessRowProps) {
  return (
    <View style={styles.successRow}>
      <Image
        source={icon}
        style={styles.successRowIcon}
        resizeMode="contain"
      />

      <View style={styles.successRowCopy}>
        <AppText
          variant="body"
          style={styles.successLabel}
        >
          {label}
        </AppText>

        <AppText
          variant="bodyMedium"
          color={COLORS.cropAdvisor}
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

// Styles ---------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  flex: {
    flex: 1,
  },

  // Header -------------------------------------------

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
    left: SPACING.lg,
    width: SIZES.iconButton,
    height: SIZES.smallIconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.md,
  },

  // Intro -------------------------------------------

  introBody: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor:
      COLORS.cropAdvisorBackground,
  },

  decorations: {
    position: 'absolute',
    top: -11,
    bottom: -11,
    left: 0,
    height: '110%',
  },

  introCopy: {
    position: 'absolute',
    top: 101,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 2,
  },

  introTitle: {
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
    fontFamily: FONT_FAMILY.semiBold,
  },

  introDescription: {
    marginTop: 14,
    paddingHorizontal: 53,
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
  },

  advisorImage: {
    position: 'absolute',
    left: 1,
    bottom: 45,
    width: 340,
    height: 430,
    zIndex: 2,
  },

  farmerImage: {
    position: 'absolute',
    right: 9,
    bottom: 72,
    width: 300,
    height: 300,
    zIndex: 3,
  },

  purpleButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.xs,
    backgroundColor:
      COLORS.cropAdvisor,
  },

  introButton: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    width: 'auto',
    bottom: 25,
    zIndex: 6,
  },

  // Form --------------------------------------------

  formButton: {
    width: '100%',
    backgroundColor: COLORS.cropAdvisor,
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
    borderColor:
      COLORS.cropAdvisor,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.text.primary,
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

  mediaSlot: {
    width: '45%',
    height: 190,
    borderWidth: 1,
    borderColor:
      COLORS.cropAdvisor,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mediaSlotPressed: {
    opacity: 0.75,
  },

  mediaSlotSelected: {
    overflow: 'hidden',
  },

  selectedMediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
  },

  selectedVideoPreview: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cropAdvisorBackground,
    borderRadius: RADIUS.lg,
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

  // Success -------------------------------------------

  successContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 42,
    paddingBottom: SPACING.xxxl,
  },

  checkIcon: {
    width: 144,
    height: 144,
  },

  requestTitle: {
    marginTop: 14,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    fontFamily: FONT_FAMILY.bold,
  },

  successDescription: {
    marginTop: 8,
    maxWidth: 330,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },

  successCard: {
    width: '100%',
    minHeight: 188,
    marginTop: 45,
    paddingHorizontal: 28,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor:
      COLORS.cropAdvisorBorder,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'space-between',
  },

  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  successRowIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
  },

  successRowCopy: {
    flex: 1,
    marginLeft: SPACING.xl,
  },

  successLabel: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginBottom: 2,
  },

  whatsappCard: {
    width: '100%',
    minHeight: 80,
    marginTop: SPACING.md,
    paddingHorizontal: 28,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      COLORS.cropAdvisorBorder,
    borderRadius: RADIUS.lg,
    backgroundColor:
      COLORS.cropAdvisorBackground,
  },

  whatsappText: {
    flex: 1,
    marginLeft: SPACING.xl,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.medium,
  },

  doneButton: {
    width: '100%',
    marginTop: 76,
    height: SIZES.smallButtonHeight,
    borderRadius: RADIUS.xs,
    backgroundColor:
      COLORS.cropAdvisor,
  },
});