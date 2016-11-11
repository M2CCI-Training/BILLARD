
/* Scripts du Billard */
/* ================== */


/* Objet de type Boule */
/* ~~~~~~~~~~~~~~~~~~~ */

// Constructeur d'une boule :
function Boule( x, y, r, v, a ) {
    this.x = x;  // position en x (horizontale)
    this.y = y;  // position en y (verticale)
    this.r = r;  // rayon de la boule
    this.a = a;  /* direction de déplacement de la boule
                  * RMQ: a est un angle exprimé en radian, a=0 correspond à
                  *      une direction horizontale vers la droite.
                  */
    this.v = v;  // vitesse de la boule
}

// getAll() :
Boule.prototype.getAll = function() {
    // on récupère dans 'tab' tous les paramètres de la boule :
    var tab = new Array(5);
    tab[0] = this.x;  // 0 = position en x
    tab[1] = this.y;  // 1 = position en y
    tab[2] = this.r;  // 2 = rayon
    tab[3] = this.v;  // 3 = vitesse
    tab[4] = this.a;  // 4 = orientation
    return tab;
};

// placer( x, y ) :
Boule.prototype.placer = function( x, y ) {
    // place la boule en (x,y) :
    this.x = x;
    this.y = y;
};

// setV( vitesse ) :
Boule.prototype.setV = function( v ) {
    // la vitesse de la boule prend pour valeur v :
    this.v = v;
};

// setA( angle ) :
Boule.prototype.setA = function( a ) {
    // oriente la boule dans la direction a :
    this.a = a;
};

// deplacer( canvas, vitesse_seuil ) :
Boule.prototype.deplacer = function( C, vs ) {
    
    // la boule s'arrête si sa vitesse devient trop petite :
    if( this.v<vs ) {
        this.v = 0;
    }
    
    // calcul la nouvelle position de la boule :
    var newX = this.x + this.v*Math.cos(this.a);  // nouvelle position en x
    var newY = this.y - this.v*Math.sin(this.a);  // nouvelle position en y
    
    // varialbles utiles pour les caluculs :
    var R = this.r;  // rayon
    var W = C.width;  // largeur du canvas
    var H = C.height;  // hauteur du canvas
    
    // si la boule va taper à gauche ou à droite :
    if( newX-R<0 || newX+R>W ) {
        // pour ne pas sortir du cadre :
        if( newX-R<0 ) { // si on tape à gauche :
            newX = this.x + (this.x-R)*(Math.cos(this.a));
        }
        if( newX+R>W ) { // si on tape à droite :
            newX = this.x + (W-(this.x+R))*(Math.cos(this.a));
        }
        this.a = Math.PI - this.a;  // on change l'orientation
        this.v = 0.7*this.v;  // la boule perd de la vitesse avec le choc contre le bord
    }
    
    // si la boule va taper en haut ou en bas :
    if( newY-R<0 || newY+R>H ) {
        // pour ne pas sortir du cadre :
        if( newY-R<0 ) { // si on tape en haut :
            newY = this.y + (this.y-R)*(Math.sin(this.a));
        }
        if( newY+R>H ) { // si on tape en bas :
            newY = this.y + (H-(this.y+R))*(Math.sin(this.a));
        }
        this.a = -this.a;  // on change l'orientation
        this.v = 0.7*this.v;  // la boule perd de la vitesse avec le choc contre le bord
    }
    
    // on effectue le changement de position de la boule :
    this.x = newX;
    this.y = newY;
};

// dessiner( ctxt ) :
Boule.prototype.dessiner = function( ctxt ) {
    // dessine la boule à l'écran
    ctxt.beginPath();
    ctxt.strokeStyle = "black";
    ctxt.fillStyle = "red";
    ctxt.arc( this.x, this.y, this.r, 0, 2*Math.PI, true );
    ctxt.fill();
    ctxt.stroke();
};


/* Fonction init() */
/* ~~~~~~~~~~~~~~~ */

function init() {
    
    // variables de bases :
    var timerId = 0;
    var canvas = document.getElementById("billard");
    var ctxt = canvas.getContext("2d");
    
    // création et affichage de la boule :
    var B = new Boule( canvas.width/2, canvas.height/2, 10, 15, 0 /*Math.PI/6*/ );
    B.dessiner(ctxt);
    
    // paramètres réglables :
    var vi;  // vitesse initiale de la boule
    var kf;  // coefficient de frottement (en %)
    var vs;  // vitesse seuil
    var ai;  // orientation initiale (en degrés)
    
    
    // Action du bouton 'Apply' :
    document.getElementById("apply").onclick = function() {
        
        // actualisation des paramètres :
        vi = parseFloat( document.getElementById("vinit").value );
        kf = parseFloat( document.getElementById("coef").value );
        kf = (100-kf)/100;
        vs = parseFloat( document.getElementById("vseuil").value );
        ai = (parseFloat( document.getElementById("ainit").value ))*Math.PI/180;
        
        // réinitialisation de l'affichage :
        ctxt.clearRect( 0, 0, canvas.width, canvas.height );
        B = new Boule( canvas.width/2, canvas.height/2, 10, vi, ai );
        B.dessiner(ctxt);
    };
    
    
    // Action du bouton 'Play' :
    document.getElementById("play").onclick = function() {
        document.getElementById("play").disabled = true;
        document.getElementById("stop").disabled = false;
        
        // démarrage du timer :
        timerId = setInterval( function() {
                                    // fonction effectuée en boucle :
                                    // | 1) on efface l'affichage
                                        ctxt.clearRect( 0, 0, canvas.width, canvas.height );
                                    // | 2) on deplace la boule
                                        B.deplacer(canvas,vs);
                                    // | 3) on dessine la boule
                                        B.dessiner(ctxt);
                                    // | 4) on diminue la vitesse de la boule
                                    /*      RMQ: - B.getAll()[3] correspond à la vitesse de la boule
                                     *           - kf est compris entre 0 et 1 exclus ( 0 < kf < 1 )
                                     */
                                        B.setV( (B.getAll()[3])*kf );
                                    // | 5) on augmente légèrement les frottements
                                        kf = kf*0.999;
                                }, 50 /*ms*/ );
    };
    
    
    // Action du bouton 'Stop' :
    document.getElementById("stop").onclick = function() {
        document.getElementById("play").disabled = false;
        document.getElementById("stop").disabled = true;
        
        // arrêt du timer :
        clearInterval(timerId);
    };
    
}



