import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/catalog/product-card';
import { FontFamilies, MaxContentWidth, Spacing } from '@/constants/theme';
import productsJson from '@/data/products.json';
import { formatCurrency } from '@/utils/format-currency';
import { ThemedText } from '@/components/themed-text';
import { useCart } from '@/hooks/use-cart';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

const products: Product[] = productsJson;
const sections = [...new Set(products.map((product) => product.category))];

export default function CatalogScreen() {
  const [query, setQuery] = useState('');
  const { addToCart, itemCount, total } = useCart();
  const theme = useTheme();

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter(
      (product) =>
        normalizedQuery.length === 0 ||
        `${product.name} ${product.description}`.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Tu recreo, más fácil
              </ThemedText>
              <ThemedText type="subtitle" style={styles.brand}>
                SnackTime
              </ThemedText>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <ThemedText style={styles.heroEyebrow}>BAR ESCOLAR</ThemedText>
              <ThemedText style={styles.heroTitle}>¿Qué se te antoja hoy?</ThemedText>
              <ThemedText style={styles.heroDescription}>
                Revisa opciones y calcula cuánto vas a gastar.
              </ThemedText>
            </View>
            <ThemedText style={styles.heroEmoji}>🍎</ThemedText>
          </View>

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
          </View>

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
                      {sectionProducts.length} opciones
                    </ThemedText>
                  </View>
                  <View style={styles.productGrid}>
                    {sectionProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={() => addToCart(product)}
                      />
                    ))}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={[styles.emptySearch, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={styles.emptySearchEmoji}>🔎</ThemedText>
              <ThemedText type="smallBold" style={styles.emptySearchTitle}>
                No encontramos ese producto
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Prueba con otra búsqueda.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
      {itemCount > 0 && (
        <View style={styles.bottomBar}>
          <View style={[styles.bottomBarContent, { backgroundColor: theme.backgroundElement }]}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Acumulado · {itemCount} productos
              </ThemedText>
              <ThemedText type="smallBold" style={styles.accumulatedTotal}>
                {formatCurrency(total)} USD
              </ThemedText>
            </View>
            <Link href="/calculator" asChild>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.calculateButton, pressed && styles.pressed]}>
                <ThemedText style={styles.calculateButtonText}>🧮 Calcular</ThemedText>
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
    paddingBottom: Spacing.two,
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
    marginBottom: 18,
  },
  brand: {
    fontSize: 28,
    lineHeight: 34,
    color: '#58751D',
  },
  hero: {
    minHeight: 150,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C6DF53',
    marginBottom: 18,
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
    marginTop: 6,
  },
  heroDescription: {
    color: '#45572A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
  },
  heroEmoji: {
    fontSize: 54,
  },
  searchBox: {
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 27,
    lineHeight: 32,
    color: '#68745A',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamilies.body,
    paddingVertical: 0,
    fontSize: 15,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    justifyContent: 'space-between',
  },
  emptySearch: {
    minHeight: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 6,
  },
  emptySearchEmoji: {
    fontSize: 34,
    marginBottom: 4,
  },
  emptySearchTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 'normal',
  },
  bottomBar: {
    paddingHorizontal: Spacing.three,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'web' ? 76 : 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomBarContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    minHeight: 66,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1E8C9',
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accumulatedTotal: {
    color: '#58751D',
    fontSize: 18,
    lineHeight: 24,
  },
  calculateButton: {
    borderRadius: 13,
    backgroundColor: '#718D20',
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
