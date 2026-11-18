import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamilies } from '@/constants/theme';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format-currency';

type ProductDetailModalProps = {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
};

export function ProductDetailModal({ product, visible, onClose }: ProductDetailModalProps) {
  const { addToCart, isFavorite, toggleFavorite, getItemQuantity, decreaseQuantity } = useCart();

  if (!product) return null;

  const favorite = isFavorite(product.id);
  const quantity = getItemQuantity(product.id);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Header con botón cerrar y favorito */}
          <View style={styles.topActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Marcar o desmarcar favorito"
              onPress={() => toggleFavorite(product.id)}
              style={styles.actionCircle}>
              <ThemedText style={styles.heartEmoji}>{favorite ? '❤️' : '🤍'}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar detalle"
              onPress={onClose}
              style={styles.actionCircle}>
              <ThemedText style={styles.closeIcon}>✕</ThemedText>
            </Pressable>
          </View>

          {/* Ilustración */}
          <View style={[styles.illustration, { backgroundColor: product.color }]}>
            <ThemedText style={styles.emoji}>{product.emoji}</ThemedText>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Nombre y Precio */}
            <View style={styles.headerInfo}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.category}>
                {product.category}
              </ThemedText>
              <ThemedText style={styles.productName}>{product.name}</ThemedText>
              <ThemedText style={styles.price}>{formatCurrency(product.price)} USD</ThemedText>
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
              {product.description}
            </ThemedText>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {product.tags.map((tag) => (
                  <View key={tag} style={styles.tagBadge}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Calorías */}
            {typeof product.calories === 'number' && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoIcon}>🔥</ThemedText>
                <View>
                  <ThemedText type="smallBold" style={styles.infoTitle}>
                    Aporte calórico
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Aproximadamente {product.calories} kcal
                  </ThemedText>
                </View>
              </View>
            )}

            {/* Ingredientes */}
            {product.ingredients && product.ingredients.length > 0 && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoIcon}>🥗</ThemedText>
                <View style={styles.infoContent}>
                  <ThemedText type="smallBold" style={styles.infoTitle}>
                    Ingredientes del bar
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {product.ingredients.join(', ')}
                  </ThemedText>
                </View>
              </View>
            )}

            {/* Alérgenos */}
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoIcon}>
                {product.allergens && product.allergens.length > 0 ? '⚠️' : '✅'}
              </ThemedText>
              <View style={styles.infoContent}>
                <ThemedText type="smallBold" style={styles.infoTitle}>
                  Información de alérgenos
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {product.allergens && product.allergens.length > 0
                    ? `Contiene: ${product.allergens.join(', ')}`
                    : 'Sin alérgenos comunes reportados'}
                </ThemedText>
              </View>
            </View>
          </ScrollView>

          {/* Footer con controles de compra */}
          <View style={styles.footer}>
            {quantity > 0 ? (
              <View style={styles.stepperContainer}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => decreaseQuantity(product.id)}
                  style={styles.stepperBtn}>
                  <ThemedText style={styles.stepperBtnText}>−</ThemedText>
                </Pressable>
                <ThemedText style={styles.stepperQtyText}>
                  {quantity} en el carrito
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addToCart(product)}
                  style={styles.stepperBtn}>
                  <ThemedText style={styles.stepperBtnText}>+</ThemedText>
                </Pressable>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => addToCart(product)}
                style={({ pressed }) => [styles.addCartBtn, pressed && styles.pressed]}>
                <ThemedText style={styles.addCartBtnText}>
                  🛒 Agregar al carrito ({formatCurrency(product.price)})
                </ThemedText>
              </Pressable>
            )}
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
  dialog: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 380,
    borderRadius: 26,
    overflow: 'hidden',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  topActions: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  heartEmoji: {
    fontSize: 16,
  },
  closeIcon: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
  illustration: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 70,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerInfo: {
    marginBottom: 6,
  },
  category: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: '#283812',
    marginTop: 2,
  },
  price: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: '#4B671B',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tagBadge: {
    backgroundColor: '#EEF4D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#3E5813',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#F0F2E8',
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#233013',
    marginBottom: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ECEFE3',
    backgroundColor: '#FAFDF4',
  },
  addCartBtn: {
    backgroundColor: '#58751D',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: FontFamilies.body,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E7EED0',
    borderRadius: 14,
    padding: 4,
  },
  stepperBtn: {
    backgroundColor: '#58751D',
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stepperQtyText: {
    fontFamily: FontFamilies.body,
    fontWeight: '700',
    fontSize: 14,
    color: '#2A3C12',
  },
  pressed: {
    opacity: 0.8,
  },
});
