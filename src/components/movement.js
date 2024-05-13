export function moveUp(player, speed) {
    if (player.isInDialogue) return;
    player.move(0, -speed);
    player.direction = "up";
    if (player.curAnim() !== "walk-up") {
        player.play("walk-up");
    }
}

export function moveDown(player, speed) {
    if (player.isInDialogue) return;
    player.move(0, speed);
    player.direction = "down";
    if (player.curAnim() !== "walk-down") {
        player.play("walk-down");
    }
}

export function moveLeft(player, speed) {
    if (player.isInDialogue) return;
    player.move(-speed, 0);
    player.direction = "left";
    player.flipX = true;
    if (player.curAnim() !== "walk-side") {
        player.play("walk-side");
    }
}

export function moveRight(player, speed) {
    if (player.isInDialogue) return;
    player.move(speed, 0);
    player.direction = "right";
    player.flipX = false;
    if (player.curAnim() !== "walk-side") {
        player.play("walk-side");
    }
}

export function stop(player) {
    player.stop();
    if (player.direction === "up") {
        player.play("idle-up");
    } else if (player.direction === "down") {
        player.play("idle-down");
    } else {
        player.play("idle-side");
    }
}