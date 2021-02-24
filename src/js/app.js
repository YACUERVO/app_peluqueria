document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();

});

function iniciarApp() {
    mostrarServicios();
}
//try catch sirve si una concexion se pudo iniciar a una base de datos
async function mostrarServicios() { //funcion para validar la base de datos. En caso que no halla resultados sigue funcionando 
    try { //estamos llamando toda la hoja de servicios de servici.jason para llevarlo al HTML
        const resultado = await fetch('./servicios.json'); //fetch para llamar la base de datos de jason
        const db = await resultado.json(); //para saber el tipo de datos al estilo objetos en javas crip
        const { servicios } = db;

        //GENERAR EL HTML

        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM SCRIPTING
            //generar el nombre
            const nombreServicio = document.createElement('P')
            nombreServicio.textContent = nombre
            nombreServicio.classList.add('nombre__servicio')


            //generar el precio del servicio
            const precioServicio = document.createElement('P')
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio__servicio')

            //generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //selecionar un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            //El método appendChild() inserta un nuevo nodo dentro de la estructura DOM de un documento, y es la segunda parte del proceso central uno-dos, crear-y-añadir para construir páginas web a base de programación

            //intectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv)

        });


    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(evento) {
    let elemento;

    if (evento.target.tagName === 'P') {
        elemento = evento.target.parentElement //forzo a js que si le doy click al parrafo se seleccione el DIV

    } else {
        elemento = evento.target; //si no doy clic en el parrafo pues es un click dentro del dv
    }

    if (elemento.classList.contains('seleccionado')) { //funcion contains: para veriricar si tienen un clase
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado')
    }


}