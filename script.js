/* =========================================================
   ELEMENTS
========================================================= */

const preloader = document.getElementById("preloader");
const seal = document.getElementById("openSeal");
const envelope = document.getElementById("envelope");
const openingScreen = document.getElementById("opening-screen");
const mainContent = document.getElementById("main-content");
const music = document.getElementById("bgMusic");


/* =========================================================
   VARIABLES
========================================================= */

let invitationOpened = false;
let autoScrollTimer = null;
let autoScrollStopped = false;
let musicStarted = false;


/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (!preloader) return;

        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";

        setTimeout(() => {

            preloader.style.display = "none";

        }, 800);

    }, 1800);

});


/* =========================================================
   MUSIC
   Android / Chrome / Firefox / Edge / iPhone / Safari
========================================================= */

/*
   مهم:
   لا نحاول تشغيل الموسيقى عند تحميل الصفحة.

   التشغيل يتم من ضغطة المستخدم على زر فتح الدعوة.
   وهذا هو الأسلوب الصحيح مع قيود autoplay
   في متصفحات الهاتف، خصوصًا iOS Safari.
*/

function startMusic() {

    if (!music || musicStarted) {
        return;
    }

    music.volume = 0.35;
    music.muted = false;

    const playPromise = music.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                musicStarted = true;

                console.log(
                    "Music started successfully."
                );

            })
            .catch((error) => {

                musicStarted = false;

                console.log(
                    "Music playback was blocked or failed:",
                    error
                );

            });

    }

}


/* =========================================================
   AUDIO ERROR CHECK
========================================================= */

if (music) {

    music.addEventListener("error", () => {

        console.log(
            "Audio error. Check that ./aseel.mp3 exists and is a valid MP3 file."
        );

    });

}


/* =========================================================
   OPEN INVITATION
========================================================= */

if (seal) {

    seal.addEventListener(
        "click",
        openInvitation
    );

}


function openInvitation() {

    if (invitationOpened) {
        return;
    }

    invitationOpened = true;


    /* =====================================================
       MUSIC
       تشغيل مباشر نتيجة ضغطة المستخدم
    ====================================================== */

    startMusic();


    /* =====================================================
       OPEN ENVELOPE
    ====================================================== */

    if (envelope) {

        envelope.classList.add("open");

    }


    /* =====================================================
       WAIT FOR ENVELOPE ANIMATION
    ====================================================== */

    setTimeout(() => {

        if (!openingScreen) return;


        openingScreen.style.transition =
            "opacity 1s ease";

        openingScreen.style.opacity =
            "0";


        /* =================================================
           HIDE OPENING
        ================================================== */

        setTimeout(() => {

            openingScreen.style.display =
                "none";


            /* =============================================
               SHOW MAIN CONTENT
            ============================================== */

            if (mainContent) {

                mainContent.style.display =
                    "block";

                mainContent.style.opacity =
                    "0";

                mainContent.style.transform =
                    "translateY(30px)";


                requestAnimationFrame(() => {

                    mainContent.style.transition =
                        "opacity 1.2s ease, transform 1.2s ease";

                    mainContent.style.opacity =
                        "1";

                    mainContent.style.transform =
                        "translateY(0)";

                });

            }


            /* =============================================
               START FROM TOP
            ============================================== */

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });


            /* =============================================
               START AUTO SCROLL
            ============================================== */

            setTimeout(() => {

                if (!autoScrollStopped) {

                    autoScrollSections();

                }

            }, 3500);

        }, 900);

    }, 1300);

}


/* =========================================================
   AUTO SCROLL
========================================================= */

function autoScrollSections() {

    if (autoScrollStopped) return;


    const sections = [

        document.querySelector(".childhood-section"),

        document.querySelector(".invitation-section"),

        document.querySelector(".quote-section"),

        document.querySelector(".countdown-section"),

        document.querySelector(".location-section")

    ].filter(Boolean);


    let currentSection = 0;


    function goNext() {

        if (autoScrollStopped) return;


        if (currentSection >= sections.length) {
            return;
        }


        const section =
            sections[currentSection];


        if (!section) {

            currentSection++;

            goNext();

            return;

        }


        /* =============================================
           SCROLL TO SECTION
        ============================================== */

        section.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });


        currentSection++;


        /* =============================================
           WAIT 7 SECONDS
        ============================================== */

        autoScrollTimer =
            setTimeout(() => {

                goNext();

            }, 7000);

    }


    goNext();

}


/* =========================================================
   STOP AUTO SCROLL
========================================================= */

function stopAutoScroll() {

    if (autoScrollStopped) return;

    autoScrollStopped = true;


    if (autoScrollTimer) {

        clearTimeout(
            autoScrollTimer
        );

        autoScrollTimer = null;

    }

}


/* =========================================================
   TOUCH
========================================================= */

window.addEventListener(
    "touchstart",
    stopAutoScroll,
    {
        passive: true,
        once: true
    }
);


/* =========================================================
   WHEEL
========================================================= */

window.addEventListener(
    "wheel",
    stopAutoScroll,
    {
        passive: true,
        once: true
    }
);


/* =========================================================
   COUNTDOWN
========================================================= */

/*
   التاريخ:
   الجمعة 18 سبتمبر 2026
   الساعة 9:00 مساءً

   يتم إنشاء التاريخ كوقت محلي على جهاز الزائر.
*/

const weddingDate =
    new Date(
        2026,
        8,
        18,
        21,
        0,
        0
    ).getTime();


function updateCountdown() {

    const now =
        Date.now();


    const distance =
        weddingDate - now;


    /* =====================================================
       DATE PASSED
    ====================================================== */

    if (distance <= 0) {

        const countdown =
            document.querySelector(
                ".countdown"
            );


        if (countdown) {

            countdown.innerHTML = `

                <h2
                    style="
                        width:100%;
                        color:#b8860b;
                        font-family:'Marhey',cursive;
                        font-size:24px;
                    "
                >
                    تم عقد القران ❤️
                </h2>

            `;

        }

        return;

    }


    /* =====================================================
       CALCULATE TIME
    ====================================================== */

    const days =
        Math.floor(
            distance /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                distance %
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) /
            (
                1000 *
                60 *
                60
            )
        );


    const minutes =
        Math.floor(
            (
                distance %
                (
                    1000 *
                    60 *
                    60
                )
            ) /
            (
                1000 *
                60
            )
        );


    const seconds =
        Math.floor(
            (
                distance %
                (
                    1000 *
                    60
                )
            ) /
            1000
        );


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const daysElement =
        document.getElementById(
            "days"
        );

    const hoursElement =
        document.getElementById(
            "hours"
        );

    const minutesElement =
        document.getElementById(
            "minutes"
        );

    const secondsElement =
        document.getElementById(
            "seconds"
        );


    /* =====================================================
       UPDATE
    ====================================================== */

    if (daysElement) {

        daysElement.textContent =
            String(days);

    }


    if (hoursElement) {

        hoursElement.textContent =
            String(hours).padStart(
                2,
                "0"
            );

    }


    if (minutesElement) {

        minutesElement.textContent =
            String(minutes).padStart(
                2,
                "0"
            );

    }


    if (secondsElement) {

        secondsElement.textContent =
            String(seconds).padStart(
                2,
                "0"
            );

    }

}


/* =========================================================
   INITIAL COUNTDOWN
========================================================= */

updateCountdown();


/* =========================================================
   UPDATE EVERY SECOND
========================================================= */

setInterval(
    updateCountdown,
    1000
);