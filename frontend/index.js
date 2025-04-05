const URL_API = 'https://taller5-practicasintermedias.onrender.com';

const seccionEncuesta = document.getElementById('seccion-encuesta');
const seccionResultados = document.getElementById('seccion-resultados');
const preguntaEncuesta = document.getElementById('pregunta-encuesta');
const contenedorOpciones = document.getElementById('contenedor-opciones');
const contenedorResultados = document.getElementById('contenedor-resultados');
const botonVotar = document.getElementById('boton-votar');
const botonVolver = document.getElementById('boton-volver');

const plantillaOpcion = document.getElementById('plantilla-opcion');
const plantillaResultado = document.getElementById('plantilla-resultado');

let idEncuestaActual = 1; 
let idOpcionSeleccionada = null;

async function cargarEncuesta() {
    try {
        preguntaEncuesta.textContent = 'Cargando pregunta...';
        contenedorOpciones.innerHTML = '<p class="cargando">Cargando opciones...</p>';
        botonVotar.disabled = true;
        
        const respuesta = await fetch(`${URL_API}/api/preguntas/${idEncuestaActual}`);

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la encuesta');
        }

        const datos = await respuesta.json();

        preguntaEncuesta.textContent = datos.pregunta.pregunta;

        contenedorOpciones.innerHTML = '';

        datos.respuestas.forEach(respuesta => {
            const elementoOpcion = plantillaOpcion.content.cloneNode(true);

            const inputRadio = elementoOpcion.querySelector('input');
            const etiqueta = elementoOpcion.querySelector('label');

            inputRadio.id = `opcion-${respuesta.id}`;
            inputRadio.value = respuesta.id;
            etiqueta.textContent = respuesta.respuesta;
            etiqueta.setAttribute('for', `opcion-${respuesta.id}`);

            inputRadio.addEventListener('change', () => {
                idOpcionSeleccionada = respuesta.id;
                botonVotar.disabled = false;
            });

            contenedorOpciones.appendChild(elementoOpcion);
        });

    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
        preguntaEncuesta.textContent = '¡Ups! Algo salió mal';
        contenedorOpciones.innerHTML = `<p class="error">Error: 
        ${error.message}. Por favor, intenta más tarde.</p>`;
    }
}

async function enviarVoto() {
    if (!idOpcionSeleccionada) {
        alert('Por favor, selecciona una opción');
        return;
    }

    try {
        botonVotar.disabled = true;
        botonVotar.textContent = 'Enviando...';

        const respuesta = await fetch(`${URL_API}/api/votar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                respuestaId: idOpcionSeleccionada
            })
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo registrar el voto');
        }

        cargarResultados();

    } catch (error) {
        console.error('Error al enviar el voto:', error);
        alert(`Error al registrar tu voto: ${error.message}`);
        botonVotar.textContent = 'Votar';
        botonVotar.disabled = false;
    }
}

async function cargarResultados() {
    try {
        seccionEncuesta.classList.add('oculto');
        seccionResultados.classList.remove('oculto');

        contenedorResultados.innerHTML = '<p class="cargando">Cargando resultados...</p>';

        const respuesta = await fetch(`${URL_API}/api/resultados`);

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los resultados');
        }

        const resultados = await respuesta.json();

        const totalVotos = resultados.reduce((suma, item) => suma + item.votos, 0);

        contenedorResultados.innerHTML = '';

        resultados.forEach(resultado => {
            const elementoResultado = plantillaResultado.content.cloneNode(true);

            const porcentaje = totalVotos > 0 ? (resultado.votos / totalVotos) * 100 : 0;

            const nombreLenguaje = elementoResultado.querySelector('.nombre-lenguaje');
            const conteoVotos = elementoResultado.querySelector('.conteo-votos');
            const barraProgreso = elementoResultado.querySelector('.barra-progreso');

            nombreLenguaje.textContent = resultado.respuesta;
            conteoVotos.textContent = `${resultado.votos} votos (${porcentaje.toFixed(1)}%)`;
            barraProgreso.style.width = `${porcentaje}%`;

            if (resultado.id === idOpcionSeleccionada) {
                elementoResultado.querySelector('.item-resultado').classList.add('seleccionado');
            }

            contenedorResultados.appendChild(elementoResultado);
        });

    } catch (error) {
        console.error('Error al cargar los resultados:', error);
        contenedorResultados.innerHTML = `<p class="error">Error: ${error.message}. Por favor, intenta más tarde.</p>`;
    }
}

function volverAEncuesta() {
    idOpcionSeleccionada = null;
    botonVotar.disabled = true;
    botonVotar.textContent = 'Votar';

    seccionResultados.classList.add('oculto');
    seccionEncuesta.classList.remove('oculto');

    cargarEncuesta();
}

document.addEventListener('DOMContentLoaded', () => {
    cargarEncuesta();

    botonVotar.addEventListener('click', enviarVoto);
    botonVolver.addEventListener('click', volverAEncuesta);
});

function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <div class="mensaje-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${mensaje}</p>
        </div>
    `;
}