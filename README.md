# LEXX — Sitio de productor musical

Sitio estático de una sola página, hecho con **Astro 7** y CSS puro (sin
framework de estilos), estética **Bold Retro-Modernism**, desplegado en
**GitHub Pages**.

- **Estilo:** superficie crema con texto carbón, y una triada retro de rojo ·
  azul vintage · amarillo sol. Lo que define el estilo no es la paleta: son los
  **campos de color a sangre**, secciones que ocupan todo el ancho de la
  pantalla y cuya alternancia marca el ritmo de la página. Titulares enormes en
  mayúsculas con interlínea 1.0, esquina viva, bordes de pelo y **ninguna
  sombra**. Hay tema oscuro detrás del interruptor, pero el estilo es de base
  clara.
- **Tipografías:** Clash Display para titulares (autoalojada en `public/fonts/`,
  licencia Fontshare libre para uso comercial) y Jost para el texto corrido
  (vía `@fontsource`). Ninguna hace peticiones a servidores de terceros.
- **JavaScript:** solo el interruptor de tema claro/oscuro. Todo lo demás es
  HTML y CSS.
- **Contacto:** sin formulario ni backend — WhatsApp y `mailto:` directos.
- **Peso del sitio compilado:** ~188 KB, fuentes incluidas.

---

## Índice

1. [Arrancar el proyecto](#1-arrancar-el-proyecto)
2. [Mapa de archivos](#2-mapa-de-archivos)
3. [Configurar cada sección](#3-configurar-cada-sección)
   · [Hero (la portada)](#hero-la-portada)
   · [Secciones con imágenes](#secciones-con-imágenes)
   · [Imágenes por enlace (Google Drive)](#5-imágenes-por-enlace-google-drive-dropbox)
   · [Móvil: menú y efectos por scroll](#móvil-menú-y-efectos-por-scroll)
4. [Colores y tipografía](#4-colores-y-tipografía)
5. [Añadir una sección nueva](#5-añadir-una-sección-nueva)
6. [Desplegar en GitHub Pages](#6-desplegar-en-github-pages)
7. [Conectar un dominio propio](#7-conectar-un-dominio-propio)
8. [Checklist antes de publicar](#8-checklist-antes-de-publicar)
9. [Trampas conocidas](#9-trampas-conocidas)

---

## 1. Arrancar el proyecto

Necesitas **Node 20 o superior** (el proyecto se desarrolló con Node 22).

```bash
npm install
```

```bash
npm run dev
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local con recarga en caliente: http://localhost:4321 |
| `npm run build` | Compila el sitio a `dist/` |
| `npm run preview` | Sirve `dist/` para revisar el resultado final antes de publicar |

`npm run build` es también tu validador: si te equivocas en un campo del
contenido, falla e indica el archivo y el campo exactos.

---

## 2. Mapa de archivos

```
src/
├─ config.ts             ← datos de contacto, redes, menú, SEO
├─ content.config.ts     ← esquema de las colecciones (qué campos son válidos)
├─ content/
│  ├─ servicios/         ← un .md por servicio
│  ├─ trabajos/          ← un .md por trabajo del portafolio
│  ├─ testimonios/       ← un .md por cliente
│  ├─ estudio/           ← un .md por bloque de foto + texto
│  ├─ galeria/           ← un .md por foto de la galería
│  └─ faq/               ← un .md por pregunta
├─ lib/
│  └─ imagen.ts          ← traduce enlaces de Drive/Dropbox a imagen directa
├─ scripts/
│  └─ foco.ts            ← en móvil, el scroll enciende los efectos de :hover
├─ styles/
│  ├─ brand.css          ← COLORES, TIPOGRAFÍA Y MEDIDAS (tu archivo de marca)
│  └─ global.css         ← reset, tipografía base, botones, utilidades
├─ layouts/
│  └─ BaseLayout.astro   ← <head>, SEO, Open Graph, JSON-LD, tema oscuro
├─ components/
│  ├─ Header.astro       ← barra fija con menú y botón de tema
│  ├─ Hero.astro         ← titular y llamadas a la acción
│  ├─ HeroArt.astro      ← tornamesa + ecualizador (CSS puro)
│  ├─ Marquee.astro      ← banda de referencias en movimiento
│  ├─ Services.astro     ← tarjetas de servicios
│  ├─ Works.astro        ← portafolio
│  ├─ Embed.astro        ← reproductor de Spotify / YouTube / SoundCloud
│  ├─ Process.astro      ← los cuatro pasos
│  ├─ Testimonials.astro ← citas de clientes
│  ├─ Faq.astro          ← acordeón de preguntas
│  ├─ Contact.astro      ← WhatsApp y correo
│  ├─ Footer.astro       ← pie con redes
│  └─ Shape.astro        ← figuras geométricas reutilizables
└─ pages/
   ├─ index.astro        ← el orden de las secciones se define aquí
   └─ 404.astro

public/                  ← se copia tal cual a la raíz del sitio
├─ fonts/                ← Clash Display (3 pesos)
├─ img/
│  └─ hero/              ← las dos versiones de la foto de portada
├─ favicon.svg
├─ robots.txt
└─ CNAME                 ← lo creas tú al conectar el dominio (paso 7)

.github/workflows/deploy.yml   ← publica en GitHub Pages en cada push
```

**Regla general:** los datos van en `config.ts` o en `src/content/`. Los
colores y medidas, en `brand.css`. Solo tocas un componente cuando cambias
la *estructura* de una sección, no su contenido.

---

## 3. Configurar cada sección

### Menú y barra superior

`src/config.ts` → `NAV`. Cada entrada apunta al `id` de una sección:

```ts
export const NAV = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Trabajos', href: '#trabajos' },
];
```

Por debajo de 60 rem (960 px) los enlaces no caben en la barra y pasan a un
**panel desplegable** que abre el botón de las tres barras de colores. El
panel se cierra solo al elegir un enlace, con Escape, y si la ventana crece
hasta que la barra vuelve a caber. Mientras está abierto, la página de detrás
no hace scroll.

Por debajo de 30 rem (480 px) tampoco cabe el botón "Cotizar", así que se va
al final del panel. La misma lista de `NAV` alimenta las dos versiones: no
hay un menú de móvil que mantener aparte.

### Hero (la portada)

Una fotografía a sangre, atenuada con una viñeta, y encima un campo de
figuras geométricas que se aparta del puntero.

**Textos:** en `src/components/Hero.astro`, dentro del `<h1>` y del
`<p class="lead">`. El `<br />` decide dónde parte cada línea del titular y
`<span class="hl">` es el resaltado magenta.

**Todo lo demás se configura en `src/config.ts` → `HERO`:**

```ts
export const HERO = {
  imagen: '/img/hero/estudio-ancho.webp',      // '' = sin foto, fondo liso
  imagenMovil: '/img/hero/estudio-alto.webp',  // '' = usa la de arriba
  encuadre: 'center 52%',   // qué parte se conserva al recortar
  oscurecer: 0.5,           // 0 = foto limpia · 1 = negro
  vineta: 0.9,              // cuánto se cierran las esquinas
  particulas: true,         // false = solo la foto
};
```

`imagen` acepta lo mismo que el resto del sitio: una ruta de `/public` o una
URL completa, enlace de Google Drive incluido.

#### Las dos fotos

Un recorte apaisado en una pantalla de pie se queda en una rendija, así que
hay dos versiones y el navegador elige: la vertical por debajo de 55 rem
(880 px) y la apaisada por encima. **Si cambias la foto, cambia las dos.**
Con `imagenMovil: ''` se usa la misma para todo, que también vale.

Para generar las dos desde un original, con `sharp` (ya está instalado):

```bash
node -e "const s=require('sharp');s('MI-FOTO.jpg').resize({width:1800}).webp({quality:76}).toFile('public/img/hero/estudio-ancho.webp');s('MI-FOTO.jpg').resize({width:1000}).webp({quality:76}).toFile('public/img/hero/estudio-alto.webp')"
```

La foto del hero es lo primero y lo más pesado que carga la página: que pese
**menos de 300 kB**. Las que hay ahora ocupan 120 kB y 71 kB.

#### La viñeta

Son tres capas sobre la foto, y las dos primeras se controlan desde `HERO`:
un oscurecido plano (`oscurecer`), un degradado desde abajo que le da suelo
al texto, y la elipse que cierra las esquinas (`vineta`). Si la foto que
pongas es clara, sube `oscurecer` hasta que el titular se lea sin esfuerzo.

#### Las partículas

`src/components/Hero.astro`, al final, en el `<script>`. Son las figuras del
vocabulario Bauhaus del sitio —círculo, medio círculo, cuarto, triángulo y
cuadrado—, todas blancas, unas rellenas y otras a línea. Flotan despacio,
giran sobre sí mismas y se apartan del puntero.

Las constantes de arriba del script son los mandos:

| Constante  | Qué hace                                              |
| ---------- | ----------------------------------------------------- |
| `DENSIDAD` | Figuras por píxel de pantalla. Más alto = más llena.  |
| `MAX`      | Tope de figuras, para que un monitor grande no se vaya |
| `TAM`      | Radio mínimo y máximo, en píxeles                     |
| `ALFA`     | Opacidad. Es un fondo: si se lee, estorba.            |
| `ALCANCE`  | Hasta dónde llega el empuje del puntero               |
| `HILO`     | Distancia a la que dos figuras se unen con una línea  |

No usa ninguna librería: son cuarenta figuras y una resta de vectores. Se
para sola cuando el hero sale de pantalla o la pestaña pasa a segundo plano,
y con "reducir movimiento" activado en el sistema se pinta una vez y se queda
quieta.

> La ilustración anterior del tocadiscos sigue en
> `src/components/HeroArt.astro`, sin usar. Para recuperarla, impórtala en
> `Hero.astro` y ponla donde quieras; si no la vas a querer, borra el archivo.

### Banda de referencias (marquesina)

`src/components/Marquee.astro` → array `referencias`. Son los nombres que
desfilan bajo el hero: artistas, sellos, estudios, medios.

```astro
const referencias = ['CELG', 'OVAN', 'GustavoBK', 'Bleuss'];
```

Repite la lista si tienes pocos nombres, para que la banda no muestre huecos.
Se detiene al pasar el cursor para poder leerla.

### Servicios

Un archivo por servicio en `src/content/servicios/`.

```yaml
---
titulo: Mezcla
resumen: Balance, profundidad y punch en cualquier sistema de escucha.
desde: "$3,500 MXN"        # opcional; bórralo para ocultar el precio
entrega: 5–7 días          # opcional
incluye:
  - Mezcla analógica híbrida
  - Stems y versión instrumental
color: blue                # red | yellow | blue | ink
figura: square             # circle | square | triangle | quarter
orden: 2                   # de menor a mayor
---
```

| Campo | Obligatorio | Notas |
| --- | --- | --- |
| `titulo` | sí | Hasta ~12 caracteres cabe en una línea en la fila de cuatro tarjetas; más largo se parte solo, sin desbordar |
| `resumen` | sí | Una o dos frases |
| `desde` | no | Texto libre: puedes poner `"A cotizar"` |
| `entrega` | no | Texto libre |
| `incluye` | sí | Lista de viñetas |
| `color` | no | Por defecto `red` |
| `figura` | no | Por defecto `circle` |
| `orden` | no | Por defecto `0` |

El cuerpo del archivo (debajo del segundo `---`) **no se usa** en esta sección.

La retícula pasa de 1 columna a 2 en 42 rem (672 px) y a 4 en 68 rem (1088 px).
Con cuatro servicios se ve una fila limpia; con cinco o seis conviene bajar a
3 columnas en `Services.astro`.

### Trabajos (portafolio)

Un archivo por trabajo en `src/content/trabajos/`.

```yaml
---
titulo: Lista prod. by Lexx
artista: ThisIsLexx + Colaboradores
anio: 2026
genero: [Reggaeton, Trap]   # un texto o una lista
roles: [Producción, Mezcla]
plataforma: spotify         # spotify | youtube | soundcloud
embedId: playlist/33DgdG7Me8xfhC4b5f28gh
reproductor: 560            # solo Spotify — ver más abajo
destacado: false            # true = ocupa el ancho completo
orden: 1
---
```

**De dónde sacas el `embedId`:**

| Plataforma | Qué copias | Ejemplo |
| --- | --- | --- |
| `spotify` | Lo que va después de `open.spotify.com/`, incluido el tipo | `track/4cOdK...`, `album/1DFix...`, `playlist/33Dgd...` |
| `youtube` | El ID del vídeo (lo que sigue a `watch?v=`) | `dQw4w9WgXcQ` |
| `soundcloud` | El **ID numérico** de la pista: Compartir → Insertar, aparece dentro del código | `1234567890` |

**El campo `reproductor`** (solo afecta a Spotify). Spotify nunca informa de
cuánto ocupa su reproductor, y además **elige el diseño según la proporción
de la caja**. Medido en pantalla:

| Caja | Qué dibuja Spotify |
| --- | --- |
| ancha y baja (1136 × 168) | barra horizontal con lista de 2 filas y scroll |
| ancha y alta (1136 × 500) | tarjeta grande con portada, **sin lista** |
| estrecha y alta (546 × 560) | lista vertical con 7 canciones y duraciones |
| cualquiera × 80 | barra compacta, sin lista |

Valores admitidos:

```yaml
reproductor: compacto   # 80px, la barra sin lista (por defecto)
reproductor: lista      # 352px, lista con scroll
reproductor: 560        # un alto exacto en píxeles (entre 80 y 720)
```

Consecuencias prácticas:

- Por debajo de ~170 px Spotify **esconde la lista** y cae al compacto.
- Para lucir el catálogo de una playlist, dale un alto grande (≈560 px) y
  **no** la marques como `destacado`: a todo el ancho pierde la lista.
- Con pocas canciones y diseño de lista, el alto exacto es unos
  **80 px de base + 44 px por canción** (2 temas → 168 px).
- Si te pasas de alto queda una franja vacía, pero apenas se nota: el fondo
  de la caja es el mismo gris del reproductor (`--embed-bg`).

YouTube usa su 16:9 real y SoundCloud 300 px con el reproductor visual; esos
dos llenan siempre y están fijados en `src/components/Embed.astro`.

### Proceso

Los cuatro pasos están en el array `pasos` de `src/components/Process.astro`
(no son una colección, porque casi nunca cambian):

```astro
const pasos = [
  { titulo: 'Llamada', texto: '…', color: 'red' },
  { titulo: 'Preproducción', texto: '…', color: 'blue' },
];
```

Colores válidos: `red`, `blue`, `yellow`, `ink`. La retícula es de 2 columnas
desde 34 rem (544 px) — **no de 4 a propósito**: con cuatro columnas cada
tarjeta se queda en ~204 px útiles y cualquier palabra de 13 letras o más se
parte. Si añades o quitas pasos, revisa que el número de tarjetas cuadre con
las 2 columnas.

### Testimonios

Un archivo por cliente en `src/content/testimonios/`. **La cita va en el
cuerpo**, debajo del segundo `---`:

```yaml
---
nombre: Ana Ruiz
proyecto: EP "Cardinal"
rol: Cantautora                      # opcional
foto: /img/clientes/ana.jpg          # opcional, ruta dentro de /public
rating: 5                            # 1 a 5
orden: 1
---
Llegué con seis maquetas grabadas en el celular y salí con un EP que suena
a disco.
```

Las fotos se muestran en círculo y en blanco y negro, para no romper la
paleta. Van en `public/img/clientes/` y se referencian con ruta absoluta
(`/img/...`). La retícula es de 3 columnas desde 48 rem (768 px), así que los
testimonios lucen mejor en múltiplos de tres.

### Secciones con imágenes

El sitio tiene cuatro sitios donde entran fotos. Los cuatro son **opcionales**:
mientras no pongas una imagen, no se pinta nada y la página se ve exactamente
como sin ellos.

Hay dos maneras de poner una foto, y los cuatro campos aceptan las dos:

- **Archivo en el repositorio** (recomendado). Va **dentro de `public/`** y se
  escribe SIN la palabra `public`, empezando por barra: si el archivo está en
  `public/img/estudio/cabina.jpg`, la ruta es `/img/estudio/cabina.jpg`.
- **Enlace externo**: pega la URL completa, incluido el enlace de "Compartir"
  de Google Drive. Está explicado en el punto 5 de aquí abajo.

#### 1. Estudio — foto grande y texto, alternando el lado

Un archivo por bloque en `src/content/estudio/`. El primero lleva la foto a la
izquierda, el segundo a la derecha, y así sucesivamente: **no hay que
indicarlo**, sale del orden.

```yaml
---
titulo: La cabina
imagen: /img/estudio/cabina.jpg   # vacío ('') = el bloque no se pinta
alt: Cabina de grabación con el micrófono montado
figura: circle                    # circle | square | triangle | quarter
color: magenta                    # red | magenta | blue
orden: 1
---

El texto del bloque va aquí, en el cuerpo. Admite varios párrafos.
```

La foto sale en gris y recupera el color al pasar el ratón. La figura Bauhaus
se solapa con la esquina y gira 90° en el mismo gesto.

#### 2. Sesiones — galería

Un archivo por foto en `src/content/galeria/`.

```yaml
---
imagen: /img/galeria/sesion-01.jpg
alt: Sesión de grabación de voces
titulo: Sesión de voces   # opcional; es el pie que sube al pasar el ratón
ancha: false              # true = ocupa dos columnas en pantallas grandes
formato: apaisado         # apaisado (4:3) | vertical (3:4) | cuadrado | original
orden: 1
---
```

**`formato` es el que evita los recortes.** El hueco de la retícula tiene una
proporción fija y la foto se recorta para llenarlo, así que si metes una foto
vertical en el hueco apaisado que viene por defecto, se quedan fuera la parte
de arriba y la de abajo. Pon `formato: vertical` y el hueco se pone de pie.
`original` respeta la proporción exacta de la foto y no recorta nada, a costa
de que la retícula quede menos regular.

Las fotos van en gris bajo una veladura magenta que se retira al acercarse.
El pie aparece al pasar el ratón; **en pantallas táctiles se queda siempre
visible**, porque ahí no hay puntero y la información no puede depender de él.

#### 3. Carátulas en los trabajos

Dos campos opcionales más en cualquier archivo de `src/content/trabajos/`:

```yaml
portada: /img/trabajos/mi-ep.jpg
portadaAlt: Carátula del EP
```

Aparece cuadrada encima del reproductor. Sin ella, la tarjeta se queda como
estaba.

#### 4. Fotos en los testimonios

Ya estaba programado desde el principio: añade `foto` a cualquier archivo de
`src/content/testimonios/`.

```yaml
foto: /img/clientes/celg.jpg
```

Sale en círculo, en escala de grises y con borde de tinta.

#### 5. Imágenes por enlace (Google Drive, Dropbox…)

En vez de una ruta, cualquiera de los cuatro campos admite una URL completa:

```yaml
imagen: https://drive.google.com/file/d/1A2b3C.../view?usp=sharing
```

Es el enlace tal cual sale del botón **Compartir** de Drive: no hay que
retocarlo. `src/lib/imagen.ts` lo traduce antes de pintarlo, porque ese enlace
abre el visor de Drive, no la imagen. Reconoce las cuatro formas que reparte
Drive (`/file/d/ID/view`, `open?id=`, `uc?export=view&id=`, `usercontent`), las
convierte a `https://drive.google.com/thumbnail?id=ID&sz=w1600` y de paso
arregla los enlaces de Dropbox. Cualquier otra URL pasa intacta.

**Para que funcione, el archivo tiene que estar compartido con "Cualquier
persona con el enlace"** (Compartir → Acceso general). Si está restringido, el
visitante ve un hueco: el navegador pide la imagen sin tu sesión de Google.

Antes de montar la página entera sobre Drive, ten claro esto:

- Drive **no es un servidor de imágenes**. Ese `thumbnail` no está
  documentado por Google, lo han cambiado ya varias veces y puede dejar de
  funcionar sin aviso.
- Tiene **cuota**: si la página recibe visitas de golpe, Drive empieza a
  devolver error y las fotos desaparecen hasta que se enfría.
- Es **lento** comparado con servir el archivo desde el propio sitio, y no
  puedes controlar el formato ni la caché.
- Si mueves el archivo a la papelera o cambias el permiso, la foto se cae de
  la página sin que nadie te avise.

Sirve muy bien para **probar** una foto sin hacer commit, o para algo temporal.
Para las fotos definitivas, mejor una de estas, por orden de comodidad:

1. **`public/img/`**, como el resto del sitio: viajan con el repositorio, se
   publican con GitHub Pages y no dependen de nadie.
2. **Cloudinary o ImageKit** (plan gratis): te dan URL directa, redimensionan
   y sirven WebP solos. Pegas la URL en el mismo campo y ya está.
3. **Un repositorio de GitHub servido por jsDelivr**
   (`https://cdn.jsdelivr.net/gh/usuario/repo@main/foto.jpg`).

#### El menú y la numeración se ajustan solos

Estudio y Sesiones **solo existen si tienen fotos**. Mientras estén vacías:

- sus enlaces no aparecen en el menú (si no, apuntarían a un ancla inexistente),
- y la numeración va corrida — `01 / Servicios`, `02 / Trabajos`… — sin dejar
  huecos.

En cuanto pongas la primera imagen, la sección aparece, su enlace entra en el
menú y todo se renumera. No hay que tocar código.

#### Antes de subir las fotos

- Recórtalas a **4:3** (Estudio y Sesiones) o **1:1** (carátulas). El CSS las
  recorta igualmente con `object-fit: cover`, pero si las recortas tú eliges
  qué parte se ve. En Sesiones, si la foto es vertical y no quieres recortarla,
  usa `formato: vertical` en vez de pelearte con el recorte.
- Redúcelas a **1600 px de ancho como mucho** y guárdalas en WebP o JPG de
  calidad media. Las imágenes se cargan con `loading="lazy"`, pero una foto de
  6 MB sigue siendo una foto de 6 MB.
- Escribe siempre el `alt`. Describe lo que se ve, no pongas "foto de estudio".

---

### Móvil: menú y efectos por scroll

En una pantalla táctil no hay puntero, así que **todos los efectos de
`:hover` del sitio no se verían nunca**: las tarjetas que se levantan, las
fotos que recuperan el color, los pasos del proceso que se rellenan con su
color. `src/scripts/foco.ts` los enciende con el scroll: lo que va pasando
por la **banda central de la pantalla** (el 30% de en medio) se pone "en
foco", y se apaga al salir.

Solo se activa donde no hay ratón. En escritorio el archivo no hace nada.

Para que un elemento nuevo entre en el sistema hacen falta dos cosas:

1. Marcarlo en el HTML con `data-foco`.
2. Escribir su efecto respondiendo a las dos cosas a la vez:

```css
.mi-tarjeta:is(:hover, .en-foco) {
  transform: translate(-5px, -5px);
  box-shadow: var(--shadow-hard);
}
```

El ratón lo enciende por `:hover` y el scroll por la clase. Una sola regla:
no hay dos versiones del mismo efecto que se puedan desincronizar.

**La FAQ queda fuera a propósito.** Es un acordeón: ahí la interacción la
pone el usuario al abrir una pregunta, y un realce automático al pasar por
delante solo confunde sobre cuál está abierta. Con ratón sí lo tiene, porque
ahí el hover es intencionado.

Si quieres cambiar cuándo se enciende, la constante `BANDA` de `foco.ts` es
el `rootMargin` del observador: `-35% 0px -35% 0px` deja viva la franja
central. Súbelo a `-45%` para que solo se encienda lo que está justo en el
centro.

### FAQ

Un archivo por pregunta en `src/content/faq/`. **La respuesta va en el
cuerpo**:

```yaml
---
pregunta: ¿En qué formato debo enviar mis pistas?
orden: 1
---
WAV a 24 bits, todas empezando en el mismo punto cero y sin efectos de máster.
```

Es un acordeón con `<details name="faq">`: al abrir una, se cierra la anterior.

### Contacto y pie de página

Todo sale de `src/config.ts`:

```ts
export const CONTACT = {
  whatsapp: '523312861625',      // internacional, SIN +, espacios ni guiones
  whatsappMessage: 'Hola Lexx!, vi tu página y…',
  email: 'thisislexxb@gmail.com',
  emailSubject: 'Cotización de producción musical',
  emailBody: 'Hola Lexx,\n\nMi proyecto es:\n…',
};

export const SOCIAL = [
  { label: 'Instagram', url: 'https://instagram.com/…' },
];
```

El número de WhatsApp va en formato internacional pegado: México es
`52` + lada + número → `523312861625`. El asunto y el cuerpo del correo se
codifican solos; escribe los saltos de línea como `\n`.

Añadir o quitar una red social es editar el array `SOCIAL`: aparece en el pie
automáticamente.

### SEO y datos del sitio

También en `config.ts`, dentro de `SITE`: `name`, `role`, `tagline`,
`description`, `city`, `url`. Con eso `BaseLayout.astro` construye el
`<title>`, la descripción, las etiquetas Open Graph y el JSON-LD de
`ProfessionalService` que ayuda a aparecer en búsquedas del tipo
"productor musical Guadalajara".

Falta una imagen en `public/img/og.png` (1200 × 630 px): es la miniatura que
se ve al compartir el enlace por WhatsApp o redes.

---

## 4. Colores y tipografía

Todo vive en `src/styles/brand.css`, organizado en 7 bloques numerados más las clases de campo.

### Colores de marca

```css
--brand-charcoal: #2b2b2b;  /* carbón cálido, la base */
--brand-cream: #f6f2e5;     /* crema hueso, el texto  */

--brand-red: #ba2c2c;       /* rojo retro   */
--brand-blue: #5ea4c9;      /* azul vintage */
--brand-yellow: #fcd65a;    /* amarillo sol */
```

Cambia esos cinco valores y se recolorea el sitio entero.

**La triada tiene dos juegos por color, y no es capricho.** Un color que
*hospeda* texto y un color que *es* texto necesitan luminosidades distintas, y
ningún tono cumple bien las dos cosas:

| Familia | Para qué | Ejemplos de uso |
| --- | --- | --- |
| `--brand-red` · `--brand-blue` · `--brand-yellow` | **Bloques**: llevan texto encima, así que contrastan con `--color-on-*` | Tarjetas de servicio, botones, la banda de referencias, etiquetas |
| `--color-accent-text` · `--color-accent-2-text` · `--color-accent-3-text` | **Texto y marcas finas**: van directamente sobre el fondo de página, así que contrastan con *el fondo* | Numerales, comillas, barras del ecualizador, líneas de 2–3 px, figuras decorativas |

Si mezclas los dos papeles algo desaparecerá. El caso más visible es el
amarillo: `#fcd65a` sobre carbón es perfecto y sobre crema es invisible, así
que en tema claro `--color-accent-3-text` baja hasta ocre (`#8f6508`).

**Regla práctica:** un bloque de color sobre fondo claro necesita borde o
texto oscuro. Todas las tarjetas ya llevan `--border-w` de línea, que es
justo lo que las salva.

### Roles semánticos

Los componentes **nunca** usan los colores de marca directamente, sino sus
roles. Así puedes reasignar qué color cumple qué función sin tocar CSS de
componentes:

| Token | Para qué |
| --- | --- |
| `--color-accent` | CTA principal y énfasis (hoy: rojo) |
| `--color-accent-2` | Secciones alternas (hoy: azul) |
| `--color-accent-3` | Destacados y resaltados (hoy: amarillo) |
| `--color-accent-text` · `-2-text` · `-3-text` | Los mismos tres, en su versión legible como texto |
| `--color-on-red` · `--color-on-blue` · `--color-on-yellow` | Texto encima de cada color de bloque |
| `--color-fg` / `--color-bg` | Primer plano y fondo de la superficie actual |
| `--color-muted` | Texto secundario |
| `--surface-card` | Fondo de tarjeta sobre la superficie actual |

**Por qué hay un `--color-on-*` por color y no uno solo:** el rojo es oscuro y
pide texto blanco; el azul y el amarillo son claros y piden texto carbón. Un
único token no puede servir a los tres.

### Campos de color

**Es el mecanismo central del estilo.** Cada sección es un rectángulo de color
de borde a borde de la pantalla, y el ritmo de la página lo da su alternancia.
Se aplica con una clase en la etiqueta `<section>`:

```astro
<section class="section field-red" id="contacto">
```

| Clase | Fondo | Texto |
| --- | --- | --- |
| `.field-cream` | Crema (o carbón en tema oscuro) | Sigue al tema |
| `.field-white` | Blanco puro | Carbón |
| `.field-red` | Rojo retro | Blanco |
| `.field-yellow` | Amarillo sol | Carbón |
| `.field-blue` | Azul vintage | Carbón |
| `.field-ink` | Carbón | Crema |

Cada clase no solo pinta el fondo: **redefine los tokens del tema dentro del
campo**. Por eso un componente escrito con `--brand-ink` y
`--color-accent-text` sigue contrastando esté sobre crema, sobre rojo o sobre
carbón, sin saber en cuál está. Es lo que evita tener una variante de cada
componente por color de fondo.

El reparto actual, de arriba abajo: portada **rojo** · marquesina **azul** ·
servicios **crema** · trabajos **carbón** (los reproductores son oscuros y
encajan) · proceso **amarillo** · testimonios **crema** · FAQ **azul** ·
contacto **rojo** · pie **carbón**.

Al añadir un campo nuevo, redefine **siempre** estos: `--brand-ink`,
`--brand-paper`, `--color-fg`, `--color-bg`, `--color-muted`,
`--surface-card` y los tres `--color-accent*-text`.

> **Ojo con `--color-fg` y `--color-bg`.** Un custom property se resuelve
> donde se **declara**, no donde se usa. Si dentro de un campo solo redefines
> `--brand-ink`, los componentes que usen `--color-fg` seguirán con el valor
> que se calculó en `:root` y quedarán ilegibles sobre el campo. Cuesta verlo
> porque el compilador no dice nada.

### Tipografía

```css
--font-display: 'Clash Display', …;   /* titulares */
--font-body: 'Jost Variable', …;      /* texto corrido */
```

La escala es fluida (`clamp`), sin media queries. Los títulos de tarjeta
tienen su propio escalón, `--step-card`, más contenido que `--step-1`, porque
viven en columnas estrechas. Los titulares grandes usan interlínea de cartel
(`--leading-display: 1` — las líneas se tocan, como pide el estilo) y los de
tarjeta una un punto más abierta (`--leading-card: 1.05`), porque a menudo
ocupan dos líneas. Todos van en `--weight-display: 700`, lo más grueso que
trae Clash Display.

El otro rasgo del estilo es el contraste de espaciado entre extremos: los
titulares van sin apretar ni soltar (`--tracking-display: 0`) y las etiquetas
en mayúsculas muy abiertas (`--tracking-label: 0.3em`). Si bajas ese `0.3em`
el sitio pierde la mitad de su carácter.

### Medidas y geometría

| Token | Qué controla |
| --- | --- |
| `--radius` | Redondeo. Está en `0px`: el estilo es esquina viva |
| `--border-w` / `--border-w-thick` | Grosor de línea (1 px / 2 px) |
| `--shadow-hard` | Vale `none` a propósito: el estilo no lleva sombras |
| `--gap-cards` | **Separación entre tarjetas en todas las secciones** |
| `--space-1` … `--space-7` | Escala de espaciado |
| `--content-max` | Ancho máximo del contenido (78 rem) |
| `--gutter` | **Aire a los lados.** El mínimo (1.75 rem) es el que manda en móvil |
| `--transition` | Velocidad normal de los realces (180 ms) |
| `--transition-lento` | La de Proceso y Sesiones (620 ms) |
| `--embed-bg` | Fondo de los reproductores (gris de Spotify) |

`--gap-cards` y `--space-7` (aire vertical de cada sección) son los dos que
probablemente quieras ajustar al ver el sitio con tu contenido.

**Sobre las dos velocidades:** Proceso y Sesiones van más despacio que el
resto porque son los realces más grandes —un bloque entero que se rellena de
color, una foto que pasa de gris a color— y porque en móvil los dispara el
scroll, no el ratón. A 180 ms el cambio se adelanta al dedo y parece un
parpadeo. Si quieres afinarlo, `--transition-lento` en `brand.css` los
gobierna a los dos a la vez; las fotos de Sesiones llevan además su propio
tiempo (900 ms para el color, 1100 ms para el zoom) en `Gallery.astro`.

**La barra de desplazamiento** también va de rojo de marca, con el tirador en
magenta al agarrarlo (`global.css`). Necesita dos sintaxis: `scrollbar-color`
para Firefox y Chrome moderno, y `::-webkit-scrollbar` para Safari y los
Chrome antiguos. Los colores salen de los tokens, así que se invierte con el
tema igual que el resto.

### Temas

**El estilo es de base clara**, así que el tema claro es el de `:root` y no
mira la preferencia del sistema: la identidad se ve igual para todo el mundo
hasta que el visitante pida lo contrario. El oscuro vive detrás del
interruptor de la barra superior y se recuerda en `localStorage`.

En `brand.css` son dos bloques: `:root[data-theme='dark']` y
`:root[data-theme='light']`. El claro está por duplicado — en `:root` y en su
propio bloque — para que el interruptor pueda volver a él desde el oscuro.

Si añades un color, decláralo en **los dos** bloques, o se quedará igual al
cambiar de tema.

**Los campos de color no se invierten con el tema.** Un `.field-red` es rojo
con texto blanco en los dos, porque un campo trae su propio texto encima y no
necesita seguir a la página. Lo único que cambia entre temas es la superficie
crema/carbón y las variantes `--color-*-text`.

¿Prefieres respetar la preferencia del sistema? Duplica el bloque del tema
oscuro dentro de:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { /* … los mismos tokens … */ }
}
```

Si lo haces, cambia también el respaldo del interruptor en `Header.astro`: hoy
es `'light'` fijo justamente porque `brand.css` no consulta el sistema.

### Cambiar de tipografía

Clash Display está autoalojada. Para sustituirla:

1. Pon los `.woff2` en `public/fonts/`.
2. Actualiza los `@font-face` al principio de `global.css`.
3. Cambia `--font-display` en `brand.css`.
4. Ajusta el `<link rel="preload">` de `BaseLayout.astro` al nuevo archivo.

Comprueba que la fuente traiga acentos y signos de apertura (`ÁÉÍÓÚÑ ¿¡`);
muchas tipografías de titular gratuitas no los incluyen.

---

## 5. Añadir una sección nueva

Ejemplo completo: una sección **"Equipo"** con el material del estudio.

### Paso 1 — ¿Necesita colección?

- **Contenido que crece** (varios ítems que añadirás con el tiempo) → colección.
- **Contenido fijo** (3–4 bloques que casi nunca cambian) → un array dentro
  del propio componente, como hace `Process.astro`.

Para este ejemplo usamos colección.

### Paso 2 — Declarar la colección

En `src/content.config.ts`:

```ts
const equipo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/equipo' }),
  schema: z.object({
    nombre: z.string(),
    categoria: z.enum(['micrófonos', 'monitores', 'previos', 'software']),
    detalle: z.string().optional(),
    orden: z.number().default(0),
  }),
});

export const collections = { servicios, testimonios, trabajos, faq, equipo };
```

### Paso 3 — Crear el contenido

`src/content/equipo/neumann-tlm103.md`:

```yaml
---
nombre: Neumann TLM 103
categoria: micrófonos
detalle: Condensador de diafragma grande para voz principal
orden: 1
---
```

### Paso 4 — Crear el componente

`src/components/Equipment.astro`. Copia la estructura de `Services.astro` y
respeta estas cuatro convenciones para que encaje con el resto:

```astro
---
import { getCollection } from 'astro:content';

const equipo = (await getCollection('equipo')).sort(
  (a, b) => a.data.orden - b.data.orden
);
---

<section class="section" id="equipo">
  <div class="wrap">
    <p class="eyebrow">07 / Equipo</p>
    <h2>Con qué<br />se graba</h2>

    <ul class="grid" role="list">
      {equipo.map((e) => (
        <li class="card reveal">
          <h3>{e.data.nombre}</h3>
          <p>{e.data.detalle}</p>
        </li>
      ))}
    </ul>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);   /* imprescindible, ver abajo */
    gap: var(--gap-cards);
    padding: 0;
    list-style: none;
  }

  .card {
    padding: var(--space-4) var(--space-3);
    border: var(--border-w) solid var(--brand-ink);
    transition: border-color var(--transition);
  }

  /* El realce es de color, nunca de relieve: este estilo no lleva
     sombras ni desplazamientos al pasar el ratón. */
  @media (hover: hover) {
    .card:hover { border-color: var(--color-accent-text); }
  }

  @media (width >= 48rem) {
    .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
</style>
```

Las cuatro convenciones:

1. **`class="section"`** en el `<section>`: aporta el aire vertical y la línea
   divisoria superior. Y un `id`, para poder enlazarlo desde el menú.
2. **`.wrap`** dentro: centra el contenido y aplica los márgenes laterales.
3. **`.eyebrow`** con el número de sección y **`<h2>`** con el título. Hay tres
   variantes de viñeta: `.eyebrow` (cuadrado rojo), `.eyebrow--circle`
   (círculo azul) y `.eyebrow--tri` (triángulo amarillo) — alterna para dar
   ritmo a la página.
4. **Nunca escribas un color ni una medida a pelo.** Si te falta un valor,
   añade el token en `brand.css`. Es lo que mantiene el sitio coherente.

Detalles que evitan errores ya cometidos en este proyecto:

- `minmax(0, 1fr)` **también en el estado de una columna**. Con `1fr` a secas
  o sin declarar columnas, una palabra larga ensancha la celda y desborda la
  página en móvil.
- El `:hover` va dentro de `@media (hover: hover)`; en pantallas táctiles el
  estado se queda pegado después de tocar.
- La clase `reveal` da la entrada suave al hacer scroll. Es opcional y
  respeta `prefers-reduced-motion`.
- Fondo alterno: `background: var(--brand-paper-dim)` para diferenciar la
  sección de sus vecinas, o `var(--brand-ink)` con
  `color: var(--brand-paper)` para un bloque invertido como Testimonios.
- Figuras decorativas: `<Shape tipo="circle" color="yellow" size="8rem" />`.
  Tipos disponibles: `circle`, `square`, `triangle`, `quarter`, `halfcircle`,
  `ring`. Colores: `red`, `yellow`, `blue`, `ink`, `paper`.

### Paso 5 — Montarla en la página

En `src/pages/index.astro`, importa y colócala **en el orden en que debe
aparecer**:

```astro
import Equipment from '../components/Equipment.astro';
…
<Process />
<Equipment />
<Testimonials />
```

### Paso 6 — Enlazarla desde el menú

En `src/config.ts` añade a `NAV`:

```ts
{ label: 'Equipo', href: '#equipo' },
```

El menú cabe cómodamente hasta 6 entradas; con más conviene acortar las
etiquetas o replantear la navegación.

### Paso 7 — Numerar

**No hay que renumerar nada a mano.** Los rótulos `01 /`, `02 /` … se calculan
en `src/pages/index.astro`: hay un array con el orden de las secciones y desde
ahí baja el número a cada componente como la prop `n`. Mete la tuya en ese
array, en su sitio, y las de abajo se recolocan solas.

Es lo que permite que Estudio y Sesiones aparezcan y desaparezcan según tengan
fotos sin dejar huecos en la numeración.

### Paso 8 — Comprobar

```bash
npm run build
```

Revisa la sección nueva a 375 px y a 1440 px de ancho, y en tema claro y
oscuro con el interruptor de la barra.

---

## 6. Desplegar en GitHub Pages

### Primera vez

1. Crea en GitHub un repositorio **vacío** (sin README, sin `.gitignore`).
   Con dominio propio el nombre es irrelevante; sin dominio formará parte de
   la URL.

2. Sube el proyecto:

```bash
git init -b main
git add -A
git commit -m "Sitio inicial"
git remote add origin https://github.com/ThisIsLexx/thisislexx-web.git
git push -u origin main
```

3. En el repositorio: **Settings → Pages → Build and deployment →
   Source: GitHub Actions**. Este paso es imprescindible; sin él el workflow
   compila pero no publica.

4. Espera 1–2 minutos. La pestaña **Actions** muestra el progreso y, al
   terminar, el enlace del sitio.

El sitio queda en `https://thisislexx.github.io/thisislexx-web`.

> **Sin dominio propio**, añade `base: '/thisislexx-web'` en
> `astro.config.mjs` para que los enlaces y los archivos resuelvan bien
> dentro de esa subcarpeta. Al conectar el dominio, quítalo.

### Cada cambio posterior

```bash
git add -A
git commit -m "Nuevo trabajo en el portafolio"
git push
```

Y ya está: `.github/workflows/deploy.yml` compila y publica solo en cada push
a `main`. También puedes lanzarlo a mano desde **Actions → Deploy a GitHub
Pages → Run workflow**.

### Qué hace el workflow

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

Dos trabajos: uno compila con `withastro/action@v3` sobre Node 22 y sube el
resultado como artefacto; el otro lo publica con `actions/deploy-pages@v4`.
No hay secretos ni tokens que configurar: usa los permisos del propio
repositorio.

### Si algo falla

| Síntoma | Causa habitual |
| --- | --- |
| El workflow pasa pero el sitio no cambia | Falta poner Source en "GitHub Actions" |
| Error de build en Actions pero local funciona | Un archivo de contenido con un campo inválido; el log dice cuál |
| El sitio carga sin estilos ni imágenes | Falta el `base` (sin dominio) o sobra (con dominio) |
| 404 en todo | El despliegue apuntó a otra rama; revisa Settings → Pages |

Antes de subir, `npm run build` en local reproduce exactamente lo que hará
GitHub. Si pasa aquí, pasa allí.

---

## 7. Conectar un dominio propio

### Comprarlo

Registradores con renovación honesta: **Cloudflare Registrar** (al costo, sin
margen), **Porkbun** o **Namecheap**. Desconfía de ofertas de primer año a
un dólar con renovación de cuarenta.

El `.com` sigue siendo el que la gente teclea por defecto.

### Configurar el DNS

En el panel del registrador, para el dominio raíz:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `thisislexx.github.io` |

Son cuatro registros A (los cuatro servidores de GitHub Pages) más el CNAME
para `www`. Opcionalmente añade los cuatro AAAA de IPv6 que GitHub documenta.

Si usas Cloudflare como DNS, deja los registros en **DNS only** (nube gris)
hasta que GitHub verifique el dominio; con el proxy activado la verificación
falla.

### Conectarlo con el repositorio

1. Crea `public/CNAME` con **una sola línea** y sin `https://` ni barra final:

```
tudominio.com
```

Va en `public/` justamente para que cada compilación lo vuelva a copiar; si
lo pones en la raíz del sitio publicado, el siguiente despliegue lo borra.

2. En `src/config.ts` cambia `SITE.url`:

```ts
url: 'https://tudominio.com',
```

Esto alimenta la URL canónica, las etiquetas Open Graph y el sitemap.

3. Actualiza la última línea de `public/robots.txt` con el nuevo sitemap.

4. Si habías puesto `base` en `astro.config.mjs`, quítalo.

5. En GitHub: **Settings → Pages → Custom domain**, escribe el dominio y
   guarda. GitHub comprueba el DNS.

6. Cuando la verificación pase (de minutos a 24 h), marca **Enforce HTTPS**.
   El certificado es de Let's Encrypt, automático y gratuito.

7. Recomendado: en tu perfil, **Settings → Pages → Verified domains**,
   verifica el dominio. Evita que otra cuenta apunte su repositorio al tuyo.

8. `git add -A && git commit -m "Dominio propio" && git push`.

### Comprobar que quedó bien

```bash
nslookup tudominio.com
```

Debe devolver las cuatro IP de GitHub. Si sigue devolviendo las antiguas,
es propagación: espera y vuelve a probar. Después comprueba que
`https://tudominio.com` carga con candado y que `www.tudominio.com` redirige
al dominio raíz.

---

## 8. Checklist antes de publicar

- [ ] WhatsApp y correo reales en `src/config.ts`.
- [ ] URLs de redes correctas en `SOCIAL` (la de SoundCloud sigue siendo un
      placeholder).
- [ ] Servicios, trabajos, testimonios y FAQ con contenido propio; sin
      quedar ninguno de ejemplo.
- [ ] Referencias reales en `Marquee.astro`.
- [ ] `public/img/og.png` (1200 × 630 px) para compartir el enlace.
- [ ] Fotos de clientes en `public/img/clientes/` y referenciadas en cada
      testimonio.
- [ ] Bloques de Estudio con foto, o la sección no aparecerá.
- [ ] Galería de sesiones con fotos, o la sección no aparecerá.
- [ ] Carátulas en los trabajos que las tengan.
- [ ] Precios revisados, o sustituidos por "A cotizar".
- [ ] `SITE.url` con el dominio definitivo.
- [ ] `npm run build` sin errores y `npm run preview` revisado.
- [ ] Probado a 375 px y a 1440 px, en tema claro y oscuro.
- [ ] Los enlaces de WhatsApp y correo abren de verdad, con el mensaje
      prellenado correcto.

---

## 9. Trampas conocidas

Cosas que ya costaron un rato de depuración. Están anotadas también en los
comentarios del código.

**Palabras largas que se salen de las tarjetas.** Toda retícula debe usar
`minmax(0, 1fr)`, incluido su estado de una columna. Y en los encabezados hace
falta `overflow-wrap: anywhere`, no `break-word`: solo `anywhere` cuenta al
calcular el ancho mínimo de una celda de grid; con `break-word` la celda crece
y la palabra nunca se parte. Ya está aplicado en `global.css`.

**Cuatro columnas es demasiado estrecho para titulares.** El contenido tope en
78 rem, así que una fila de cuatro deja ~204 px útiles por tarjeta y Clash
Display en mayúsculas cabe unos 12 caracteres. Por eso Proceso va a dos
columnas.

**Spotify y la proporción de la caja.** Ver la tabla de la sección Trabajos.
Resumen: para ver la lista de canciones, la caja tiene que ser estrecha y
alta.

**El amarillo desaparece sobre crema.** Es la trampa que más cuesta ver,
porque en el tema oscuro — el de por defecto — todo se ve bien. `#fcd65a`
sobre carbón contrasta 10:1; sobre crema, 1,26:1. De ahí que la triada tenga
dos juegos: `--brand-*` para bloques y `--color-*-text` para texto y marcas
finas. Si pones un `--brand-yellow` como texto, en tema claro no se verá.
La misma regla al revés afecta al rojo: `#ba2c2c` es perfecto como bloque y
flojo como texto sobre carbón, y para eso está `--color-accent-text`.

**`--color-fg` no sigue a los campos de color si no lo redeclaras.** Un
custom property se resuelve donde se declara: `--color-fg: var(--brand-ink)`
se calcula en `:root` y se hereda ya resuelto. Si un `.field-*` redefine
`--brand-ink` pero no `--color-fg`, todo lo que use `--color-fg` seguirá en
carbón y desaparecerá sobre el campo rojo. Redeclara siempre los dos.

**Ninguna sombra.** Se midieron cero `box-shadow` en 241 elementos de la
referencia. Si añades una, el sitio deja de parecerse al estilo — por eso
`--shadow-hard` vale `none` y los realces de hover son de color.

**Un `--color-on-*` por color, no uno para todos.** El rojo pide texto crema;
el azul y el amarillo, carbón. Si reutilizas el token equivocado, el texto
sobre la tarjeta se vuelve ilegible sin que el compilador diga nada.

**El compilador de Astro y los template literals anidados.** Un template
literal multilínea dentro de una llamada dentro de un objeto, en el
frontmatter de un `.astro`, hace fallar el compilador con un error que apunta
a una línea equivocada. Si `npm run build` se queja de una sintaxis que se ve
correcta, sospecha de eso: sepáralo en variables o usa concatenación, como
hace `Embed.astro`.

**Estilos que no se actualizan en `npm run dev`.** Los estilos con ámbito de
componente se quedan en caché a veces. Si editas un `<style>` y no ves el
cambio, reinicia el servidor. `npm run build` siempre refleja la verdad.

**La barra negra sobre el texto del hero.** Es el dev toolbar de Astro, solo
aparece en `npm run dev`. No sale en el sitio publicado.

---

## Licencias

- **Clash Display** — Fontshare (Indian Type Foundry). Libre para uso personal
  y comercial, incluida la incrustación en webs.
- **Jost** — SIL Open Font License 1.1.
- Los reproductores embebidos se sirven desde Spotify, YouTube y SoundCloud
  bajo sus propios términos; el sitio no aloja audio.
