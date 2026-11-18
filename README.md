# SnackTime

## Problema
En el bar escolar, los estudiantes necesitan conocer los productos disponibles y sus precios antes de realizar una compra. En ocasiones, no tienen claro cuánto deben pagar o qué productos pueden comprar con el dinero que tienen.

## Solución
Crearé una aplicación móvil que permita consultar los productos del bar escolar, visualizar sus precios y calcular automáticamente el valor total de una compra. Su objetivo es facilitar la consulta de productos y mejorar la organización de las compras de los estudiantes.

## Objetivos
- Diseñar en Figma un prototipo de la aplicación que incluya las pantallas de inicio, catálogo y carrito de compras, comprobando que cada pantalla tenga sus elementos principales.
- Desarrollar un catálogo de al menos 10 productos utilizando React Native, Expo y TypeScript, almacenando los datos en un archivo JSON local y verificando que se visualicen correctamente.
- Implementar un carrito de compras mediante TypeScript y useState, permitiendo agregar y eliminar al menos 5 productos diferentes, comprobando su funcionamiento mediante pruebas en Expo Go.
- Crear una función en TypeScript que calcule automáticamente el total de la compra con dos decimales, verificando los resultados mediante al menos 3 pruebas con diferentes productos y cantidades.
- Evaluar la facilidad de uso de la aplicación con al menos 3 estudiantes mediante Expo Go, utilizando una encuesta de Google Forms con preguntas previamente revisadas por un docente o compañero y analizando las respuestas obtenidas.

## Habilidades
- Desarrollo de aplicaciones móviles con React Native y Expo.
- Programación con TypeScript.
- Uso de estados y hooks.
- Navegación entre pantallas con Expo Router.
- Manejo de operaciones matemáticas y condiciones lógicas.

## Alcance inicial
Pantalla principal con acceso al catálogo.
Catálogo de alimentos y bebidas con imágenes y precios.
Carrito para agregar, eliminar y modificar cantidades.
Cálculo automático del total.

## Implementación actual
- Catálogo local organizado en secciones de comida y bebidas, con búsqueda.
- El acumulado de los productos seleccionados aparece debajo del catálogo.
- Una calculadora permite ingresar el presupuesto en USD y ver el gasto y cuánto dinero sobra o falta.
- Los importes se muestran en dólares con dos decimales; no se realizan pagos desde la aplicación.

### Cambiar productos e ilustraciones
- Edita nombres, precios, categorías y emojis en `src/data/products.json`.
- Las ilustraciones actuales son emojis guardados en el campo `emoji` de cada producto; no hay fotografías separadas todavía.
- La categoría `Comida` o `Bebidas` determina en qué sección aparece el producto.

### Tipografías
- Los archivos están en `assets/fonts/`.
- `DopeFortune.ttf` se usa en los títulos y `SuckerBrush.ttf` en el resto del texto.
- El texto general usa un tamaño ligeramente mayor para mantener su legibilidad con Sucker Brush.
- Revisa las licencias incluidas en los ZIP originales antes de distribuir la app: Sucker Brush indica uso personal y Dope Fortune indica un pago de €2 por proyecto.

### Diseño visual
La interfaz usa una paleta verde lima, superficies claras, tarjetas redondeadas y botones de alto contraste, adaptados al catálogo y calculadora de SnackTime.

### Organización del código
```text
src/
  app/                 # Pantallas y navegación de Expo Router
  components/
    cart/              # Componentes del carrito
    catalog/           # Componentes del catálogo
  data/                # Catálogo local en JSON
  hooks/               # Estado compartido del carrito y hooks de tema
  types/               # Tipos compartidos
  utils/               # Formateo de moneda
```

Inicia la aplicación con `npm start` y pruébala en Expo Go o en el navegador.

## Restricciones
- No incluir pagos electrónicos.
- No implementar pedidos a domicilio.
- Los productos y precios serán registrados manualmente.
- La aplicación funcionará inicialmente sin conexión a internet.
