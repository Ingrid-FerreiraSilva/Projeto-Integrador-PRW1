import {
    Player
} from './MODIF-player.js';
import {
    InputHandler
} from './MODIF-input.js';
import {
    Background
} from './background.js';
import {
    FlyingEnemy,
    ClimbingEnemy,
    GroundEnemy
} from './MODIF-enemies.js';
import {
    UI
} from './MODIF-UI.js';

//níveis
export const Dificuldade = {
    FACIL: 'Fácil',
    MEDIO: 'Médio',
    DIFICIL: 'Difícil'
};

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        //níveis
        constructor(width, height, dificuldade = Dificuldade.FACIL) {
            //níveis
            this.dificuldade = dificuldade;

            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);

            this.enemies = [];
            this.particles = [];
            this.collisions = [];

            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.maxParticles = 200;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            this.winningScore = 50;
            this.maxTime = 35000; // 45s
            this.gameOver = false;
            this.lives = 5;

            //parametros dos niveis
            this.defineParametroDificuldade()

            // estado inicial do player
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

            // áudio
            this.audio = {
                boom: document.getElementById('boom_sfx'),
                started: false,
                start() {
                    if (this.started || !this.boom) return;
                    this.started = true;
                    this.boom.play().then(() => {
                        this.boom.pause();
                        this.boom.currentTime = 0;
                    }).catch(() => {});
                },
                playBoom() {
                    if (!this.boom) return;
                    const sfx = this.boom.cloneNode();
                    sfx.volume = 0.9;
                    sfx.play().catch(() => {});
                }
            };
        }

        //definindo parametros
        defineParametroDificuldade() {
            switch (this.dificuldade) {
                case Dificuldade.MEDIO:
                    this.maxSpeed = 4;
                    this.enemyInterval = 700;
                    this.lives = 3;
                    this.winningScore = 70;
                    this.maxTime = 30000;
                    this.spawn = {
                        chaoChance: 0.6,
                        escalaChance: 0.7,
                        voaChance: 1
                    };
                    break;

                case Dificuldade.DIFICIL:
                    this.maxSpeed = 5;
                    this.enemyInterval = 500;  
                    this.lives = 2;
                    this.winningScore = 85;
                    this.maxTime = 25000;       
                    this.spawn = {
                        chaoChance: 0.8,
                        escalaChance: 0.9,
                        voaChance: 2           
                    };
                    break;

                // padrao facil
                case Dificuldade.FACIL:
                default:
                    this.maxSpeed = 3;          
                    this.enemyInterval = 900; 
                    this.lives = 5;
                    this.winningScore = 60;
                    this.maxTime = 40000;      
                    this.spawn= {
                        chaoChance: 0.4,    
                        escalaChance: 0.5,   
                        voaChance: 1           
                    };
                    break;
            }
        }

        update(deltaTime) {
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(e => e.update(deltaTime));
            this.particles.forEach(p => p.update(deltaTime));
            this.collisions.forEach(c => c.update(deltaTime));

            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            this.enemies = this.enemies.filter(e => !e.markedForDeletion);
            this.particles = this.particles.filter(p => !p.markedForDeletion);
            this.collisions = this.collisions.filter(c => !c.markedForDeletion);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(e => e.draw(context));
            this.particles.forEach(p => p.draw(context));
            this.collisions.forEach(c => c.draw(context));
            this.UI.draw(context);
        }

        //spawn seguindo a dificuldade
        addEnemy() {
            if (this.speed >0 && Math.random() < this.spawn.chaoChance) this.enemies.push(new GroundEnemy(this));
            else if (this.speed >0 && Math.random() < this.spawn.escalaChance) this.enemies.push(new ClimbingEnemy(this));
            if (Math.random() < this.spawn.voaChance) this.enemies.push(new FlyingEnemy(this));
        }
    }

    //modficado
    let game;
    let lastTime = 0;

    function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (game) { // só roda se o jogo existir
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
        }
    }
    // inicia quando clicar no botão
    document.getElementById('iniciar').addEventListener('click', (e) => {
    e.preventDefault();//problema com o enter
    const selected = document.getElementById('dificuldade').value;
    // cria o jogo com a dificuldade escolhida
    game = new Game(canvas.width, canvas.height, selected);
    lastTime = 0;
    animate(0);
    });
});