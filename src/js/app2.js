let pagina = 1; //variable global para que la app inicie en la seccion de servicios siempre


const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {

    // Consulta los Servicios
    mostrarServicios();

    // Resalta el Div Actual segun el tab al que se presiona
    mostrarSeccion();

    eventListeners();
});

function eventListeners() {




    // Oculta o muestra una sección segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita ( o mensaje de error en caso de no pasar la validación )
    mostrarResumen();


    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();

    // deshabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual'); //eliminar la clase de actual en el tab anterior
    }

    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button'); //El método querySelectorAll() de un Element devuelve una NodeList estática (no viva) que representa una lista de elementos del documento que coinciden con el grupo de selectores indicados

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso); //para que lo tome como un numero

            // //agregar mostrar-seccion donde dimos click
            // const seccion = document.querySelector(`#paso_${pagina}`);
            // seccion.classList.add('mostrar__seccion')

            // //eliminar la clase de actual en el tab anterior
            // document.querySelector('.navegacion .actual').classList.remove('actual')


            // //agregar la clase de actual en el tab siguiente
            // const navegacion = document.querySelector(`[data-paso="${pagina}"]`);
            // navegacion.classList.add('actual');

            //llamar la funcion de mostrar seccion

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

//try catch sirve si una concexion se pudo iniciar a una base de datos
async function mostrarServicios() { //funcion para validar la base de datos. En caso que no halla resultados sigue funcionando
    try { //estamos llamando toda la hoja de servicios de servici.jason para llevarlo al HTML
        const resultado = await fetch('./servicios.json'); //fetch para llamar la base de datos de jason
        const db = await resultado.json(); //para saber el tipo de datos al estilo objetos en javas crip

        const { servicios } = db;

        // Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio  } = servicio;

            // DOM Scripting
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar el precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, crear-y-añadir para construir páginas web a base de programación


            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error);
    }
}


function seleccionarServicio(e) {

    let elemento;
    // Forzar que el  elemento al cual le damos click sea el DIV 
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio); //para converitr a el numero 

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado'); //si no doy clic en el parrafo pues es un click dentro del dv
        // console.log(elemento.firstElementChild.nextElementSibling.textContent);//para vierificar el precio par allevarlo al obeto

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio), //para mirar a donde doy click
            nombre: elemento.firstElementChild.textContent, //traer el nombre del elemento
            precio: elemento.firstElementChild.nextElementSibling.textContent //traer el precio del elemento
        }

        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); //El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.

    console.log(cita);
}

function agregarServicio(servicioObj) {
    const {  servicios } = cita;
    cita.servicios = [...servicios, servicioObj]; //codigo para que se vayan agregando los servicios  que requiere el usaurio 

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página
}

function mostrarResumen() {
    // Destructuring
    const {  nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }


    // validación de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        // agregar a resumen Div
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // Mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar sobre el arreglo de servicios
    servicios.forEach(servicio => {

        const {  nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        // console.log(parseInt( totalServicio[1].trim() ));

        cantidad += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });


    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar:  </span> $ ${cantidad}`;


    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => { //input: para validar si esta escribiendo en tiempo real
        const nombreTexto = e.target.value.trim(); //funcion trim para que no tome los espcacio en blanco al incio y al final 
        //console.log(nombreTexto); //para saber que es lo que esta escribiendo el usuario 


        // Validación de que nombreTexto debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            // console.log('nombre no valido')
            mostrarAlerta('Nombre no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}


function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return; //detecta la funcion y detiene el cogido para genrar solo un alerta

    }
    // console.log('el mensaje es', mensaje);
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }
    // console.log(alerta);

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();
        //getUTCDate() para retornanos el día 0 para el dia domingo. La función GETUTCDATE () devuelve la fecha y hora UTC del sistema de base de datos actual, en un Formato 'AAAA-MM-DD hh: mm: ss.mmm'. 

        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long',
        // }
        // console.log(dia.toLocaleDateString('es-ES', opciones));

        if ([0, 6].includes(dia)) {
            e.preventDefault(); //para que no me deje selccionar la fecha 
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos', 'error');
            // console.log('selecionaste domingo o sabado lo cual no es valido');//para mostrar en la consola y validar si funciona
        } else {
            cita.fecha = fechaInput.value;
            //console.log('Fecha Correcta');

            console.log(cita);
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    // const fechaAhora = new Date();
    // const year = fechaAhora.getFullYear();
    // const mes = fechaAhora.getMonth() + 1;
    // const dia = fechaAhora.getDate() + 1;
    // const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    // inputFecha.min = fechaDeshabilitar;
    inputFecha.min = new Date().toISOString().split("T")[0]; //para desabitar fechas anteriores

}


function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':'); //split: para evaluar el string y puedo buscar una divicion para 

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}