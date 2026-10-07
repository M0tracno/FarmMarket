import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, type ImageSourcePropType, Pressable, ScrollView, StyleSheet, type StyleProp, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CART_COPY, PRODUCT_BENEFITS, PRODUCT_DETAIL_ADDRESS, PRODUCT_DETAIL_CONFIG, PRODUCT_DETAIL_COPY, PRODUCT_DETAIL_SECTIONS, PRODUCT_FAQS, PRODUCT_PACKS, PRODUCT_RATING, PRODUCT_REVIEWS } from '@/constants/config';
import { ICONS } from '@/constants/icons';
import { IMAGES } from '@/constants/images';
import { COLORS, PRODUCT_LAYOUT, PRODUCT_TYPOGRAPHY, RADIUS, SIZES, UI } from '@/theme';
import { type Product } from '@/types';
import { formatPaise, getProductDiscountPercent } from '@/utils/price';
import { ProductRecommendationCard } from './ProductRecommendationCard';

interface ProductPack {
  id: string;
  label: string;
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onCart: () => void;
  onSearch?: () => void;
  onShare?: () => void;
  onPackChange?: (pack: ProductPack) => void;
  packs?: readonly ProductPack[];
  images?: readonly ImageSourcePropType[];
  reviewLabel?: string;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onAddressChange?: () => void;
  onPlayVideo?: () => void;
  onReturns?: () => void;
  onProductPress?: (product: Product) => void;
  address?: { name: string; address: string; delivery: string };
  detailSections?: readonly { id: string; title: string; content?: string }[];
  similarProducts?: readonly Product[];
  recommendedProducts?: readonly Product[];
  reviews?: readonly { id: string; author: string; stars: number; date: string; text: string }[];
  faqs?: readonly { id: string; question: string; answer?: string }[];
  onReply?: (reviewId: string) => void;
  onReviewOptions?: (reviewId: string) => void;
}

function ProductGallery({ images, name, onShare, saved, onSave }: { images: readonly ImageSourcePropType[]; name: string; onShare?: () => void; saved: boolean; onSave: () => void }) {
  const [imageIndex, setImageIndex] = useState<number>(PRODUCT_DETAIL_CONFIG.initialImageIndex);
  return (
    <>
      <View style={styles.gallery}>
        <Image source={images[imageIndex]} style={styles.productImage} resizeMode="contain" accessibilityLabel={name} />
        <View style={styles.galleryActions}>
          <Pressable onPress={onSave} hitSlop={UI.hitSlop} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.wishlist} accessibilityState={{ selected: saved }}>
            <Ionicons name={saved ? ICONS.heartFilled : ICONS.heart} size={SIZES.productActionIconSize} color={saved ? COLORS.purple : COLORS.text.black} />
          </Pressable>
          <Pressable onPress={onShare} disabled={!onShare} hitSlop={UI.hitSlop} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.share}>
            <Ionicons name={ICONS.share} size={SIZES.productActionIconSize} color={COLORS.text.black} />
          </Pressable>
        </View>
      </View>
      <View style={styles.pager}>
        {images.map((_, index) => (
          <Pressable key={index} onPress={() => setImageIndex(index)} hitSlop={UI.hitSlop} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.image(index)} accessibilityState={{ selected: index === imageIndex }} style={[styles.pagerDot, index === imageIndex && styles.activeDot]} />
        ))}
      </View>
    </>
  );
}

function ProductPackSelector({ packs, onChange }: { packs: readonly ProductPack[]; onChange?: (pack: ProductPack) => void }) {
  const [selectedId, setSelectedId] = useState<string | undefined>(() => packs.find((pack) => pack.id === PRODUCT_DETAIL_CONFIG.initialPackId)?.id ?? packs[0]?.id);
  return (
    <View>
      <AppText style={styles.packTitle}>{PRODUCT_DETAIL_COPY.selectPack}</AppText>
      <View style={styles.packs} accessibilityRole="radiogroup" accessibilityLabel={PRODUCT_DETAIL_COPY.selectPack}>
        {packs.map((pack) => (
          <Pressable key={pack.id} onPress={() => { setSelectedId(pack.id); onChange?.(pack); }} accessibilityRole="radio" accessibilityState={{ checked: selectedId === pack.id }} style={styles.pack}>
            <View pointerEvents="none" style={[styles.packBorder, selectedId === pack.id && styles.selectedPack]} />
            <AppText style={[styles.packText, selectedId === pack.id && styles.selectedPackText]} numberOfLines={1}>{pack.label}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ProductBenefits() {
  return (
    <View style={styles.benefits}>
      {PRODUCT_BENEFITS.map((benefit) => <Image key={benefit.label} source={IMAGES[benefit.imageKey]} style={styles.benefitImage} resizeMode="contain" accessibilityLabel={benefit.label} />)}
    </View>
  );
}

function ProductPurchaseActions({ onAddToCart, onBuyNow }: { onAddToCart?: () => void; onBuyNow?: () => void }) {
  const [buttonWidth, setButtonWidth] = useState<number>(SIZES.productPurchaseButtonWidth);
  return (
    <View style={styles.purchaseActions} onLayout={({ nativeEvent }) => setButtonWidth((nativeEvent.layout.width - PRODUCT_LAYOUT.purchaseGap) / 2)}>
      <Pressable onPress={onAddToCart} disabled={!onAddToCart} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.addToCart} style={[styles.purchaseButton, styles.addButton, { width: buttonWidth }]}>
        <AppText style={styles.addButtonText} numberOfLines={1}>{PRODUCT_DETAIL_COPY.addToCart}</AppText>
      </Pressable>
      <Pressable onPress={onBuyNow} disabled={!onBuyNow} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.buyNow} style={[styles.purchaseButton, styles.buyButton, { width: buttonWidth }]}>
        <AppText style={styles.buyButtonText} numberOfLines={1}>{PRODUCT_DETAIL_COPY.buyNow}</AppText>
      </Pressable>
    </View>
  );
}

function ProductDeliveryAddress({ address, onChange }: { address: { name: string; address: string; delivery: string }; onChange?: () => void }) {
  return (
    <View style={styles.addressSection}>
      <AppText style={styles.sectionTitle}>{PRODUCT_DETAIL_COPY.address}</AppText>
      <View style={styles.addressRow}>
        <Image source={IMAGES.productMapPin} style={styles.addressIcon} resizeMode="contain" accessible={false} />
        <AppText style={styles.addressName}>{address.name}</AppText>
        <AppText style={styles.addressText} numberOfLines={1}>{address.address}</AppText>
        <Pressable onPress={onChange} disabled={!onChange} accessibilityRole="button" accessibilityLabel={CART_COPY.changeAddress} hitSlop={UI.hitSlop}><AppText style={styles.addressChange}>{CART_COPY.changeAddress}</AppText></Pressable>
      </View>
      <View style={styles.deliveryBanner}><AppText style={styles.deliveryText}>{address.delivery}</AppText></View>
    </View>
  );
}

function ProductInformation({ sections }: { sections: readonly { id: string; title: string; content?: string }[] }) {
  const [expandedId, setExpandedId] = useState<string>();
  return (
    <View style={styles.detailsSection}>
      <AppText style={styles.sectionTitle}>{PRODUCT_DETAIL_COPY.productDetails}</AppText>
      <View style={styles.detailRows}>
        {sections.map((section) => <View key={section.id}>
          <Pressable onPress={() => setExpandedId(expandedId === section.id ? undefined : section.id)} disabled={!section.content} accessibilityRole="button" accessibilityLabel={section.title} accessibilityState={{ expanded: expandedId === section.id, disabled: !section.content }} style={styles.detailRow}>
            <AppText style={styles.detailRowText}>{section.title}</AppText>
            <Ionicons name={expandedId === section.id ? ICONS.chevronDown : ICONS.chevronRight} size={SIZES.productActionIconSize} color={COLORS.text.black} />
          </Pressable>
          {expandedId === section.id && <AppText style={styles.detailContent}>{section.content}</AppText>}
        </View>)}
      </View>
    </View>
  );
}

function RatingStars({ size, filledStars }: { size: number; filledStars: number }) {
  return <View style={styles.ratingStars}>{Array.from({ length: PRODUCT_DETAIL_CONFIG.starCount }, (_, index) => <View key={index} style={{ width: size, height: size }}><View style={{ width: size * Math.min(1, Math.max(0, filledStars - index)), height: size, overflow: 'hidden' }}><Image source={IMAGES.ratingStar} style={{ width: size, height: size }} accessible={false} /></View></View>)}</View>;
}

function ProductRecommendations({ title, products, onAddToCart, onProductPress, style }: { title: string; products: readonly Product[]; onAddToCart?: (product: Product) => void; onProductPress?: (product: Product) => void; style?: StyleProp<ViewStyle> }) {
  if (!products.length || !onAddToCart) return null;
  return <View style={style}>
    <AppText style={styles.smallSectionTitle}>{title}</AppText>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarCards}>
      {products.map((item) => <ProductRecommendationCard key={item.id} product={item} onAddToCart={onAddToCart} onProductPress={onProductPress} />)}
    </ScrollView>
  </View>;
}

function ProductReview({ review, onReply, onOptions }: { review: { id: string; author: string; stars: number; date: string; text: string }; onReply?: (reviewId: string) => void; onOptions?: (reviewId: string) => void }) {
  const [helpful, setHelpful] = useState(false);
  return <View style={styles.review}>
    <View style={styles.reviewHeader}>
      <Ionicons name={ICONS.reviewer} size={SIZES.reviewAvatarSize} color={COLORS.reviewGreen} style={styles.reviewIcon} />
      <AppText style={styles.reviewAuthor}>{review.author}</AppText>
      <Pressable onPress={onOptions ? () => onOptions(review.id) : undefined} disabled={!onOptions} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.reviewOptions} hitSlop={UI.hitSlop}><Image source={IMAGES.reviewMenu} style={styles.reviewMenuIcon} resizeMode="contain" accessible={false} /></Pressable>
    </View>
    <View style={styles.reviewMeta}><RatingStars size={SIZES.reviewStarSize} filledStars={review.stars} /><AppText style={styles.reviewDate}>{review.date}</AppText></View>
    <AppText style={styles.reviewText}>{review.text}</AppText>
    <View style={styles.reviewActions}>
      <Pressable onPress={onReply ? () => onReply(review.id) : undefined} disabled={!onReply} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.reply}><AppText style={styles.reviewReply}>{PRODUCT_DETAIL_COPY.reply}</AppText></Pressable>
      <Pressable onPress={() => setHelpful(!helpful)} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.helpful} accessibilityState={{ selected: helpful }} hitSlop={UI.hitSlop} style={helpful && styles.helpfulSelected}><Image source={IMAGES.reviewHelpful} style={styles.reviewHelpfulIcon} resizeMode="contain" accessible={false} /></Pressable>
    </View>
  </View>;
}

function ProductFaqs({ faqs }: { faqs: readonly { id: string; question: string; answer?: string }[] }) {
  const [expandedId, setExpandedId] = useState<string>();
  return <View style={styles.faqSection}>
    <AppText style={styles.faqTitle}>{PRODUCT_DETAIL_COPY.faq}</AppText>
    <View style={styles.faqRows}>{faqs.map((faq) => <View key={faq.id}>
      <Pressable onPress={() => setExpandedId(expandedId === faq.id ? undefined : faq.id)} disabled={!faq.answer} accessibilityRole="button" accessibilityLabel={faq.question} accessibilityState={{ expanded: expandedId === faq.id, disabled: !faq.answer }} style={styles.faqRow}>
        <AppText style={styles.faqQuestion}>{faq.question}</AppText><Ionicons name={expandedId === faq.id ? ICONS.chevronDown : ICONS.chevronRight} size={SIZES.reviewStarSize} color={COLORS.text.secondary} />
      </Pressable>
      {expandedId === faq.id && <AppText style={styles.faqAnswer}>{faq.answer}</AppText>}
    </View>)}</View>
  </View>;
}

export function ProductDetails({ product, onBack, onCart, onSearch, onShare, onPackChange, onAddToCart, onBuyNow, onAddressChange, onPlayVideo, onReturns, onProductPress, onReply, onReviewOptions, packs = PRODUCT_PACKS, images, reviewLabel = PRODUCT_DETAIL_COPY.reviews, address = PRODUCT_DETAIL_ADDRESS, detailSections = PRODUCT_DETAIL_SECTIONS, similarProducts = [], recommendedProducts = similarProducts, reviews = PRODUCT_REVIEWS, faqs = PRODUCT_FAQS }: ProductDetailsProps) {
  const [saved, setSaved] = useState(false);
  const imageSource = typeof product.imageUrl === 'string' ? { uri: product.imageUrl } : product.imageUrl;
  const galleryImages = images ?? [imageSource];
  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel={CART_COPY.back} hitSlop={UI.hitSlop}>
          <Ionicons name={ICONS.back} size={SIZES.cartHeaderIconSize} color={COLORS.text.black} />
        </Pressable>
        <AppText style={styles.headerTitle}>{PRODUCT_DETAIL_COPY.title}</AppText>
        <View style={styles.headerActions}>
          <Pressable onPress={onSearch} disabled={!onSearch} accessibilityRole="button" accessibilityLabel={CART_COPY.search} hitSlop={UI.hitSlop}><Image source={IMAGES.headerSearch} style={styles.headerIcon} /></Pressable>
          <Pressable onPress={() => setSaved(!saved)} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.wishlist} accessibilityState={{ selected: saved }} hitSlop={UI.hitSlop}><Ionicons name={saved ? ICONS.heartFilled : ICONS.heart} size={SIZES.cartHeaderIconSize} color={saved ? COLORS.purple : COLORS.text.black} /></Pressable>
          <Pressable onPress={onCart} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.cart} hitSlop={UI.hitSlop}><Image source={IMAGES.productHeaderCart} style={styles.headerIcon} resizeMode="contain" accessible={false} /></Pressable>
        </View>
      </View>
        <ProductGallery images={galleryImages} name={product.name} onShare={onShare} saved={saved} onSave={() => setSaved(!saved)} />
        <View style={styles.content}>
          <AppText style={styles.name}>{product.name}</AppText>
          <View style={styles.rating}>
            {Array.from({ length: PRODUCT_DETAIL_CONFIG.starCount }, (_, index) => <Image key={index} source={IMAGES.ratingStar} style={styles.star} accessible={false} />)}
            <AppText style={styles.reviews}>{reviewLabel}</AppText>
          </View>
          <View style={styles.priceRow}>
            <AppText style={styles.price}>{formatPaise(product.pricePaise, true)}</AppText>
            {product.mrpPaise > product.pricePaise && <>
              <AppText style={styles.mrp}>{formatPaise(product.mrpPaise, true)}</AppText>
              <AppText style={styles.discount}>{CART_COPY.discount(getProductDiscountPercent(product))}</AppText>
            </>}
          </View>
          <ProductPackSelector packs={packs} onChange={onPackChange} />
          <ProductBenefits />
          <ProductPurchaseActions onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined} onBuyNow={onBuyNow ? () => onBuyNow(product) : undefined} />
          <ProductDeliveryAddress address={address} onChange={onAddressChange} />
          <ProductInformation sections={detailSections} />
          <View style={styles.videoSection}>
            <AppText style={styles.videoTitle}>{PRODUCT_DETAIL_COPY.watchVideo}</AppText>
            <AppText style={styles.videoDescription}>{PRODUCT_DETAIL_COPY.videoDescription}</AppText>
            <Pressable onPress={onPlayVideo} disabled={!onPlayVideo} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.watchVideo} style={styles.videoPreview} />
          </View>
          <View style={styles.returnsSection}>
            <Pressable onPress={onReturns} disabled={!onReturns} accessibilityRole="button" accessibilityLabel={PRODUCT_DETAIL_COPY.returns}><AppText style={styles.returnsTitle}>{PRODUCT_DETAIL_COPY.returns}</AppText></Pressable>
            <AppText style={styles.returnsDescription}>{PRODUCT_DETAIL_COPY.returnsDescription}</AppText>
          </View>
          <ProductRecommendations title={PRODUCT_DETAIL_COPY.similarProducts} products={similarProducts} onAddToCart={onAddToCart} onProductPress={onProductPress} style={styles.similarSection} />
          <View style={styles.ratingSection}>
            <AppText style={styles.smallSectionTitle}>{PRODUCT_DETAIL_COPY.ratingReview}</AppText>
            <View style={styles.ratingSummary}>
              <View style={styles.ratingScorePanel}>
                <AppText style={styles.ratingScore}>{PRODUCT_RATING.score}</AppText>
                <View style={styles.summaryStars}><RatingStars size={SIZES.productStarSize} filledStars={PRODUCT_RATING.filledStars} /></View>
                <AppText style={styles.ratingCount}>{PRODUCT_DETAIL_COPY.ratingReviewCount}</AppText>
              </View>
              <View style={styles.ratingDistribution}>{PRODUCT_RATING.distribution.map((row) => <View key={row.stars} style={styles.ratingBarRow}>
                <AppText style={styles.ratingBarLabel}>{row.stars}</AppText><View style={styles.ratingTrack}><View style={[styles.ratingFill, { width: `${row.percent}%` }]} /></View>
              </View>)}</View>
            </View>
            {reviews.map((review) => <ProductReview key={review.id} review={review} onReply={onReply} onOptions={onReviewOptions} />)}
          </View>
          <ProductRecommendations title={PRODUCT_DETAIL_COPY.recommendedProducts} products={recommendedProducts} onAddToCart={onAddToCart} onProductPress={onProductPress} style={styles.recommendedSection} />
          <ProductFaqs faqs={faqs} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { height: SIZES.productHeaderHeight, paddingTop: PRODUCT_LAYOUT.headerTopInset, paddingBottom: PRODUCT_LAYOUT.headerBottomInset, paddingHorizontal: PRODUCT_LAYOUT.contentPadding, flexDirection: 'row', alignItems: 'center', gap: PRODUCT_LAYOUT.headerTitleGap },
  headerTitle: { ...PRODUCT_TYPOGRAPHY.header, flex: 1, color: COLORS.text.black },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: PRODUCT_LAYOUT.headerActionGap },
  headerIcon: { width: SIZES.cartHeaderIconSize, height: SIZES.cartHeaderIconSize },
  gallery: { height: SIZES.productGalleryHeight, alignItems: 'center', justifyContent: 'center' },
  productImage: { width: '100%', height: SIZES.productImageHeight },
  galleryActions: { position: 'absolute', right: PRODUCT_LAYOUT.galleryActionsRight, bottom: PRODUCT_LAYOUT.galleryActionsBottom, flexDirection: 'row', gap: PRODUCT_LAYOUT.galleryActionsGap },
  pager: { height: SIZES.productPagerHeight, marginBottom: PRODUCT_LAYOUT.pagerBottomGap, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: PRODUCT_LAYOUT.pagerGap },
  pagerDot: { width: SIZES.productPagerDotSize, height: SIZES.productPagerDotSize, borderRadius: RADIUS.full, backgroundColor: COLORS.originalPrice },
  activeDot: { backgroundColor: COLORS.text.black },
  content: { paddingHorizontal: PRODUCT_LAYOUT.contentPadding, paddingBottom: PRODUCT_LAYOUT.contentPadding },
  name: { ...PRODUCT_TYPOGRAPHY.name, color: COLORS.text.black },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: PRODUCT_LAYOUT.ratingTopGap },
  star: { width: SIZES.productStarSize, height: SIZES.productStarSize },
  reviews: { ...PRODUCT_TYPOGRAPHY.reviews, marginLeft: PRODUCT_LAYOUT.reviewGap, color: COLORS.text.black },
  priceRow: { width: SIZES.productPriceRowWidth, height: SIZES.productPriceRowHeight, flexDirection: 'row', alignItems: 'center', gap: UI.compactGap, marginTop: PRODUCT_LAYOUT.priceTopGap },
  price: { ...PRODUCT_TYPOGRAPHY.price, color: COLORS.purple },
  mrp: { ...PRODUCT_TYPOGRAPHY.mrp, color: COLORS.productPackBorder, textDecorationLine: 'line-through' },
  discount: { ...PRODUCT_TYPOGRAPHY.discount, color: COLORS.purple },
  packTitle: { ...PRODUCT_TYPOGRAPHY.pack, color: COLORS.text.black, marginTop: PRODUCT_LAYOUT.packTitleTopGap },
  packs: { flexDirection: 'row', gap: PRODUCT_LAYOUT.packGap, marginTop: PRODUCT_LAYOUT.packTopGap },
  pack: { height: SIZES.productPackHeight, borderRadius: RADIUS.xxs, paddingHorizontal: PRODUCT_LAYOUT.packPaddingHorizontal, paddingVertical: PRODUCT_LAYOUT.packPaddingVertical, justifyContent: 'center' },
  packBorder: { position: 'absolute', inset: UI.zeroInset, borderWidth: UI.borderWidth, borderColor: COLORS.productPackBorder, borderRadius: RADIUS.xxs },
  selectedPack: { borderColor: COLORS.purple },
  packText: { ...PRODUCT_TYPOGRAPHY.pack, color: COLORS.text.black },
  selectedPackText: { color: COLORS.purple },
  benefits: { height: SIZES.productBenefitsHeight, backgroundColor: COLORS.productBenefits, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: PRODUCT_LAYOUT.benefitsTopGap },
  benefitImage: { width: SIZES.productBenefitImageWidth, height: SIZES.productBenefitImageHeight, flexShrink: 1 },
  purchaseActions: { marginTop: PRODUCT_LAYOUT.purchaseTopGap, flexDirection: 'row', gap: PRODUCT_LAYOUT.purchaseGap },
  purchaseButton: { height: SIZES.productPurchaseButtonHeight, borderRadius: RADIUS.xs, justifyContent: 'center', alignItems: 'center', paddingVertical: PRODUCT_LAYOUT.purchasePaddingVertical, paddingHorizontal: PRODUCT_LAYOUT.purchasePaddingHorizontal },
  addButton: { backgroundColor: COLORS.productActionSurface, borderWidth: UI.borderWidth, borderColor: COLORS.purple },
  buyButton: { backgroundColor: COLORS.purple, borderWidth: UI.borderWidth, borderColor: COLORS.purple, paddingHorizontal: PRODUCT_LAYOUT.buyNowPaddingHorizontal },
  addButtonText: { ...PRODUCT_TYPOGRAPHY.pack, color: COLORS.text.black, flexShrink: 0, width: SIZES.productPurchaseLabelWidth, maxWidth: SIZES.productPurchaseLabelWidth },
  buyButtonText: { ...PRODUCT_TYPOGRAPHY.pack, color: COLORS.text.inverse, flexShrink: 0, width: SIZES.productBuyNowLabelWidth, maxWidth: SIZES.productBuyNowLabelWidth },
  addressSection: { marginTop: PRODUCT_LAYOUT.addressTopGap },
  sectionTitle: { ...PRODUCT_TYPOGRAPHY.section, color: COLORS.text.black },
  addressRow: { height: SIZES.productAddressHeight, borderWidth: UI.borderWidth, borderColor: COLORS.productDetailBorder, borderRadius: RADIUS.xs, marginTop: PRODUCT_LAYOUT.addressTitleGap, paddingHorizontal: PRODUCT_LAYOUT.addressPaddingHorizontal, flexDirection: 'row', alignItems: 'center', gap: PRODUCT_LAYOUT.addressContentGap },
  addressName: { ...PRODUCT_TYPOGRAPHY.addressName, color: COLORS.text.black },
  addressIcon: { width: SIZES.productAddressIconSize, height: SIZES.productAddressIconSize },
  addressText: { ...PRODUCT_TYPOGRAPHY.addressText, color: COLORS.text.dark, flex: 1 },
  addressChange: { ...PRODUCT_TYPOGRAPHY.addressAction, color: COLORS.text.black, textDecorationLine: 'underline' },
  deliveryBanner: { height: SIZES.productDeliveryHeight, borderRadius: RADIUS.xs, marginTop: PRODUCT_LAYOUT.deliveryTopGap, backgroundColor: COLORS.paymentOffer, justifyContent: 'center', alignItems: 'center' },
  deliveryText: { ...PRODUCT_TYPOGRAPHY.delivery, color: COLORS.stepperGreen },
  detailsSection: { marginTop: PRODUCT_LAYOUT.detailsTopGap },
  detailRows: { marginTop: PRODUCT_LAYOUT.detailsTitleGap, gap: PRODUCT_LAYOUT.detailRowGap },
  detailRow: { height: SIZES.productDetailRowHeight, borderWidth: UI.borderWidth, borderColor: COLORS.productDetailBorder, borderRadius: RADIUS.xs, paddingHorizontal: PRODUCT_LAYOUT.detailRowPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailRowText: { ...PRODUCT_TYPOGRAPHY.detailRow, color: COLORS.text.black },
  detailContent: { ...PRODUCT_TYPOGRAPHY.detailRow, padding: PRODUCT_LAYOUT.detailRowPadding, color: COLORS.text.dark },
  videoSection: { marginTop: PRODUCT_LAYOUT.videoTopGap },
  videoTitle: { ...PRODUCT_TYPOGRAPHY.pack, color: COLORS.text.black },
  videoDescription: { ...PRODUCT_TYPOGRAPHY.videoCaption, color: COLORS.text.dark, marginTop: PRODUCT_LAYOUT.videoDescriptionGap },
  videoPreview: { height: SIZES.productVideoHeight, borderRadius: RADIUS.lg, backgroundColor: COLORS.productVideo, marginTop: PRODUCT_LAYOUT.videoPreviewGap },
  returnsSection: { marginTop: PRODUCT_LAYOUT.returnsTopGap, maxWidth: SIZES.productReturnsWidth },
  returnsTitle: { ...PRODUCT_TYPOGRAPHY.returns, color: COLORS.purple },
  returnsDescription: { ...PRODUCT_TYPOGRAPHY.returnsDescription, color: COLORS.text.dark, marginTop: PRODUCT_LAYOUT.returnsDescriptionGap },
  similarSection: { marginTop: PRODUCT_LAYOUT.similarTopGap },
  similarCards: { gap: PRODUCT_LAYOUT.similarCardGap, marginTop: PRODUCT_LAYOUT.similarTitleGap },
  smallSectionTitle: { ...PRODUCT_TYPOGRAPHY.smallSection, color: COLORS.text.black },
  ratingSection: { marginTop: PRODUCT_LAYOUT.reviewSectionTopGap },
  ratingSummary: { height: SIZES.ratingSummaryHeight, marginTop: PRODUCT_LAYOUT.ratingSummaryTopGap, flexDirection: 'row', justifyContent: 'space-between' },
  ratingScorePanel: { width: SIZES.ratingScorePanelWidth, alignItems: 'center', paddingTop: PRODUCT_LAYOUT.ratingScoreTopGap },
  ratingScore: { ...PRODUCT_TYPOGRAPHY.ratingScore, color: COLORS.text.black },
  ratingStars: { flexDirection: 'row' },
  summaryStars: { marginTop: PRODUCT_LAYOUT.ratingStarsTopGap },
  ratingCount: { ...PRODUCT_TYPOGRAPHY.ratingLabel, color: COLORS.text.black, marginTop: PRODUCT_LAYOUT.ratingCountTopGap },
  ratingDistribution: { width: SIZES.ratingDistributionWidth },
  ratingBarRow: { height: SIZES.ratingRowHeight, flexDirection: 'row', alignItems: 'center', gap: PRODUCT_LAYOUT.ratingBarGap },
  ratingBarLabel: { ...PRODUCT_TYPOGRAPHY.ratingLabel, width: SIZES.ratingLabelWidth, color: COLORS.text.black },
  ratingTrack: { flex: 1, height: SIZES.ratingBarHeight, borderRadius: RADIUS.lg, backgroundColor: COLORS.productVideo, overflow: 'hidden' },
  ratingFill: { height: '100%', borderRadius: RADIUS.lg, backgroundColor: COLORS.ratingStar },
  review: { marginTop: PRODUCT_LAYOUT.reviewTopGap },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: PRODUCT_LAYOUT.reviewAuthorGap },
  reviewIcon: { width: SIZES.productActionIconSize, height: SIZES.productActionIconSize, lineHeight: SIZES.productActionIconSize },
  reviewMenuIcon: { width: SIZES.reviewStarSize, height: SIZES.reviewStarSize },
  reviewHelpfulIcon: { width: SIZES.productActionIconSize, height: SIZES.productActionIconSize },
  helpfulSelected: { backgroundColor: COLORS.paymentOffer, borderRadius: RADIUS.xxs },
  reviewAuthor: { ...PRODUCT_TYPOGRAPHY.reviewAuthor, flex: 1, color: COLORS.text.black },
  reviewMeta: { marginTop: PRODUCT_LAYOUT.reviewMetaTopGap, flexDirection: 'row', alignItems: 'center', gap: PRODUCT_LAYOUT.reviewDateGap },
  reviewDate: { ...PRODUCT_TYPOGRAPHY.reviewDate, color: COLORS.text.black },
  reviewText: { ...PRODUCT_TYPOGRAPHY.reviewText, color: COLORS.text.black, marginTop: PRODUCT_LAYOUT.reviewTextTopGap },
  reviewActions: { marginTop: PRODUCT_LAYOUT.reviewActionsTopGap, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewReply: { ...PRODUCT_TYPOGRAPHY.reviewReply, color: COLORS.reviewGreen },
  recommendedSection: { marginTop: PRODUCT_LAYOUT.recommendedTopGap },
  faqSection: { marginTop: PRODUCT_LAYOUT.faqTopGap },
  faqTitle: { ...PRODUCT_TYPOGRAPHY.faqTitle, color: COLORS.text.black, alignSelf: 'flex-start' },
  faqRows: { marginTop: PRODUCT_LAYOUT.faqTitleGap, gap: PRODUCT_LAYOUT.faqRowGap },
  faqRow: { minHeight: SIZES.productFaqRowHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { ...PRODUCT_TYPOGRAPHY.faq, color: COLORS.text.dark, flex: 1 },
  faqAnswer: { ...PRODUCT_TYPOGRAPHY.faq, color: COLORS.text.dark, paddingVertical: PRODUCT_LAYOUT.detailRowPadding },
});
