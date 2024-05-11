export function displayDialogue(text, onDisplayEnd) {
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");

    dialogueUI.style.display = "block";

    let index = 0;
    let currentText = "";
    const interval = setInterval(() => {
        if (index < text.length) {
            currentText += text[index];
            dialogue.innerText = currentText;
            index++;
            return;
        }

        clearInterval(interval);
    }, 5);

    const closeBtn = document.getElementById("close");

    closeBtn.onclick = () => {
        dialogueUI.style.display = "none";
        dialogue.innerText = "";
        clearInterval(interval);
        onDisplayEnd();
    };
    
    window.addEventListener("keydown", (key) => {
        if (key.code === "Enter" || key.code === "Space" || key.code === "Escape") {
            closeBtn.click();
        }
    });

}

export function screenSize(k) {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
        k.camScale(k.vec2(1));
        return;
    } 

    k.camScale(k.vec2(1.5));
}