import { Link } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartItem } from '@/components/cart/cart-item';
import { ThemedText } from '@/components/themed-text';
import { CartToast } from '@/components/ui/toast';
import { FontFamilies, MaxContentWidth, Spacing } from '@/constants/theme';
import productsJson from '@/data/products.json';
import { useCart } from '@/hooks/use-cart';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format-currency';

const allProducts = productsJson as Product[];

export default function CalculatorScreen() {
  const {
    items,
    total,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    orderHistory,
    saveOrderToHistory,
    repeatOrder,
  } = useCart();

  const [budgetInput, setBudgetInput] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const [ticketNumber] = useState(() => Math.floor(100 + Math.random() * 900));
  const theme = useTheme();

  const budget = Number.parseFloat(budgetInput.replace(',', '.'));
  const hasBudget = budgetInput.trim().length > 0 && Number.isFinite(budget);
  const difference = hasBudget ? budget - total : 0;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Productos sugeridos con el dinero que le sobra
  const affordableSuggestions =
    hasBudget && difference > 0.25
      ? allProducts.filter((p) => p.price <= difference).slice(0, 4)
      : [];

  const addCoin = (amount: number) => {
    const current = Number.parseFloat(budgetInput.replace(',', '.')) || 0;
    const nextVal = (Math.round((current + amount) * 100) / 100).toFixed(2);
    setBudgetInput(nextVal);
  };

  const handleOpenTicket = () => {
    saveOrderToHistory({
      id: Date.now().toString(),
      orderNumber: ticketNumber,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      total,
    });
    setShowTicket(true);
  };

  const handleShareOrder = async () => {
    const orderLines = items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (${formatCurrency(item.product.price * item.quantity)})`,
      )
      .join('\n');
    const msg = `🥪 SnackTime - Pedido para el Bar Escolar (#${ticketNumber}):\n\n${orderLines}\n\nTotal a pagar: ${formatCurrency(total)} USD${
      hasBudget
        ? `\nPago con: ${formatCurrency(budget)} USD\n${difference >= 0 ? `Cambio esperado: ${formatCurrency(difference)} USD` : `Falta: ${formatCurrency(Math.abs(difference))} USD`}`
        : ''
    }\n\n¡Listo para pedir en el recreo!`;

    try {
      await Share.share({ message: msg });
    } catch {
      // Ignorar si el usuario cancela la acción
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <CartToast />
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

          {/* Tarjeta de Presupuesto */}
          <View style={[styles.budgetCard, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold" style={styles.cardTitle}>
              ¿Cuánto dinero tienes para el recreo?
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.helper}>
              Escribe tu presupuesto o suma tus monedas y billetes:
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
              {budgetInput.length > 0 && (
                <Pressable
                  onPress={() => setBudgetInput('')}
                  hitSlop={8}
                  style={styles.clearBudgetButton}>
                  <ThemedText style={styles.clearBudgetText}>×</ThemedText>
                </Pressable>
              )}
            </View>

            {/* Sumar Monedas Físicas Rápidas */}
            <View style={styles.coinsSection}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.coinsTitle}>
                Sumar monedas / billetes:
              </ThemedText>
              <View style={styles.coinsRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addCoin(0.25)}
                  style={({ pressed }) => [styles.coinBtn, pressed && styles.pressed]}>
                  <ThemedText style={styles.coinBtnText}>🪙 +$0.25</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addCoin(0.50)}
                  style={({ pressed }) => [styles.coinBtn, pressed && styles.pressed]}>
                  <ThemedText style={styles.coinBtnText}>🪙 +$0.50</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addCoin(1.00)}
                  style={({ pressed }) => [styles.coinBtn, pressed && styles.pressed]}>
                  <ThemedText style={styles.coinBtnText}>🪙 +$1.00</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addCoin(5.00)}
                  style={({ pressed }) => [styles.coinBtn, pressed && styles.pressed]}>
                  <ThemedText style={styles.coinBtnText}>💵 +$5.00</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {items.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={styles.emptyEmoji}>🧮</ThemedText>
              <ThemedText type="smallBold" style={styles.emptyTitle}>
                Tu carrito está vacío
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyMessage}>
                Elige productos o combos en el menú y ven aquí a comparar tu dinero.
              </ThemedText>
              <Link href="/" asChild>
                <Pressable style={({ pressed }) => [styles.browseButton, pressed && styles.pressed]}>
                  <ThemedText style={styles.browseButtonText}>Explorar menú escolar</ThemedText>
                </Pressable>
              </Link>
            </View>
          ) : (
            <>
              {/* Header Selección */}
              <View style={styles.selectionHeader}>
                <View>
                  <ThemedText type="smallBold" style={styles.sectionTitle}>
                    Tu selección
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en total
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

              {/* Lista de Productos del Carrito */}
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onIncrease={() => addToCart(item.product)}
                  onDecrease={() => decreaseQuantity(item.product.id)}
                  onRemove={() => removeFromCart(item.product.id)}
                />
              ))}

              {/* Tarjeta de Resumen y Comparativa de Dinero */}
              <View style={[styles.resultCard, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small" themeColor="textSecondary">
                  Total a pagar en el bar
                </ThemedText>
                <ThemedText type="subtitle" style={styles.total}>
                  {formatCurrency(total)} USD
                </ThemedText>

                <View style={styles.divider} />

                {hasBudget ? (
                  <>
                    <View style={styles.resultRow}>
                      <View>
                        <ThemedText type="smallBold" style={styles.statusLabel}>
                          {difference >= 0 ? '✅ Te queda' : '⚠️ Te falta'}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {difference >= 0
                            ? 'Tienes suficiente dinero para pagar'
                            : 'Superas tu presupuesto actual'}
                        </ThemedText>
                      </View>
                      <ThemedText
                        type="smallBold"
                        style={[
                          styles.differenceAmount,
                          difference >= 0 ? styles.surplus : styles.shortage,
                        ]}>
                        {formatCurrency(Math.abs(difference))} USD
                      </ThemedText>
                    </View>

                    {/* Alerta si falta dinero */}
                    {difference < 0 && (
                      <View style={styles.shortageNotice}>
                        <ThemedText style={styles.shortageNoticeText}>
                          💡 Te sugerimos reducir cantidades o cambiar por productos más económicos para no quedarte sin dinero en la fila.
                        </ThemedText>
                      </View>
                    )}
                  </>
                ) : (
                  <ThemedText type="small" themeColor="textSecondary">
                    Ingresa cuánto dinero tienes arriba para calcular si te alcanza o cuánto cambio debes recibir.
                  </ThemedText>
                )}

                {/* Botón para ver Ticket */}
                <Pressable
                  accessibilityRole="button"
                  onPress={handleOpenTicket}
                  style={({ pressed }) => [styles.ticketButton, pressed && styles.pressed]}>
                  <ThemedText style={styles.ticketButtonText}>🧾 Ver Ticket para el Bar</ThemedText>
                </Pressable>
              </View>

              {/* Sugerencias Inteligentes con el cambio restante */}
              {affordableSuggestions.length > 0 && (
                <View style={[styles.suggestionsBox, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText style={styles.suggestionsHeaderTitle}>
                    💡 Con tu cambio ({formatCurrency(difference)} USD) te alcanza:
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.suggestionsSub}>
                    Puedes agregar algo más sin pasarte de tu presupuesto:
                  </ThemedText>

                  <View style={styles.suggestionsList}>
                    {affordableSuggestions.map((prod) => (
                      <View key={prod.id} style={styles.suggestionRow}>
                        <View style={styles.suggestionInfo}>
                          <ThemedText style={styles.suggestionEmoji}>{prod.emoji}</ThemedText>
                          <View>
                            <ThemedText style={styles.suggestionName}>{prod.name}</ThemedText>
                            <ThemedText type="small" themeColor="textSecondary">
                              {formatCurrency(prod.price)}
                            </ThemedText>
                          </View>
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => addToCart(prod)}
                          style={({ pressed }) => [
                            styles.addSuggestionBtn,
                            pressed && styles.pressed,
                          ]}>
                          <ThemedText style={styles.addSuggestionBtnText}>+ Agregar</ThemedText>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}

          {/* Historial de Pedidos Anteriores */}
          {orderHistory.length > 0 && (
            <View style={[styles.historyContainer, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={styles.historyTitle}>📜 Historial del Recreo</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.historySub}>
                Tus pedidos simulados recientes
              </ThemedText>

              {orderHistory.slice(0, 3).map((saved) => (
                <View key={saved.id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <ThemedText style={styles.historyCardOrder}>
                      Orden #{saved.orderNumber} · {saved.date}
                    </ThemedText>
                    <ThemedText style={styles.historyCardTotal}>
                      {formatCurrency(saved.total)} USD
                    </ThemedText>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {saved.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => repeatOrder(saved.items)}
                    style={({ pressed }) => [styles.repeatOrderBtn, pressed && styles.pressed]}>
                    <ThemedText style={styles.repeatOrderBtnText}>🔁 Volver a pedir este menú</ThemedText>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal / Ticket para pedir en el bar */}
      <Modal
        visible={showTicket}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTicket(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <ThemedText style={styles.ticketSchoolTitle}>BAR ESCOLAR - SNACKTIME</ThemedText>
              <ThemedText style={styles.ticketOrderNumber}>Orden #{ticketNumber}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Muestra o lee esta orden en la ventanilla del bar
              </ThemedText>
            </View>

            <View style={styles.ticketDottedLine} />

            <ScrollView style={styles.ticketItemsList} showsVerticalScrollIndicator={false}>
              {items.map((item) => (
                <View key={item.product.id} style={styles.ticketItemRow}>
                  <ThemedText style={styles.ticketItemQty}>{item.quantity}x</ThemedText>
                  <ThemedText style={styles.ticketItemName} numberOfLines={1}>
                    {item.product.emoji} {item.product.name}
                  </ThemedText>
                  <ThemedText style={styles.ticketItemPrice}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>

            <View style={styles.ticketDottedLine} />

            <View style={styles.ticketSummary}>
              <View style={styles.ticketSummaryRow}>
                <ThemedText style={styles.ticketSummaryLabel}>Total a pagar:</ThemedText>
                <ThemedText style={styles.ticketSummaryTotal}>{formatCurrency(total)} USD</ThemedText>
              </View>

              {hasBudget && (
                <>
                  <View style={styles.ticketSummaryRow}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Pagas con:
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {formatCurrency(budget)} USD
                    </ThemedText>
                  </View>
                  <View style={styles.ticketSummaryRow}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: difference >= 0 ? '#436B14' : '#B45430' }}>
                      {difference >= 0 ? 'Cambio esperado:' : 'Te falta pagar:'}
                    </ThemedText>
                    <ThemedText
                      type="smallBold"
                      style={{ color: difference >= 0 ? '#436B14' : '#B45430' }}>
                      {formatCurrency(Math.abs(difference))} USD
                    </ThemedText>
                  </View>
                </>
              )}
            </View>

            {/* Acciones del Ticket */}
            <View style={styles.ticketActionsRow}>
              <Pressable
                accessibilityRole="button"
                onPress={handleShareOrder}
                style={({ pressed }) => [styles.shareTicketBtn, pressed && styles.pressed]}>
                <ThemedText style={styles.shareTicketBtnText}>📲 Compartir</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setShowTicket(false)}
                style={({ pressed }) => [styles.closeTicketButton, pressed && styles.pressed]}>
                <ThemedText style={styles.closeTicketButtonText}>¡Listo, entendido!</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 18,
  },
  budgetCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
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
    marginBottom: 12,
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
  clearBudgetButton: {
    padding: 6,
  },
  clearBudgetText: {
    fontSize: 18,
    color: '#68745A',
    fontWeight: '700',
  },
  coinsSection: {
    marginTop: 12,
  },
  coinsTitle: {
    fontSize: 12,
    marginBottom: 6,
  },
  coinsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coinBtn: {
    backgroundColor: '#EDF3D6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  coinBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3F5915',
    fontFamily: FontFamilies.body,
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
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FCE9E1',
  },
  clearButtonText: {
    color: '#B45430',
    fontSize: 13,
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
  statusLabel: {
    fontSize: 16,
  },
  differenceAmount: {
    fontSize: 18,
  },
  surplus: {
    color: '#4B671B',
  },
  shortage: {
    color: '#B45430',
  },
  shortageNotice: {
    backgroundColor: '#FDF2F0',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  shortageNoticeText: {
    color: '#9C2E17',
    fontSize: 12,
    lineHeight: 16,
  },
  ticketButton: {
    backgroundColor: '#4B671B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  ticketButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FontFamilies.body,
  },
  suggestionsBox: {
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  suggestionsHeaderTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: '#344714',
  },
  suggestionsSub: {
    marginTop: 2,
    marginBottom: 10,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7FAEE',
    padding: 10,
    borderRadius: 12,
  },
  suggestionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  suggestionEmoji: {
    fontSize: 24,
  },
  suggestionName: {
    fontFamily: FontFamilies.heading,
    fontSize: 15,
    color: '#293817',
  },
  addSuggestionBtn: {
    backgroundColor: '#718D20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addSuggestionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  historyContainer: {
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E4E9D4',
  },
  historyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: '#334814',
  },
  historySub: {
    marginTop: 2,
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#F7FAEE',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyCardOrder: {
    fontFamily: FontFamilies.body,
    fontWeight: '700',
    color: '#283A11',
    fontSize: 13,
  },
  historyCardTotal: {
    fontFamily: FontFamilies.heading,
    color: '#4B671B',
    fontSize: 15,
  },
  repeatOrderBtn: {
    backgroundColor: '#E6EED0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  repeatOrderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#385012',
    fontFamily: FontFamilies.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  ticketHeader: {
    alignItems: 'center',
  },
  ticketSchoolTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#657351',
    letterSpacing: 1.5,
  },
  ticketOrderNumber: {
    fontFamily: FontFamilies.heading,
    fontSize: 26,
    color: '#2B3D12',
    marginTop: 4,
  },
  ticketDottedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  ticketItemsList: {
    maxHeight: 200,
  },
  ticketItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketItemQty: {
    fontWeight: '700',
    color: '#4F6A1A',
    width: 28,
    fontSize: 14,
  },
  ticketItemName: {
    flex: 1,
    fontSize: 14,
    color: '#2A3022',
  },
  ticketItemPrice: {
    fontWeight: '700',
    fontSize: 14,
    color: '#2A3022',
  },
  ticketSummary: {
    gap: 6,
    marginBottom: 16,
  },
  ticketSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketSummaryLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 17,
    color: '#2B3D12',
  },
  ticketSummaryTotal: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: '#4F6A1A',
  },
  ticketActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shareTicketBtn: {
    flex: 1,
    backgroundColor: '#E7EED0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareTicketBtnText: {
    color: '#344914',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: FontFamilies.body,
  },
  closeTicketButton: {
    flex: 1.5,
    backgroundColor: '#4F6A1A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeTicketButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});
