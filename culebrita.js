var juego;
var ritmo = 150; 

var puntos = 0;

var color = '#cc19fd';
var color_manzana = '#c02a2a';

var malla = document.querySelector('.malla');
var dimension = 20;

// posicion del jugador
var posicion = [17, 0];
var direccion = 'arriba';

var array_cola = [
    [18, 0],
    [19, 0]
];

// datos de la cuadricula
var malla_data = [];

for (let i = 0; i < dimension; i++){
    malla_data.push([]);
    for (let j = 0; j < dimension; j++){
        malla_data[i].push(0);
    }
}
aparecerManzana();

var permite_click = true;

function btnIniciar(){
    document.querySelector('.container').setAttribute('hidden', 'hidden');
    document.querySelector('.game').removeAttribute('hidden');
    ritmo = document.querySelector('#dificultad').value;

    color = document.querySelector('#color').value;
    color_manzana = document.querySelector('#color-m').value;
    document.querySelector('.game').style.borderColor = color;
    
    juego = setInterval(fotograma, ritmo);
}

function btnReiniciar(){
    document.getElementById('notificacion').setAttribute('hidden', 'hidden');
    
    posicion = [19, 0];
    direccion = 'arriba';

    array_cola = [
        [18, 0],
        [19, 0]
    ];

    malla_data[19][0] = 1;

    for (let i = 0; i < dimension; i++){
        for (let j = 0; j < dimension; j++){
            malla_data[i][j] = 0;
        }
    }

    juego = setInterval(fotograma, ritmo);

    aparecerManzana();
    reiniciarContador()
}

function activarCasilla(cord){
    malla // malla
    .children[cord[0]] // fila
    .children[cord[1]] // casilla
    .style.backgroundColor = color; // pone la clase "active" que lo pone en blanco, feliz???
}
function activarManzana(cord){
    malla // malla
    .children[cord[0]] // fila
    .children[cord[1]] // casilla
    .style.backgroundColor = color_manzana; // pone la clase "active" que lo pone en blanco, feliz???
}

function aparecerManzana(){
    let disponible = [];

    for (let i = 0; i < dimension; i++){
        for (let j = 0; j < dimension; j++){
            if(malla_data[i][j] == 0){
                disponible.push([i,j]);
            }
        }
    }

    console.log(disponible.length);

    let posicion_manzana = disponible[Math.floor(Math.random() * disponible.length)];

    malla_data[posicion_manzana[0]][posicion_manzana[1]] = 2;
}

function resetearCasillas(){
    let todas_las_casilla = document.querySelectorAll('.casilla');

    for (let casilla of todas_las_casilla){
        casilla.style.backgroundColor = '#0000'
    }
}

// funcion que corre un fotograma
function fotograma(){
    // despintar la malla
    resetearCasillas();

    // -- Acciones que modifican la malla --

    // calculo la nueva posicion de la cabeza y guardo la antigua
    let posicion_previa = [posicion[0], posicion[1]];
    malla_data[posicion_previa[0]][posicion_previa[1]] = 0;
    
    if(direccion == 'arriba'){ // 38 87
        posicion[0] -= 1;
    }
    else if(direccion == 'abajo'){ // 40 83
        posicion[0] += 1;
    }
    else if(direccion == 'izquierda'){ // 37 65
        posicion[1] -= 1;
    }
    else if(direccion == 'derecha'){ // 39 68
        posicion[1] += 1;
    }

    // inmediatamente despues de mover,
    // verifico si está fuera de los bordes para 
    // evitar que de error por buscar en los datos
    // una posicion que no exista

    if (malla_data[posicion[0]] == undefined){
        document.getElementById('notificacion').removeAttribute('hidden');
        clearInterval(juego);
        return;
    }
    else if (malla_data[posicion[0]][posicion[1]] == undefined) {
        document.getElementById('notificacion').removeAttribute('hidden');
        clearInterval(juego);
        return;
    }

    // **ACTUALIZAR LA COLA**
    array_cola.unshift([posicion_previa[0], posicion_previa[1]]);
    let eliminar = array_cola.pop();
    malla_data[eliminar[0]][eliminar[1]] = 0;

    let manzana = false;
    
    if (malla_data[posicion[0]][posicion[1]] == 2){
        array_cola.push(eliminar);
        malla_data[posicion[0]][posicion[1]] = 1;
        manzana = true;
    }
    else if (malla_data[posicion[0]][posicion[1]] == 1){
        document.getElementById('notificacion').removeAttribute('hidden');
        clearInterval(juego);
        return;
    }
    else {
        malla_data[posicion[0]][posicion[1]] = 1;
    }

    for (let cola of array_cola){
        malla_data[cola[0]][cola[1]] = 1;
    }

    if (manzana){
        aparecerManzana();
        sumarContador();
    }
    
    // volver a pintar la malla

    for (let i = 0; i < dimension; i++){
        for (let j = 0; j < dimension; j++){
            if(malla_data[i][j] == 1){
                activarCasilla([i,j]);
            }
            if(malla_data[i][j] == 2){
                activarManzana([i,j]);
            }
            
        }
    }

    permite_click = true;
}

// inicia el juego (solo debug)
if (document.querySelector('.game').getAttribute('hidden') != 'hidden') {
    juego = setInterval(fotograma, ritmo);
}

function sumarContador(){
    puntos += 1;

    let puntos_texto;

    if (puntos < 10){
        puntos_texto =  '00' + puntos;
    }
    else if (puntos < 100){
        puntos_texto = '0' + puntos;
    }
    else {
        puntos_texto = puntos;
    }

    document.getElementById('puntos').innerHTML = puntos_texto;
}

function reiniciarContador(){
    puntos = 0;
    document.getElementById('puntos').innerHTML = '000';
}

document.addEventListener('keydown', function(e){
    // PON MISUQUITA

    if (permite_click){
        if((e.code == 'KeyW' || e.code == 'ArrowUp') && direccion != 'abajo'){
            direccion = 'arriba';
            permite_click = false;
        }
        if((e.code == 'KeyS' || e.code == 'ArrowDown') && direccion != 'arriba'){
            direccion = 'abajo';
            permite_click = false;
        }
        if((e.code == 'KeyA' || e.code == 'ArrowLeft') && direccion != 'derecha'){
            direccion = 'izquierda';
            permite_click = false;
        }
        if((e.code == 'KeyD' || e.code == 'ArrowRight') && direccion != 'izquierda'){
            direccion = 'derecha';
            permite_click = false;
        }
    }
    
});
