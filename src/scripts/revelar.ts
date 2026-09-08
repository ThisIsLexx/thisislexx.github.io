/**
 * ─────────────────────────────────────────────────────────────
 *  REVELAR — Las entradas al hacer scroll
 *
 *  Cada bloque marcado con `.reveal` empieza bajado y transparente,
 *  y sube a su sitio cuando entra en pantalla. El CSS está en
 *  global.css; aquí solo se decide CUÁNDO.
 *
 *  Por qué en JavaScript y no con `animation-timeline: view()`:
 *  esa propiedad, que es la forma elegante de hacerlo en CSS puro,
 *  solo la entiende Chromium. En Firefox y en todo el iPhone no
 *  hacía nada, así que media web veía los bloques aparecer de golpe.
 *  Un IntersectionObserver se comporta igual en los cuatro motores.
 *
 *  Cómo se usa:
 *    1. Marca el elemento con la clase `reveal`.
 *    2. Si quieres que entre de lado, añade `reveal--izq` o
 *       `reveal--der`; si quieres que crezca, `reveal--zoom`.
 *    3. Para forzar un retardo concreto, ponle el estilo
 *       `--retardo: 400ms`. Si no, se calcula solo (ver abajo).
 *
 *  ESCALONADO: los hermanos que comparten padre entran uno detrás
 *  de otro, no todos a la vez. Una retícula de cuatro tarjetas se
 *  lee mucho mejor si caen en cascada.
 *
 *  Con "menos movimiento" activado no hay entrada ninguna: todo
 *  aparece ya colocado.
 * ─────────────────────────────────────────────────────────────
 */

/** Clase que enciende la entrada. La pone este script, nunca el HTML. */
const CLASE = 'visible';

/** Milisegundos entre un hermano y el siguiente. Corto a propósito:
    la cascada tiene que insinuarse, no hacerse esperar. */
const PASO = 50;

/** Tope de escalonado: a partir del quinto, todos con el mismo retardo.
    Sin tope, una galería de doce fotos dejaría la última medio segundo
    por detrás de la primera. */
const TOPE = 4;

const quieto = matchMedia('(prefers-reduced-motion: reduce)');

const todos = () => document.querySelectorAll<HTMLElement>('.reveal');

/**
 * Lo deja todo visible AHORA. Es la salida de emergencia, así que
 * apaga también la animación: si se limitara a marcar `.visible`,
 * el contenido seguiría dependiendo de que la animación arranque y
 * termine. Cuando se llega hasta aquí es justamente porque algo del
 * movimiento no va bien, o porque el visitante ha pedido que no
 * haya ninguno.
 */
function revelarTodo() {
  for (const el of todos()) el.classList.add('sin-animacion', CLASE);
  // Señal para el resto del sitio: aquí no hay movimiento que esperar.
  // La usa el titular del hero, que se anima solo con CSS y no pasa
  // por el observador.
  document.documentElement.classList.add('sin-movimiento');
}

/**
 * Reparte los retardos del escalonado. Se respeta el `--retardo`
 * que venga puesto a mano en el HTML: el hero lo usa para encajar
 * su texto con la entrada del titular.
 */
function repartirRetardos(elementos: HTMLElement[]) {
  const porPadre = new Map<Element, number>();

  for (const el of elementos) {
    if (el.style.getPropertyValue('--retardo')) continue;

    const padre = el.parentElement ?? document.body;
    const i = porPadre.get(padre) ?? 0;
    porPadre.set(padre, i + 1);

    if (i > 0) el.style.setProperty('--retardo', `${Math.min(i, TOPE) * PASO}ms`);
  }
}

function arrancar() {
  if (quieto.matches || !('IntersectionObserver' in window)) {
    revelarTodo();
    return;
  }

  const elementos = [...todos()];
  if (elementos.length === 0) return;

  repartirRetardos(elementos);

  let revelados = 0;

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        // Lo que ya quedó por encima de la pantalla no se anima: pasa
        // cuando se recarga a media página o se llega por un enlace
        // con ancla. Animarlo sería estrenar algo que el visitante
        // no va a ver moverse.
        const yaPasado = !e.isIntersecting && e.boundingClientRect.bottom < 0;

        if (e.isIntersecting || yaPasado) {
          if (yaPasado) e.target.classList.add('sin-animacion');
          e.target.classList.add(CLASE);
          observador.unobserve(e.target);
          revelados++;
        }
      }
    },
    {
      // Se dispara un poco antes de que el bloque toque el borde:
      // así termina de entrar mientras sigue subiendo, y no se ve
      // arrancar la animación ya dentro de la pantalla.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.05,
    }
  );

  for (const el of elementos) observador.observe(el);

  // Red de seguridad. Al cargar siempre hay algo del hero en pantalla,
  // así que a los tres segundos el contador tiene que haberse movido.
  // Si sigue a cero es que el observador no está funcionando —y lo que
  // se esconde a la espera de un efecto que no llega es, sin más,
  // contenido perdido—. Se comprueba que sea CERO y no que falten
  // algunos: lo normal es que la mitad de la página siga sin entrar.
  setTimeout(() => {
    if (revelados === 0) {
      observador.disconnect();
      revelarTodo();
    }
  }, 3000);
}

arrancar();

// Si el visitante activa "menos movimiento" con la página abierta,
// lo que quede por entrar aparece sin más.
quieto.addEventListener('change', () => {
  if (quieto.matches) revelarTodo();
});
