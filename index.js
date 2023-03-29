// Capturamos el canvas para pintar
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// El intervalo de refresco, que llenaremos más adelante
let interval_id;

// El pajarito
let bird = {
    pos: {
        x: 5,
        y: 5
    },
    size: {
        x: 10,
        y: 10
    },
    vy:   0,
    ay: 0.3
}

// Los cuadrados contra los que se puede chocar el pajarito
function Square(x, up_down){
    let height = Math.floor(Math.random()*(canvas.height - 100));
    let y;
    if (up_down === "up"){
        y = 0;
    } else if (up_down === "down"){
        y = canvas.height - height;
    } else {
        throw "up_down variable not set properly!";
    }
    this.pos = { x: x, y: y};
    this.size = { x: 40, y: height};
    this.up_down = up_down;
}

let squares = [
    new Square(canvas.width, "up"),
    new Square (canvas.width + 150, "down"),
    new Square (canvas.width + 300, "up")
]
const square_vx = -5; // Velocidad de los cuadrados

function update(){
    /**
    * Función que se ejecuta cada frame:
    *  - Actualiza el estado del juego
    *  - Pinta todo en la pantalla
    */
    bird.vy = bird.vy + bird.ay;

    // Mover las cosas
    bird.pos.y += bird.vy;

    for( let i = 0; i < squares.length; i++ ){
        let sq = squares[i];
        sq.pos.x += square_vx;
        if (sq.pos.x + sq.size.x <= 0){
            squares[i]= new Square(canvas.width, sq.up_down);
        }
    }

    // Comprobar colisiones
    if(bird.pos.y + bird.size.y > canvas.height ||
        bird.pos.y < 0){
        clearInterval( interval_id );
        console.log("HAS MUERTO");
    }

    // Este algoritmo de colisiones es muy pobre y está mal organizado, no
    // estaría mal que alguien (¿quizás tú?) lo mejorara.
    for( let i = 0; i < squares.length; i++ ){
        let sq = squares[i];
        if( bird.pos.x <= sq.pos.x && bird.pos.x + bird.size.x >= sq.pos.x ){
            console.log("ZONA CALIENTE: delante");
            if(bird.pos.y < sq.pos.y && bird.pos.y + bird.size.y > sq.pos.y){
                clearInterval( interval_id );
                console.log("MUERTO POR ABAJO")
            }
            if(bird.pos.y > sq.pos.y && bird.pos.y < sq.pos.y + sq.size.y){
                clearInterval( interval_id );
                console.log("MUERTO POR ARRIBA")
            }
        }
        if (sq.pos.x < bird.pos.x && sq.pos.x + sq.size.x >= bird.pos.x) {
            console.log("ZONA CALIENTE: detrás");
            if(bird.pos.y < sq.pos.y && bird.pos.y + bird.size.y > sq.pos.y){
                clearInterval( interval_id );
                console.log("MUERTO POR ABAJO")
            }
            if(bird.pos.y > sq.pos.y && bird.pos.y < sq.pos.y + sq.size.y){
                clearInterval( interval_id );
                console.log("MUERTO POR ARRIBA")
            }
        }
    }

    // Pintar las cosas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(bird.pos.x, bird.pos.y, bird.size.x,
         bird.size.y);

    ctx.fillStyle = 'red';
    for( let i = 0; i < squares.length; i++ ){
        let sq = squares[i];
        ctx.fillRect(sq.pos.x,sq.pos.y,sq.size.x,sq.size.y);
    }
}

function keydown(event){
    /**
    Cuando se presionan las teclas Arriba o W se mueve hacia arriba.
    Cuando se presionan las teclas Abajo o S se mueve hacia abajo.
    */
    switch( event.key ){
        case "ArrowUp":
        case "w":
            bird.vy = -5;
            break;
    }
}

// Escuchar los eventos de las teclas (presionar y soltar)
document.addEventListener("keydown", keydown);

// Lanzar la función que se ejecuta cada frame
interval_id = setInterval( update, 1 / 40 * 1000 );