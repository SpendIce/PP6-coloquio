/*
 * Práctica oral cronometrada: el coloquio es hablado, así que se practica
 * hablando. Al terminar el tiempo (o al tocar «Terminé») se habilita la
 * respuesta modelo para autoevaluarse.
 *
 * Marcado:
 *   <section class="ejercicio oral" data-segundos="60">
 *     <p class="pregunta">…</p>
 *     <details class="modelo">…</details>
 *   </section>
 */
(function () {
  "use strict";

  document.querySelectorAll(".oral").forEach((ejercicio) => {
    const total = Number(ejercicio.dataset.segundos || 60);
    const modelo = ejercicio.querySelector(".modelo");
    modelo.hidden = true;

    const reloj = document.createElement("p");
    reloj.className = "reloj";
    reloj.textContent = formato(total);
    const empezar = document.createElement("button");
    empezar.type = "button";
    empezar.textContent = `Empezar a hablar (${total} s)`;
    const termine = document.createElement("button");
    termine.type = "button";
    termine.textContent = "Terminé";
    termine.hidden = true;
    ejercicio.insertBefore(reloj, modelo);
    ejercicio.insertBefore(empezar, modelo);
    ejercicio.insertBefore(termine, modelo);

    let intervalo = null;

    function formato(s) {
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    }

    function cerrar() {
      clearInterval(intervalo);
      empezar.hidden = true;
      termine.hidden = true;
      modelo.hidden = false;
      modelo.open = true;
    }

    empezar.addEventListener("click", () => {
      let restante = total;
      empezar.disabled = true;
      termine.hidden = false;
      intervalo = setInterval(() => {
        restante--;
        reloj.textContent = formato(Math.max(restante, 0));
        if (restante <= 0) {
          cerrar();
        }
      }, 1000);
    });
    termine.addEventListener("click", cerrar);
  });
})();
