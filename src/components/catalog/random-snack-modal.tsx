import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamilies } from '@/constants/theme';
import productsJson from '@/data/products.json';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format-currency';

const allProducts = productsJson as Product[];
const foods = allProducts.filter((p) => p.category === 'Comida');
const drinks = allProducts.filter((p) => p.category === 'Bebidas');

type RandomSnackModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function RandomSnackModal({ visible, onClose }: RandomSnackModalProps) {
  const { addMultipleToCart } = useCart();
  const [selectedFood, setSelectedFood] = useState<Product>(() => foods[0]);
  const [selectedDrink, setSelectedDrink] = useState<Product>(() => drinks[0]);

  const spin = () => {
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
    setSelectedFood(randomFood);
    setSelectedDrink(randomDrink);
  };

  const handleAddToCart = () => {
    addMultipleToCart([selectedFood, selectedDrink], 'Lonchera Sorpresa');
    onClose();
  };

  const total = (selectedFood?.price || 0) + (selectedDrink?.price || 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>🎲 ¿Qué pido hoy?</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Te armamos una combinación aleatoria para el recreo
            </ThemedText>
          </View>

          <View style={styles.itemsContainer}>
            {/* Comida elegida */}
            <View style={[styles.productBox, { backgroundColor: selectedFood.color }]}>
              <ThemedText style={styles.emoji}>{selectedFood.emoji}</ThemedText>
              <ThemedText style={styles.productName} numberOfLines={1}>
                {selectedFood.name}
              </ThemedText>
              <ThemedText type="smallBold" style={styles.productPrice}>
                {formatCurrency(selectedFood.price)}
              </ThemedText>
            </View>

            <ThemedText style={styles.plusSign}>+</ThemedText>

            {/* Bebida elegida */}
            <View style={[styles.productBox, { backgroundColor: selectedDrink.color }]}>
              <ThemedText style={styles.emoji}>{selectedDrink.emoji}</ThemedText>
              <ThemedText style={styles.productName} numberOfLines={1}>
                {selectedDrink.name}
              </ThemedText>
              <ThemedText type="smallBold" style={styles.productPrice}>
                {formatCurrency(selectedDrink.price)}
              </ThemedText>
            </View>
          </View>

          {/* Resumen */}
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total de esta lonchera:</ThemedText>
            <ThemedText style={styles.totalAmount}>{formatCurrency(total)} USD</ThemedText>
          </View>

          {/* Botones */}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={spin}
              style={({ pressed }) => [styles.spinButton, pressed && styles.pressed]}>
              <ThemedText style={styles.spinButtonText}>🎲 Probar otra opción</ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleAddToCart}
              style={({ pressed }) => [styles.acceptButton, pressed && styles.pressed]}>
              <ThemedText style={styles.acceptButtonText}>🛒 ¡Me gusta, pedir!</ThemedText>
            </Pressable>

            <Pressable onPress={onClose} style={styles.cancelButton}>
              <ThemedText type="small" themeColor="textSecondary">
                Cerrar
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 360,
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: '#283812',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
    width: '100%',
  },
  productBox: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 44,
    marginBottom: 4,
  },
  productName: {
    fontFamily: FontFamilies.heading,
    fontSize: 14,
    color: '#24320F',
    textAlign: 'center',
  },
  productPrice: {
    color: '#4B671B',
    fontSize: 14,
    marginTop: 2,
  },
  plusSign: {
    fontSize: 22,
    fontWeight: '700',
    color: '#76875E',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEF2E2',
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 15,
    color: '#475438',
  },
  totalAmount: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: '#4B671B',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  spinButton: {
    backgroundColor: '#EEF4D6',
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
  },
  spinButtonText: {
    color: '#3B5215',
    fontWeight: '700',
    fontFamily: FontFamilies.body,
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: '#58751D',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: FontFamilies.body,
    fontSize: 14,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});
