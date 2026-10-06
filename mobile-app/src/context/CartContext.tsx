import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { CART_CONFIG } from '@/constants/config';
import { type CartConfig, type CartItem, type CartPriceSummary, type Product } from '@/types';
import { computePriceSummary } from '@/utils/price';

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'DELETE_ITEM'; productId: string }
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
}

function cartReducer(
  state: CartState,
  action: CartAction,
  config: CartConfig,
): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id,
      );
      if (!existing) {
        return {
          items: [...state.items, {
            product: action.product,
            quantity: config.MIN_QUANTITY_PER_ITEM,
          }],
        };
      }
      if (existing.quantity >= config.MAX_QUANTITY_PER_ITEM) return state;
      return {
        items: state.items.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    }
    case 'REMOVE_ITEM': {
      const existing = state.items.find(
        (item) => item.product.id === action.productId,
      );
      if (!existing) return state;
      if (existing.quantity <= config.MIN_QUANTITY_PER_ITEM) {
        return {
          items: state.items.filter((item) => item.product.id !== action.productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    }
    case 'DELETE_ITEM':
      return {
        items: state.items.filter((item) => item.product.id !== action.productId),
      };
    case 'SET_QUANTITY': {
      if (!Number.isFinite(action.quantity)) return state;
      const quantity = Math.min(
        Math.max(Math.trunc(action.quantity), config.MIN_QUANTITY_PER_ITEM),
        config.MAX_QUANTITY_PER_ITEM,
      );
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId ? { ...item, quantity } : item,
        ),
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  config: CartConfig;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  priceSummary: CartPriceSummary;
}

interface CartProviderProps {
  children: React.ReactNode;
  initialItems?: readonly CartItem[];
  config?: CartConfig;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const EMPTY_ITEMS: readonly CartItem[] = [];

export function CartProvider({
  children,
  initialItems = EMPTY_ITEMS,
  config = CART_CONFIG,
}: CartProviderProps) {
  const [state, dispatch] = useReducer(
    (current: CartState, action: CartAction) => cartReducer(current, action, config),
    initialItems,
    (items): CartState => ({ items: items.map((item) => ({ ...item })) }),
  );
  const actions = useMemo(() => ({
    addItem: (product: Product) => dispatch({ type: 'ADD_ITEM', product }),
    removeItem: (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId }),
    deleteItem: (productId: string) => dispatch({ type: 'DELETE_ITEM', productId }),
    setQuantity: (productId: string, quantity: number) =>
      dispatch({ type: 'SET_QUANTITY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }), []);
  const value = useMemo<CartContextValue>(() => ({
    ...actions,
    items: state.items,
    config,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    priceSummary: computePriceSummary(state.items, config),
  }), [actions, state.items, config]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
