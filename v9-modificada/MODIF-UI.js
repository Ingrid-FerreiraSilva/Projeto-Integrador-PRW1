export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.livesImage = document.getElementById('lives');
        //painel
        this.scoreEl = document.getElementById('score');
        this.timeEl = document.getElementById('time');
        this.nivelEl = document.getElementById('nivel');
    }
    draw(ctx) {
        ctx.save();
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 0;
        ctx.font = this.fontSize + 'px ' + this.fontFamily;
        ctx.textAlign = 'left';
        ctx.fillStyle = this.game.fontColor;
        // score - painel
        this.scoreEl.textContent = `Pontuação: ${this.game.score}`;

        // time - painel
        this.timeEl.textContent = `Tempo: ${(this.game.time * 0.001).toFixed(1)}s`;
        
        //nivel-painel
        this.nivelEl.textContent = `Dificuldade: ${this.game.dificuldade}`;

        // vidas
        for (let i = 0; i < this.game.lives; i++) {
            ctx.drawImage(this.livesImage, 30 * i + 20, 20, 25, 25);
        }
        // game over
        if (this.game.gameOver) {
            ctx.textAlign = 'center';
            ctx.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score > this.game.winningScore) {
                ctx.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5 - 20);
                ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                ctx.fillText('Com medo do que?', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                ctx.fillText('GAME OVER', this.game.width * 0.5, this.game.height * 0.5 - 20);
                ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                ctx.fillText('Melhor sorte na próxima', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        ctx.restore();
    }
}