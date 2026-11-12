# Spec Delta

## Purpose

Define cómo se separa el aspecto de cada tienda (su tema) del motor, para que
otra tienda cambie colores, fuentes, logo y adornos sin tocar los componentes.

## ADDED Requirements

### Requirement: El tema de la tienda vive en un solo sitio
El frontend SHALL reunir todo lo que cambia de aspecto entre tiendas (colores, degradados, tipografías, logo y adornos) en la carpeta `frontend/src/theme/`, y los componentes SHALL usar solo tokens con nombres neutros, que describen su papel y no su color.

#### Scenario: Ningún componente lleva colores ni la tienda escritos a mano
- **WHEN** se revisan los archivos de `frontend/src/` fuera de `frontend/src/theme/`
- **THEN** ninguno contiene colores hexadecimales escritos a mano
- **AND** ninguno contiene las palabras "Voxel3D" ni "cobre"

#### Scenario: Cambiar un token cambia todas las piezas
- **WHEN** se cambia el valor de `--color-accent` en `theme.css`
- **THEN** todas las piezas que usan el acento muestran el nuevo color sin editar ningún componente

### Requirement: Adornos que se pueden apagar
El tema SHALL definir los adornos (textura de la página, patrón de la cabecera, línea de acento, remaches y barras laterales de la tarjeta) como variables, y apagar un adorno SHALL consistir solo en darle el valor `none` o `0px` en el tema.

#### Scenario: Tema de Voxel3D con adornos
- **WHEN** se carga la web con el tema de Voxel3D
- **THEN** la cabecera muestra el acero perforado, la tarjeta muestra los remaches y las barras laterales, y la página el metal cepillado

#### Scenario: Adornos apagados
- **WHEN** las variables de adornos valen `none` o `0px`
- **THEN** las piezas se muestran con fondos lisos, sin remaches ni barras, y siguen siendo usables

### Requirement: Logo de la tienda
El frontend SHALL mostrar como logo el nombre de la tienda (`NEXT_PUBLIC_STORE_NAME`) con la fuente y el degradado del tema, o una imagen si el tema la define, y el logo SHALL ser un enlace a la portada.

#### Scenario: Logo de texto
- **WHEN** el tema define el logo como texto y `NEXT_PUBLIC_STORE_NAME` vale "Voxel3D"
- **THEN** la cabecera muestra "Voxel3D" como enlace a `/`

#### Scenario: Logo de imagen
- **WHEN** el tema define el logo como imagen con su texto alternativo
- **THEN** la cabecera muestra la imagen con ese texto alternativo, como enlace a `/`

### Requirement: Contraste suficiente
Las parejas de texto y fondo del tema SHALL tener un contraste de al menos 4,5:1, comprobado por un test; para un degradado se SHALL usar el extremo con peor contraste.

#### Scenario: El tema cumple el contraste
- **WHEN** se ejecutan los tests del frontend
- **THEN** cada pareja de texto y fondo del tema tiene un contraste de al menos 4,5:1

#### Scenario: Un color con poco contraste
- **WHEN** alguien cambia un color del tema y una pareja queda por debajo de 4,5:1
- **THEN** el test falla e indica qué pareja no cumple
