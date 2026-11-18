import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/catalog/product-card';
import { ProductDetailModal } from '@/components/catalog/product-detail-modal';
import { RandomSnackModal } from '@/components/catalog/random-snack-modal';
import { RecreationCombos } from '@/components/catalog/recreation-combos';
import { ThemedText } from '@/components/themed-text';
import { CartToast } from '@/components/ui/toast';
import { FontFamilies, MaxContentWidth, Spacing } from '@/constants/theme';
import productsJson from '@/data/products.json';
import { useCart } from '@/hooks/use-cart';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format-currency';

const products: Product[] = productsJson;
const sections = [...new Set(products.map((product) => product.category))];

type FilterType = 'all' | 'Comida' | 'Bebidas' | 'under2' | 'favorites';

export default function CatalogScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const { addToCart, itemCount, total, favorites } = useCart();
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Math.max(
    1,
    Math.min(windowWidth, MaxContentWidth) - Spacing.three * 2,
  );
  const productColumns = Math.min(
    4,
    Math.max(1, Math.floor((contentWidth + Spacing.two) / (164 + Spacing.two))),
  );
  const productCardWidth = `${
    ((contentWidth - (productColumns - 1) * Spacing.two) / productColumns / contentWidth) * 100
  }%`;

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      // 1. Filtro por texto
      const matchesText =
        normalizedQuery.length === 0 ||
        `${product.name} ${product.description}`.toLocaleLowerCase().includes(normalizedQuery);
      if (!matchesText) return false;

      // 2. Filtro por chips
      if (activeFilter === 'all') return true;
      if (activeFilter === 'Comida') return product.category === 'Comida';
      if (activeFilter === 'Bebidas') return product.category === 'Bebidas';
      if (activeFilter === 'under2') return product.price <= 2.0;
      if (activeFilter === 'favorites') return favorites.includes(product.id);

      return true;
    });
  }, [query, activeFilter, favorites]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <CartToast />

      {/* Modal de Detalle de Producto */}
      <ProductDetailModal
        product={selectedProduct}
        visible={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Modal de Ruleta / ¿Qué pido hoy? */}
      <RandomSnackModal
        visible={showRandomModal}
        onClose={() => setShowRandomModal(false)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Tu recreo, más fácil
              </ThemedText>
              <ThemedText type="subtitle" style={styles.brand}>
                SnackTime
              </ThemedText>
            </View>
            <View style={styles.scheduleBadge}>
              <ThemedText style={styles.statusDot}>🟢</ThemedText>
              <ThemedText style={styles.scheduleText}>Bar Abierto</ThemedText>
            </View>
          </View>

          {/* Banner de Horario Escolar */}
          <View style={[styles.recessBar, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.recessIcon}>⏰</ThemedText>
            <ThemedText style={styles.recessText}>
              <ThemedText style={styles.recessBold}>Recreos escolares: </ThemedText>
              09:30 - 10:00 y 12:00 - 12:30
            </ThemedText>
          </View>

          {/* Hero Banner */}
          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <ThemedText style={styles.heroEyebrow}>BAR ESCOLAR</ThemedText>
              <ThemedText style={styles.heroTitle}>¿Qué se te antoja hoy?</ThemedText>
              <ThemedText style={styles.heroDescription}>
                Revisa opciones, pide combos o prueba la ruleta si no sabes qué elegir.
              </ThemedText>

              {/* Botón ¿Qué pido hoy? */}
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowRandomModal(true)}
                style={({ pressed }) => [styles.randomButton, pressed && styles.pressed]}>
                <ThemedText style={styles.randomButtonText}>🎲 ¿Qué pido hoy? Sorpréndeme</ThemedText>
              </Pressable>
            </View>
            <ThemedText style={styles.heroEmoji}>🍎</ThemedText>
          </View>

          {/* Search Box */}
          <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.searchIcon}>⌕</ThemedText>
            <TextInput
              accessibilityLabel="Buscar productos"
              onChangeText={setQuery}
              placeholder="Buscar algo rico..."
              placeholderTextColor={theme.textSecondary}
              returnKeyType="search"
              style={[styles.searchInput, { color: theme.text }]}
              value={query}
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => setQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Borrar búsqueda"
                hitSlop={8}
                style={styles.clearSearchButton}>
                <ThemedText style={styles.clearSearchText}>×</ThemedText>
              </Pressable>
            )}
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveFilter('all')}
              style={[
                styles.chip,
                activeFilter === 'all'
                  ? styles.chipActive
                  : { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText
                style={[
                  styles.chipText,
                  activeFilter === 'all' && styles.chipTextActive,
                ]}>
                ✨ Todos
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveFilter('Comida')}
              style={[
                styles.chip,
                activeFilter === 'Comida'
                  ? styles.chipActive
                  : { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText
                style={[
                  styles.chipText,
                  activeFilter === 'Comida' && styles.chipTextActive,
                ]}>
                🥪 Comida
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveFilter('Bebidas')}
              style={[
                styles.chip,
                activeFilter === 'Bebidas'
                  ? styles.chipActive
                  : { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText
                style={[
                  styles.chipText,
                  activeFilter === 'Bebidas' && styles.chipTextActive,
                ]}>
                🥤 Bebidas
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveFilter('under2')}
              style={[
                styles.chip,
                activeFilter === 'under2'
                  ? styles.chipActive
                  : { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText
                style={[
                  styles.chipText,
                  activeFilter === 'under2' && styles.chipTextActive,
                ]}>
                🪙 Hasta $2.00
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveFilter('favorites')}
              style={[
                styles.chip,
                activeFilter === 'favorites'
                  ? styles.chipActive
                  : { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText
                style={[
                  styles.chipText,
                  activeFilter === 'favorites' && styles.chipTextActive,
                ]}>
                ❤️ Favoritos {favorites.length > 0 ? `(${favorites.length})` : ''}
              </ThemedText>
            </Pressable>
          </ScrollView>

          {/* Combos del Recreo (solo en filtro 'all' sin búsqueda) */}
          {activeFilter === 'all' && query.trim().length === 0 && (
            <RecreationCombos />
          )}

          {/* Lista de Productos */}
          {filteredProducts.length > 0 ? (
            sections.map((section) => {
              const sectionProducts = filteredProducts.filter((product) => product.category === section);
              if (sectionProducts.length === 0) return null;

              return (
                <View key={section} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <ThemedText type="smallBold" style={styles.sectionTitle}>
                      {section}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {sectionProducts.length} {sectionProducts.length === 1 ? 'opción' : 'opciones'}
                    </ThemedText>
                  </View>
                  <View style={styles.productGrid}>
                    {sectionProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        cardWidth={productCardWidth}
                        onAdd={() => addToCart(product)}
                        onPress={() => setSelectedProduct(product)}
                      />
                    ))}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={[styles.emptySearch, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={styles.emptySearchEmoji}>
                {activeFilter === 'favorites' ? '🤍' : '🔎'}
              </ThemedText>
              <ThemedText type="smallBold" style={styles.emptySearchTitle}>
                {activeFilter === 'favorites'
                  ? 'Aún no tienes favoritos'
                  : 'No encontramos ese producto'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptySearchSubtitle}>
                {activeFilter === 'favorites'
                  ? 'Toca el corazón en cualquier producto para guardarlo aquí.'
                  : 'Prueba con otra palabra o limpia los filtros.'}
              </ThemedText>
              {activeFilter !== 'all' && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setActiveFilter('all');
                    setQuery('');
                  }}
                  style={styles.resetFilterButton}>
                  <ThemedText style={styles.resetFilterButtonText}>Ver todo el menú</ThemedText>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      {itemCount > 0 && (
        <View style={styles.bottomBar}>
          <View style={[styles.bottomBarContent, { backgroundColor: theme.backgroundElement }]}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Acumulado · {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </ThemedText>
              <ThemedText type="smallBold" style={styles.accumulatedTotal}>
                {formatCurrency(total)} USD
              </ThemedText>
            </View>
            <Link href="/calculator" asChild>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.calculateButton, pressed && styles.pressed]}>
                <ThemedText style={styles.calculateButtonText}>🧮 Calculadora</ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brand: {
    fontSize: 28,
    lineHeight: 34,
    color: '#58751D',
  },
  scheduleBadge: {
    backgroundColor: '#E7F2C8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    fontSize: 8,
  },
  scheduleText: {
    color: '#3B5314',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  recessBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8CE',
    gap: 8,
  },
  recessIcon: {
    fontSize: 16,
  },
  recessText: {
    fontSize: 12,
    color: '#55653D',
    fontFamily: FontFamilies.body,
  },
  recessBold: {
    fontWeight: '700',
    color: '#344714',
  },
  hero: {
    minHeight: 140,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C6DF53',
    marginBottom: 16,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 8,
  },
  heroEyebrow: {
    color: '#425B18',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: FontFamilies.heading,
    color: '#293817',
    fontSize: 23,
    lineHeight: 29,
    fontWeight: 'normal',
    marginTop: 4,
  },
  heroDescription: {
    color: '#45572A',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  randomButton: {
    backgroundColor: '#354C11',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  randomButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  heroEmoji: {
    fontSize: 48,
  },
  searchBox: {
    height: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  searchIcon: {
    fontSize: 24,
    lineHeight: 28,
    color: '#68745A',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamilies.body,
    paddingVertical: 0,
    fontSize: 15,
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 20,
    lineHeight: 22,
    color: '#68745A',
    fontWeight: '700',
  },
  filterChipsContainer: {
    gap: 8,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8CE',
  },
  chipActive: {
    backgroundColor: '#4B671B',
    borderColor: '#4B671B',
  },
  chipText: {
    fontSize: 13,
    color: '#344714',
    fontWeight: '600',
    fontFamily: FontFamilies.body,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: 'normal',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.two,
  },
  emptySearch: {
    minHeight: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  emptySearchEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptySearchTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  emptySearchSubtitle: {
    textAlign: 'center',
    maxWidth: 260,
  },
  resetFilterButton: {
    marginTop: 10,
    backgroundColor: '#718D20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  resetFilterButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    paddingHorizontal: Spacing.three,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'web' ? 76 : 12,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomBarContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D4E2AF',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  accumulatedTotal: {
    color: '#4B671B',
    fontSize: 18,
    lineHeight: 24,
  },
  calculateButton: {
    borderRadius: 13,
    backgroundColor: '#58751D',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
