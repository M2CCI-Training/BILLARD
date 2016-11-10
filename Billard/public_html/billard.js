/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Math.degrees = function (rad)
{
    return rad * (180 / Math.PI);
};

Math.radians = function (deg)
{
    return deg * (Math.PI / 180);
};
/**
 * 
 * @param {type} canvas dans lequel la boule est dessinée
 * @returns {Boule}
 */
function Boule(canvas) {
    this.canvas = canvas;
    this.r = 5;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
}
/**
 * Dessine la boule
 * @returns {undefined} dessine la fonction
 */
Boule.prototype.dessiner = function () {
    var ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
};

/**
 * 
 * @param {canvas} canvas où est dessiné la queue 
 * @param {objet} Boule = la boule à jouer servant à récupérer les coordonnées
 * @returns {Queue}
 */
function Queue(canvas, Boule) {
    this.canvas = canvas;
    this.x = Boule.x;
    this.y = Boule.y;
    this.taille = 200;
}
/**
 * 
 * Déplace la queue de billard
 */
Queue.prototype.deplacer = function () {
    this.xtop = this.x + this.taille * Math.cos(this.alpha);
    this.ytop = this.y + this.taille * Math.sin(this.alpha);
};

Queue.prototype.incliner = function (evt) {
    var mouse = getMousePos(this.canvas, evt);
    var x = mouse.x - this.x;
    var y = mouse.y - this.y;
    if (x < 0) {
       this.alpha = Math.PI + Math.atan(y / x);   
    }else{
       this.alpha = Math.atan(y / x);
       }
};
/**
 * 
 * Dessine la queue
 */
Queue.prototype.dessiner = function () {
    var ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 4;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.xtop, this.ytop);
    ctx.stroke();
};

/**
 * 
 * @param {type} canvas 
 * @param {type} evt = la position de la souris
 * @returns les coordonnées de la souris
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function init() {
    var canvas = document.getElementById("MyCanvas");
    var ctxt = canvas.getContext("2d");
    var blanche = new Boule(canvas);
    var queue = new Queue(canvas, blanche);
    blanche.dessiner();
    canvas.addEventListener("mousemove", function (evt) {
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        blanche.dessiner();
        queue.incliner(evt);
        queue.deplacer();
        queue.dessiner();
    }, false);
}
