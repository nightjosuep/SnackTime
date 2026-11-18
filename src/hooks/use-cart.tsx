import { createContext, useContext, useMemo, useState, useCallback, type PropsWithChildren } from 'react';

import type { Product } from '@/types/product';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type SavedOrder = {
  id: string;
  orderNumber: number;
  date: string;
  items: CartItem[];
  total: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  // Favoritos
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  // Combos
  addMultipleToCart: (products: Product[], comboName?: string) => void;
  // Historial de pedidos
  orderHistory: SavedOrder[];
  saveOrderToHistory: (order: SavedOrder) => void;
  repeatOrder: (savedItems: CartItem[]) => void;
  // Notificaciones Toast
  toastMessage: string | null;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<SavedOrder[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...currentItems, { product, quantity: 1 }];
    });
    triggerToast(`¡${product.name} agregado al carrito!`);
  }, [triggerToast]);

  const addMultipleToCart = useCallback((products: Product[], comboName?: string) => {
    setItems((currentItems) => {
      const newItems = [...currentItems];
      for (const prod of products) {
        const index = newItems.findIndex((item) => item.product.id === prod.id);
        if (index >= 0) {
          newItems[index] = {
            ...newItems[index],
            quantity: newItems[index].quantity + 1,
          };
        } else {
          newItems.push({ product: prod, quantity: 1 });
        }
      }
      return newItems;
    });
    triggerToast(comboName ? `¡${comboName} agregado al carrito!` : '¡Productos agregados al carrito!');
  }, [triggerToast]);

  const decreaseQuantity = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.product.id !== productId) return [item];
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      }),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const found = items.find((item) => item.product.id === productId);
      return found ? found.quantity : 0;
    },
    [items],
  );

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  const saveOrderToHistory = useCallback((order: SavedOrder) => {
    setOrderHistory((prev) => [order, ...prev.slice(0, 9)]);
  }, []);

  const repeatOrder = useCallback((savedItems: CartItem[]) => {
    setItems(savedItems);
    triggerToast('¡Pedido repetido y cargado al carrito!');
  }, [triggerToast]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      items,
      itemCount,
      total,
      addToCart,
      addMultipleToCart,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      getItemQuantity,
      favorites,
      toggleFavorite,
      isFavorite,
      orderHistory,
      saveOrderToHistory,
      repeatOrder,
      toastMessage,
      dismissToast,
    };
  }, [
    items,
    addToCart,
    addMultipleToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    favorites,
    toggleFavorite,
    isFavorite,
    orderHistory,
    saveOrderToHistory,
    repeatOrder,
    toastMessage,
    dismissToast,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider.');
  }
  return context;
}
