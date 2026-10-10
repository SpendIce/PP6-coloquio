/*
 * Ejercicio de ordenar pasos con devolución al comprobar.
 *
 * Marcado:
 *   <section class="ejercicio ordenar">
 *     <p class="pregunta">…</p>
 *     <ul class="ordenar-lista">
 *       <li data-paso="1">…</li> <li data-paso="2">…</li> …   (en orden correcto)
 *     </ul>
 *     <button data-comprobar>Comprobar</button>
 *     <p class="devolucion" data-si-ok hidden>…</p>
 *   </section>
 *
 * Los pasos se mezclan al cargar; se reordenan con los botones ↑ ↓.
 */
(function () {
  "use strict";

  document.querySelectorAll(".ordenar").forEach((ejercicio) => {
    const lista = ejercicio.querySelector(".ordenar-lista");
    const items = Array.from(lista.children);

    items.forEach((li) => {
      const texto = document.createElement("span");
      texto.className = "texto";
      while (li.firstChild) {
        texto.appendChild(li.firstChild);
      }
      const subir = document.createElement("button");
      subir.className = "mover";
      subir.type = "button";
      subir.textContent = "↑";
      subir.setAttribute("aria-label", "Subir");
      const bajar = document.createElement("button");
      bajar.className = "mover";
      bajar.type = "button";
      bajar.textContent = "↓";
      bajar.setAttribute("aria-label", "Bajar");
      li.append(subir, bajar, texto);

      subir.addEventListener("click", () => {
        limpiar();
        if (li.previousElementSibling) {
          lista.insertBefore(li, li.previousElementSibling);
        }
      });
      bajar.addEventListener("click", () => {
        limpiar();
        if (li.nextElementSibling) {
          lista.insertBefore(li.nextElementSibling, li);
        }
      });
    });

    // Mezcla garantizando que no quede ya resuelto.
    do {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
    } while (items.every((li, i) => Number(li.dataset.paso) === i + 1));
    items.forEach((li) => lista.appendChild(li));

    const devolucionOk = ejercicio.querySelector("[data-si-ok]");

    function limpiar() {
      lista.querySelectorAll("li").forEach((li) => li.classList.remove("ok", "mal"));
      if (devolucionOk) {
        devolucionOk.hidden = true;
      }
    }

    ejercicio.querySelector("[data-comprobar]").addEventListener("click", () => {
      let todoBien = true;
      Array.from(lista.children).forEach((li, i) => {
        const bien = Number(li.dataset.paso) === i + 1;
        li.classList.toggle("ok", bien);
        li.classList.toggle("mal", !bien);
        todoBien = todoBien && bien;
      });
      if (devolucionOk) {
        devolucionOk.hidden = !todoBien;
      }
    });
  });
})();
