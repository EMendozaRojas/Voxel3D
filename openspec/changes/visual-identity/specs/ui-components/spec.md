# Spec Delta

## Purpose

Define las piezas base con las que se construyen las pantallas de la tienda y
el muestrario donde se ven todas juntas.

## ADDED Requirements

### Requirement: Botón
El frontend SHALL ofrecer un botón con variante principal y estado desactivado, construido con el elemento `<button>`.

#### Scenario: Botón desactivado
- **WHEN** el botón está desactivado
- **THEN** no reacciona al pulsarlo y se anuncia como desactivado

### Requirement: Etiqueta de stock
El frontend SHALL mostrar el stock de un producto con el texto "Agotado" si el stock es 0, "Quedan N" si el stock es igual o menor que el umbral, y "En stock" en otro caso; el umbral SHALL recibirse como dato.

#### Scenario: Sin stock
- **WHEN** el stock es 0
- **THEN** la etiqueta dice "Agotado"

#### Scenario: Pocas unidades
- **WHEN** el stock es 3 y el umbral es 5
- **THEN** la etiqueta dice "Quedan 3"

#### Scenario: Stock suficiente
- **WHEN** el stock es 12 y el umbral es 5
- **THEN** la etiqueta dice "En stock"

### Requirement: Tarjeta de producto
El frontend SHALL mostrar un producto en una tarjeta con su foto, la etiqueta de stock, el nombre, el precio en euros con formato español y su descripción corta, y un botón "Añadir al carrito" que se desactiva y dice "Agotado" si no hay stock.

#### Scenario: Precio en formato español
- **WHEN** el precio del producto es 1490 céntimos
- **THEN** la tarjeta muestra "14,90 €"

#### Scenario: Producto agotado
- **WHEN** el stock del producto es 0
- **THEN** el botón dice "Agotado" y está desactivado

### Requirement: Chips de categoría
El frontend SHALL mostrar las categorías como chips que se pueden elegir, con la categoría elegida marcada; en el móvil SHALL mostrar las tres primeras y un botón "Más" que abre un panel con el resto.

#### Scenario: Elegir una categoría del panel
- **WHEN** la persona abre "Más" y elige una categoría del panel
- **THEN** el panel se cierra y el botón "Más" pasa a llevar el nombre de esa categoría, marcado como elegido

#### Scenario: Cerrar el panel
- **WHEN** el panel está abierto y la persona pulsa fuera de él o la tecla `Escape`
- **THEN** el panel se cierra

### Requirement: Buscador
El frontend SHALL ofrecer un campo de búsqueda con su etiqueta accesible y el icono del tema.

#### Scenario: Campo con etiqueta
- **WHEN** un lector de pantalla llega al buscador
- **THEN** lo anuncia como campo de búsqueda con su etiqueta

### Requirement: Muestrario de piezas
En desarrollo, el frontend SHALL ofrecer la página `/muestrario` con todas las piezas y datos de ejemplo; en producción esa página SHALL no existir.

#### Scenario: Muestrario en desarrollo
- **WHEN** la persona abre `/muestrario` en desarrollo
- **THEN** ve el botón, las etiquetas de stock, las tarjetas, los chips y el buscador con datos de ejemplo

#### Scenario: Muestrario en producción
- **WHEN** alguien abre `/muestrario` en la versión de producción
- **THEN** recibe la página de "no encontrado"
