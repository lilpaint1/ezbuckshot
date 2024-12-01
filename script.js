document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");

    // Enable music to play after user interaction
    const enableAudio = () => {
        if (localStorage.getItem("visitedBefore")) {
            music.loop = true;
            music.play().catch(error => console.log("Audio playback blocked:", error));
        } else {
            localStorage.setItem("visitedBefore", "true");
        }
    };

    // Add user interaction events
    document.body.addEventListener("click", enableAudio, { once: true });
    document.body.addEventListener("keydown", enableAudio, { once: true });

    // Restart music if it ends
    music.addEventListener("ended", () => {
        music.currentTime = 0;
        music.play();
    });
});
