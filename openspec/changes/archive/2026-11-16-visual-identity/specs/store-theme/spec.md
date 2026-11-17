# Spec Delta

## Purpose

Define cómo se separa el motor de la tienda (la lógica, igual en todas) de su
carrocería (todo lo que se ve, libre en cada tienda), para que otra tienda
cambie colores, fuentes, logo y también la forma de las piezas sin tocar el
motor.

## ADDED Requirements

### Requirement: Motor y carrocería separados
El frontend SHALL reunir todo lo que se ve de una tienda (colores, degradados, tipografías, logo, adornos, componentes visuales y disposición de la página) en la carpeta `frontend/src/theme/`, y SHALL mantener la lógica de las piezas en el motor (el resto de `frontend/src/`, salvo `config/`), que no conoce ninguna tienda.

#### Scenario: El motor no conoce ninguna tienda
- **WHEN** se revisan los archivos del motor (todo `frontend/src/` salvo `theme/` y `config/`)
- **THEN** ninguno contiene colores hexadecimales escritos a mano
- **AND** ninguno contiene las palabras "Voxel3D" ni "cobre"

#### Scenario: Rehacer una pieza no obliga a tocar el motor
- **WHEN** una tienda reescribe una pieza de su carrocería con otra forma o disposición, recibiendo los mismos datos
- **THEN** ningún archivo del motor cambia
- **AND** los tests de la lógica del motor siguen pasando

### Requirement: Contrato entre motor y carrocería
El motor SHALL definir con tipos de TypeScript los datos que recibe cada pieza de la carrocería, y la comprobación de tipos SHALL fallar si una pieza no encaja con ese contrato.

#### Scenario: A una pieza le falta un dato
- **WHEN** una pieza de la carrocería no acepta un dato que el contrato exige
- **THEN** la comprobación de tipos (`tsc`) falla e indica la pieza y el dato

### Requirement: Logo de la tienda
El frontend SHALL mostrar como logo el nombre de la tienda (`NEXT_PUBLIC_STORE_NAME`) con la fuente y el degradado de la carrocería, o una imagen si la carrocería la define, y el logo SHALL ser un enlace a la portada.

#### Scenario: Logo de texto
- **WHEN** la carrocería define el logo como texto y `NEXT_PUBLIC_STORE_NAME` vale "Voxel3D"
- **THEN** la cabecera muestra "Voxel3D" como enlace a `/`

#### Scenario: Logo de imagen
- **WHEN** la carrocería define el logo como imagen con su texto alternativo
- **THEN** la cabecera muestra la imagen con ese texto alternativo, como enlace a `/`

### Requirement: Contraste suficiente
Las parejas de texto y fondo de la carrocería SHALL tener un contraste de al menos 4,5:1, comprobado por un test; para un degradado se SHALL usar el extremo con peor contraste.

#### Scenario: La carrocería cumple el contraste
- **WHEN** se ejecutan los tests del frontend
- **THEN** cada pareja de texto y fondo de la carrocería tiene un contraste de al menos 4,5:1

#### Scenario: Un color con poco contraste
- **WHEN** alguien cambia un color de la carrocería y una pareja queda por debajo de 4,5:1
- **THEN** el test falla e indica qué pareja no cumple
