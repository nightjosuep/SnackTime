import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamilies, Spacing } from '@/constants/theme';
import productsJson from '@/data/products.json';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format-currency';

const allProducts = productsJson as Product[];

export type Combo = {
  id: string;
  name: string;
  badge: string;
  emoji: string;
  productIds: string[];
  bgColor: string;
  tagColor: string;
};

const COMBOS: Combo[] = [
  {
    id: 'combo-clasico',
    name: 'Combo Clásico',
    badge: '⭐ Más pedido',
    emoji: '🥪🥤',
    productIds: ['sandwich', 'juice'],
    bgColor: '#EBF4D2',
    tagColor: '#58751D',
  },
  {
    id: 'combo-economico',
    name: 'Combo Al Paso',
    badge: '🪙 Menos de $4',
    emoji: '🥟💧',
    productIds: ['empanada', 'water'],
    bgColor: '#FDF2D9',
    tagColor: '#966311',
  },
  {
    id: 'combo-dulce',
    name: 'Combo Dulce',
    badge: '🍪 Delicioso',
    emoji: '🧁🥤',
    productIds: ['muffin', 'milkshake'],
    bgColor: '#FCE7F3',
    tagColor: '#9D174D',
  },
  {
    id: 'combo-saludable',
    name: 'Combo Vital',
    badge: '🍓 Saludable',
    emoji: '🍓💧',
    productIds: ['fruit-salad', 'water'],
    bgColor: '#DEF7EC',
    tagColor: '#03543F',
  },
];

export function RecreationCombos() {
  const { addMultipleToCart } = useCart();

  const handleAddCombo = (combo: Combo) => {
    const productsToAdd = combo.productIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (productsToAdd.length > 0) {
      addMultipleToCart(productsToAdd, combo.name);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Combos del Recreo</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Ahorra tiempo eligiendo combinaciones populares
          </ThemedText>
        </View>
        <ThemedText style={styles.fireEmoji}>⚡</ThemedText>
      </View>

      <FlatList
        data={COMBOS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const comboProducts = item.productIds
            .map((id) => allProducts.find((p) => p.id === id))
            .filter((p): p is Product => Boolean(p));

          const comboTotal = comboProducts.reduce((sum, p) => sum + p.price, 0);

          return (
            <View style={[styles.card, { backgroundColor: item.bgColor }]}>
              <View style={styles.topRow}>
                <View style={[styles.badge, { backgroundColor: item.tagColor }]}>
                  <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                </View>
                <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
              </View>

              <ThemedText style={styles.comboName}>{item.name}</ThemedText>
              <ThemedText type="small" style={styles.productsSummary} numberOfLines={2}>
                {comboProducts.map((p) => p.name).join(' + ')}
              </ThemedText>

              <View style={styles.bottomRow}>
                <ThemedText type="smallBold" style={styles.price}>
                  {formatCurrency(comboTotal)}
                </ThemedText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Agregar ${item.name} al carrito`}
                  onPress={() => handleAddCombo(item)}
                  style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                  <ThemedText style={styles.addButtonText}>+ Pedir</ThemedText>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: '#344714',
  },
  fireEmoji: {
    fontSize: 20,
  },
  listContent: {
    paddingRight: Spacing.two,
    gap: 12,
  },
  card: {
    width: 200,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  emoji: {
    fontSize: 22,
  },
  comboName: {
    fontFamily: FontFamilies.heading,
    fontSize: 17,
    color: '#293817',
    marginBottom: 3,
  },
  productsSummary: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    color: '#22380A',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#385012',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
