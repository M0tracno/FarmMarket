import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { HELP_ISSUES } from '../../constants/orders';
import { useOrder } from '../../hooks/useOrder';
import {
  colors,
  fonts,
  lineHeight,
  radii,
  spacing,
  type,
} from '../../../themes';
import { Header } from '../../components/orders/Header';
import { ProductBag } from '../../components/orders/ProductBag';
import { KeyValue } from '../../components/orders/InfoCard';

const caretRightImage = require('../../components/images/caret-right (1) 8.png');

export function HelpCentreScreen() {
  const order = useOrder();
  return (
    <ScrollView style={styles.page}>
      <Header title="Help Centre" backRoute={`/(main)/order-detail?orderId=${encodeURIComponent(order.id)}`} />
      <View style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Order ID </Text>
            <Text style={styles.metaValue}>{order.id}</Text>
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Sold to </Text>
            <Text style={styles.metaValue}>{order.deliveryAddress.name}</Text>
          </Text>
        </View>
        <Pressable
          style={styles.product}
          onPress={() => router.push({ pathname: '/(main)/help-upload', params: { orderId: order.id } })}
        >
          <ProductBag small />
          <View style={styles.copy}>
            <Text style={styles.productName}>{order.product}</Text>
            <View style={styles.deliveryRow}>
              <View style={styles.greenDot} />
              <Text style={styles.deliveryOn}>Delivery On</Text>
            </View>
          </View>
          <Image source={caretRightImage} style={styles.productCaret} resizeMode="contain" />
        </Pressable>
        <Text style={styles.heading}>What Issue are you facing?</Text>
        {HELP_ISSUES.map((issue) => (
          <Pressable
            key={issue}
            style={styles.issue}
            onPress={() => router.push({ pathname: '/(main)/help-upload', params: { orderId: order.id, issue } })}
          >
            <Text style={styles.issueText}>{issue}</Text>
            <Image source={caretRightImage} style={styles.issueCaret} resizeMode="contain" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export function HelpUploadScreen() {
  const order = useOrder();
  const { issue = '' } = useLocalSearchParams<{ issue?: string }>();
  const [selectedMedia, setSelectedMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [details, setDetails] = useState('');
  const canProceed = selectedMedia.length > 0 && details.trim().length > 0;

  useEffect(() => {
    const pendingMedia = selectedMedia.filter((asset) => (uploadProgress[asset.uri] ?? 0) < 100);
    if (pendingMedia.length === 0) return;

    const timer = setInterval(() => {
      setUploadProgress((progress) => {
        const nextProgress = { ...progress };
        pendingMedia.forEach((asset) => {
          nextProgress[asset.uri] = Math.min((nextProgress[asset.uri] ?? 0) + 20, 100);
        });
        return nextProgress;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [selectedMedia, uploadProgress]);

  const pickMedia = async (mediaType: ImagePicker.MediaTypeOptions) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia((current) => {
        const existingUris = new Set(current.map((asset) => asset.uri));
        return [...current, ...result.assets.filter((asset) => !existingUris.has(asset.uri))];
      });
      setUploadProgress((current) => ({
        ...current,
        ...Object.fromEntries(result.assets.map((asset) => [asset.uri, 0])),
      }));
    }
  };

  const removeMedia = (uri: string) => {
    setSelectedMedia((current) => current.filter((asset) => asset.uri !== uri));
    setUploadProgress((current) => {
      const nextProgress = { ...current };
      delete nextProgress[uri];
      return nextProgress;
    });
  };

  return (
    <View style={styles.page}>
      <Header title="Help Centre" backRoute={`/(main)/help-centre?orderId=${encodeURIComponent(order.id)}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.uploadTitle}>Tell us more about the issue</Text>
        <Text style={styles.description}>
          Help us understand the issue better by uploading photos or videos
          {`\n`}and sharing additional details.
        </Text>
        <Text style={styles.uploadLabel}>Upload Photos and video</Text>
        <View style={styles.uploadRow}>
          <UploadChoice
            icon="camera-outline"
            label={selectedMedia.some((asset) => asset.type === 'image') ? 'Photo selected' : 'Upload Photos'}
            assets={selectedMedia.filter((asset) => asset.type === 'image')}
            uploadProgress={uploadProgress}
            onRemove={removeMedia}
            onPress={() => pickMedia(ImagePicker.MediaTypeOptions.Images)}
          />
          <UploadChoice
            icon="videocam-outline"
            label={selectedMedia.some((asset) => asset.type === 'video') ? 'Video selected' : 'Upload Video'}
            assets={selectedMedia.filter((asset) => asset.type === 'video')}
            uploadProgress={uploadProgress}
            onRemove={removeMedia}
            onPress={() => pickMedia(ImagePicker.MediaTypeOptions.Videos)}
          />
        </View>
        <Text style={styles.uploadLabel}>Additional Details</Text>
        <Text style={styles.description}>
          Please provide more information about the issue (optional)
        </Text>
        <View style={styles.textBox}>
          <TextInput
            placeholder="Description of your issue"
            placeholderTextColor={colors.placeholder}
            selectionColor={colors.purple}
            selectionHandleColor={colors.purple}
            cursorColor={colors.purple}
            underlineColorAndroid="transparent"
            multiline
            maxLength={5000}
            value={details}
            onChangeText={setDetails}
            style={[styles.input, { outlineWidth: 0, outlineColor: 'transparent', backgroundColor: 'transparent' }]}
          />
          <Text style={styles.counter}>{details.length}/5000</Text>
        </View>
      </ScrollView>
      <Pressable
        style={[styles.nextButton, !canProceed && styles.disabledButton]}
        disabled={!canProceed}
        onPress={() => {
          if (canProceed) {
            router.push({ pathname: '/(main)/return-success', params: { orderId: order.id, reason: issue || order.returnRequest.reason } });
          }
        }}
      >
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </View>
  );
}

function UploadChoice({
  icon,
  label,
  assets,
  uploadProgress,
  onRemove,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  assets: ImagePicker.ImagePickerAsset[];
  uploadProgress: Record<string, number>;
  onRemove: (uri: string) => void;
  onPress: () => void;
}) {
  const selectedAsset = assets[0];
  const progressAsset = assets.find((asset) => (uploadProgress[asset.uri] ?? 0) < 100);
  const selectedProgress = progressAsset ? uploadProgress[progressAsset.uri] ?? 0 : 100;
  return (
    <Pressable style={styles.uploadChoice} onPress={onPress} accessibilityRole="button">
      {selectedAsset ? (
        <>
          {selectedAsset.type === 'image' ? (
            <Image source={{ uri: selectedAsset.uri }} style={styles.uploadPreview} />
          ) : (
            <Ionicons name="videocam" size={30} color={colors.purple} />
          )}
          <Text style={styles.uploadChoiceText} numberOfLines={1}>{label}</Text>
          {assets.length > 1 && <Text style={styles.mediaCount}>+{assets.length - 1} more</Text>}
          {selectedProgress < 100 && (
            <View style={styles.choiceProgressTrack}>
              <View style={[styles.uploadProgress, { width: `${selectedProgress}%` }]} />
            </View>
          )}
          <Pressable
            style={styles.choiceRemove}
            onPress={() => onRemove(selectedAsset.uri)}
            accessibilityLabel="Remove selected media"
          >
            <Ionicons name="close" size={16} color={colors.black} />
          </Pressable>
        </>
      ) : (
        <>
          <Ionicons name={icon} size={34} color={colors.purple} />
          <Text style={styles.uploadChoiceText}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function ReturnSuccessScreen() {
  const order = useOrder();
  const { reason = order.returnRequest.reason } = useLocalSearchParams<{ reason?: string }>();
  const supportCallRoute = '/(main)/support-call' as never;
  const supportChatRoute = '/(main)/chat-support' as never;
  return (
    <View style={styles.page}>
      <Header title="Return Request Submitted" backRoute="/(main)/home" />
      <View style={styles.successContent}>
        <Image
          source={require('../../components/images/check-circle-fill 1.png')}
          style={styles.successIcon}
        />
        <Text style={styles.successMessage}>
          Your return request has been{`\n`}submitted successfully
        </Text>
        <Text style={styles.requestTitle}>Request Details</Text>
        <View style={styles.requestDetails}>
          <KeyValue label="Request ID" value={order.returnRequest.id} labelStyle={styles.requestLabel} valueStyle={styles.requestValue} />
          <KeyValue
            label="Product"
            value={`${order.product} (${order.weight})`}
            labelStyle={styles.requestLabel}
            valueStyle={styles.requestValue}
          />
          <KeyValue label="Reason" value={reason} labelStyle={styles.requestLabel} valueStyle={styles.requestValue} />
          <KeyValue label="Refund Amount" value={order.price} labelStyle={styles.requestLabel} valueStyle={styles.requestAmount} />
          <KeyValue label="Request Date" value={order.requestDate} labelStyle={styles.requestLabel} valueStyle={styles.requestValue} />
        </View>
      </View>
      <View style={styles.successActions}>
        <Pressable
          style={styles.nextButton}
          onPress={() => router.push({ pathname: supportCallRoute, params: { orderId: order.id } })}
        >
          <Image source={require('../../components/images/phone-fill (1) 1.png')} style={styles.supportIcon} />
          <Text style={styles.supportActionText}>Request a Support Call</Text>
        </Pressable>
        <Pressable
          style={styles.chatButton}
          onPress={() => router.push({ pathname: supportChatRoute, params: { orderId: order.id } })}
        >
          <Image source={require('../../components/images/Vector (4).png')} style={styles.supportIcon} />
          <Text style={[styles.supportActionText, styles.chatActionText]}>Chat with support</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.lg },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  meta: {
    color: colors.black,
    fontSize: type.xs,
    lineHeight: lineHeight.xs,
  },
  metaLabel: { color: colors.black, fontFamily: fonts.semiBold },
  metaValue: { color: colors.secondaryText, fontFamily: fonts.semiBold },
  product: {
    height: 83,
    borderRadius: radii.md,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  productCaret: { width: 30, height: 30 },
  issueCaret: { width: 24, height: 24 },
  copy: { flex: 1, marginLeft: spacing.lg },
  productName: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.supportStatus,
    marginRight: spacing.sm,
  },
  deliveryOn: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: type.xs,
    lineHeight: lineHeight.xs,
  },
  heading: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: type.md,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  issue: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueText: {
    color: colors.issueText,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
  },
  uploadTitle: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.lg,
    marginTop: spacing.lg,
  },
  description: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    marginTop: spacing.sm,
  },
  uploadLabel: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
    marginTop: spacing.xl,
  },
  uploadRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  uploadPreview: { width: 42, height: 42, borderRadius: radii.sm },
  mediaCount: { color: colors.text, fontFamily: fonts.semiBold, fontSize: type.xs },
  choiceProgressTrack: { width: '90%', height: 5, borderRadius: 3, backgroundColor: colors.border },
  choiceRemove: { position: 'absolute', top: spacing.xs, right: spacing.xs, padding: 2 },
  uploadProgress: { height: 5, borderRadius: 3, backgroundColor: colors.purple },
  uploadChoice: {
    height: 120,
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  uploadChoiceText: {
    color: colors.purple,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
  },
  removeMedia: { marginLeft: 'auto', padding: spacing.xs },
  textBox: {
    height: 132,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginTop: spacing.md,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  input: {
    color: colors.black,
    backgroundColor: 'transparent',
    fontFamily: fonts.medium,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    flex: 1,
    textAlignVertical: 'top',
  },
  counter: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
    textAlign: 'right',
  },
  nextButton: {
    height: 48,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radii.sm,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  disabledButton: { opacity: 0.45 },
  nextText: { color: colors.white, fontFamily: fonts.bold, fontSize: type.lg },
  successContent: { alignItems: 'center', paddingHorizontal: spacing.lg },
  successIcon: { width: 140, height: 140, marginTop: 52 },
  successMessage: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    fontSize: type.lg,
    lineHeight: lineHeight.lg,
    marginTop: 34,
  },
  requestTitle: {
    alignSelf: 'stretch',
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: type.lg,
    marginTop: 47,
    marginBottom: 25,
  },
  requestDetails: { alignSelf: 'stretch', gap: spacing.xs },
  requestLabel: { fontSize: type.productSubtext, lineHeight: lineHeight.sm },
  requestValue: { fontSize: type.productSubtext, lineHeight: lineHeight.sm },
  requestAmount: { color: colors.black, fontFamily: fonts.bold, fontSize: type.productSubtext, lineHeight: lineHeight.sm },
  successActions: { marginTop: spacing.xxl * 3, paddingBottom: 101, gap: 0 },
  chatButton: {
    height: 48,
    marginHorizontal: spacing.lg,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
  },
  supportIcon: { width: 20, height: 20, resizeMode: 'contain' },
  supportActionText: { color: colors.white, fontFamily: fonts.semiBold, fontSize: type.md },
  chatActionText: { color: colors.black, fontFamily: fonts.bold },
});
