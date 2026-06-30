const startBtn = document.getElementById("startBtn");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ascii = document.getElementById("ascii");

let asciiLoop = null;

const ASCII_CHARS =
"@%#*+=-:. ";


/* ======================
   START CAMERA
====================== */

startBtn.addEventListener("click", async () => {

    if (asciiLoop) return;

    const stream =
        await navigator.mediaDevices.getUserMedia({
            video: true
        });

    video.srcObject = stream;

    video.onloadedmetadata = () => {
        startAscii();
    };

});


/* ======================
   ASCII CAMERA
====================== */

function startAscii() {

    canvas.width = 220;
    canvas.height = 120;

    asciiLoop = setInterval(() => {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        /* SELFIE MODE */

        ctx.save();

        ctx.scale(-1, 1);

        ctx.drawImage(
            video,
            -canvas.width,
            0,
            canvas.width,
            canvas.height
        );

        ctx.restore();

        const pixels =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            ).data;

        let output = "";

        for (let y = 0; y < canvas.height; y++) {

            for (let x = 0; x < canvas.width; x++) {

                const index =
                    (y * canvas.width + x) * 4;

                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];

                const brightness =
                    (r + g + b) / 3;

                const charIndex =
                    Math.floor(
                        brightness *
                        (ASCII_CHARS.length - 1) /
                        255
                    );

                output +=
                    ASCII_CHARS[charIndex];
            }

            output += "\n";
        }

        ascii.textContent = output;

    }, 33);

}


/* ======================
   MATRIX RAIN
====================== */

const bg =
    document.getElementById("matrix-bg");

const bgCtx =
    bg.getContext("2d");


function resizeMatrix() {

    bg.width = window.innerWidth;
    bg.height = window.innerHeight;

}

resizeMatrix();

window.addEventListener(
    "resize",
    resizeMatrix
);


const letters =
"01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";

const fontSize = 14;

let columns =
    Math.floor(bg.width / fontSize);

let drops =
    Array(columns).fill(1);


function matrixRain() {

    bgCtx.fillStyle =
        "rgba(0,0,0,0.03)";

    bgCtx.fillRect(
        0,
        0,
        bg.width,
        bg.height
    );

    bgCtx.fillStyle = "#00ff41";

    bgCtx.font =
        fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {

        const text =
            letters[
                Math.floor(
                    Math.random() *
                    letters.length
                )
            ];

        bgCtx.fillText(
            text,
            i * fontSize,
            drops[i] * fontSize
        );

        if (
            drops[i] * fontSize > bg.height &&
            Math.random() > 0.975
        ) {

            drops[i] = 0;

        }

        drops[i]++;

    }

}

setInterval(
    matrixRain,
    35
);