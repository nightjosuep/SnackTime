import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamilies } from '@/constants/theme';
import { useCart } from '@/hooks/use-cart';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format-currency';

type ProductCardProps = {
  product: Product;
  cardWidth: string;
  onAdd: () => void;
  onPress?: () => void;
};

export function ProductCard({ product, cardWidth, onAdd, onPress }: ProductCardProps) {
  const theme = useTheme();
  const { isFavorite, toggleFavorite, getItemQuantity, decreaseQuantity } = useCart();
  const favorite = isFavorite(product.id);
  const quantity = getItemQuantity(product.id);

  return (
    <View style={[styles.card, { width: cardWidth, backgroundColor: theme.backgroundElement }]}>
      {/* Tapping the illustration opens the detail modal */}
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressedCardArea}>
        <View style={[styles.illustration, { backgroundColor: product.color }]}>
          <ThemedText style={styles.emoji} accessibilityLabel={product.name}>
            {product.emoji}
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorite ? `Quitar de favoritos` : `Marcar como favorito`}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            hitSlop={8}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && styles.pressed,
            ]}>
            <ThemedText style={styles.favoriteIcon}>
              {favorite ? '❤️' : '🤍'}
            </ThemedText>
          </Pressable>

          {quantity > 0 && (
            <View style={styles.quantityBadge}>
              <ThemedText style={styles.quantityBadgeText}>{quantity}</ThemedText>
            </View>
          )}

          {product.calories ? (
            <View style={styles.caloriesBadge}>
              <ThemedText style={styles.caloriesBadgeText}>{product.calories} kcal</ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.category}>
          {product.category}
        </ThemedText>

        <ThemedText type="smallBold" style={styles.name} numberOfLines={1}>
          {product.name}
        </ThemedText>

        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.description}
          numberOfLines={2}>
          {product.description}
        </ThemedText>
      </Pressable>

      <View style={styles.footer}>
        <ThemedText type="smallBold">{formatCurrency(product.price)}</ThemedText>

        {quantity > 0 ? (
          <View style={styles.stepperContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Quitar uno de ${product.name}`}
              onPress={() => decreaseQuantity(product.id)}
              style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}>
              <ThemedText style={styles.stepperButtonText}>−</ThemedText>
            </Pressable>
            <ThemedText style={styles.stepperQuantity}>{quantity}</ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Agregar uno de ${product.name}`}
              onPress={onAdd}
              style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}>
              <ThemedText style={styles.stepperButtonText}>+</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Agregar ${product.name} al carrito`}
            onPress={onAdd}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <ThemedText style={styles.addButtonText}>+</ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  pressedCardArea: {
    opacity: 0.9,
  },
  illustration: {
    height: 112,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 14,
    lineHeight: 18,
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#3F5915',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  quantityBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  caloriesBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  caloriesBadgeText: {
    color: '#5C6D44',
    fontSize: 9,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 52,
    lineHeight: 62,
  },
  category: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 3,
  },
  name: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: 'normal',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#718D20',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '600',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF1DB',
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperButton: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#718D20',
  },
  stepperButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  stepperQuantity: {
    paddingHorizontal: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#293817',
    fontFamily: FontFamilies.body,
  },
  pressed: {
    opacity: 0.75,
  },
});
