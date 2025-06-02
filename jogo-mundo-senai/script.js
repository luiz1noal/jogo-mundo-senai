const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ----------- CLASSES PRIMEIRO ------------
class Raquete {
    constructor(x) {
        this.x = x;
        this.y = HEIGHT / 2 - 50;
        this.width = 10;
        this.height = 100;
        this.vel = 15;
    }
    desenhar() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    mover(direcao) {
        if (direcao === "cima" && this.y > 0) {
            this.y -= this.vel;
        } else if (direcao === "baixo" && this.y + this.height < HEIGHT) {
            this.y += this.vel;
        }
    }
}

class Bola {
    constructor() {
        this.raio = 10;
        this.resetar();
    }
    resetar() {
        this.x = WIDTH / 2;
        this.y = HEIGHT / 2;
        this.velx = Math.random() < 1/*0.5*/ ? 18/*4*/ : -18;
        this.vely = (Math.random() * 18) - 18/*2*/;
    }
    desenhar() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        ctx.fill();
    }
    atualizar(player, cpu) {
        this.x += this.velx;
        this.y += this.vely;

        if (this.y - this.raio < 0 || this.y + this.raio > HEIGHT) {
            this.vely *= -1;
        }

        // Colisão com o player
        if (
            this.x - this.raio < player.x + player.width &&
            this.y > player.y &&
            this.y < player.y + player.height
        ) {
            this.velx *= -1;
            this.x = player.x + player.width + this.raio;
        }

        // Colisão com a CPU
        if (
            this.x + this.raio > cpu.x &&
            this.y > cpu.y &&
            this.y < cpu.y + cpu.height
        ) {
            this.velx *= -1;
            this.x = cpu.x - this.raio;
        }

        if (this.x < 0) {
            cpuScore++;
            this.resetar();
        } else if (this.x > WIDTH) {
            playerScore++;
            this.resetar();
        }
    }
}

// ----------- AGORA OS OBJETOS ------------
const player = new Raquete(20);
const cpu = new Raquete(WIDTH - 30);
const bola = new Bola();

let playerScore = 0;
let cpuScore = 0;

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ----------- FUNÇÕES ------------
function atualizar() {
    if (keys["ArrowUp"]) player.mover("cima");
    if (keys["ArrowDown"]) player.mover("baixo");

    if (cpu.y + cpu.height / 2 < bola.y - 50) {
        cpu.mover("baixo");
    } else if (cpu.y + cpu.height / 2 > bola.y + 10) {
        cpu.mover("cima");
    }

    bola.atualizar(player, cpu);
}

function desenhar() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    player.desenhar();
    cpu.desenhar();
    bola.desenhar();

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`${playerScore}`, WIDTH / 4, 40);
    ctx.fillText(`${cpuScore}`, (WIDTH * 3) / 4, 40);
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();
