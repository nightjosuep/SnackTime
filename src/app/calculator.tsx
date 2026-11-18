import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartItem } from '@/components/cart/cart-item';
import { ThemedText } from '@/components/themed-text';
import { FontFamilies, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCart } from '@/hooks/use-cart';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/utils/format-currency';

export default function CalculatorScreen() {
  const { items, total, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [budgetInput, setBudgetInput] = useState('');
  const theme = useTheme();
  const budget = Number.parseFloat(budgetInput.replace(',', '.'));
  const hasBudget = budgetInput.trim().length > 0 && Number.isFinite(budget);
  const difference = hasBudget ? budget - total : 0;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Calcula tu gasto en dólares
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Calculadora
          </ThemedText>

          <View style={[styles.budgetCard, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold" style={styles.cardTitle}>
              ¿Cuánto dinero tienes?
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.helper}>
              Escribe tu presupuesto en USD y compáralo con lo que llevas.
            </ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
              <ThemedText style={styles.currencySign}>$</ThemedText>
              <TextInput
                accessibilityLabel="Dinero disponible en dólares"
                keyboardType="decimal-pad"
                onChangeText={setBudgetInput}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                returnKeyType="done"
                style={[styles.budgetInput, { color: theme.text }]}
                value={budgetInput}
              />
              <ThemedText type="small" themeColor="textSecondary">
                USD
              </ThemedText>
            </View>
          </View>

          {items.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={styles.emptyEmoji}>🧮</ThemedText>
              <ThemedText type="smallBold" style={styles.emptyTitle}>
                Agrega productos para calcular
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyMessage}>
                El total se actualizará cada vez que agregues o quites algo del menú.
              </ThemedText>
              <Link href="/" asChild>
                <Pressable style={({ pressed }) => [styles.browseButton, pressed && styles.pressed]}>
                  <ThemedText style={styles.browseButtonText}>Ver menú</ThemedText>
                </Pressable>
              </Link>
            </View>
          ) : (
            <>
              <View style={styles.selectionHeader}>
                <View>
                  <ThemedText type="smallBold" style={styles.sectionTitle}>
                    Tu selección
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {itemCount} productos
                  </ThemedText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Vaciar selección"
                  onPress={clearCart}
                  style={styles.clearButton}>
                  <ThemedText style={styles.clearButtonText}>Vaciar</ThemedText>
                </Pressable>
              </View>

              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onIncrease={() => addToCart(item.product)}
                  onDecrease={() => decreaseQuantity(item.product.id)}
                  onRemove={() => removeFromCart(item.product.id)}
                />
              ))}

              <View style={[styles.resultCard, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small" themeColor="textSecondary">
                  Vas a gastar
                </ThemedText>
                <ThemedText type="subtitle" style={styles.total}>
                  {formatCurrency(total)} USD
                </ThemedText>
                <View style={styles.divider} />
                {hasBudget ? (
                  <View style={styles.resultRow}>
                    <ThemedText type="smallBold">
                      {difference >= 0 ? 'Te queda' : 'Te falta'}
                    </ThemedText>
                    <ThemedText
                      type="smallBold"
                      style={difference >= 0 ? styles.surplus : styles.shortage}>
                      {formatCurrency(Math.abs(difference))} USD
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText type="small" themeColor="textSecondary">
                    Ingresa cuánto dinero tienes para saber cuánto te queda.
                  </ThemedText>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
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
  title: {
    fontSize: 30,
    lineHeight: 37,
    marginTop: 2,
    marginBottom: 22,
  },
  budgetCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  cardTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    fontWeight: 'normal',
  },
  helper: {
    marginTop: 4,
    marginBottom: 14,
  },
  inputContainer: {
    minHeight: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  currencySign: {
    color: '#58751D',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: 18,
    paddingVertical: 10,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: 'normal',
  },
  clearButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: '#FCE9E1',
  },
  clearButtonText: {
    color: '#B45430',
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    borderRadius: 20,
    padding: 18,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  total: {
    fontFamily: FontFamilies.body,
    color: '#58751D',
    fontSize: 28,
    lineHeight: 36,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D5DBD4',
    marginVertical: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surplus: {
    color: '#58751D',
  },
  shortage: {
    color: '#B45430',
  },
  emptyState: {
    borderRadius: 22,
    padding: 26,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 'normal',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 290,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#718D20',
    marginTop: 18,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
