// API:42af03e4072d50bd9f8e4b3de874674c5b4312dd41ed1fa5eab314aea185934 
//eEmail : mpyoqoqxrr@iubridge.com


//Donde se va pintar en Select
const formulario = document.querySelector('#formulario');
const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');



const resultado = document.querySelector('#resultados');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {

    consultarCriptos();
    formulario.addEventListener('submit', submitFormulario);
    criptoMonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});


//Cargar la API de CRIPTOMONEDAS
function consultarCriptos() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url) 
        .then(data => data.json())
          .then(respuesta => {
            console.log(respuesta.Data);
            return respuesta.Data; // Aquí devuelves los datos para que se pasen al siguiente .then()
        })
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
        .catch(error => {console.log('Error al cargar la API'), error})
        
};



//Pintar en Selecto como POTION
function selectCriptomonedas(arrayCriptomonedas){
    arrayCriptomonedas.forEach(criptoID => {
        const { FullName, Name } = criptoID.CoinInfo;
        

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoMonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda)
    
   
}

function submitFormulario(e){
    e.preventDefault();

    //VAlidar
    const { moneda, criptomoneda } = objBusqueda;

    if( moneda === '' || criptomoneda === ''){
        mostrarALerta('Ambos campos son obligatorios');
        return;
    }
    consultarApi(); 

    
};


function mostrarALerta(msg) {
    const existeError = document.querySelector('.error');

    if (!existeError) {
        // Crear el elemento div para el mensaje de error
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        // Establecer el contenido del mensaje
        divMensaje.textContent = msg;

        // Insertar al final del formulario
        formulario.appendChild(divMensaje);

        // Eliminar el mensaje de error después de 2 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }
}



function consultarApi() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then(data => data.json())
        
        .then(objCotizacion => mostrarCotizacion(objCotizacion))
        .catch(error => {
            console.error(error); // Mostrar el error real en la consola
            console.log('No muestra nada'); // Mensaje adicional, si lo deseas
        });
}

function mostrarCotizacion(objCotizacion) {
    limpiarHtml();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = objCotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;
    resultado.appendChild(precio);

    const precioAlto = document.createElement('p');
    precioAlto.classList.add('precio');
    precioAlto.innerHTML = `Precio más alto: <span>${HIGHDAY}</span>`;
    resultado.appendChild(precioAlto);

    const precioBajo = document.createElement('p');
    precioBajo.classList.add('precio');
    precioBajo.innerHTML = `Precio más bajo: <span>${LOWDAY}</span>`;
    resultado.appendChild(precioBajo);
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.classList.add('precio');
    ultimasHoras.innerHTML = `Cambio en las últimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`;
    resultado.appendChild(ultimasHoras);

    const ultActualizacion = document.createElement('p');
    ultActualizacion.classList.add('precio');
    ultActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;
    resultado.appendChild(ultActualizacion);
}


function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

