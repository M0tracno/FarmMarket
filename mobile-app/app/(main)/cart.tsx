import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { IMAGES, PRODUCT_DETAIL_GALLERY } from '@/constants/images';
import { AppText } from '@/components/common/AppText';
import { AppIcon } from '@/components/common/AppIcon';
import {
  AddressBar,
  CartBottomBar,
  CartItemCard,
  CouponBanner,
  PriceBreakdown,
  RecommendationCarousel,
} from '@/components/cart';
import { useCart } from '@/context/CartContext';
import { CART_CONFIG, CART_COPY, CURRENCY, PAYMENT_COPY, PAYMENT_OPTIONS, PAYMENT_SUCCESS_COPY, PAYMENT_SUCCESS_ORDER, WALLET_COPY, WALLET_DATA, type CartCopy } from '@/constants/config';
import { type CartConfig, type CartItem, type CartPriceSummary, type DeliveryAddress, type Product } from '@/types';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, PAYMENT_SUCCESS_LAYOUT, PAYMENT_SUCCESS_TYPOGRAPHY, RADIUS, SIZES, SPACING, UI, WALLET_LAYOUT, WALLET_TYPOGRAPHY } from '@/theme';
import { formatPaise } from '@/utils/price';
import { MOCK_ADDRESS } from '@/data/mockAddress';
import { MOCK_CART_PRODUCTS, MOCK_RECOMMENDATION_PRODUCTS } from '@/data/mockProducts';
import { ProductDetails } from '@/components/product/ProductDetails';

interface CartViewProps {
  items: readonly CartItem[];
  priceSummary: CartPriceSummary;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
  config?: CartConfig;
  address?: DeliveryAddress;
  recommendations?: readonly Product[];
  copy?: CartCopy;
  onBack?: () => void;
  onSearch?: () => void;
  onWishlist?: () => void;
  onAddressChange?: () => void;
  onApplyCoupon?: () => void;
  onViewMoreRecommendations?: () => void;
  onContinue?: () => void;
  onProductPress?: (product: Product) => void;
  appliedCoupon?: string | null;
}

export default function CartScreen() {
  const router = useRouter();
  const cart = useCart();
  const { step, productId, walletTab } = useLocalSearchParams<{ step?: string; productId?: string; walletTab?: string }>();

  if (step === 'wallet') {
    return <WalletView initialTab={walletTab === 'how-to-use' ? 'how-to-use' : 'history'} onAddMoney={() => router.push({ pathname: '/cart', params: { step: 'wallet-add-money' } })} onBack={() => router.canGoBack() ? router.back() : router.replace('/cart')} />;
  }

  if (step === 'wallet-add-money') {
    return <WalletAddMoneyView onBack={() => router.canGoBack() ? router.back() : router.replace({ pathname: '/cart', params: { step: 'wallet' } })} />;
  }

  if (step === 'success') {
    return <PaymentSuccessView onHome={() => router.replace('/cart')} />;
  }

  if (step === 'product') {
    const product = [...MOCK_CART_PRODUCTS, ...MOCK_RECOMMENDATION_PRODUCTS].find((item) => item.id === productId) ?? MOCK_CART_PRODUCTS[0];
    return <ProductDetails
      key={product.id}
      product={product}
      images={product.imageUrl === IMAGES.saaf ? PRODUCT_DETAIL_GALLERY : undefined}
      onBack={() => router.canGoBack() ? router.back() : router.replace('/cart')}
      onCart={() => router.replace('/cart')}
      onAddToCart={cart.addItem}
      onBuyNow={(item) => { cart.addItem(item); router.push({ pathname: '/cart', params: { step: 'payment' } }); }}
      similarProducts={MOCK_RECOMMENDATION_PRODUCTS}
      onProductPress={(item) => router.push({ pathname: '/cart', params: { step: 'product', productId: item.id } })}
    />;
  }

  if (step === 'payment') {
    return (
      <PaymentView
        totalPaise={cart.priceSummary.orderTotalPaise}
        onBack={() => router.canGoBack() ? router.back() : router.replace('/cart')}
        onPlaceOrder={() => router.push({ pathname: '/cart', params: { step: 'success' } })}
      />
    );
  }

  return (
    <CartView
      {...cart}
      address={MOCK_ADDRESS}
      recommendations={MOCK_RECOMMENDATION_PRODUCTS}
      onBack={router.canGoBack() ? () => router.back() : undefined}
      onContinue={() => router.push({ pathname: '/cart', params: { step: 'payment' } })}
      onProductPress={(product) => router.push({ pathname: '/cart', params: { step: 'product', productId: product.id } })}
    />
  );
}

function WalletHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return <View style={walletStyles.header}>
    <Pressable style={walletStyles.back} onPress={onBack} disabled={!onBack} accessibilityRole="button" accessibilityLabel={CART_COPY.back} accessibilityState={{ disabled: !onBack }} hitSlop={UI.hitSlop}>
      <AppIcon name="chevronLeft" size="md" color={COLORS.text.black} />
    </Pressable>
    <AppText accessibilityRole="header" style={walletStyles.headerTitle}>{title}</AppText>
  </View>;
}

export function WalletAddMoneyView({ onBack, onProceed }: { onBack?: () => void; onProceed?: (amountPaise: number) => void }) {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width, WALLET_LAYOUT.width) / WALLET_LAYOUT.width;
  const [amount, setAmount] = useState('');
  const amountPaise = Math.round(Number(amount) * CURRENCY.PAISE_PER_RUPEE);
  const canProceed = Number.isFinite(amountPaise) && amountPaise > 0 && !!onProceed;
  return <View style={[walletStyles.wrapper, { width: WALLET_LAYOUT.width * scale }]}>
    <View style={[walletStyles.screen, { height: height / scale, transform: [{ scale }] }]}>
      <WalletHeader title={WALLET_COPY.addMoney} onBack={onBack} />
      <ScrollView style={walletStyles.body} contentContainerStyle={walletStyles.addMoneyBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <AppText style={walletStyles.amountTitle}>{WALLET_COPY.enterAmount}</AppText>
        <View style={walletStyles.amountField}>
          <Image source={IMAGES.walletAmountCurrency} style={walletStyles.amountCurrency} resizeMode="contain" accessible={false} />
          <TextInput accessibilityLabel={WALLET_COPY.enterAmount} value={amount} onChangeText={(value) => { if (/^\d*(?:\.\d{0,2})?$/.test(value)) setAmount(value); }} keyboardType="decimal-pad" inputMode="decimal" style={walletStyles.amountInput} />
        </View>
        <AppText style={walletStyles.paymentMethod}>{WALLET_COPY.selectPaymentMethod}</AppText>
      </ScrollView>
      <Pressable style={walletStyles.proceed} onPress={() => { if (canProceed) onProceed?.(amountPaise); }} disabled={!canProceed} accessibilityRole="button" accessibilityState={{ disabled: !canProceed }}>
        <AppText style={walletStyles.proceedText}>{WALLET_COPY.proceed}</AppText>
      </Pressable>
    </View>
  </View>;
}

interface WalletTransaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  credited: boolean;
}

interface WalletViewProps {
  initialTab?: 'history' | 'how-to-use';
  usageImage?: ImageSourcePropType;
  balance?: string;
  transactions?: readonly WalletTransaction[];
  onBack?: () => void;
  onAddMoney?: () => void;
  onHowToUse?: () => void;
}

export function WalletView({ balance = WALLET_DATA.balance, transactions = WALLET_DATA.transactions, initialTab = 'history', usageImage = IMAGES.walletUsageIllustration, onBack, onAddMoney, onHowToUse }: WalletViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width, WALLET_LAYOUT.width) / WALLET_LAYOUT.width;
  return (
    <View style={[walletStyles.wrapper, { width: WALLET_LAYOUT.width * scale }]}>
    <View style={[walletStyles.screen, { height: height / scale, transform: [{ scale }] }]}>
      <WalletHeader title={WALLET_COPY.title} onBack={onBack} />
      <ScrollView style={walletStyles.body} contentContainerStyle={walletStyles.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={walletStyles.balanceCard}>
          <Image source={IMAGES.walletIllustration} style={walletStyles.illustration} resizeMode="contain" accessible={false} />
          <View style={walletStyles.balanceDetails}>
            <AppText style={walletStyles.balanceTitle}>{WALLET_COPY.title}</AppText>
            <AppText style={walletStyles.balance}>{balance}</AppText>
          </View>
          <Pressable style={walletStyles.addMoney} onPress={onAddMoney} disabled={!onAddMoney} accessibilityRole="button" accessibilityState={{ disabled: !onAddMoney }}>
            <AppText style={walletStyles.addMoneyText}>{WALLET_COPY.addMoney}</AppText>
          </Pressable>
        </View>
        <View style={walletStyles.tabs} accessibilityRole="tablist">
          <Pressable style={walletStyles.historyTab} onPress={() => setActiveTab('history')} accessibilityRole="tab" accessibilityState={{ selected: activeTab === 'history' }}>
            <AppText style={walletStyles.historyText}>{WALLET_COPY.history}</AppText>
            {activeTab === 'history' && <View style={walletStyles.tabIndicator} />}
          </Pressable>
          <Pressable style={walletStyles.howToUseTab} onPress={() => { setActiveTab('how-to-use'); onHowToUse?.(); }} accessibilityRole="tab" accessibilityState={{ selected: activeTab === 'how-to-use' }}>
            <AppText style={walletStyles.howToUseText}>{WALLET_COPY.howToUse}</AppText>
            {activeTab === 'how-to-use' && <View style={walletStyles.tabIndicator} />}
          </Pressable>
        </View>
        {activeTab === 'history' ? <View style={walletStyles.transactions}>
          {transactions.map((transaction) => <WalletTransactionRow key={transaction.id} transaction={transaction} />)}
        </View> : <View>
          <View style={walletStyles.usageImage}>
            {usageImage && <Image source={usageImage} style={walletStyles.usageImageContent} resizeMode="contain" accessible={false} />}
          </View>
          <AppText accessibilityRole="header" style={walletStyles.usageTitle}>{WALLET_COPY.usageTitle}</AppText>
          <AppText style={walletStyles.usageDescription}>{WALLET_COPY.usageDescription}</AppText>
          <Pressable style={walletStyles.gotIt} onPress={() => setActiveTab('history')} accessibilityRole="button">
            <AppText style={walletStyles.gotItText}>{WALLET_COPY.gotIt}</AppText>
          </Pressable>
        </View>}
      </ScrollView>
    </View>
    </View>
  );
}

function WalletTransactionRow({ transaction }: { transaction: WalletTransaction }) {
  return (
    <View style={walletStyles.transaction}>
      <View style={walletStyles.transactionCircle}>
        <Image source={IMAGES.walletTransactionCircle} style={walletStyles.circleImage} resizeMode="contain" accessible={false} />
        <Image source={transaction.credited ? IMAGES.walletCreditArrow : IMAGES.walletDebitArrow} style={walletStyles.arrow} resizeMode="contain" accessible={false} />
      </View>
      <View style={walletStyles.transactionDetails}>
        <AppText style={walletStyles.transactionTitle}>{transaction.title}</AppText>
        <AppText style={walletStyles.transactionDate}>{transaction.date}</AppText>
      </View>
      <View style={walletStyles.transactionAmount}>
        <AppText style={[walletStyles.currency, transaction.credited && walletStyles.creditText]}>{CURRENCY.SYMBOL}</AppText>
        <AppText style={[walletStyles.amount, transaction.credited && walletStyles.creditText]}>{transaction.amount}</AppText>
      </View>
      <View style={walletStyles.transactionBorder} accessible={false}>
        {Array.from({ length: Math.ceil((WALLET_LAYOUT.width - WALLET_LAYOUT.horizontalPadding * 2) / (WALLET_LAYOUT.transactionDash + WALLET_LAYOUT.transactionDashGap)) }, (_, index) => <View key={index} style={walletStyles.transactionDash} />)}
      </View>
    </View>
  );
}

const walletStyles = StyleSheet.create({
  addMoneyBody: { paddingHorizontal: WALLET_LAYOUT.horizontalPadding, paddingTop: WALLET_LAYOUT.amountTitleTopGap },
  amountTitle: { ...WALLET_TYPOGRAPHY.amountTitle, color: COLORS.text.black },
  amountField: { height: WALLET_LAYOUT.amountFieldHeight, marginTop: WALLET_LAYOUT.amountFieldGap, borderRadius: WALLET_LAYOUT.amountFieldRadius, borderWidth: UI.borderWidth, borderColor: COLORS.walletSurface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: WALLET_LAYOUT.amountFieldPadding },
  amountCurrency: { width: WALLET_LAYOUT.amountCurrencySize, height: WALLET_LAYOUT.amountCurrencySize },
  amountInput: { ...WALLET_TYPOGRAPHY.amountInput, color: COLORS.purple, flex: 1, minWidth: UI.zeroInset, marginLeft: WALLET_LAYOUT.amountCurrencyGap, padding: UI.zeroInset, borderWidth: UI.zeroInset, outlineWidth: UI.zeroInset, outlineStyle: 'solid', outlineColor: COLORS.surface },
  paymentMethod: { ...WALLET_TYPOGRAPHY.paymentMethod, color: COLORS.text.black, marginTop: WALLET_LAYOUT.paymentMethodTopGap },
  proceed: { height: WALLET_LAYOUT.proceedHeight, marginHorizontal: WALLET_LAYOUT.horizontalPadding, marginBottom: WALLET_LAYOUT.proceedBottomPadding, borderRadius: WALLET_LAYOUT.proceedRadius, backgroundColor: COLORS.purple, boxShadow: WALLET_LAYOUT.proceedShadow, alignItems: 'center', justifyContent: 'center' },
  proceedText: { ...WALLET_TYPOGRAPHY.proceed, color: COLORS.text.inverse },
  usageImage: { width: WALLET_LAYOUT.usageImageWidth, height: WALLET_LAYOUT.usageImageHeight, marginLeft: WALLET_LAYOUT.usageImageLeft, marginTop: WALLET_LAYOUT.usageImageTopGap },
  usageImageContent: { width: '100%', height: '100%' },
  usageTitle: { ...WALLET_TYPOGRAPHY.howToUseTitle, color: COLORS.purple, textAlign: 'center', width: WALLET_LAYOUT.usageTitleWidth, marginLeft: WALLET_LAYOUT.usageTitleLeft, marginTop: WALLET_LAYOUT.usageTitleGap },
  usageDescription: { ...WALLET_TYPOGRAPHY.howToUseDescription, color: COLORS.text.dark, textAlign: 'center', width: WALLET_LAYOUT.usageDescriptionWidth, minHeight: WALLET_LAYOUT.usageDescriptionHeight, marginLeft: WALLET_LAYOUT.usageDescriptionLeft, marginTop: WALLET_LAYOUT.usageDescriptionGap },
  gotIt: { height: WALLET_LAYOUT.gotItHeight, marginHorizontal: WALLET_LAYOUT.horizontalPadding, marginTop: WALLET_LAYOUT.gotItGap, borderRadius: WALLET_LAYOUT.gotItRadius, backgroundColor: COLORS.purple, boxShadow: UI.headerShadow, alignItems: 'center', justifyContent: 'center' },
  gotItText: { ...WALLET_TYPOGRAPHY.gotIt, color: COLORS.text.inverse },
  wrapper: { flex: 1, alignSelf: 'center', backgroundColor: COLORS.surface },
  screen: { position: 'absolute', width: WALLET_LAYOUT.width, transformOrigin: 'top left', backgroundColor: COLORS.surface },
  header: { height: WALLET_LAYOUT.headerHeight, backgroundColor: COLORS.walletSurface, borderBottomLeftRadius: WALLET_LAYOUT.headerRadius, borderBottomRightRadius: WALLET_LAYOUT.headerRadius, boxShadow: WALLET_LAYOUT.headerShadow, zIndex: 1 },
  back: { position: 'absolute', left: WALLET_LAYOUT.horizontalPadding, top: WALLET_LAYOUT.headerTitleTop },
  headerTitle: { ...WALLET_TYPOGRAPHY.header, color: COLORS.text.black, textAlign: 'center', marginTop: WALLET_LAYOUT.headerTitleTop },
  body: { flex: 1 },
  bodyContent: { paddingTop: WALLET_LAYOUT.balanceTop, paddingBottom: WALLET_LAYOUT.bottomPadding },
  balanceCard: { height: WALLET_LAYOUT.balanceHeight, marginHorizontal: WALLET_LAYOUT.horizontalPadding, borderRadius: WALLET_LAYOUT.balanceRadius, backgroundColor: COLORS.walletSurface },
  illustration: { position: 'absolute', left: WALLET_LAYOUT.illustrationLeft, top: (WALLET_LAYOUT.balanceHeight - WALLET_LAYOUT.illustrationHeight) / 2, width: WALLET_LAYOUT.illustrationWidth, height: WALLET_LAYOUT.illustrationHeight },
  balanceDetails: { position: 'absolute', left: WALLET_LAYOUT.balanceTextLeft, top: WALLET_LAYOUT.balanceTextTop, gap: WALLET_LAYOUT.balanceTextGap },
  balanceTitle: { ...WALLET_TYPOGRAPHY.balanceTitle, color: COLORS.text.black },
  balance: { ...WALLET_TYPOGRAPHY.balance, color: COLORS.purple },
  addMoney: { position: 'absolute', right: WALLET_LAYOUT.addMoneyRight, top: WALLET_LAYOUT.addMoneyTop, width: WALLET_LAYOUT.addMoneyWidth, height: WALLET_LAYOUT.addMoneyHeight, borderRadius: WALLET_LAYOUT.addMoneyRadius, padding: WALLET_LAYOUT.addMoneyPadding, backgroundColor: COLORS.purple, alignItems: 'center', justifyContent: 'center' },
  addMoneyText: { ...WALLET_TYPOGRAPHY.addMoney, color: COLORS.text.inverse },
  tabs: { flexDirection: 'row', marginTop: WALLET_LAYOUT.tabsTopGap, height: WALLET_LAYOUT.tabsHeight },
  historyTab: { width: WALLET_LAYOUT.historyTabWidth, alignItems: 'center' },
  historyText: { ...WALLET_TYPOGRAPHY.tab, color: COLORS.text.black, width: WALLET_LAYOUT.historyTextWidth, marginLeft: WALLET_LAYOUT.historyTextOffset, textAlign: 'center' },
  howToUseTab: { flex: 1, alignItems: 'center' },
  howToUseText: { ...WALLET_TYPOGRAPHY.tab, color: COLORS.text.black, width: WALLET_LAYOUT.howToUseTextWidth, marginRight: WALLET_LAYOUT.howToUseTextOffset, textAlign: 'center' },
  tabIndicator: { position: 'absolute', left: UI.zeroInset, right: UI.zeroInset, bottom: UI.zeroInset, height: WALLET_LAYOUT.tabIndicator, backgroundColor: COLORS.purple },
  transactions: { marginTop: WALLET_LAYOUT.transactionTopGap, marginHorizontal: WALLET_LAYOUT.horizontalPadding },
  transaction: { height: WALLET_LAYOUT.transactionHeight, borderRadius: WALLET_LAYOUT.transactionRadius, backgroundColor: COLORS.walletSurface, overflow: 'hidden', paddingHorizontal: WALLET_LAYOUT.transactionPadding, flexDirection: 'row', alignItems: 'center' },
  transactionBorder: { position: 'absolute', left: UI.zeroInset, right: UI.zeroInset, bottom: UI.zeroInset, height: WALLET_LAYOUT.transactionBorder, flexDirection: 'row', gap: WALLET_LAYOUT.transactionDashGap },
  transactionDash: { width: WALLET_LAYOUT.transactionDash, height: WALLET_LAYOUT.transactionBorder, backgroundColor: COLORS.purple, flexShrink: 0 },
  transactionCircle: { width: WALLET_LAYOUT.circleSize, height: WALLET_LAYOUT.circleSize, alignItems: 'center', justifyContent: 'center' },
  circleImage: { position: 'absolute', width: WALLET_LAYOUT.circleSize, height: WALLET_LAYOUT.circleSize },
  arrow: { width: WALLET_LAYOUT.arrowSize, height: WALLET_LAYOUT.arrowSize },
  transactionDetails: { flex: 1, marginLeft: WALLET_LAYOUT.transactionTextGap, gap: WALLET_LAYOUT.transactionDateGap },
  transactionTitle: { ...WALLET_TYPOGRAPHY.transactionTitle, color: COLORS.text.black },
  transactionDate: { ...WALLET_TYPOGRAPHY.transactionDate, color: COLORS.walletDate },
  transactionAmount: { flexDirection: 'row', alignItems: 'center', gap: WALLET_LAYOUT.amountGap },
  currency: { ...WALLET_TYPOGRAPHY.currency, color: COLORS.text.black },
  amount: { ...WALLET_TYPOGRAPHY.transactionAmount, color: COLORS.text.black },
  creditText: { color: COLORS.walletCredit },
});

interface PaymentOption {
  id: string;
  label: string;
  discountPaise: number;
  offer?: string;
}

interface PaymentSuccessViewProps {
  order?: { name: string; price: string; unit: string; location: string };
  productImage?: ImageSourcePropType;
  onViewOrders?: () => void;
  onHome?: () => void;
  onOrderOptions?: () => void;
}

export function PaymentSuccessView({ order = PAYMENT_SUCCESS_ORDER, productImage = IMAGES.confirmedProductImage, onViewOrders, onHome, onOrderOptions }: PaymentSuccessViewProps) {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width, PAYMENT_SUCCESS_LAYOUT.screenWidth) / PAYMENT_SUCCESS_LAYOUT.screenWidth;
  const contentHeight = Math.max(PAYMENT_SUCCESS_LAYOUT.minimumContentHeight, Math.min(PAYMENT_SUCCESS_LAYOUT.screenHeight, height / scale));
  return (
    <ScrollView style={successStyles.screen} contentContainerStyle={successStyles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ width: PAYMENT_SUCCESS_LAYOUT.screenWidth * scale, height: contentHeight * scale }}>
      <View style={[successStyles.content, { height: contentHeight, transform: [{ scale }] }]}>
        <View style={successStyles.check}>
          <Image source={IMAGES.paymentSuccessCheck} style={successStyles.checkImage} resizeMode="contain" accessible={false} />
        </View>
        <AppText accessibilityRole="header" style={successStyles.title}>{PAYMENT_SUCCESS_COPY.title}</AppText>
        <AppText style={successStyles.description}>{PAYMENT_SUCCESS_COPY.description}</AppText>
        <View style={successStyles.order}>
          <Image source={productImage} style={successStyles.productImage} resizeMode="contain" accessibilityLabel={order.name} />
          <View style={successStyles.details}>
            <AppText style={successStyles.productName}>{order.name}</AppText>
            <AppText style={successStyles.price}>{CURRENCY.SYMBOL}{order.price}<AppText style={successStyles.unit}>{order.unit}</AppText></AppText>
            <View style={successStyles.location}>
              <AppIcon name="location" size="md" color={COLORS.text.black} />
              <AppText style={successStyles.locationText}>{order.location}</AppText>
            </View>
          </View>
          <Pressable onPress={onOrderOptions} disabled={!onOrderOptions} accessibilityRole="button" accessibilityLabel={PAYMENT_SUCCESS_COPY.orderOptions} accessibilityState={{ disabled: !onOrderOptions }} hitSlop={UI.hitSlop} style={successStyles.menu}>
            <Image source={IMAGES.reviewMenu} style={successStyles.menuImage} resizeMode="contain" accessible={false} />
          </Pressable>
        </View>
        <View style={successStyles.spacer} />
        <View style={successStyles.actions}>
          <Pressable onPress={onViewOrders} disabled={!onViewOrders} accessibilityRole="button" accessibilityState={{ disabled: !onViewOrders }} style={successStyles.button}>
            <AppText style={successStyles.buttonText}>{PAYMENT_SUCCESS_COPY.viewOrders}</AppText>
          </Pressable>
          <Pressable onPress={onHome} disabled={!onHome} accessibilityRole="button" accessibilityState={{ disabled: !onHome }} style={successStyles.button}>
            <AppText style={successStyles.buttonText}>{PAYMENT_SUCCESS_COPY.home}</AppText>
          </Pressable>
        </View>
      </View>
      </View>
    </ScrollView>
  );
}

const successStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  content: { position: 'absolute', width: PAYMENT_SUCCESS_LAYOUT.screenWidth, height: PAYMENT_SUCCESS_LAYOUT.screenHeight, transformOrigin: 'top left', paddingTop: PAYMENT_SUCCESS_LAYOUT.topPadding, paddingHorizontal: PAYMENT_SUCCESS_LAYOUT.horizontalPadding, paddingBottom: PAYMENT_SUCCESS_LAYOUT.bottomPadding, alignItems: 'center' },
  check: { width: PAYMENT_SUCCESS_LAYOUT.checkSize, height: PAYMENT_SUCCESS_LAYOUT.checkSize },
  checkImage: { position: 'absolute', width: PAYMENT_SUCCESS_LAYOUT.checkImageSize, height: PAYMENT_SUCCESS_LAYOUT.checkImageSize, top: PAYMENT_SUCCESS_LAYOUT.checkImageTopOffset, left: PAYMENT_SUCCESS_LAYOUT.checkImageOffset },
  title: { ...PAYMENT_SUCCESS_TYPOGRAPHY.title, color: COLORS.text.black, textAlign: 'center', marginTop: PAYMENT_SUCCESS_LAYOUT.titleGap },
  description: { ...PAYMENT_SUCCESS_TYPOGRAPHY.body, color: COLORS.text.black, textAlign: 'center', width: PAYMENT_SUCCESS_LAYOUT.descriptionWidth, maxWidth: '100%', marginTop: PAYMENT_SUCCESS_LAYOUT.descriptionGap },
  order: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', marginTop: PAYMENT_SUCCESS_LAYOUT.orderGap },
  productImage: { width: PAYMENT_SUCCESS_LAYOUT.productImageWidth, height: PAYMENT_SUCCESS_LAYOUT.productImageHeight, borderRadius: PAYMENT_SUCCESS_LAYOUT.productImageRadius },
  details: { flex: 1, marginLeft: PAYMENT_SUCCESS_LAYOUT.productGap, paddingTop: PAYMENT_SUCCESS_LAYOUT.productDetailsTop },
  productName: { ...PAYMENT_SUCCESS_TYPOGRAPHY.body, color: COLORS.text.black, width: PAYMENT_SUCCESS_LAYOUT.productNameWidth, textAlign: 'center' },
  price: { ...PAYMENT_SUCCESS_TYPOGRAPHY.price, color: COLORS.text.black, marginTop: PAYMENT_SUCCESS_LAYOUT.priceGap },
  unit: { ...PAYMENT_SUCCESS_TYPOGRAPHY.unit, color: COLORS.confirmedUnit },
  location: { flexDirection: 'row', alignItems: 'center', marginLeft: -PAYMENT_SUCCESS_LAYOUT.locationTextGap, marginTop: PAYMENT_SUCCESS_LAYOUT.locationGap },
  locationText: { ...PAYMENT_SUCCESS_TYPOGRAPHY.location, color: COLORS.text.black, marginLeft: PAYMENT_SUCCESS_LAYOUT.locationTextGap },
  menu: { marginTop: PAYMENT_SUCCESS_LAYOUT.productDetailsTop },
  menuImage: { width: PAYMENT_SUCCESS_LAYOUT.menuSize, height: PAYMENT_SUCCESS_LAYOUT.menuSize },
  spacer: { flex: 1 },
  actions: { width: '100%', gap: PAYMENT_SUCCESS_LAYOUT.buttonGap },
  button: { height: PAYMENT_SUCCESS_LAYOUT.buttonHeight, borderRadius: PAYMENT_SUCCESS_LAYOUT.buttonRadius, backgroundColor: COLORS.purple, paddingVertical: PAYMENT_SUCCESS_LAYOUT.buttonPaddingVertical, paddingHorizontal: PAYMENT_SUCCESS_LAYOUT.buttonPaddingHorizontal, alignItems: 'center', justifyContent: 'center' },
  buttonText: { ...PAYMENT_SUCCESS_TYPOGRAPHY.button, color: COLORS.text.inverse },
});

interface PaymentViewProps {
  totalPaise: number;
  onBack: () => void;
  options?: readonly PaymentOption[];
  onPlaceOrder?: (option: PaymentOption, totalPaise: number) => void;
}

export function PaymentView({ totalPaise, onBack, options = PAYMENT_OPTIONS, onPlaceOrder }: PaymentViewProps) {
  const [selectedId, setSelectedId] = useState<string>();
  const selectedOption = options.find((option) => option.id === selectedId);
  const payablePaise = Math.max(0, totalPaise - (selectedOption?.discountPaise ?? 0));

  return (
    <View style={styles.screen}>
      <View style={[styles.header, paymentStyles.header]}>
        <Pressable onPress={onBack} hitSlop={UI.hitSlop} accessibilityRole="button" accessibilityLabel={CART_COPY.back}>
          <AppIcon name="back" size="md" color={COLORS.text.black} />
        </Pressable>
        <AppText style={paymentStyles.headerTitle}>{PAYMENT_COPY.title}</AppText>
        <View style={paymentStyles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={paymentStyles.content} showsVerticalScrollIndicator={false}>
        <AppText style={paymentStyles.sectionTitle}>{PAYMENT_COPY.selectMethod}</AppText>
        <View accessibilityRole="radiogroup" accessibilityLabel={PAYMENT_COPY.selectMethod} style={paymentStyles.options}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setSelectedId(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedId === option.id }}
              accessibilityLabel={`${option.label}, ${formatPaise(Math.max(0, totalPaise - option.discountPaise))}${option.offer ? `, ${option.offer}` : ''}`}
              style={paymentStyles.option}
            >
              <View style={[paymentStyles.optionRow, option.offer && paymentStyles.offerOptionRow]}>
                <AppText style={paymentStyles.price}>{formatPaise(Math.max(0, totalPaise - option.discountPaise))}</AppText>
                <View style={paymentStyles.divider} />
                <AppText style={paymentStyles.method}>{option.label}</AppText>
                <View style={paymentStyles.radio}>
                  {selectedId === option.id && <View style={paymentStyles.radioDot} />}
                </View>
              </View>
              {option.offer && <View style={paymentStyles.offer}><AppText style={paymentStyles.offerText}>{option.offer}</AppText></View>}
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <CartBottomBar
        totalPaise={payablePaise}
        actionWidth={SIZES.placeOrderButtonWidth}
        actionTopMargin={CART_LAYOUT.paymentActionTopMargin}
        rightPadding={CART_LAYOUT.sectionPadding}
        copy={{ ...CART_COPY, continue: PAYMENT_COPY.placeOrder, checkout: PAYMENT_COPY.placeOrder }}
        disabled={!selectedOption}
        onContinue={selectedOption && onPlaceOrder ? () => onPlaceOrder(selectedOption, payablePaise) : undefined}
      />
    </View>
  );
}

const paymentStyles = StyleSheet.create({
  header: { justifyContent: 'space-between' },
  headerTitle: { ...CART_TYPOGRAPHY.title, color: COLORS.text.black },
  headerSpacer: { width: SIZES.cartHeaderIconSize },
  content: { paddingHorizontal: CART_LAYOUT.sectionPadding, paddingTop: CART_LAYOUT.paymentContentTop },
  sectionTitle: { ...CART_TYPOGRAPHY.sectionTitle, color: COLORS.text.black, marginBottom: CART_LAYOUT.paymentTitleGap },
  options: { gap: CART_LAYOUT.paymentOptionGap },
  option: { borderWidth: UI.borderWidth, borderColor: COLORS.purple, borderRadius: RADIUS.md, overflow: 'hidden', backgroundColor: COLORS.surface },
  optionRow: { height: SIZES.paymentOptionHeight - UI.borderWidth * 2, paddingHorizontal: SPACING.md, flexDirection: 'row', alignItems: 'center' },
  offerOptionRow: { height: SIZES.paymentOfferOptionRowHeight },
  price: { ...CART_TYPOGRAPHY.paymentMethod, color: COLORS.text.black, width: SIZES.paymentPriceWidth },
  divider: { height: SIZES.paymentDividerHeight, borderLeftWidth: UI.borderWidth, borderLeftColor: COLORS.cardBorder, borderStyle: 'dashed' },
  method: { ...CART_TYPOGRAPHY.paymentMethod, color: COLORS.text.black, flex: 1, marginLeft: CART_LAYOUT.paymentMethodGap },
  radio: { width: SIZES.paymentRadioSize, height: SIZES.paymentRadioSize, borderWidth: UI.borderWidth, borderColor: COLORS.purple, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: SIZES.paymentRadioDotSize, height: SIZES.paymentRadioDotSize, borderRadius: RADIUS.full, backgroundColor: COLORS.purple },
  offer: { height: SIZES.paymentOfferHeight, backgroundColor: COLORS.paymentOffer, alignItems: 'center', justifyContent: 'center' },
  offerText: { ...CART_TYPOGRAPHY.paymentOffer, color: COLORS.stepperGreen },
});

export function CartView({
  items,
  priceSummary,
  addItem,
  removeItem,
  deleteItem,
  config = CART_CONFIG,
  address,
  recommendations = [],
  copy = CART_COPY,
  onBack,
  onSearch,
  onWishlist,
  onAddressChange,
  onApplyCoupon,
  onViewMoreRecommendations,
  onContinue,
  onProductPress,
  appliedCoupon,
}: CartViewProps) {
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          accessibilityState={{ disabled: !onBack }}
          hitSlop={UI.hitSlop}
          accessibilityRole="button"
          accessibilityLabel={copy.back}
        >
          <AppIcon name="back" size="md" color={COLORS.text.black} />
        </Pressable>
        <AppText style={styles.headerTitle}>{copy.title}</AppText>
      </View>

      <View style={styles.headerRight}>
        <Pressable onPress={onSearch} disabled={!onSearch} accessibilityState={{ disabled: !onSearch }} hitSlop={UI.hitSlop} accessibilityRole="button" accessibilityLabel={copy.search}>
          <Image source={IMAGES.headerSearch} style={styles.headerIcon} resizeMode="contain" accessible={false} />
        </Pressable>
        <Pressable onPress={onWishlist} disabled={!onWishlist} accessibilityState={{ disabled: !onWishlist }} hitSlop={UI.hitSlop} accessibilityRole="button" accessibilityLabel={copy.wishlist}>
          <Image source={IMAGES.headerHeart} style={styles.headerIcon} resizeMode="contain" accessible={false} />
        </Pressable>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.screen}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <AppIcon name="cart" size="lg" color={COLORS.text.muted} />
          <AppText
            variant="subheading"
            color={COLORS.text.secondary}
            style={styles.emptyText}
          >
            {copy.emptyTitle}
          </AppText>
          <AppText variant="caption" color={COLORS.text.muted}>
            {copy.emptyDescription}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {address && (
          <AddressBar address={address} onChangePress={onAddressChange} copy={copy} />
        )}

        {items.map((item) => (
          <CartItemCard
            key={item.product.id}
            item={item}
            minQuantity={config.MIN_QUANTITY_PER_ITEM}
            maxQuantity={config.MAX_QUANTITY_PER_ITEM}
            copy={copy}
            onIncrement={() => addItem(item.product)}
            onDecrement={() => removeItem(item.product.id)}
            onDelete={() => deleteItem(item.product.id)}
          />
        ))}

        <CouponBanner onPress={onApplyCoupon} appliedCoupon={appliedCoupon} copy={copy} />

        <RecommendationCarousel
          title={copy.recommendations}
          products={recommendations}
          onViewMore={onViewMoreRecommendations}
          copy={copy}
          onAddToCart={addItem}
          onProductPress={onProductPress}
        />

        <PriceBreakdown summary={priceSummary} copy={copy} />

      </ScrollView>

      <CartBottomBar
        totalPaise={priceSummary.orderTotalPaise}
        onContinue={onContinue}
        copy={copy}
        disabled={items.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: SIZES.cartHeaderHeight,
    paddingTop: CART_LAYOUT.headerTopInset,
    paddingBottom: CART_LAYOUT.headerBottomInset,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: UI.headerShadow,
    elevation: UI.elevation,
    zIndex: UI.elevation,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_LAYOUT.headerTitleGap,
  },

  headerTitle: {
    ...CART_TYPOGRAPHY.title,
    marginTop: CART_LAYOUT.headerTitleTopMargin,
    color: COLORS.text.black,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_LAYOUT.headerActionGap,
  },
  headerIcon: {
    width: SIZES.cartHeaderIconSize,
    height: SIZES.cartHeaderIconSize,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: CART_LAYOUT.footerWhitespace,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xxxl,
  },

  emptyText: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

});
