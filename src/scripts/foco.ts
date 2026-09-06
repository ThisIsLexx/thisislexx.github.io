/**
 * ─────────────────────────────────────────────────────────────
 *  FOCO — El :hover del móvil
 *
 *  En una pantalla táctil no hay puntero, así que todos los efectos
 *  de :hover del sitio (las tarjetas que se levantan, las fotos que
 *  recuperan el color, los pasos del proceso que se rellenan) no se
 *  ven nunca. Este observador los enciende con el scroll: lo que va
 *  pasando por la banda central de la pantalla se pone "en foco" y
 *  se apaga al salir.
 *
 *  Cómo se usa:
 *    1. En el HTML del componente, marca el elemento con `data-foco`.
 *    2. En su CSS, escribe el efecto como
 *         .tarjeta:is(:hover, .en-foco) { … }
 *       El ratón lo enciende por :hover y el scroll por la clase.
 *
 *  Solo se activa donde no hay puntero. En escritorio no hace nada:
 *  ahí ya está el ratón para decidir qué se mira.
 * ─────────────────────────────────────────────────────────────
 */

/** La banda viva: el 30% central de la pantalla (100% − 35% − 35%) */
const BANDA = '-35% 0px -35% 0px';

const tactil = matchMedia('(hover: none)');

let observador: IntersectionObserver | null = null;

function encender() {
  if (observador) return;

  observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) e.target.classList.toggle('en-foco', e.isIntersecting);
    },
    { rootMargin: BANDA, threshold: 0 }
  );

  for (const el of document.querySelectorAll('[data-foco]')) observador.observe(el);
}

function apagar() {
  observador?.disconnect();
  observador = null;
  // Al pasar a un ratón, lo que quedara encendido se apaga: a partir
  // de ahí manda :hover y dos fuentes de verdad se contradicen.
  for (const el of document.querySelectorAll('.en-foco')) el.classList.remove('en-foco');
}

if (tactil.matches) encender();

// Un portátil con pantalla táctil puede cambiar de modo al conectar
// un ratón, y una tablet al girarse. Se reevalúa en caliente.
tactil.addEventListener('change', (e) => (e.matches ? encender() : apagar()));
