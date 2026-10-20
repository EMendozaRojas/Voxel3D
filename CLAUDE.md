# Voxel3D

> **Antes de nada, lee `SOBRE_MI.md`** (archivo local, no se sube al
> repositorio; si no existe, aplica igualmente este resumen): la autora no viene
> del área de IT, aprende de forma autodidacta y quiere que Claude actúe como
> su profesor (explicaciones claras en español, sin jerga, paso a paso, y
> **primero se habla y después se hace**).

## ¿Qué hace este proyecto?

Tienda online de artículos impresos en 3D con filamento: catálogo con
categorías y filtros, carrito, pago con tarjeta (Stripe, **solo en modo de
pruebas**), inventario por variante, pedidos con estados y panel de
administración. Se puede comprar **como invitada** (sin registrarse) o con
cuenta.

Objetivo del proyecto: proyecto de aprendizaje de desarrollo asistido por IA y
**portafolio** (CV y GitHub) para buscar el primer empleo como desarrolladora
junior en Madrid. Por eso se usan herramientas que se piden en ofertas junior,
sin sobreingeniería.

**Estado:** Fase 0 (preparación). Todavía no hay código. Siguientes pasos:
`openspec init` y el primer change, `project-skeleton` (el esqueleto que
arranca con un comando). Cómo funciona cada parte, cuando exista, estará en
`openspec/specs/`; las ideas futuras, en `openspec/changes/` como fichas (solo
propuesta) que **no se implementan durante el MVP** salvo decisión explícita.

## Alcance del MVP

| Rol | Puede |
|---|---|
| **Visitante** (sin cuenta) | Explorar el catálogo, buscar, filtrar y ordenar; ver el detalle de un producto; añadir al carrito (temporal); comprar con envío a domicilio y pago con Stripe; consultar su pedido con un enlace firmado enviado por email; registrarse si quiere (tras comprar, solo pone una contraseña) |
| **Cliente registrado** | Todo lo del visitante, más: iniciar sesión y recuperar la contraseña; consultar y modificar su perfil (nombre, correo con verificación, contraseña pidiendo la actual, teléfono); libreta de direcciones de envío (varias, una predeterminada); realizar pedidos con sus datos precargados; consultar su historial; cancelar un pedido pendiente; eliminar su cuenta |
| **Administradora** (una sola) | Crear, editar y desactivar productos (nunca se borran: los pedidos antiguos los referencian); gestionar precios, variantes, stock e imágenes; gestionar categorías; ajustar stock con un motivo (queda en un historial); ver avisos de stock bajo; consultar y actualizar pedidos (también los de invitados) y cancelarlos; consultar los usuarios registrados (solo lectura) |

**La administradora se crea desde el servidor** con un script, nunca desde la
web, y no habrá varios administradores.

**Fuera del MVP** (se apuntarán como fichas en OpenSpec): productos
personalizados, reseñas y favoritos, cupones, login con Google, varios tipos
de administrador, reembolsos automáticos, seguimiento con transportista,
multiidioma, doble verificación (2FA) para la administradora, página de
"Servicios".

## Catálogo

Categorías de dos niveles; cada producto tiene **una** categoría principal.

- **Decoración y hogar** (chip móvil: *Hogar*): Macetas · Organizadores de escritorio · Arte de pared
- **Mundo animal** (*Animales*): Mascotas y figuras realistas · Criaturas fantásticas y míticas
- **Manga, anime y geek** (*Geek*): Figuras y estatuas · Llaveros y accesorios · Bustos · Gaming y cultura pop
- **Lámparas e iluminación** (*Lámparas*): Lámparas de litofanía · Luces de noche y de mesa

**Filtros:** Acabado (seda, arcoíris, brilla en la oscuridad, mármol, madera) ·
Material (PLA, PETG) · Color · Articulado · Solo en stock · Rango de precio.
**Ordenar por:** Novedades · Más vendidos (los calcula el sistema) · Precio.

**Variantes:** cada variante de un producto tiene un **acabado** y, cuando
aplica, un **color** (arcoíris, mármol y madera no son un color), y **su propio
stock**.

No se usan diseños con marcas registradas en el catálogo: solo diseños
originales o de licencia libre.

## Tecnologías

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS | Páginas renderizadas en el servidor (buen SEO para una tienda); consume la API por HTTP |
| Backend | Python + FastAPI | API REST, validación con Pydantic, docs OpenAPI automáticas |
| Base de datos | PostgreSQL | corre en contenedor Docker |
| ORM / migraciones | SQLAlchemy + Alembic | todo cambio de esquema pasa por una migración |
| Gestor de dependencias (Python) | pip + requirements.txt | igual que ExpenseTrack |
| Autenticación | JWT + bcrypt + roles | multiusuario; detalle (cookies o tokens) en el change de autenticación |
| Pagos | Stripe Checkout (modo de pruebas) + webhooks | la app nunca ve los datos de la tarjeta |
| Imágenes de producto | Almacenamiento compatible con S3 | volumen local en desarrollo |
| Email | Mailhog en local | bandeja en http://localhost:8025; nunca entrega a internet |
| Tests backend | pytest | |
| Tests frontend | Vitest + React Testing Library | |
| Tests de extremo a extremo | Playwright | un "robot" que compra en la tienda como una persona |
| Calidad | Ruff, mypy, ESLint, Prettier, pre-commit | desde el esqueleto, no a mitad del proyecto |
| CI/CD | GitHub Actions + Dependabot | CI en cada push; CD (despliegue automático) en su propio change |
| Orquestación local | Docker Compose | frontend, backend, db y mailhog |
| Despliegue | Plataforma sencilla con URL real | se elige en el change de despliegue |
| Planificación | OpenSpec | cada cambio se planifica antes de implementarse |

En el ordenador de la autora **no hay Node.js instalado**: el frontend corre
dentro de Docker, igual que en ExpenseTrack.

## Estructura de carpetas (prevista)

```
Voxel3D/
├── CLAUDE.md
├── BUENAS_PRACTICAS.md
├── DISENO.md
├── docker-compose.yml
├── .env.example
├── LICENSE              # MIT
├── openspec/
│   ├── specs/           # cómo funciona hoy cada parte (fuente de verdad)
│   └── changes/         # mejoras pendientes; archive/ = changes ya hechos
├── backend/
│   ├── app/
│   │   ├── core/        # config, base de datos, seguridad, metadatos OpenAPI
│   │   ├── modules/     # un módulo por tema: catalog, cart, orders, inventory,
│   │   │                #   payments, users, shipping (routers, services, models, schemas)
│   │   └── main.py
│   ├── alembic/         # migraciones
│   ├── scripts/         # crear administradora, seed de datos de prueba, openapi.json
│   ├── tests/
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── app/         # rutas de Next.js
    │   ├── features/    # catalog, cart, checkout, account, admin...
    │   └── components/  # piezas compartidas
    ├── e2e/             # tests de Playwright
    └── Dockerfile
```

## Reglas de negocio importantes

- **Inventario:** el stock es de cada variante. Al pagar, se comprueba y se
  descuenta dentro de una transacción de base de datos con bloqueo de fila,
  para que dos personas no compren la última unidad a la vez. Todo cambio de
  stock queda en un historial de movimientos con su motivo.
- **Pagos:** el pedido se crea como "pendiente de pago" y solo pasa a
  "pagado" cuando llega el **webhook** firmado de Stripe. El webhook es
  idempotente: si Stripe avisa dos veces del mismo pago, el pedido se procesa
  una sola vez.
- **Estados del pedido:** Pendiente → En impresión → Listo → Entregado, y
  Cancelado. El **estado del pago** va aparte (pendiente de pago, pagado,
  fallido). Solo se preparan pedidos ya pagados y hay transiciones permitidas
  (por ejemplo, un pedido "Listo" no vuelve a "Pendiente"). Se confirmará al
  escribir la spec de pedidos.
- **Envío:** a domicilio con una **tarifa fija** configurable. La dirección se
  copia dentro del pedido, así cambiar la libreta no altera pedidos antiguos.
- **Invitado:** el carrito vive en el servidor, ligado a una cookie anónima
  `HttpOnly`, y se fusiona con el de la cuenta al iniciar sesión. Un pedido de
  invitado se consulta con un enlace firmado y con caducidad enviado por
  email; nunca basta con conocer el número de pedido. Los pedidos de invitado
  **no** se enlazan a una cuenta solo porque coincida el email: primero se
  verifica ese email.
- **Seguridad:** el servidor comprueba el rol en **cada** petición (ocultar un
  botón no protege nada) y hay tests que lo verifican: un cliente recibe un
  error de permisos en las rutas de administración y no puede ver pedidos de
  otra persona.

## Buenas prácticas y diseño

- [`BUENAS_PRACTICAS.md`](./BUENAS_PRACTICAS.md): convenciones de código,
  testing, seguridad, Docker y Git.
- [`DISENO.md`](./DISENO.md): identidad visual aprobada (paleta, tipografías,
  componentes, reglas de móvil). El diseño se decidió **antes** de programar
  las pantallas, para evitar un rediseño a mitad de proyecto.

## Cómo se corre en local

*(Se completará con el change `project-skeleton`.)* La meta es que arrancar
todo sea siempre:

```bash
cp .env.example .env
docker compose up --build
```

## Plan de changes (orden previsto)

1. `project-skeleton`: repositorio, Docker Compose, `/health`, migración
   inicial, frontend conectado, primer test, linters, pre-commit y CI.
2. `visual-identity`: tokens de diseño, logo y componentes base de `DISENO.md`.
3. `users-auth-roles`: registro, login, roles y creación de la administradora.
4. `catalog-and-products`: categorías, productos, variantes e imágenes, y su
   gestión desde el panel.
5. `cart`: carrito en servidor con cookie anónima.
6. `guest-checkout`: compra sin cuenta, dirección y envío.
7. `stripe-payments`: pago y webhooks.
8. `orders-management`: estados del pedido y panel de pedidos.
9. `inventory`: reserva y descuento de stock, historial y avisos.
10. `account-and-history`: perfil, libreta de direcciones e historial.
11. `deployment`: URL real y despliegue automático.

## Decisiones tomadas

Formato: decisión · alternativas que se miraron · por qué.

- **Frontend con Next.js** · React + Vite como en ExpenseTrack · una tienda
  necesita que los buscadores encuentren sus productos (SEO) y Next.js es el
  framework de React más pedido en ofertas.
- **Backend con FastAPI, PostgreSQL, SQLAlchemy y Alembic** · Django, NestJS
  · ya se conoce el stack, el tipado con Pydantic enseña buenas bases y la
  documentación OpenAPI es automática.
- **Monolito modular** · microservicios · un proyecto junior no necesita la
  complejidad de varios servicios; se ordena el código en módulos por tema.
- **Pagos con Stripe Checkout en modo de pruebas** · formulario de pago propio,
  PayPal · la app nunca toca datos de tarjeta, es lo que usan las empresas y
  enseña webhooks. No se mueve dinero real.
- **Compra como invitada desde el inicio** · exigir registro · menos fricción
  para comprar; el registro es opcional tras la compra.
- **Carrito en el servidor con cookie anónima** · carrito en `localStorage` ·
  precios y stock siempre los controla el servidor, y la fusión al iniciar
  sesión es limpia.
- **Una sola administradora, creada desde el servidor** · registro de
  administradoras desde la web, varios administradores · evita que cualquiera
  se haga administradora y simplifica los permisos.
- **Envío a domicilio con tarifa fija** · solo recogida, transportistas con
  seguimiento · realista para un portafolio sin complicar el MVP.
- **Variantes con stock propio (acabado + color)** · un producto distinto por
  color · el stock es de cada variante; es una regla de negocio más rica.
- **Categorías de dos niveles + filtros** · "Filamentos" como categoría ·
  seda, mármol o madera son un acabado que cualquier producto puede tener, no
  un tema. "Novedades" y "Más vendidos" son ordenaciones calculadas.
- **Diseño metálico** (opción B de las maquetas) · versión simplificada
  (opción A) · es la identidad que más gusta a la autora; ver `DISENO.md`.
- **Todo en español y precios en euros** · multiidioma · el público objetivo es
  España; el multiidioma queda como ficha futura.
- **Repositorio público con licencia MIT; rama principal `main`** · igual que
  ExpenseTrack, en la misma cuenta de GitHub (EMendozaRojas).
- **Calidad y CI desde el primer change** · añadirlos a mitad del proyecto ·
  en ExpenseTrack llegaron con más de un mes de código y costó ordenarlo.

## Pendiente de decidir

| Tema | Se decide en |
|---|---|
| Importe de la tarifa fija y si el envío es solo a España | `guest-checkout` |
| Si el precio es el mismo para todas las variantes de un producto | `catalog-and-products` |
| Cookies `HttpOnly` o tokens para la sesión | `users-auth-roles` |
| Plataforma de despliegue y proveedor de email real | `deployment` |
| Logo en imagen, más fiel que el hecho con CSS | `visual-identity` |
| Lista y fotos de los productos de ejemplo (diseños sin marcas registradas) | `catalog-and-products` |
