AFRAME.registerComponent("video-controller", {
    init: function () {
        const target = document.getElementById("target");
        const btn = document.querySelector("button");
        const video = document.getElementById("myVideo");

        // detect target found
        target.addEventListener("targetFound", event => {
            console.log("target found");
            this.found = true;
            video.play();
        });
        // detect target lost
        target.addEventListener("targetLost", event => {
            console.log("target lost");
            this.found = false
            video.pause();
        });
        // detect click event
        btn.addEventListener("click", event => {
            console.log("btn click");
            if (this.found)
                video.play();
        });
    }
})