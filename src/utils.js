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

    const onCloseBtnClick = () => {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerText = "";
        clearInterval(interval);
        closeBtn.removeEventListener("click", onCloseBtnClick);
    }

    closeBtn.addEventListener("click", onCloseBtnClick);
}