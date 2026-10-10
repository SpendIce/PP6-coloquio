/*
 * Planilla para clasificar cada fila en una de varias categorías, con
 * resumen copiable. Lo marcado se recuerda en este navegador
 * (localStorage); si el almacenamiento no está disponible, la planilla
 * funciona igual, sin recordar.
 *
 * Marcado:
 *   <section class="ejercicio clasificar" data-clave="q-origen"
 *            data-opciones="Profe|Yo|No sé">
 *     <table><tbody>
 *       <tr data-fila="Vigencia (Q1, Q10)"><td>…</td><td class="eleccion"></td></tr> …
 *     </tbody></table>
 *     <button data-copiar>Copiar resumen</button>
 *     <textarea data-resumen readonly></textarea>
 *   </section>
 */
(function () {
  "use strict";

  function leer(clave) {
    try {
      return JSON.parse(localStorage.getItem(clave) || "{}");
    } catch (e) {
      return {};
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      // Sin almacenamiento: la planilla sigue funcionando sin recordar.
    }
  }

  document.querySelectorAll(".clasificar").forEach((planilla, n) => {
    const clave = "coloquio-" + (planilla.dataset.clave || n);
    const opciones = (planilla.dataset.opciones || "Sí|No").split("|");
    const estado = leer(clave);
    const resumen = planilla.querySelector("[data-resumen]");

    function actualizarResumen() {
      const lineas = Array.from(planilla.querySelectorAll("[data-fila]")).map((fila) => {
        const nombre = fila.dataset.fila;
        return `${nombre}: ${estado[nombre] || "(sin marcar)"}`;
      });
      if (resumen) {
        resumen.value = lineas.join("\n");
      }
    }

    planilla.querySelectorAll("[data-fila]").forEach((fila, i) => {
      const nombre = fila.dataset.fila;
      const celda = fila.querySelector(".eleccion");
      opciones.forEach((opcion) => {
        const etiqueta = document.createElement("label");
        etiqueta.style.marginRight = ".7rem";
        etiqueta.style.whiteSpace = "nowrap";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `${clave}-${i}`;
        radio.value = opcion;
        radio.checked = estado[nombre] === opcion;
        radio.addEventListener("change", () => {
          estado[nombre] = opcion;
          guardar(clave, estado);
          actualizarResumen();
        });
        etiqueta.append(radio, " " + opcion);
        celda.appendChild(etiqueta);
      });
    });

    const copiar = planilla.querySelector("[data-copiar]");
    if (copiar) {
      copiar.addEventListener("click", async () => {
        actualizarResumen();
        try {
          await navigator.clipboard.writeText(resumen.value);
          copiar.textContent = "Copiado ✔";
        } catch (e) {
          resumen.focus();
          resumen.select();
          copiar.textContent = "Seleccionado: copialo con Ctrl+C";
        }
      });
    }
    actualizarResumen();
  });
})();
