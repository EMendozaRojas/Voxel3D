# Spec Delta

## Purpose

Define la estructura común de todas las páginas de la tienda: cabecera, pie,
barra inferior del móvil y aviso de demostración.

## ADDED Requirements

### Requirement: Cabecera
Cada página SHALL mostrar una cabecera con el logo y el menú de navegación (Inicio, Productos, Sobre nosotros), un botón de cuenta y un botón de carrito con contador; en el móvil SHALL mostrar solo el logo y el carrito.

#### Scenario: Página activa
- **WHEN** la persona está en una página del menú
- **THEN** ese enlace lleva `aria-current="page"` y el color de acento

#### Scenario: Contador del carrito
- **WHEN** el carrito tiene 3 unidades
- **THEN** el botón del carrito muestra "3" y su nombre accesible dice que el carrito tiene 3 productos

#### Scenario: Carrito vacío
- **WHEN** el carrito tiene 0 unidades
- **THEN** el botón del carrito no muestra contador

### Requirement: Pie con aviso de demostración
Cada página SHALL mostrar un pie con el aviso "Modo demostración: no se cobra dinero real."

#### Scenario: Aviso visible
- **WHEN** la persona abre cualquier página
- **THEN** el pie muestra el aviso de modo demostración

### Requirement: Barra inferior en el móvil
En pantallas estrechas, cada página SHALL mostrar una barra inferior fija con los enlaces Inicio, Productos y Cuenta y un botón Más que abre un panel desde abajo con el resto de enlaces, y SHALL ocultarla en escritorio.

#### Scenario: Navegación en el móvil
- **WHEN** la persona abre la web en un móvil
- **THEN** ve la barra inferior con Inicio, Productos, Cuenta y Más, y la opción de la página actual marcada con `aria-current="page"`

#### Scenario: Panel Más
- **WHEN** la persona pulsa Más en la barra inferior
- **THEN** se abre un panel desde abajo con el resto de enlaces, el botón anuncia que está abierto (`aria-expanded`) y el panel se cierra con `Escape`, pulsando fuera o eligiendo un enlace

### Requirement: Accesibilidad de la estructura
Los elementos de la estructura SHALL usar elementos reales (`<header>`, `<nav>`, `<main>`, `<footer>`, `<a>`, `<button>`), los botones con solo icono SHALL tener nombre accesible, y los objetivos táctiles SHALL medir al menos 44 px.

#### Scenario: Botones con solo icono
- **WHEN** un lector de pantalla recorre la cabecera
- **THEN** los botones de cuenta y carrito se anuncian con su nombre ("Mi cuenta", "Carrito")
