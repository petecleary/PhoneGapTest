
var particleObj;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    particleObj = new particleTest();
}


var particleTest = function() {
    var canvas = document.getElementById("particalCanvas");
    var ctx = canvas.getContext("2d");

    //Make the canvas occupy the full page
    var W = window.innerWidth, H = window.innerHeight;
    canvas.width = W;
    canvas.height = H - 50;
    ctx.clearRect(0, 0, W, H - 50);

    var particles = [];
    var mouse = {};

    //set default values
    var intXRange, intYRange, intRadius, intLife, intColorR, intColorG, intColorB, intSpeed, intDrawOption;
    //set the default range
    setRangeInt("0");
    //set the default radius
    intRadius = 10;
    //set the default radius
    intLife = 20;
    //buildParticals particles
    buildParticles(50);
    //set speed
    intSpeed = 33;
    var nowPlaying;

    //set intDrawOption
    intDrawOption = "lighter";

    this.rebuildParticles = function(particle_count) {
        buildParticles(particle_count);
    }

    function buildParticles(particle_count) {
        particles.length = 0;
        //Lets create some particles now
        for(var i = 0; i < particle_count; i++) {
            particles.push(new particle());
        }
    }

    startWatch();

    //finally some mouse tracking
   // canvas.addEventListener('mousemove', track_mouse, false);

    //function track_mouse(e) {
        //since the canvas = full page the position of the mouse 
        //relative to the document will suffice
    //    mouse.x = e.pageX;
    //    mouse.y = e.pageY;
   // }

    // The watch id references the current `watchAcceleration`
    var watchID = null;

    // Start watching the acceleration
    //
    function startWatch() {

        // Update acceleration every 3 seconds
        var options = { frequency: 100 };

        watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    // Stop watching the acceleration
    //
    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }

    // onSuccess: Get a snapshot of the current acceleration
    //
    function onSuccess(acceleration) {
        mouse.x = (W / 2) + ((W / 20) * acceleration.x);
        mouse.y = (H / 2) + ((H / 20) * acceleration.y);
        var element = document.getElementById('accelerometer');
        element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
                            'Acceleration Y: ' + acceleration.y + '<br />' +
                            'Acceleration Z: ' + acceleration.z + '<br />' +
                            'Timestamp: ' + acceleration.timestamp + '<br />';
    }

    // onError: Failed to get the acceleration
    //
    function onError() {
        //
    }

    this.setRange = function(direction) {
        setRangeInt(direction);
    }

    function setRangeInt(direction) {
        switch(direction) {
            case "350":
                intXRange = 1.5 - Math.random() * 5;
                intYRange = -15 + Math.random() * 10;
                break;
            case "0":
                intXRange = 0;
                intYRange = -15 + Math.random() * 10;
                break;
            case "10":
                intXRange = -2.5 + Math.random() * 5;
                intYRange = -15 + Math.random() * 10;
                break;
            case "80":
                intXRange = 5 + Math.random() * 10;
                intYRange = -2.5 + Math.random() * 5;
                break;
            case "90":
                intXRange = 5 + Math.random() * 10;
                intYRange = 0;
                break;
            case "100":
                intXRange = 5 + Math.random() * 10;
                intYRange = 1.5 - Math.random() * 5;
                break;
            case "170":
                intXRange = -2.5 + Math.random() * 5;
                intYRange = 5 + Math.random() * 10;
                break;
            case "180":
                intXRange = 0;
                intYRange = 5 + Math.random() * 10;
                break;
            case "190":
                intXRange = 1.5 - Math.random() * 5;
                intYRange = 5 + Math.random() * 10;
                break;
            case "260":
                intXRange = -15 + Math.random() * 10;
                intYRange = -2.5 + Math.random() * 5;
                break;
            case "270":
                intXRange = -15 + Math.random() * 10;
                intYRange = 0;
                break;
            case "280":
                intXRange = -15 + Math.random() * 10;
                intYRange = 1.5 - Math.random() * 5;
                break;
        }
        //document.getElementById("xRangeDisplay").innerText = intXRange;
        //document.getElementById("yRangeDisplay").innerText = intYRange;
    }

    this.setRadius = function(r) {
        intRadius = Number(r);
    }

    this.setLife = function(l) {
        intLife = Number(l);
    }

    this.drawOption = function(v) {
        intDrawOption = v;
    }

    this.setSpeed = function(s) {
        intSpeed = Number(s);
        clearInterval(nowPlaying);
        nowPlaying = setInterval(draw, intSpeed);
    }
    function particle() {
        //speed, life, location, life, colors
        this.speed = { x: intXRange, y: intYRange };
        //location = mouse coordinates
        //Now the flame follows the mouse coordinates
        if(mouse.x && mouse.y) {
            this.location = { x: mouse.x, y: mouse.y };
        }
        else {
            this.location = { x: W / 2, y: H / 2 };
        }
        //radius range = 10-30
        this.radius = intRadius + Math.random() * 20;
        //life range = 20-30
        this.life = intLife + Math.random() * 10;
        this.remaining_life = this.life;
        //colors
        this.r = Math.round(Math.random() * 255);
        this.g = Math.round(Math.random() * 255);
        this.b = Math.round(Math.random() * 255);
    }

    function draw() {
        //Painting the canvas black
        //Time for lighting magic
        //particles are painted with "lighter"
        //In the next frame the background is painted normally without blending to the 
        //previous frame
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = intDrawOption;

        for(var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.beginPath();
            //changing opacity according to the life.
            //opacity goes to 0 at the end of life of a particle
            p.opacity = Math.round(p.remaining_life / p.life * 100) / 100
            //a gradient instead of white fill
            var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
            gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
            ctx.fillStyle = gradient;
            ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
            ctx.fill();

            //lets move the particles
            p.remaining_life--;
            p.radius--;
            p.location.x += p.speed.x;
            p.location.y += p.speed.y;

            //regenerate particles
            if(p.remaining_life < 0 || p.radius < 0) {
                //a brand new particle replacing the dead one
                particles[i] = new particle();
            }
        }
    }

    nowPlaying = setInterval(draw, intSpeed);
}