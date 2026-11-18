import { Pressable, StyleSheet, View } from 'react-native';

import { FontFamilies } from '@/constants/theme';
import type { CartItem as CartItemType } from '@/hooks/use-cart';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/utils/format-currency';
import { ThemedText } from '@/components/themed-text';

type CartItemProps = {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.illustration, { backgroundColor: item.product.color }]}>
        <ThemedText style={styles.emoji}>{item.product.emoji}</ThemedText>
      </View>
      <View style={styles.details}>
        <ThemedText type="smallBold" numberOfLines={1} style={styles.productName}>
          {item.product.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatCurrency(item.product.price)} c/u
        </ThemedText>
        <View style={styles.quantityControls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Quitar una unidad de ${item.product.name}`}
            onPress={onDecrease}
            style={styles.quantityButton}>
            <ThemedText style={styles.quantityButtonText}>−</ThemedText>
          </Pressable>
          <ThemedText type="smallBold" style={styles.quantity}>
            {item.quantity}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Agregar una unidad de ${item.product.name}`}
            onPress={onIncrease}
            style={styles.quantityButton}>
            <ThemedText style={styles.quantityButtonText}>+</ThemedText>
          </Pressable>
        </View>
      </View>
      <View style={styles.priceColumn}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Eliminar ${item.product.name} del carrito`}
          onPress={onRemove}
          hitSlop={8}>
          <ThemedText themeColor="textSecondary" style={styles.removeIcon}>
            ×
          </ThemedText>
        </Pressable>
        <ThemedText type="smallBold">{formatCurrency(item.product.price * item.quantity)}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  illustration: {
    width: 66,
    height: 66,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 34,
    lineHeight: 42,
  },
  details: {
    flex: 1,
  },
  productName: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: 'normal',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#EDF3D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#58751D',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
  },
  quantity: {
    minWidth: 30,
    textAlign: 'center',
  },
  priceColumn: {
    height: 64,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeIcon: {
    fontSize: 24,
    lineHeight: 24,
  },
});
