import { dialogueData, scaleFactor } from "./components/constants";
import { k } from "./kaboomCtx";
import { displayDialogue, screenSize } from "./components/text";
import { moveUp, moveDown, moveLeft, moveRight, stop } from "./components/movement";



k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 936,
        "walk-down": {from: 936, to: 939, loop: true, speed: 8},
        "idle-side": 975,
        "walk-side": {from: 975, to: 978, loop: true, speed: 8},
        "idle-up": 1014,
        "walk-up": {from: 1014, to: 1017, loop: true, speed: 8},
    },
});

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#000000"));

k.scene("game", async () => {
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;

    const map = k.add([
        k.sprite("map"),
        k.pos(0, 0),
        k.scale(scaleFactor),
    ]);

    const player = k.make([
        k.sprite("spritesheet", {anim: "idle-down"}),
        k.area({shape: new k.Rect(k.vec2(0, 3), 10, 10)}),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player",
    ]);

    for (const layer of layers) {
        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(
                            k.vec2(0), 
                            boundary.width, 
                            boundary.height
                        ),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);

                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        displayDialogue(dialogueData[boundary.name], () => (
                            player.isInDialogue = false
                        ));
                    });
                }
            }
            continue;
        }

        if (layer.name === "spawnpoint") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    screenSize(k)

    k.onResize(() => {
        screenSize(k);
    })

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y - 100);
    });

    // Movement using wasd
    k.onKeyDown("w", () => {
        if (player.isInDialogue) return;
        moveUp(player, player.speed);
    });

    k.onKeyDown("s", () => {
        if (player.isInDialogue) return;
        moveDown(player, player.speed);
    });

    k.onKeyDown("a", () => {
        if (player.isInDialogue) return;
        moveLeft(player, player.speed);
    });

    k.onKeyDown("d", () => {
        if (player.isInDialogue) return;
        moveRight(player, player.speed);
    });

    k.onKeyRelease("w", () => {
        stop(player);
    });

    k.onKeyRelease("s", () => {
        stop(player);
    });

    k.onKeyRelease("a", () => {
        stop(player);
    });

    k.onKeyRelease("d", () => {
        stop(player);
    });


    // movemnt with arrow keys
    k.onKeyDown("up", () => {
        if (player.isInDialogue) return;
        moveUp(player, player.speed);
    });

    k.onKeyDown("down", () => {
        if (player.isInDialogue) return;
        moveDown(player, player.speed);
    });

    k.onKeyDown("left", () => {
        if (player.isInDialogue) return;
        moveLeft(player, player.speed);
    });

    k.onKeyDown("right", () => {
        if (player.isInDialogue) return;
        moveRight(player, player.speed);
    });

    k.onKeyRelease("up", () => {
        stop(player);
    });

    k.onKeyRelease("down", () => {
        stop(player);
    });

    k.onKeyRelease("left", () => {
        stop(player);
    });

    k.onKeyRelease("right", () => {
        stop(player);
    });

    //movement with mouse
    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const mousePos = k.toWorld(k.mousePos());
        player.move(mousePos.sub(player.pos).unit().scale(player.speed));

        const mouseAngle = player.pos.angle(mousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (mouseAngle > lowerBound && mouseAngle < upperBound) {
            moveUp(player, 50);
            return;
        }

        if (mouseAngle > -upperBound && mouseAngle < -lowerBound) {
            moveDown(player, 50);
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            moveRight(player, 50);
            return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
            moveLeft(player, 50);
            return;
        }
    });

    k.onMouseRelease(() => {
        stop(player);
    });

});

k.go("game");