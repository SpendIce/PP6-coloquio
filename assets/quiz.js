/*
 * Quiz de opción múltiple con devolución inmediata.
 *
 * Marcado:
 *   <section class="ejercicio quiz" data-correcta="b">
 *     <p class="pregunta">…</p>
 *     <div class="opciones">
 *       <button data-op="a">…</button> <button data-op="b">…</button> …
 *     </div>
 *     <p class="devolucion" data-op="a" hidden>…</p> …
 *   </section>
 *   <p class="marcador" data-quiz-marcador></p>   (opcional, uno por página)
 *
 * Las opciones se mezclan al cargar para que la posición no delate la
 * respuesta. Solo cuenta el primer intento de cada pregunta.
 */
(function () {
  "use strict";

  const preguntas = Array.from(document.querySelectorAll(".quiz"));
  const marcador = document.querySelector("[data-quiz-marcador]");
  let aciertos = 0;
  let respondidas = 0;

  function actualizarMarcador() {
    if (marcador) {
      marcador.textContent = `${aciertos} de ${respondidas} correctas al primer intento · ${preguntas.length} preguntas`;
    }
  }

  function mezclar(contenedor) {
    const hijos = Array.from(contenedor.children);
    for (let i = hijos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hijos[i], hijos[j]] = [hijos[j], hijos[i]];
    }
    hijos.forEach((h) => contenedor.appendChild(h));
  }

  preguntas.forEach((pregunta) => {
    const correcta = pregunta.dataset.correcta;
    const opciones = pregunta.querySelector(".opciones");
    mezclar(opciones);

    opciones.addEventListener("click", (evento) => {
      const boton = evento.target.closest("button[data-op]");
      if (!boton || pregunta.dataset.respondida) {
        return;
      }
      pregunta.dataset.respondida = "si";
      respondidas++;
      const acerto = boton.dataset.op === correcta;
      if (acerto) {
        aciertos++;
      }
      opciones.querySelectorAll("button").forEach((b) => {
        b.disabled = true;
        if (b.dataset.op === correcta) {
          b.classList.add("correcta");
        } else if (b === boton) {
          b.classList.add("incorrecta");
        }
      });
      const elegida = pregunta.querySelector(`.devolucion[data-op="${boton.dataset.op}"]`);
      const deLaCorrecta = pregunta.querySelector(`.devolucion[data-op="${correcta}"]`);
      if (elegida) {
        elegida.hidden = false;
      }
      if (!acerto && deLaCorrecta) {
        deLaCorrecta.hidden = false;
      }
      actualizarMarcador();
    });
  });

  actualizarMarcador();
})();
