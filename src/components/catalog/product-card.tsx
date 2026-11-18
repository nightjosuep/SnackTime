import { Pressable, StyleSheet, View } from 'react-native';

import { FontFamilies } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/utils/format-currency';
import { ThemedText } from '@/components/themed-text';
import type { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
  onAdd: () => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.illustration, { backgroundColor: product.color }]}>
        <ThemedText style={styles.emoji} accessibilityLabel={product.name}>
          {product.emoji}
        </ThemedText>
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
      <View style={styles.footer}>
        <ThemedText type="smallBold">{formatCurrency(product.price)}</ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Agregar ${product.name} al carrito`}
          onPress={onAdd}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <ThemedText style={styles.addButtonText}>+</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    borderRadius: 22,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  illustration: {
    height: 112,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  pressed: {
    opacity: 0.75,
  },
});
