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

k.setBackground(k.Color.fromHex("#000000"));

k.scene("game", async (png, json) => {

    k.loadSprite("map", png);

    const mapData = await (await fetch(json)).json();
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
                        if (boundary.name === "exit" && player.direction === "down" && player.pos.y > boundary.y) {
                            k.destroyAll();
                            k.go("game", "./map2.png", "./map2.json");
                        }
                        else if (boundary.name === "house") {
                            k.destroyAll();
                            k.go("game", "./map.png", "./map.json");
                        }
                        else if (boundary.name === "ladder") {
                            k.destroyAll();
                            k.go("game", "./map3.png", "./map3.json");
                        }
                        else if (boundary.name === "castle") {
                            k.destroyAll();
                            k.go("game", "./map2.png", "./map2.json");
                        }
                        else {
                            player.isInDialogue = true;
                            displayDialogue(dialogueData[boundary.name], () => (
                                player.isInDialogue = false
                            ));
                        }

                    });
                }
            }
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
        moveUp(player, player.speed);
    });

    k.onKeyDown("s", () => {
        moveDown(player, player.speed);
    });

    k.onKeyDown("a", () => {
        moveLeft(player, player.speed);
    });

    k.onKeyDown("d", () => {
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
        moveUp(player, player.speed);
    });

    k.onKeyDown("down", () => {
        moveDown(player, player.speed);
    });

    k.onKeyDown("left", () => {
        moveLeft(player, player.speed);
    });

    k.onKeyDown("right", () => {
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

k.go("game", "./map.png", "./map.json");