
//Variables


const apiURL = "https://mindicador.cl/api/";
const formulario = document.querySelector('#formulario');
const boton = document.querySelector('#boton');
const contenedor = document.querySelector('#contenedor');
let chartGraph = document.getElementById('myChart');

//Eventos

eventos ();

function eventos() {
    document.addEventListener('DOMContentLoaded', async () => {
        getMoneda();
        renderMonedas()
        
    });

    boton.addEventListener('click',   async () => {
        const select = document.querySelector('#select');
        calculoMoneda ();
        destroyChart()
        grafico(select.value)
    } );
};

//Funciones

async function destroyChart() {
    await myChart.destroy();
  }

async function getMoneda(){
    try{
        const res = await fetch(apiURL);
        const data = await res.json()
        return data;
    }
    catch (error) {
        alert(error.message)
    }
}



async function calculoMoneda () {
    const input = document.querySelector('#input').value;
    const monedas = await getMoneda();
    let tipoMoneda = document.querySelector('#select').value;

    if(input == ''){
        alert('Favor introducir monto en CLP')
    }else{
        for (const moneda in monedas) {
            if( tipoMoneda == monedas[moneda].codigo ){
                let valorMoneda = await monedas[moneda].valor
                let resultado = Number(input)/Number(valorMoneda);
                resultado = resultado.toFixed(2);
                document.querySelector('#resultado').innerHTML = resultado;     
            }
        }  
    }

  
}



async function renderMonedas() {
    const monedas = await getMoneda();
    for (const moneda in monedas) {
        let option = document.createElement('option');
        option.id = await monedas[moneda].codigo;
        option.value = await monedas[moneda].codigo;
        option.innerHTML = await monedas[moneda].nombre;
        if ( option.value != 'undefined' ){
            select.appendChild(option)
        }
    } ;
}


async function grafico(codigo) {

    const res = await fetch(`https://mindicador.cl/api/${codigo}`);
    const dataFechas = await res.json()
    let datosMoneda =  Object.values (dataFechas.serie);
    let labels = [];
    let valores = []
    console.log(labels);
    for (label of datosMoneda){
        labels =  [...labels, label.fecha]
        valores =  [...valores, label.valor]

    }
    labels = labels.slice(0, 10)
    console.log(labels);
    valores = valores.slice(0, 10)
    
    const data = {
      labels: labels,
      datasets: [{
        label: 'Grafica del valor de los ultimos 10 dias',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: valores,
      }]
    };
  
    const config = {
      type: 'line',
      data: data,
      options: {}
    };
    
   window.myChart = new Chart(
    chartGraph,
    config
    );
}