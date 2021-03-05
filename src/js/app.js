let pagina = 1; //variable global para que la app inicie en la seccion de servicios siempre

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicio: []
}

document.addEventListener('DOMContentLoaded', function() {
    //consulta los servicios
    mostrarServicios();
    //resalta el div actual segun el tab al que se preciona
    mostrarSeccion();

    iniciarApp();

});

function iniciarApp() {

    //oculta o muestra una seccion segun el tab al que se preciona
    cambiarSeccion();

    //pagina sigueinte y anterior
    paginaSiguiente();

    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //muestra el resumen de la cita (o mensaje en caso de no pasar la validación)
    mostrarResumen();

    //almacena el nombre de la cita en el objeto
    nombreCita();

    //almacenar fecha de la cita
    fechaCita();

    //deshabilita días anteriores del calentadrio
    deshabilitarFechaAnterior();

    //almacenar hora de la cita
    horaCita();

}

function mostrarSeccion() {

    //eliminar mostrar__seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar__seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar__seccion');
    };

    //agregar la clase mostrar seccion
    const seccionActual = document.querySelector(`#paso_${pagina}`);
    seccionActual.classList.add('mostrar__seccion');

    const navegacionAnterior = document.querySelector('.navegacion .actual');
    if (navegacionAnterior) {
        //eliminar la clase de actual en el tab anterior
        navegacionAnterior.classList.remove('actual');
    };

    //resalta la navegación actual
    const navegacion = document.querySelector(`[data-paso="${pagina}"]`);
    navegacion.classList.add('actual');


};


function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.navegacion button'); //El método querySelectorAll() de un Element devuelve una NodeList estática (no viva) que representa una lista de elementos del documento que coinciden con el grupo de selectores indicados
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', evento => {
            evento.preventDefault();

            pagina = parseInt(evento.target.dataset.paso); //para que lo tome como un numero



            // //agregar mostrar-seccion donde dimos click
            // const seccion = document.querySelector(`#paso_${pagina}`);
            // seccion.classList.add('mostrar__seccion')

            // //eliminar la clase de actual en el tab anterior
            // document.querySelector('.navegacion .actual').classList.remove('actual')


            // //agregar la clase de actual en el tab siguiente
            // const navegacion = document.querySelector(`[data-paso="${pagina}"]`);
            // navegacion.classList.add('actual');

            //llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();


        });
    });
};


//try catch sirve si una concexion se pudo iniciar a una base de datos
async function mostrarServicios() { //funcion para validar la base de datos. En caso que no halla resultados sigue funcionando
    try { //estamos llamando toda la hoja de servicios de servici.jason para llevarlo al HTML
        const resultado = await fetch('./servicios.json'); //fetch para llamar la base de datos de jason
        const db = await resultado.json(); //para saber el tipo de datos al estilo objetos en javas crip
        const { servicios } = db;

        //GENERAR EL HTML

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

            //inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, crear-y-añadir para construir páginas web a base de programación

            //intectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error);
    }

    function seleccionarServicio(evento) {
        let elemento;

        if (evento.target.tagName === 'P') {
            elemento = evento.target.parentElement; //forzo a js que si le doy click al parrafo se seleccione el DIV

        } else {
            elemento = evento.target; //si no doy clic en el parrafo pues es un click dentro del dv
        };

        if (elemento.classList.contains('seleccionado')) { //funcion contains: para veriricar si tienen un clase
            elemento.classList.remove('seleccionado');

            const id = parseInt(elemento.dataset.idServicio); //para converitr a el numero 

            eliminarServicio(id);
        } else {
            elemento.classList.add('seleccionado');

            // console.log(elemento.firstElementChild.nextElementSibling.textContent);//para vierificar el precio par allevarlo al obeto

            const servicioObj = {
                    id: parseInt(elemento.dataset.idServicio), //para mirar a donde doy click
                    nombre: elemento.firstElementChild.textContent, //traer el nombre del elemento
                    precio: elemento.firstElementChild.nextElementSibling.textContent //traer el precio del elemento
                }
                // console.log(servicioObj)
            agregarServicio(servicioObj);
        };
    };

    function eliminarServicio(id) {
        const { servicio } = cita;
        cita.servicio = servicio.filter(servicios => servicios.id !== id); //El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
        console.log(cita);
    };

    function agregarServicio(servicioObj) {
        const { servicio } = cita;
        cita.servicio = [...servicio, servicioObj]; //codigo para que se vayan agregando los servicios  que requiere el usaurio 
        console.log(cita);

    };


    function paginaSiguiente() {
        const paginaSiguiente = document.querySelector('#siguiente');
        paginaSiguiente.addEventListener('click', () => {
            pagina++;
            // console.log(pagina)
            botonesPaginador();

        });

    };

    function paginaAnterior() {
        const paginaAnterior = document.querySelector('#anterior');
        paginaAnterior.addEventListener('click', () => {
            pagina--;
            // console.log(pagina);
            botonesPaginador();

        });
    };

    function botonesPaginador() {
        const paginaSiguiente = document.querySelector('#siguiente');
        const paginaAnterior = document.querySelector('#anterior');
        if (pagina === 1) {
            paginaAnterior.classList.add('ocultar');


            // } else if (pagina === 2) {
            //     paginaAnterior.classList.remove('ocultar');
            //     paginaSiguiente.classList.remove('ocultar')

        } else if (pagina === 3) {
            paginaSiguiente.classList.add('ocultar');
            paginaAnterior.classList.remove('ocultar');

            mostrarResumen(); //estamos en la pagina 3 carga el resumen de la cita, carga el resumen de la cita

        } else {
            paginaAnterior.classList.remove('ocultar');
            paginaSiguiente.classList.remove('ocultar');
        }

        mostrarSeccion(); //cambia la seccion que se muestra por la de la pagina
    }

    function mostrarResumen() {
        //destruction
        const { nombre, fecha, hora, servicios } = cita;

        //seleccionar el resumen
        const resumenDiv = document.querySelector('#paso_3');

        //limpiar el hmtl previo
        // resumenDiv.innerHTML = ''; //opcion 
        while (resumenDiv.firstChild) {
            resumenDiv.removeChild(resumenDiv.firstChild);
        };


        //validacion del objeto
        if (Object.values(cita).includes('')) {
            const noServicio = document.createElement('P');
            noServicio.textContent = 'Faltan datos de servicios, hora fecha o nombre';

            noServicio.classList.add('invalidar__cita');

            //agregar a resumen Div

            resumenDiv.appendChild(noServicio);
            return;
        };

        //mostrar el resumen

        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`; //funcion innerHTML: para que interprete las etiqueta de HTML


        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Fecha:</span> ${hora}`;

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        //interar sobre el arreglo de srevicios

        servicios.forEach(servicio => {

            const { nombre, precio } = servicio;
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;

            contenedorServicio.appendChild(textoServicio); //agregar al contenedor
            contenedorServicio.appendChild(precioServicio);

            serviciosCita.appendChild(contenedorServicio);


        });

        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);

        resumenDiv.appendChild(serviciosCita);

    };

    function nombreCita() {
        const nombreInput = document.querySelector('#nombre');

        nombreInput.addEventListener('input', (evento) => { //input: para validar si esta escribiendo en tiempo real
            const nombreTexto = evento.target.value.trim(); //funcion trim para que no tome los espcacio en blanco al incio y al final 
            //console.log(nombreTexto); //para saber que es lo que esta escribiendo el usuario 

            //validacion de que el nombreTexto debe tener algo
            if (nombreTexto === '' || nombreTexto.length < 3) {
                // console.log('nombre no valido')
                mostrarAlerta('Nombre no Valido', 'error');

            } else {
                // console.log('nombre valido')
                const alerta = document.querySelector('.alerta');
                if (alerta) {
                    alerta.remove();
                }
                cita.nombre = nombreTexto;
                console.log(cita);
            }
        });
    }

    function mostrarAlerta(mensaje, tipo) {
        //si hay una alerta previa, entonces no crear otra
        const alertaPrevia = document.querySelector('.alerta');
        if (alertaPrevia) {
            return; //detecta la funcion y detiene el cogido para genrar solo un alerta

        }

        // console.log('el mensaje es', mensaje);
        const alerta = document.createElement('DIV')
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');

        if (tipo === 'error') {
            alerta.classList.add('error');
        }
        // console.log(alerta);

        //insertar en el HTML
        const formulario = document.querySelector('.formulario');
        formulario.appendChild(alerta);

        //ELIMINAR LA ALERTA DEPUES DE 3 SEGUNDOS

        setTimeout(() => {
            alerta.remove();
        }, 3000);

    }

    function fechaCita() {
        const fechaInput = document.querySelector('#fecha');
        fechaInput.addEventListener('input', evento => {
            const dia = new Date(evento.target.value).getUTCDay(); //getUTCDate() para retornanos el día 0 para el dia domingo. La función GETUTCDATE () devuelve la fecha y hora UTC del sistema de base de datos actual, en un Formato 'AAAA-MM-DD hh: mm: ss.mmm'. 

            // const opciones = {
            //     weekday: 'long',
            //     year: 'numeric',
            //     month: 'long',
            // }
            // console.log(dia.toLocaleDateString('es-ES', opciones));
            if ([0, 6].includes(dia)) {
                evento.preventDefault(); //para que no me deje selccionar la fecha 
                fechaInput.value = '';

                mostrarAlerta('Fines de semana no son permitidos', 'error');
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
        //     // const fechaAhora = new Date();
        //     // const year = fechaAhora.getFullYear();
        //     // const mes = fechaAhora.getMonth() + 1;
        //     // const dia = fechaAhora.getDate() + 1; //para que me selecciono para aprtar dia al dia sigueiten

        //     // //formato deseado: AAAA-MM-DD
        //     // const fechaDesahabilitar = `${year}-${mes}-${dia}`;

        inputFecha.min = new Date().toISOString().split("T")[0]; //para desabitar fechas anteriores

    }



    function horaCita(); {
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
            };
        });
    }