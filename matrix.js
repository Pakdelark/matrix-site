const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

const letters = "01アカサタナハマヤラワ";

// settings
const CONFIG = {
    speedMin: 0.45,
    speedMax: 0.5,
    fade: 0.05,
    spawnChance: 0.414,
    maxLife: 100
};

// fon-rain
const rain = Array(columns).fill(1);

// active falling message
let activeDrops = [];

// memory message
let memoryMessages = [];

// forms
document.getElementById("form").addEventListener("submit", function(e){
    e.preventDefault();

    let val = document.getElementById("msg").value.trim();

    if(val.length > 0){

        memoryMessages.push(val);

        activeDrops.push({
            text: val,
            x: Math.floor(Math.random() * columns),
            y: 0,
            speed: CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin),
            life: 0,
            maxLife: CONFIG.maxLife
        });

    }

    document.getElementById("msg").value = "";
});

// generate random simbols
function randomChar(){
    return letters[Math.floor(Math.random() * letters.length)];
}

function draw(){

    // затемнение (убирает смазывание)
    ctx.fillStyle = `rgba(0,0,0,${CONFIG.fade})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    // fon rain
    for(let i = 0; i < rain.length; i++){

        const char = randomChar();

        ctx.fillText(char, i * fontSize, rain[i] * fontSize);

        if(rain[i] * fontSize > canvas.height && Math.random() > 0.975){
            rain[i] = 0;
        }

        rain[i]++;
    }

    // message-repeat
    if(Math.random() > CONFIG.spawnChance && memoryMessages.length > 0){

        let val = memoryMessages[Math.floor(Math.random() * memoryMessages.length)];

        activeDrops.push({
            text: val,
            x: Math.floor(Math.random() * columns),
            y: 0,
            speed: CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin),
            life: 0,
            maxLife: CONFIG.maxLife
        });
    }

    // falling messages (without blurring)
    for(let i = activeDrops.length - 1; i >= 0; i--){

        let drop = activeDrops[i];

        for(let j = 0; j < drop.text.length; j++){

            let x = drop.x * fontSize;
            let y = (drop.y + j) * fontSize;

            // CLEARING the area under the text
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(x, y - fontSize, fontSize, fontSize);

            // draw on top
            if(j === 0){
                ctx.fillStyle = "#AFFF9F";
            } else {
                ctx.fillStyle = "#0F0";
            }

            ctx.fillText(drop.text[j], x, y);
        }

        drop.y += drop.speed;
        drop.life++;

        if(drop.life > drop.maxLife || (drop.y * fontSize) > canvas.height){
            activeDrops.splice(i, 1);
        }
    }


}

setInterval(draw, 33);
