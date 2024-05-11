import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, screenSize } from "./utils";


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
        player.move(0, -player.speed);
        player.direction = "up";
        if (player.curAnim() !== "walk-up") {
            player.play("walk-up");
        }
    });

    k.onKeyDown("s", () => {
        if (player.isInDialogue) return;
        player.move(0, player.speed);
        player.direction = "down";
        if (player.curAnim() !== "walk-down") {
            player.play("walk-down");
        }
    });

    k.onKeyDown("a", () => {
        if (player.isInDialogue) return;
        player.move(-player.speed, 0);
        player.direction = "left";
        player.flipX = true;
        if (player.curAnim() !== "walk-side") {
            player.play("walk-side");
        }
    });

    k.onKeyDown("d", () => {
        if (player.isInDialogue) return;
        player.move(player.speed, 0);
        player.direction = "right";
        player.flipX = false;
        if (player.curAnim() !== "walk-side") {
            player.play("walk-side");
        }
    });

    k.onKeyRelease("w", () => {
        if (player.direction === "up") {
            player.stop();
            player.play("idle-up");
        }
    });

    k.onKeyRelease("s", () => {
        if (player.direction === "down") {
            player.stop();
            player.play("idle-down");
        }
    });

    k.onKeyRelease("a", () => {
            player.stop();
            player.play("idle-side");
    });

    k.onKeyRelease("d", () => {
            player.stop();
            player.play("idle-side");
    });


    // movemnt with arrow keys
    k.onKeyDown("up", () => {
        if (player.isInDialogue) return;
        player.move(0, -player.speed);
        player.play("walk-up");
        player.direction = "up";
    });

    k.onKeyDown("down", () => {
        if (player.isInDialogue) return;
        player.move(0, player.speed);
        player.play("walk-down");
        player.direction = "down";
    });

    k.onKeyDown("left", () => {
        if (player.isInDialogue) return;
        player.move(-player.speed, 0);
        player.direction = "left";
        player.flipX = true;
        player.play("walk-side");
    });

    k.onKeyDown("right", () => {
        if (player.isInDialogue) return;
        player.move(player.speed, 0);
        player.direction = "right";
        player.flipX = false;
        player.play("walk-side");
    });

    //movement with mouse
    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const mousePos = k.toWorld(k.mousePos());
        player.move(mousePos.sub(player.pos).unit().scale(player.speed));

        const mouseAngle = player.pos.angle(mousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== "walk-up") {
            player.play("walk-up");
            player.direction = "up";
            return;
        }

        if (mouseAngle > -upperBound && mouseAngle < -lowerBound && player.curAnim() !== "walk-down") {
            player.play("walk-down");
            player.direction = "down";
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") {
                player.play("walk-side");
            }
            player.direction = "right";
            return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") {
                player.play("walk-side");
            }
            player.direction = "left";
            return;
        }
    });

    k.onMouseRelease(() => {
        player.stop();
        if (player.direction === "down") {
            player.play("idle-down");
            return;
        }

        if (player.direction === "up") {
            player.play("idle-up");
            return;
        }

        if (player.direction === "left" || player.direction === "right") {
            player.play("idle-side");
        }
    });

});

k.go("game");