"use strict";

(() => {
    const STORAGE_KEY = "magic-ovad-side-shooter-mvp.save.v1";
    const MAX_HP = 3;
    const FOOT_EXTENSION = 26;
    const GRAVITY = 1850;
    const FRICTION = 0.86;

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    const ui = {
        hp: document.getElementById("hud-hp"),
        hero: document.getElementById("hud-hero"),
        zone: document.getElementById("hud-zone"),
        score: document.getElementById("hud-score"),
        mushrooms: document.getElementById("hud-mushrooms"),
        skill: document.getElementById("hud-skill"),
        pauseButton: document.getElementById("pause-button"),
        heroGrid: document.getElementById("hero-grid"),
        upgradeGrid: document.getElementById("upgrade-grid"),
        upgradeHint: document.getElementById("upgrade-hint"),
        pauseZone: document.getElementById("pause-zone"),
        resultEyebrow: document.getElementById("result-eyebrow"),
        resultTitle: document.getElementById("result-title"),
        resultCopy: document.getElementById("result-copy"),
        nextZoneButton: document.getElementById("next-zone-button"),
        gameoverCopy: document.getElementById("gameover-copy")
    };

    const screens = {
        menu: document.getElementById("menu-screen"),
        heroes: document.getElementById("heroes-screen"),
        pause: document.getElementById("pause-screen"),
        result: document.getElementById("result-screen"),
        gameover: document.getElementById("gameover-screen")
    };

    const audio = {
        shoot: document.getElementById("audio-shoot"),
        hit: document.getElementById("audio-hit"),
        pickup: document.getElementById("audio-pickup"),
        music: document.getElementById("audio-music")
    };

    const imagePaths = {
        rookie: "images/black2.png",
        mushroom: "images/skin1.png",
        forest: "images/skin2.png",
        fire: "images/skin3.png",
        ice: "images/skin4.png",
        golden: "images/skin5.png",
        shadow: "images/skin6.png",
        star: "images/skin7.png",
        stone: "images/skin8.png",
        cat: "images/skin9.png",
        ghost: "images/skin10.png",
        firefly: "images/skin11.png",
        mushroomPickup: "images/mushroom.png",
        flyMushroom: "images/fly-mushroom.png",
        lakeBg: "images/level-1-bg.png",
        oldBg: "images/Background.png",
        sticker: "images/sticker.png"
    };

    const images = {};
    Object.entries(imagePaths).forEach(([key, path]) => {
        const img = new Image();
        img.src = path;
        images[key] = img;
    });

    const heroes = [
        {
            id: "rookie",
            name: "Rookie Ovad",
            image: "rookie",
            weapon: "Sting Rifle",
            perk: "Balanced speed, fast reload, clean single shots.",
            skill: "Focus Burst",
            color: "#50d8c8",
            fireRate: 240,
            speed: 1,
            jump: 1,
            bullet: "normal"
        },
        {
            id: "mushroom",
            name: "Mushroom King",
            image: "mushroom",
            weapon: "Spore Shotgun",
            perk: "Short spread. Skill heals one HP and fires spores.",
            skill: "Spore Heal",
            color: "#c7ef5f",
            fireRate: 410,
            speed: 0.94,
            jump: 0.96,
            bullet: "spore"
        },
        {
            id: "forest",
            name: "Forest Spirit",
            image: "forest",
            weapon: "Leaf Piercer",
            perk: "Piercing leaves and softer landings.",
            skill: "Leaf Fan",
            color: "#88e060",
            fireRate: 330,
            speed: 1.05,
            jump: 1.12,
            bullet: "leaf"
        },
        {
            id: "fire",
            name: "Fire Hopper",
            image: "fire",
            weapon: "Flame Pistol",
            perk: "Burning shots. Skill turns on rapid fire.",
            skill: "Overheat",
            color: "#ff8757",
            fireRate: 180,
            speed: 1.02,
            jump: 1,
            bullet: "fire"
        },
        {
            id: "ice",
            name: "Ice Warrior",
            image: "ice",
            weapon: "Frost Bolts",
            perk: "Freezes enemies and slows bosses.",
            skill: "Frost Lock",
            color: "#86dbff",
            fireRate: 300,
            speed: 0.98,
            jump: 1,
            bullet: "ice"
        },
        {
            id: "golden",
            name: "Golden Hero",
            image: "golden",
            weapon: "Gold Splitter",
            perk: "More mushrooms from kills and double gold shots.",
            skill: "Gold Rush",
            color: "#ffd166",
            fireRate: 360,
            speed: 1,
            jump: 1,
            bullet: "gold"
        },
        {
            id: "shadow",
            name: "Shadow Master",
            image: "shadow",
            weapon: "Shadow Needles",
            perk: "Fast piercing shots. Skill gives phase immunity.",
            skill: "Shadow Phase",
            color: "#ad8cff",
            fireRate: 260,
            speed: 1.1,
            jump: 1.04,
            bullet: "shadow"
        },
        {
            id: "star",
            name: "Stars Wanderer",
            image: "star",
            weapon: "Star Splitter",
            perk: "Triple star shots, strong against bosses.",
            skill: "Star Storm",
            color: "#f5d7ff",
            fireRate: 420,
            speed: 0.98,
            jump: 1.04,
            bullet: "star"
        },
        {
            id: "stone",
            name: "Stone Warden",
            image: "stone",
            weapon: "Rock Cannon",
            perk: "Slow heavy damage and passive armor.",
            skill: "Stone Guard",
            color: "#b8c0c8",
            fireRate: 520,
            speed: 0.88,
            jump: 0.9,
            bullet: "stone"
        },
        {
            id: "cat",
            name: "Magic Cat",
            image: "cat",
            weapon: "Blink Sparks",
            perk: "Light homing shots. Skill teleports forward.",
            skill: "Blink Shot",
            color: "#ff9ce3",
            fireRate: 280,
            speed: 1.08,
            jump: 1.16,
            bullet: "cat"
        },
        {
            id: "ghost",
            name: "Ghost Fox",
            image: "ghost",
            weapon: "Ghost Dashers",
            perk: "High crit damage. Skill dashes through danger.",
            skill: "Ghost Dash",
            color: "#d6e3ff",
            fireRate: 310,
            speed: 1.14,
            jump: 1.08,
            bullet: "ghost"
        },
        {
            id: "firefly",
            name: "FireFly",
            image: "firefly",
            weapon: "Spark Minigun",
            perk: "Tiny fast shots and a short hover burst.",
            skill: "Spark Barrage",
            color: "#ffe66d",
            fireRate: 110,
            speed: 1.04,
            jump: 1.06,
            bullet: "spark"
        }
    ];

    const heroById = Object.fromEntries(heroes.map((hero) => [hero.id, hero]));

    const upgrades = [
        { id: "damage", name: "Damage", max: 4, cost: (level) => 16 + level * 12, text: "More bullet damage" },
        { id: "cooldown", name: "Reload", max: 4, cost: (level) => 14 + level * 10, text: "Faster fire rate" },
        { id: "armor", name: "Armor", max: 3, cost: (level) => 18 + level * 14, text: "Chance to block damage" },
        { id: "engine", name: "Engine", max: 3, cost: (level) => 14 + level * 12, text: "More bike fuel" },
        { id: "skill", name: "Skill", max: 3, cost: (level) => 20 + level * 14, text: "Lower skill cooldown" },
        { id: "magnet", name: "Magnet", max: 3, cost: (level) => 12 + level * 10, text: "Pull pickups closer" }
    ];

    const levels = [
        {
            name: "Lake Shore",
            shortName: "Lake",
            biome: "lake",
            vehicle: "foot",
            width: 4300,
            reward: 24,
            ground: "#1f8f68",
            soil: "#11484c",
            skyTop: "#56d6ce",
            skyBottom: "#163c52",
            enemySet: ["ovad", "waterfly", "skeeter"],
            boss: {
                name: "Bubble Matriarch",
                hp: 42,
                pattern: "lake",
                color: "#ff7bd4",
                mechanic: "Bubble shield and wide bubble spreads"
            }
        },
        {
            name: "Bog Kayak Run",
            shortName: "Swamp",
            biome: "swamp",
            vehicle: "kayak",
            width: 4700,
            reward: 32,
            ground: "#466b37",
            soil: "#263c28",
            skyTop: "#9acb79",
            skyBottom: "#2d4737",
            enemySet: ["skeeter", "slime", "waterfly"],
            boss: {
                name: "Mud Admiral",
                hp: 56,
                pattern: "swamp",
                color: "#e09b45",
                mechanic: "Poison waves across the water"
            }
        },
        {
            name: "Dung Island",
            shortName: "Dung",
            biome: "dung",
            vehicle: "foot",
            width: 5100,
            reward: 42,
            ground: "#a56c35",
            soil: "#4b2b16",
            skyTop: "#d5a35a",
            skyBottom: "#563319",
            enemySet: ["dungling", "fly", "roller"],
            boss: {
                name: "The Brown Throne",
                hp: 70,
                pattern: "dung",
                color: "#7b421f",
                mechanic: "Bouncing bombs and summoned dunglings"
            }
        },
        {
            name: "Sky Ridge",
            shortName: "Sky",
            biome: "sky",
            vehicle: "foot",
            width: 5600,
            reward: 54,
            ground: "#78bde8",
            soil: "#3e78b5",
            skyTop: "#d6f7ff",
            skyBottom: "#4d8cdf",
            enemySet: ["stormbug", "ovad", "fly"],
            boss: {
                name: "Storm Crown",
                hp: 84,
                pattern: "sky",
                color: "#fff070",
                mechanic: "Lightning marks and side wind"
            }
        },
        {
            name: "Cosmic Hive",
            shortName: "Space",
            biome: "space",
            vehicle: "foot",
            width: 6200,
            reward: 72,
            ground: "#5b44c8",
            soil: "#180d3d",
            skyTop: "#101746",
            skyBottom: "#050610",
            enemySet: ["voidfly", "cometling", "stormbug"],
            boss: {
                name: "Void Ovad Prime",
                hp: 110,
                pattern: "space",
                color: "#b980ff",
                mechanic: "Gravity pulses and homing comets"
            }
        }
    ];

    const enemyTypes = {
        ovad: { name: "Ovad", hp: 3, w: 42, h: 30, speed: 74, flying: true, color: "#f6d15b", score: 80, shoot: false },
        waterfly: { name: "Water Fly", hp: 2, w: 34, h: 26, speed: 96, flying: true, color: "#67e8f9", score: 70, shoot: true, shot: "bubble" },
        skeeter: { name: "Skeeter", hp: 2, w: 28, h: 24, speed: 120, flying: true, color: "#e8ff94", score: 60, shoot: false },
        slime: { name: "Bog Slime", hp: 5, w: 54, h: 36, speed: 42, flying: false, color: "#7fe36c", score: 110, shoot: true, shot: "poison" },
        dungling: { name: "Dungling", hp: 5, w: 48, h: 42, speed: 52, flying: false, color: "#815022", score: 120, shoot: false },
        fly: { name: "Fat Fly", hp: 4, w: 44, h: 34, speed: 82, flying: true, color: "#b4a089", score: 90, shoot: true, shot: "spit" },
        roller: { name: "Roller", hp: 6, w: 48, h: 48, speed: 68, flying: false, color: "#5a3217", score: 140, shoot: true, shot: "dung" },
        stormbug: { name: "Storm Bug", hp: 5, w: 46, h: 32, speed: 112, flying: true, color: "#ffe66d", score: 140, shoot: true, shot: "spark" },
        voidfly: { name: "Void Fly", hp: 6, w: 44, h: 32, speed: 126, flying: true, color: "#9d8cff", score: 160, shoot: true, shot: "comet" },
        cometling: { name: "Cometling", hp: 7, w: 44, h: 44, speed: 88, flying: true, color: "#ff82e7", score: 180, shoot: true, shot: "comet" }
    };

    const save = loadSave();
    const controls = {
        left: false,
        right: false,
        jump: false,
        down: false,
        fireHeld: false,
        pointerShoot: false,
        aimStickShoot: false,
        skill: false,
        action: false,
        actionPressed: false,
        jumpPressed: false,
        aimX: 1,
        aimY: 0,
        aimActive: false,
        aimPointerId: null,
        aimKeys: {
            left: false,
            right: false,
            up: false,
            down: false
        }
    };

    const view = { w: 1, h: 1, dpr: 1 };
    let lastFrame = 0;
    let overlay = "menu";
    let heroReturnScreen = "menu";
    let wasPlayingBeforeHeroes = false;

    const player = {
        x: 100,
        y: 0,
        w: 50,
        h: 62,
        vx: 0,
        vy: 0,
        dir: 1,
        hp: MAX_HP,
        onGround: false,
        invuln: 0,
        fireTimer: 0,
        skillTimer: 0,
        phaseTimer: 0,
        shieldTimer: 0,
        rapidTimer: 0,
        spreadTimer: 0,
        hoverTimer: 0,
        jumpsUsed: 0,
        flipTimer: 0,
        flipDuration: 0.62,
        flipProgress: 0,
        flipAngle: 0,
        flipDirection: 1,
        vehicle: null,
        bikeFuel: 0,
        nearbyBike: null
    };

    const run = {
        state: "menu",
        levelIndex: 0,
        level: null,
        cameraX: 0,
        score: 0,
        time: 0,
        groundY: 0,
        waterY: 0,
        platforms: [],
        enemies: [],
        playerBullets: [],
        enemyBullets: [],
        hazards: [],
        particles: [],
        pickups: [],
        boss: null,
        message: "",
        messageTimer: 0,
        shake: 0,
        wind: 0
    };

    function loadSave() {
        const fallback = {
            selectedHero: "rookie",
            mushrooms: 0,
            upgrades: { damage: 0, cooldown: 0, armor: 0, engine: 0, skill: 0, magnet: 0 }
        };

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);
            return {
                selectedHero: heroById && heroById[parsed.selectedHero] ? parsed.selectedHero : fallback.selectedHero,
                mushrooms: Number.isFinite(parsed.mushrooms) ? parsed.mushrooms : 0,
                upgrades: { ...fallback.upgrades, ...(parsed.upgrades || {}) }
            };
        } catch (error) {
            return fallback;
        }
    }

    function persistSave() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    }

    function currentHero() {
        return heroById[save.selectedHero] || heroes[0];
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function rectsOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function entityRect(entity) {
        if (entity === player) {
            return playerCollisionRect();
        }

        return { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
    }

    function playerFootExtension() {
        return player.vehicle === "kayak" ? 12 : FOOT_EXTENSION;
    }

    function playerFootBottom() {
        return player.y + player.h + playerFootExtension();
    }

    function playerCollisionRect() {
        const extension = playerFootExtension();
        return {
            x: player.x,
            y: player.y,
            w: player.w,
            h: player.h + extension
        };
    }

    function playAudio(name, volume = 0.45) {
        const element = audio[name];
        if (!element) {
            return;
        }

        try {
            element.volume = volume;
            element.currentTime = 0;
            element.play().catch(() => {});
        } catch (error) {
            // Browser audio can be blocked until the first user gesture.
        }
    }

    function startMusic() {
        try {
            audio.music.volume = 0.18;
            audio.music.play().catch(() => {});
        } catch (error) {
            // Ignore autoplay restrictions.
        }
    }

    function resizeCanvas() {
        view.dpr = Math.min(window.devicePixelRatio || 1, 2);
        view.w = Math.max(320, canvas.clientWidth);
        view.h = Math.max(360, canvas.clientHeight);
        canvas.width = Math.round(view.w * view.dpr);
        canvas.height = Math.round(view.h * view.dpr);
        ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);

        if (run.level) {
            const previousGround = run.groundY || view.h - 112;
            setLevelY();
            const delta = run.groundY - previousGround;
            player.y += delta;
            run.platforms.forEach((platform) => {
                platform.y += delta;
            });
            run.enemies.forEach((enemy) => {
                if (!enemy.flying) {
                    enemy.y += delta;
                    enemy.baseY += delta;
                }
            });
        }
    }

    function setLevelY() {
        const level = run.level || levels[0];
        const reserve = gameplayBottomReserve();
        run.groundY = level.vehicle === "kayak" ? view.h - reserve + 32 : view.h - reserve;
        run.waterY = level.vehicle === "kayak" ? view.h - reserve - 4 : view.h - reserve - 44;
    }

    function gameplayBottomReserve() {
        if (view.w <= 720) {
            return 200;
        }

        if (view.w <= 980) {
            return 132;
        }

        return 112;
    }

    function showScreen(name) {
        overlay = name;
        Object.entries(screens).forEach(([key, element]) => {
            element.classList.toggle("is-active", key === name);
        });
    }

    function openHeroes(returnScreen) {
        heroReturnScreen = returnScreen || "menu";
        wasPlayingBeforeHeroes = run.state === "playing";
        if (wasPlayingBeforeHeroes) {
            run.state = "paused";
        }
        renderHeroGrid();
        renderUpgrades();
        showScreen("heroes");
    }

    function closeHeroes() {
        if (wasPlayingBeforeHeroes && heroReturnScreen === "pause") {
            showPause();
            return;
        }
        showScreen(heroReturnScreen);
    }

    function showPause() {
        if (run.level) {
            run.state = "paused";
            ui.pauseZone.textContent = `${run.level.name} - ${run.level.boss.mechanic}`;
        }
        showScreen("pause");
    }

    function resumeGame() {
        if (!run.level) {
            showScreen("menu");
            return;
        }
        run.state = "playing";
        showScreen(null);
    }

    function resetSave() {
        if (!window.confirm("Reset local progress for this MVP?")) {
            return;
        }

        localStorage.removeItem(STORAGE_KEY);
        save.selectedHero = "rookie";
        save.mushrooms = 0;
        save.upgrades = { damage: 0, cooldown: 0, armor: 0, engine: 0, skill: 0, magnet: 0 };
        renderHeroGrid();
        renderUpgrades();
        updateHud();
    }

    function renderHeroGrid() {
        ui.heroGrid.innerHTML = "";
        heroes.forEach((hero) => {
            const card = document.createElement("article");
            card.className = `hero-card${hero.id === save.selectedHero ? " is-selected" : ""}`;
            card.innerHTML = `
                <div class="hero-row">
                    <img src="${imagePaths[hero.image]}" alt="">
                    <div>
                        <h3>${hero.name}</h3>
                        <p>${hero.weapon}</p>
                    </div>
                </div>
                <p>${hero.perk}</p>
                <button type="button">${hero.id === save.selectedHero ? "Selected" : "Select"}</button>
            `;
            card.querySelector("button").addEventListener("click", () => {
                save.selectedHero = hero.id;
                persistSave();
                renderHeroGrid();
                updateHud();
            });
            ui.heroGrid.appendChild(card);
        });
    }

    function renderUpgrades() {
        ui.upgradeHint.textContent = `Mushrooms: ${Math.floor(save.mushrooms)}`;
        ui.upgradeGrid.innerHTML = "";
        upgrades.forEach((upgrade) => {
            const level = save.upgrades[upgrade.id] || 0;
            const cost = upgrade.cost(level);
            const button = document.createElement("button");
            button.type = "button";
            button.disabled = level >= upgrade.max || save.mushrooms < cost;
            button.innerHTML = `${upgrade.name} ${level}/${upgrade.max}<br>${level >= upgrade.max ? "Max" : `${cost} mushrooms`}<br>${upgrade.text}`;
            button.addEventListener("click", () => {
                if (level >= upgrade.max || save.mushrooms < cost) {
                    return;
                }

                save.mushrooms -= cost;
                save.upgrades[upgrade.id] = level + 1;
                persistSave();
                renderUpgrades();
                updateHud();
            });
            ui.upgradeGrid.appendChild(button);
        });
    }

    function startCampaign() {
        run.score = 0;
        startLevel(0);
    }

    function startLevel(index) {
        resizeCanvas();
        const level = levels[index];
        run.state = "playing";
        run.levelIndex = index;
        run.level = level;
        run.cameraX = 0;
        run.time = 0;
        run.message = level.vehicle === "kayak" ? "Kayak zone: aim with mouse, IJKL, or stick." : "Jump twice to flip. Aim with mouse, IJKL, or stick.";
        run.messageTimer = 3.2;
        run.wind = 0;
        setLevelY();

        player.x = 92;
        player.w = 50;
        player.h = 62;
        player.vx = 0;
        player.vy = 0;
        player.dir = 1;
        controls.aimX = 1;
        controls.aimY = 0;
        controls.aimActive = false;
        controls.fireHeld = false;
        controls.pointerShoot = false;
        controls.aimStickShoot = false;
        player.hp = MAX_HP;
        player.invuln = 1.2;
        player.fireTimer = 0;
        player.skillTimer = 0;
        player.phaseTimer = 0;
        player.shieldTimer = 0;
        player.rapidTimer = 0;
        player.spreadTimer = 0;
        player.hoverTimer = 0;
        player.jumpsUsed = 0;
        player.flipTimer = 0;
        player.flipProgress = 0;
        player.flipAngle = 0;
        player.flipDirection = 1;
        player.nearbyBike = null;
        player.vehicle = level.vehicle === "kayak" ? "kayak" : null;
        player.bikeFuel = 0;
        player.y = player.vehicle === "kayak" ? run.waterY - 68 : run.groundY - player.h - playerFootExtension();

        run.platforms = createPlatforms(level);
        run.enemies = createEnemies(level);
        run.pickups = createPickups(level);
        run.playerBullets = [];
        run.enemyBullets = [];
        run.hazards = [];
        run.particles = [];
        run.boss = createBoss(level);
        showScreen(null);
        startMusic();
        updateHud();
    }

    function createPlatforms(level) {
        if (level.vehicle === "kayak") {
            return [];
        }

        const platforms = [];
        let x = 460;
        while (x < level.width - 850) {
            const width = rand(130, 230);
            platforms.push({
                x,
                y: run.groundY - rand(105, 245),
                w: width,
                h: 16,
                color: level.biome === "space" ? "#8e7cff" : level.biome === "sky" ? "#e6fbff" : level.ground
            });
            x += rand(330, 520);
        }
        return platforms;
    }

    function createEnemies(level) {
        const enemies = [];
        let x = 620;
        let index = 0;
        while (x < level.width - 980) {
            const kind = level.enemySet[index % level.enemySet.length];
            const spec = enemyTypes[kind];
            const flying = spec.flying || level.vehicle === "kayak";
            const y = flying ? rand(120, Math.max(160, run.groundY - 180)) : run.groundY - spec.h;
            const levelScale = 1 + run.levelIndex * 0.16;
            enemies.push({
                kind,
                name: spec.name,
                x,
                y,
                baseY: y,
                w: spec.w,
                h: spec.h,
                hp: Math.ceil(spec.hp * levelScale),
                maxHp: Math.ceil(spec.hp * levelScale),
                speed: spec.speed * (1 + run.levelIndex * 0.08),
                flying,
                color: spec.color,
                score: spec.score,
                shoot: spec.shoot,
                shot: spec.shot,
                dir: Math.random() < 0.5 ? -1 : 1,
                timer: rand(0, 2),
                fireTimer: rand(0.6, 2.6),
                frozen: 0
            });
            x += rand(250, 420);
            index += 1;
        }
        return enemies;
    }

    function createPickups(level) {
        const pickups = [];
        for (let x = 520; x < level.width - 1000; x += 720) {
            pickups.push({ type: "mushroom", x: x + rand(-70, 70), y: run.groundY - rand(120, 260), w: 32, h: 32, taken: false });
        }

        if (level.vehicle !== "kayak") {
            pickups.push({ type: "bike", x: Math.min(920, level.width * 0.25), y: run.groundY - 44, w: 86, h: 44, taken: false });
            if (level.biome === "sky" || level.biome === "dung") {
                pickups.push({ type: "bike", x: level.width * 0.58, y: run.groundY - 44, w: 86, h: 44, taken: false });
            }
        }

        pickups.push({ type: "heart", x: level.width * 0.52, y: run.groundY - 170, w: 30, h: 30, taken: false });
        return pickups;
    }

    function createBoss(level) {
        return {
            active: false,
            dead: false,
            name: level.boss.name,
            pattern: level.boss.pattern,
            mechanic: level.boss.mechanic,
            color: level.boss.color,
            x: level.width - 600,
            y: level.vehicle === "kayak" ? run.waterY - 130 : run.groundY - 170,
            w: 132,
            h: 128,
            hp: level.boss.hp,
            maxHp: level.boss.hp,
            timer: 0,
            fireTimer: 1.2,
            specialTimer: 3.5,
            shieldTimer: 0,
            frozen: 0,
            dir: -1
        };
    }

    function update(dt) {
        if (run.state !== "playing" || !run.level) {
            return;
        }

        run.time += dt;
        run.messageTimer = Math.max(0, run.messageTimer - dt);
        run.shake = Math.max(0, run.shake - dt * 14);
        player.invuln = Math.max(0, player.invuln - dt);
        player.fireTimer = Math.max(0, player.fireTimer - dt);
        player.skillTimer = Math.max(0, player.skillTimer - dt);
        player.phaseTimer = Math.max(0, player.phaseTimer - dt);
        player.shieldTimer = Math.max(0, player.shieldTimer - dt);
        player.rapidTimer = Math.max(0, player.rapidTimer - dt);
        player.spreadTimer = Math.max(0, player.spreadTimer - dt);
        player.hoverTimer = Math.max(0, player.hoverTimer - dt);
        updateFlip(dt);

        updateAimFromKeys();

        if (isShooting()) {
            shoot();
        }

        if (controls.skill) {
            useSkill();
        }

        updatePlayer(dt);
        updateBullets(dt);
        updateEnemies(dt);
        updateBoss(dt);
        updatePickups(dt);
        updateHazards(dt);
        updateParticles(dt);
        updateCamera();
        updateHud();

        controls.actionPressed = false;
        controls.jumpPressed = false;
    }

    function updatePlayer(dt) {
        const hero = currentHero();
        player.nearbyBike = null;

        if (run.level.vehicle === "kayak") {
            updateKayak(dt, hero);
            return;
        }

        if (controls.actionPressed && player.vehicle === "bike") {
            dismountBike("Bike parked");
        }

        const speedBase = player.vehicle === "bike" ? 430 : 245;
        const upgradeBoost = 1 + save.upgrades.engine * 0.04;
        const speed = speedBase * hero.speed * upgradeBoost;
        const accel = speed * 8;

        if (run.level.biome === "sky" && run.boss && run.boss.active) {
            run.wind = Math.sin(run.time * 1.2) * 92;
        } else {
            run.wind *= 0.9;
        }

        if (controls.left) {
            player.vx -= accel * dt;
            player.dir = -1;
        }
        if (controls.right) {
            player.vx += accel * dt;
            player.dir = 1;
        }

        player.vx += run.wind * dt;
        player.vx *= player.onGround ? FRICTION : 0.98;
        player.vx = clamp(player.vx, -speed, speed);

        const gravityMod = run.level.biome === "space" ? 0.62 : 1;
        player.vy += GRAVITY * gravityMod * dt;

        if (controls.jumpPressed) {
            tryJump(hero);
        }

        if (player.hoverTimer > 0 && controls.jump) {
            player.vy -= 900 * dt;
        }

        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.x = clamp(player.x, 24, run.level.width - player.w - 24);

        collideWithWorld();

        if (player.vehicle === "bike") {
            player.bikeFuel -= dt;
            if (player.bikeFuel <= 0) {
                dismountBike("Bike fuel empty");
            }
        }
    }

    function updateFlip(dt) {
        if (player.flipTimer <= 0) {
            if (player.onGround) {
                player.flipAngle = 0;
                player.flipProgress = 0;
            }
            return;
        }

        player.flipTimer = Math.max(0, player.flipTimer - dt);
        player.flipProgress = clamp(player.flipProgress + dt / player.flipDuration, 0, 1);
        player.flipAngle = player.flipDirection * Math.PI * 2 * player.flipProgress;

        if (player.flipTimer <= 0 && player.onGround) {
            player.flipAngle = 0;
            player.flipProgress = 0;
        }
    }

    function tryJump(hero) {
        if (player.onGround) {
            performJump(hero, false);
            return;
        }

        if (player.vehicle !== "bike" && player.jumpsUsed < 2) {
            performJump(hero, true);
        }
    }

    function performJump(hero, isDoubleJump) {
        const bikeMod = player.vehicle === "bike" ? 0.86 : 1;
        player.vy = (isDoubleJump ? -610 : -650) * hero.jump * bikeMod;
        player.onGround = false;
        player.jumpsUsed = isDoubleJump ? 2 : 1;

        if (isDoubleJump) {
            player.flipTimer = player.flipDuration;
            player.flipProgress = 0;
            player.flipDirection = player.dir || 1;
            player.flipAngle = 0;
            player.vx += (player.dir || 1) * 80;
            addHitParticles(player.x + player.w / 2, player.y + player.h / 2, hero.color, 8);
            showMessage("Double flip");
        }
    }

    function updateKayak(dt, hero) {
        const speed = 255 * hero.speed;
        player.vx = 0;

        if (controls.left) {
            player.vx = -speed * 0.82;
            player.dir = -1;
        }
        if (controls.right) {
            player.vx = speed;
            player.dir = 1;
        }

        if (!controls.left && !controls.right) {
            player.vx = 85;
        }

        if (controls.jump || controls.jumpPressed) {
            player.vy -= 920 * dt;
        }
        if (controls.down) {
            player.vy += 920 * dt;
        }

        player.vy += Math.sin(run.time * 4) * 12 * dt;
        player.vy *= 0.9;
        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.x = clamp(player.x, 24, run.level.width - player.w - 24);
        player.y = clamp(player.y, 90, run.waterY - 34);
        player.onGround = false;
    }

    function collideWithWorld() {
        player.onGround = false;

        const footExtension = playerFootExtension();
        let footBottom = playerFootBottom();

        if (footBottom >= run.groundY) {
            player.y = run.groundY - player.h - footExtension;
            player.vy = 0;
            player.onGround = true;
            footBottom = playerFootBottom();
        }

        if (player.vy >= 0) {
            run.platforms.forEach((platform) => {
                const previousFootBottom = footBottom - player.vy * 0.02;
                const wasAbove = previousFootBottom <= platform.y + 4;
                if (
                    wasAbove &&
                    player.x + player.w > platform.x &&
                    player.x < platform.x + platform.w &&
                    footBottom >= platform.y &&
                    footBottom <= platform.y + platform.h + 28
                ) {
                    player.y = platform.y - player.h - footExtension;
                    player.vy = 0;
                    player.onGround = true;
                    footBottom = playerFootBottom();
                }
            });
        }

        if (player.onGround) {
            player.jumpsUsed = 0;
            player.flipTimer = 0;
            player.flipProgress = 0;
            player.flipAngle = 0;
        }
    }

    function mountBike(pickup) {
        if (pickup.taken) {
            return;
        }
        pickup.taken = true;
        player.vehicle = "bike";
        player.bikeFuel = 8 + save.upgrades.engine * 3;
        player.vx = 260 * player.dir;
        showMessage("Bike mounted");
        playAudio("pickup", 0.45);
    }

    function dismountBike(message) {
        player.vehicle = null;
        player.bikeFuel = 0;
        player.vx *= 0.5;
        showMessage(message);
    }

    function setAimVector(dx, dy, active = true) {
        const length = Math.hypot(dx, dy);

        if (length < 0.12) {
            return;
        }

        controls.aimX = dx / length;
        controls.aimY = dy / length;
        controls.aimActive = active;

        if (Math.abs(controls.aimX) > 0.18) {
            player.dir = controls.aimX < 0 ? -1 : 1;
        }
    }

    function getAimVector() {
        if (!controls.aimActive) {
            return { x: player.dir || 1, y: 0 };
        }

        return { x: controls.aimX, y: controls.aimY };
    }

    function updateAimFromKeys() {
        const x = (controls.aimKeys.right ? 1 : 0) - (controls.aimKeys.left ? 1 : 0);
        const y = (controls.aimKeys.down ? 1 : 0) - (controls.aimKeys.up ? 1 : 0);

        if (x !== 0 || y !== 0) {
            setAimVector(x, y, true);
        }
    }

    function isAimKeyHeld() {
        return controls.aimKeys.left || controls.aimKeys.right || controls.aimKeys.up || controls.aimKeys.down;
    }

    function isShooting() {
        return controls.fireHeld || controls.pointerShoot || controls.aimStickShoot || isAimKeyHeld();
    }

    function aimDashDirection() {
        const aim = getAimVector();
        if (Math.abs(aim.x) > 0.2) {
            return aim.x < 0 ? -1 : 1;
        }

        return player.dir || 1;
    }

    function weaponGripPoint(aim = getAimVector()) {
        const handBaseY = player.y + player.h + playerFootExtension() * 0.2 - 17;
        return {
            x: player.x + player.w / 2 + aim.x * 30,
            y: handBaseY + aim.y * 30
        };
    }

    function weaponMuzzlePoint(aim = getAimVector()) {
        const grip = weaponGripPoint(aim);
        return {
            x: grip.x + aim.x * 34,
            y: grip.y + aim.y * 34
        };
    }

    function shoot() {
        if (player.fireTimer > 0 || run.state !== "playing") {
            return;
        }

        const hero = currentHero();
        const cooldownUpgrade = 1 - save.upgrades.cooldown * 0.08;
        const rapidMod = player.rapidTimer > 0 ? 0.48 : 1;
        player.fireTimer = (hero.fireRate / 1000) * cooldownUpgrade * rapidMod;
        fireWeapon(hero);
        playAudio("shoot", 0.18);
    }

    function fireWeapon(hero) {
        const aim = getAimVector();
        const side = { x: -aim.y, y: aim.x };
        const muzzle = weaponMuzzlePoint(aim);
        const originX = muzzle.x;
        const originY = muzzle.y;
        const bonusDamage = save.upgrades.damage * 0.35;

        const shot = (speed, spread, damage, type, radius = 5, life = 1.25, pierce = 0) => {
            createPlayerBullet({
                x: originX,
                y: originY,
                vx: aim.x * Math.abs(speed) + side.x * spread,
                vy: aim.y * Math.abs(speed) + side.y * spread,
                damage: damage + bonusDamage,
                type,
                radius,
                life,
                pierce,
                color: hero.color
            });
        };

        switch (hero.bullet) {
            case "spore":
                shot(550, -90, 1.05, "spore", 7, 0.95);
                shot(520, 0, 1.05, "spore", 7, 0.95);
                shot(550, 90, 1.05, "spore", 7, 0.95);
                break;
            case "leaf":
                shot(660, 0, 1.25, "leaf", 5, 1.5, 1);
                break;
            case "fire":
                shot(650, rand(-24, 24), 1.1, "fire", 5, 1.15);
                break;
            case "ice":
                shot(610, 0, 1.1, "ice", 6, 1.35);
                break;
            case "gold":
                shot(600, -38, 1.05, "gold", 5, 1.2);
                shot(600, 38, 1.05, "gold", 5, 1.2);
                break;
            case "shadow":
                shot(760, 0, 1.15, "shadow", 4, 1.35, 2);
                break;
            case "star":
                shot(600, -72, 1.05, "star", 6, 1.25);
                shot(640, 0, 1.1, "star", 6, 1.25);
                shot(600, 72, 1.05, "star", 6, 1.25);
                break;
            case "stone":
                shot(520, 0, 2.4, "stone", 9, 1.45);
                break;
            case "cat":
                shot(610, -22, 0.95, "cat", 5, 1.35);
                shot(610, 22, 0.95, "cat", 5, 1.35);
                break;
            case "ghost":
                shot(720, 0, Math.random() < 0.28 ? 2.3 : 1.15, "ghost", 5, 1.25, 1);
                break;
            case "spark":
                shot(690, rand(-42, 42), 0.62, "spark", 4, 1);
                break;
            default:
                shot(640, 0, 1.15, "normal", 5, 1.25);
                if (player.spreadTimer > 0) {
                    shot(610, -70, 0.85, "normal", 5, 1.1);
                    shot(610, 70, 0.85, "normal", 5, 1.1);
                }
        }
    }

    function useSkill() {
        if (player.skillTimer > 0 || run.state !== "playing") {
            return;
        }

        const hero = currentHero();
        const cooldown = Math.max(3.8, 7.2 - save.upgrades.skill * 0.8);
        player.skillTimer = cooldown;

        switch (hero.id) {
            case "mushroom":
                player.hp = Math.min(MAX_HP, player.hp + 1);
                radialShots("spore", 10, 1.2, 460, hero.color);
                showMessage("Spore Heal");
                break;
            case "forest":
                player.spreadTimer = 5;
                radialShots("leaf", 12, 1.15, 560, hero.color, 1);
                showMessage("Leaf Fan");
                break;
            case "fire":
                player.rapidTimer = 5.8;
                showMessage("Overheat");
                break;
            case "ice":
                freezeNearby(420, 4);
                radialShots("ice", 8, 1.05, 500, hero.color);
                showMessage("Frost Lock");
                break;
            case "golden":
                addMushrooms(8);
                radialShots("gold", 8, 1.1, 500, hero.color);
                showMessage("Gold Rush");
                break;
            case "shadow":
                player.phaseTimer = 3.4;
                player.invuln = Math.max(player.invuln, 3.4);
                showMessage("Shadow Phase");
                break;
            case "star":
                radialShots("star", 16, 1.2, 620, hero.color);
                showMessage("Star Storm");
                break;
            case "stone":
                player.shieldTimer = 5.5;
                showMessage("Stone Guard");
                break;
            case "cat":
                player.x = clamp(player.x + aimDashDirection() * 240, 32, run.level.width - player.w - 32);
                radialShots("cat", 8, 0.95, 540, hero.color);
                showMessage("Blink Shot");
                break;
            case "ghost":
                player.phaseTimer = 2.3;
                player.invuln = Math.max(player.invuln, 2.3);
                player.x = clamp(player.x + aimDashDirection() * 310, 32, run.level.width - player.w - 32);
                showMessage("Ghost Dash");
                break;
            case "firefly":
                player.rapidTimer = 4.8;
                player.hoverTimer = 3.6;
                radialShots("spark", 14, 0.72, 610, hero.color);
                showMessage("Spark Barrage");
                break;
            default:
                player.spreadTimer = 4.2;
                radialShots("normal", 7, 1.0, 520, hero.color);
                showMessage("Focus Burst");
                break;
        }

        playAudio("pickup", 0.38);
    }

    function radialShots(type, count, damage, speed, color, pierce = 0) {
        const centerX = player.x + player.w / 2;
        const centerY = player.y + player.h / 2;
        for (let index = 0; index < count; index += 1) {
            const angle = (-Math.PI * 0.65) + (index / Math.max(1, count - 1)) * Math.PI * 1.3;
            createPlayerBullet({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                damage: damage + save.upgrades.damage * 0.25,
                type,
                radius: type === "stone" ? 8 : 5,
                life: 1.15,
                pierce,
                color
            });
        }
    }

    function freezeNearby(radius, seconds) {
        run.enemies.forEach((enemy) => {
            if (Math.abs(enemy.x - player.x) < radius && Math.abs(enemy.y - player.y) < radius) {
                enemy.frozen = Math.max(enemy.frozen, seconds);
            }
        });

        if (run.boss && run.boss.active) {
            run.boss.frozen = Math.max(run.boss.frozen, seconds);
        }
    }

    function createPlayerBullet(data) {
        run.playerBullets.push({ ...data, owner: "player" });
    }

    function createEnemyBullet(data) {
        run.enemyBullets.push(data);
    }

    function updateBullets(dt) {
        run.playerBullets.forEach((bullet) => {
            bullet.life -= dt;

            if (bullet.type === "cat") {
                const target = nearestTarget(bullet);
                if (target) {
                    const targetX = target.x + target.w / 2;
                    const targetY = target.y + target.h / 2;
                    bullet.vx += clamp((targetX - bullet.x) * 0.8, -160, 160) * dt;
                    bullet.vy += clamp((targetY - bullet.y) * 0.8, -160, 160) * dt;
                }
            }

            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;
            bullet.vy += (bullet.type === "spore" || bullet.type === "stone" ? 180 : 0) * dt;
        });

        run.enemyBullets.forEach((bullet) => {
            bullet.life -= dt;
            if (bullet.type === "comet") {
                bullet.vx += clamp((player.x + player.w / 2 - bullet.x) * 0.75, -110, 110) * dt;
                bullet.vy += clamp((player.y + player.h / 2 - bullet.y) * 0.75, -110, 110) * dt;
            }
            if (bullet.type === "dung") {
                bullet.vy += 680 * dt;
            }
            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;
        });

        checkBulletCollisions();

        run.playerBullets = run.playerBullets.filter((bullet) => bullet.life > 0 && bullet.x > run.cameraX - 200 && bullet.x < run.cameraX + view.w + 260 && bullet.y > -220 && bullet.y < view.h + 220);
        run.enemyBullets = run.enemyBullets.filter((bullet) => bullet.life > 0 && bullet.x > run.cameraX - 240 && bullet.x < run.cameraX + view.w + 260 && bullet.y > -260 && bullet.y < view.h + 260);
    }

    function nearestTarget(bullet) {
        let best = null;
        let bestDistance = Infinity;
        run.enemies.forEach((enemy) => {
            const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
            if (distance < bestDistance && distance < 420) {
                best = enemy;
                bestDistance = distance;
            }
        });
        if (run.boss && run.boss.active && !run.boss.dead) {
            const distance = Math.hypot(run.boss.x - bullet.x, run.boss.y - bullet.y);
            if (distance < bestDistance && distance < 520) {
                best = run.boss;
            }
        }
        return best;
    }

    function checkBulletCollisions() {
        run.playerBullets.forEach((bullet) => {
            const bulletRect = { x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, w: bullet.radius * 2, h: bullet.radius * 2 };
            run.enemies.forEach((enemy) => {
                if (enemy.dead || !rectsOverlap(bulletRect, entityRect(enemy))) {
                    return;
                }

                damageEnemy(enemy, bullet.damage, bullet.type);
                addHitParticles(bullet.x, bullet.y, bullet.color || "#ffffff", 5);
                if (bullet.pierce > 0) {
                    bullet.pierce -= 1;
                } else {
                    bullet.life = 0;
                }
            });

            if (run.boss && run.boss.active && !run.boss.dead && rectsOverlap(bulletRect, entityRect(run.boss))) {
                damageBoss(bullet.damage, bullet.type);
                addHitParticles(bullet.x, bullet.y, bullet.color || "#ffffff", 8);
                if (bullet.pierce > 0) {
                    bullet.pierce -= 1;
                } else {
                    bullet.life = 0;
                }
            }
        });

        const playerRect = entityRect(player);
        run.enemyBullets.forEach((bullet) => {
            const bulletRect = { x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, w: bullet.radius * 2, h: bullet.radius * 2 };
            if (rectsOverlap(playerRect, bulletRect)) {
                bullet.life = 0;
                damagePlayer(bullet.damage || 1);
            }
        });
    }

    function damageEnemy(enemy, damage, type) {
        if (type === "ice") {
            enemy.frozen = Math.max(enemy.frozen, 1.8);
        }
        if (type === "fire") {
            damage += 0.25;
        }
        if (type === "gold") {
            damage += 0.1;
        }

        enemy.hp -= damage;
        enemy.hitTimer = 0.12;
        if (enemy.hp <= 0 && !enemy.dead) {
            enemy.dead = true;
            run.score += enemy.score;
            addMushrooms(currentHero().id === "golden" ? 2 : 1);
            if (Math.random() < 0.18 + save.upgrades.magnet * 0.04) {
                run.pickups.push({ type: "mushroom", x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2, w: 30, h: 30, taken: false });
            }
            addHitParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.color, 14);
            playAudio("hit", 0.26);
        }
    }

    function damageBoss(damage, type) {
        const boss = run.boss;
        if (!boss || boss.dead) {
            return;
        }

        if (type === "ice") {
            boss.frozen = Math.max(boss.frozen, 1.2);
        }
        if (type === "fire") {
            damage += 0.22;
        }
        if (type === "star") {
            damage += 0.18;
        }
        if (boss.shieldTimer > 0) {
            damage *= 0.35;
        }

        boss.hp -= damage;
        boss.hitTimer = 0.14;
        run.score += 8;
        if (boss.hp <= 0) {
            boss.dead = true;
            completeLevel();
        }
    }

    function damagePlayer(amount) {
        if (player.invuln > 0 || player.phaseTimer > 0 || run.state !== "playing") {
            return;
        }

        const armorChance = Math.min(0.42, save.upgrades.armor * 0.09 + (currentHero().id === "stone" ? 0.18 : 0));
        if (player.shieldTimer > 0 || Math.random() < armorChance) {
            player.invuln = 0.7;
            showMessage("Blocked");
            addHitParticles(player.x + player.w / 2, player.y + player.h / 2, "#b8c0c8", 8);
            return;
        }

        player.hp -= Math.max(1, Math.ceil(amount));
        player.invuln = 1.1;
        player.vx = -player.dir * 190;
        player.vy = -240;
        run.shake = 6;
        playAudio("hit", 0.32);

        if (player.hp <= 0) {
            gameOver();
        }
    }

    function updateEnemies(dt) {
        const playerRect = entityRect(player);
        run.enemies.forEach((enemy) => {
            if (enemy.dead) {
                enemy.hitTimer = Math.max(0, (enemy.hitTimer || 0) - dt);
                return;
            }

            const speedFactor = enemy.frozen > 0 ? 0.25 : 1;
            enemy.frozen = Math.max(0, enemy.frozen - dt);
            enemy.timer += dt;
            enemy.fireTimer -= dt * speedFactor;
            enemy.hitTimer = Math.max(0, (enemy.hitTimer || 0) - dt);

            if (enemy.flying) {
                const dx = player.x - enemy.x;
                if (Math.abs(dx) < 620) {
                    enemy.x += Math.sign(dx || enemy.dir) * enemy.speed * 0.42 * speedFactor * dt;
                } else {
                    enemy.x += enemy.dir * enemy.speed * 0.25 * speedFactor * dt;
                }
                enemy.y = enemy.baseY + Math.sin(enemy.timer * 3.3 + enemy.x * 0.02) * 32;
                enemy.y = clamp(enemy.y, 76, run.groundY - 44);
            } else {
                const dx = player.x - enemy.x;
                if (Math.abs(dx) < 480) {
                    enemy.dir = Math.sign(dx || enemy.dir);
                }
                enemy.x += enemy.dir * enemy.speed * speedFactor * dt;
                enemy.y = run.groundY - enemy.h;
            }

            if (enemy.shoot && enemy.fireTimer <= 0 && Math.abs(enemy.x - player.x) < 720) {
                enemy.fireTimer = rand(1.4, 2.7) + run.levelIndex * -0.08;
                shootEnemy(enemy);
            }

            if (rectsOverlap(playerRect, entityRect(enemy))) {
                if (player.vehicle === "bike" && Math.abs(player.vx) > 170) {
                    damageEnemy(enemy, 3.4, "bike");
                    player.vx *= 0.7;
                    return;
                }
                damagePlayer(enemy.kind === "roller" ? 2 : 1);
            }
        });

        run.enemies = run.enemies.filter((enemy) => !enemy.dead || enemy.hitTimer > 0);
    }

    function shootEnemy(enemy) {
        const fromX = enemy.x + enemy.w / 2;
        const fromY = enemy.y + enemy.h / 2;
        const toX = player.x + player.w / 2;
        const toY = player.y + player.h / 2;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const speed = enemy.shot === "comet" ? 235 : enemy.shot === "spark" ? 300 : 210;
        createEnemyBullet({
            x: fromX,
            y: fromY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: enemy.shot === "dung" ? 10 : 7,
            damage: enemy.shot === "dung" ? 2 : 1,
            life: 4,
            type: enemy.shot || "sting",
            color: enemy.color
        });
    }

    function updateBoss(dt) {
        const boss = run.boss;
        if (!boss || boss.dead) {
            return;
        }

        if (!boss.active && player.x > run.level.width - 1050) {
            boss.active = true;
            showMessage(`${boss.name}: ${boss.mechanic}`);
            run.messageTimer = 4;
        }

        if (!boss.active) {
            return;
        }

        const frozenFactor = boss.frozen > 0 ? 0.35 : 1;
        boss.frozen = Math.max(0, boss.frozen - dt);
        boss.shieldTimer = Math.max(0, boss.shieldTimer - dt);
        boss.hitTimer = Math.max(0, (boss.hitTimer || 0) - dt);
        boss.timer += dt * frozenFactor;
        boss.fireTimer -= dt * frozenFactor;
        boss.specialTimer -= dt * frozenFactor;

        const anchorX = run.level.width - 520;
        boss.x = anchorX + Math.sin(boss.timer * 1.2) * 90;
        boss.y += Math.sin(boss.timer * 1.9) * 20 * dt;
        boss.y = clamp(boss.y, 86, run.level.vehicle === "kayak" ? run.waterY - 150 : run.groundY - 180);

        if (boss.fireTimer <= 0) {
            boss.fireTimer = boss.pattern === "space" ? 0.88 : boss.pattern === "sky" ? 1.05 : 1.25;
            fireBossPattern(boss);
        }

        if (boss.specialTimer <= 0) {
            boss.specialTimer = boss.pattern === "lake" ? 6.2 : boss.pattern === "dung" ? 4.2 : 5;
            fireBossSpecial(boss);
        }

        if (rectsOverlap(entityRect(player), entityRect(boss))) {
            damagePlayer(2);
        }
    }

    function fireBossPattern(boss) {
        const originX = boss.x + boss.w * 0.35;
        const originY = boss.y + boss.h * 0.55;
        const playerCenterX = player.x + player.w / 2;
        const playerCenterY = player.y + player.h / 2;
        const angle = Math.atan2(playerCenterY - originY, playerCenterX - originX);

        if (boss.pattern === "lake") {
            [-0.4, -0.18, 0, 0.18, 0.4].forEach((offset) => {
                createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle + offset) * 240, vy: Math.sin(angle + offset) * 240, radius: 11, damage: 1, life: 4, type: "bubble", color: "#7ce7ff" });
            });
            return;
        }

        if (boss.pattern === "swamp") {
            createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle) * 250, vy: Math.sin(angle) * 250, radius: 10, damage: 1, life: 4, type: "poison", color: "#9fff62" });
            run.hazards.push({ type: "wave", x: boss.x - 40, y: run.waterY - 18, w: 46, h: 22, vx: -260, timer: 3.8, damage: 1, color: "#9fff62" });
            return;
        }

        if (boss.pattern === "dung") {
            createEnemyBullet({ x: originX, y: originY, vx: -210 + rand(-70, 70), vy: -280 + rand(-120, 20), radius: 13, damage: 2, life: 4.5, type: "dung", color: "#6b3f1d" });
            return;
        }

        if (boss.pattern === "sky") {
            run.hazards.push({ type: "lightning", x: player.x + rand(-60, 60), y: 0, w: 44, h: run.groundY, timer: 1.2, warn: 0.72, damage: 1, color: "#fff070" });
            createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle) * 320, vy: Math.sin(angle) * 320, radius: 8, damage: 1, life: 3.2, type: "spark", color: "#fff070" });
            return;
        }

        if (boss.pattern === "space") {
            createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle) * 260, vy: Math.sin(angle) * 260, radius: 10, damage: 1, life: 5, type: "comet", color: "#d28cff" });
            createEnemyBullet({ x: boss.x + rand(0, boss.w), y: 50, vx: rand(-40, 40), vy: 230, radius: 10, damage: 1, life: 4.5, type: "comet", color: "#ff82e7" });
        }
    }

    function fireBossSpecial(boss) {
        if (boss.pattern === "lake") {
            boss.shieldTimer = 2.2;
            showMessage("Bubble shield");
            return;
        }

        if (boss.pattern === "dung") {
            const spec = enemyTypes.dungling;
            run.enemies.push({
                kind: "dungling",
                name: spec.name,
                x: boss.x - 80,
                y: run.groundY - spec.h,
                baseY: run.groundY - spec.h,
                w: spec.w,
                h: spec.h,
                hp: Math.ceil(spec.hp * 1.2),
                maxHp: Math.ceil(spec.hp * 1.2),
                speed: spec.speed * 1.2,
                flying: false,
                color: spec.color,
                score: spec.score,
                shoot: false,
                dir: -1,
                timer: 0,
                fireTimer: 2,
                frozen: 0
            });
            showMessage("Dunglings spawned");
            return;
        }

        if (boss.pattern === "space") {
            player.vy -= 420;
            run.shake = 5;
            showMessage("Gravity pulse");
            return;
        }

        if (boss.pattern === "swamp") {
            run.hazards.push({ type: "wave", x: boss.x - 20, y: run.waterY - 22, w: 62, h: 28, vx: -330, timer: 4.2, damage: 1, color: "#caff70" });
            showMessage("Poison wake");
            return;
        }

        if (boss.pattern === "sky") {
            run.wind = rand(-220, 220);
            showMessage("Crosswind");
        }
    }

    function updatePickups(dt) {
        const playerRect = entityRect(player);
        const magnetRadius = 62 + save.upgrades.magnet * 52;

        run.pickups.forEach((pickup) => {
            if (pickup.taken) {
                return;
            }

            if (pickup.type !== "bike") {
                const dx = player.x + player.w / 2 - (pickup.x + pickup.w / 2);
                const dy = player.y + player.h / 2 - (pickup.y + pickup.h / 2);
                const dist = Math.hypot(dx, dy);
                if (dist < magnetRadius && dist > 1) {
                    pickup.x += (dx / dist) * 180 * dt;
                    pickup.y += (dy / dist) * 180 * dt;
                }
            }

            if (!rectsOverlap(playerRect, pickup)) {
                return;
            }

            if (pickup.type === "bike") {
                player.nearbyBike = pickup;
                if (controls.actionPressed && player.vehicle !== "bike") {
                    mountBike(pickup);
                }
                return;
            }

            pickup.taken = true;
            if (pickup.type === "heart") {
                player.hp = Math.min(MAX_HP, player.hp + 1);
                showMessage("HP restored");
            } else {
                addMushrooms(3);
                run.score += 35;
            }
            playAudio("pickup", 0.4);
        });

        run.pickups = run.pickups.filter((pickup) => !pickup.taken);
    }

    function updateHazards(dt) {
        const playerRect = entityRect(player);

        run.hazards.forEach((hazard) => {
            hazard.timer -= dt;
            if (hazard.vx) {
                hazard.x += hazard.vx * dt;
            }

            if (hazard.type === "lightning" && hazard.timer < hazard.warn && !hazard.didDamage) {
                if (rectsOverlap(playerRect, { x: hazard.x, y: hazard.y, w: hazard.w, h: hazard.h })) {
                    damagePlayer(hazard.damage);
                    hazard.didDamage = true;
                }
            }

            if (hazard.type === "wave" && rectsOverlap(playerRect, hazard)) {
                damagePlayer(hazard.damage);
                hazard.didDamage = true;
            }
        });

        run.hazards = run.hazards.filter((hazard) => hazard.timer > 0);
    }

    function updateParticles(dt) {
        run.particles.forEach((particle) => {
            particle.life -= dt;
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.vy += 320 * dt;
        });
        run.particles = run.particles.filter((particle) => particle.life > 0);
    }

    function addHitParticles(x, y, color, count) {
        for (let index = 0; index < count; index += 1) {
            run.particles.push({
                x,
                y,
                vx: rand(-190, 190),
                vy: rand(-220, 40),
                r: rand(2, 5),
                life: rand(0.28, 0.62),
                color
            });
        }
    }

    function updateCamera() {
        const desired = player.x - view.w * 0.36;
        run.cameraX = clamp(desired, 0, Math.max(0, run.level.width - view.w));
    }

    function addMushrooms(amount) {
        save.mushrooms += amount;
        persistSave();
    }

    function showMessage(text) {
        run.message = text;
        run.messageTimer = 2.1;
    }

    function completeLevel() {
        if (run.state !== "playing") {
            return;
        }

        run.state = "result";
        const reward = run.level.reward + Math.floor(run.score / 800);
        addMushrooms(reward);
        run.score += 1200 + run.levelIndex * 300;
        ui.resultEyebrow.textContent = run.levelIndex === levels.length - 1 ? "Campaign clear" : "Zone clear";
        ui.resultTitle.textContent = run.levelIndex === levels.length - 1 ? "Island saved" : `${run.boss.name} defeated`;
        ui.resultCopy.textContent = run.levelIndex === levels.length - 1
            ? `Final score ${Math.floor(run.score)}. You earned ${reward} mushrooms.`
            : `You earned ${reward} mushrooms. Upgrade camp or jump into the next biome.`;
        ui.nextZoneButton.textContent = run.levelIndex === levels.length - 1 ? "Restart Campaign" : "Next Zone";
        showScreen("result");
        renderUpgrades();
        updateHud();
    }

    function nextZone() {
        if (run.levelIndex >= levels.length - 1) {
            startLevel(0);
            return;
        }
        startLevel(run.levelIndex + 1);
    }

    function gameOver() {
        run.state = "gameover";
        ui.gameoverCopy.textContent = `Score ${Math.floor(run.score)} on ${run.level.name}. Change hero or retry.`;
        showScreen("gameover");
    }

    function updateHud() {
        const hero = currentHero();
        ui.hp.textContent = `${clamp(player.hp, 0, MAX_HP)}/${MAX_HP}`;
        ui.hero.textContent = hero.name.replace(" Ovad", "");
        ui.zone.textContent = run.level ? `${run.levelIndex + 1}/5` : "1/5";
        ui.score.textContent = `${Math.floor(run.score)}`;
        ui.mushrooms.textContent = `${Math.floor(save.mushrooms)}`;

        if (run.state !== "playing") {
            ui.skill.textContent = hero.skill;
        } else if (player.skillTimer <= 0) {
            ui.skill.textContent = "Ready";
        } else {
            ui.skill.textContent = `${player.skillTimer.toFixed(1)}s`;
        }
    }

    function render() {
        ctx.clearRect(0, 0, view.w, view.h);

        const level = run.level || levels[0];
        drawBackground(level);

        if (!run.level) {
            drawMenuScene();
            return;
        }

        const shakeX = run.shake > 0 ? rand(-run.shake, run.shake) : 0;
        const shakeY = run.shake > 0 ? rand(-run.shake, run.shake) : 0;

        ctx.save();
        ctx.translate(shakeX - run.cameraX, shakeY);
        drawWorld(level);
        drawPlatforms();
        drawPickups();
        drawHazards();
        drawEnemies();
        drawBoss();
        drawBullets();
        drawPlayer();
        drawParticles();
        ctx.restore();

        drawBossHud();
        drawMessage();
        drawProgressBar();
    }

    function drawBackground(level) {
        const gradient = ctx.createLinearGradient(0, 0, 0, view.h);
        gradient.addColorStop(0, level.skyTop);
        gradient.addColorStop(1, level.skyBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, view.w, view.h);

        if (level.biome === "lake" && images.lakeBg.complete) {
            const img = images.lakeBg;
            const scale = Math.max(view.w / img.width, view.h / img.height);
            const tileW = img.width * scale;
            const tileH = img.height * scale;
            const offset = -((run.cameraX * 0.12) % tileW);
            ctx.globalAlpha = 0.48;
            for (let x = offset - tileW; x < view.w + tileW; x += tileW) {
                ctx.drawImage(img, x, 0, tileW, tileH);
            }
            ctx.globalAlpha = 1;
        }

        if (level.biome === "space") {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            for (let i = 0; i < 80; i += 1) {
                const x = (i * 97 - run.cameraX * (0.03 + (i % 5) * 0.01)) % (view.w + 80);
                const y = 30 + ((i * 53) % Math.max(80, view.h - 160));
                ctx.fillRect(x < 0 ? x + view.w + 80 : x, y, 2, 2);
            }
        }

        if (level.biome === "sky") {
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            for (let i = 0; i < 8; i += 1) {
                const x = ((i * 230 - run.cameraX * 0.18) % (view.w + 220)) - 110;
                const y = 70 + (i % 4) * 55;
                drawCloud(x, y, 1 + (i % 3) * 0.2);
            }
        }
    }

    function drawMenuScene() {
        ctx.save();
        ctx.globalAlpha = 0.58;
        ctx.translate(-40, 0);
        drawCloud(view.w * 0.68, view.h * 0.22, 1.5);
        ctx.restore();
        ctx.fillStyle = "rgba(80,216,200,0.16)";
        ctx.beginPath();
        ctx.ellipse(view.w * 0.72, view.h * 0.67, 220, 64, -0.08, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCloud(x, y, scale) {
        ctx.beginPath();
        ctx.ellipse(x, y, 42 * scale, 18 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 34 * scale, y - 6 * scale, 48 * scale, 22 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 78 * scale, y, 38 * scale, 18 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawWorld(level) {
        if (level.vehicle === "kayak") {
            ctx.fillStyle = "rgba(60, 118, 83, 0.78)";
            ctx.fillRect(run.cameraX - 80, run.waterY - 18, view.w + 160, view.h - run.waterY + 80);
            ctx.strokeStyle = "rgba(210, 255, 198, 0.34)";
            ctx.lineWidth = 3;
            for (let x = Math.floor((run.cameraX - 120) / 90) * 90; x < run.cameraX + view.w + 160; x += 90) {
                ctx.beginPath();
                ctx.moveTo(x, run.waterY + Math.sin(run.time * 3 + x * 0.02) * 8);
                ctx.quadraticCurveTo(x + 44, run.waterY - 8, x + 90, run.waterY + Math.sin(run.time * 3 + x * 0.02) * 8);
                ctx.stroke();
            }
            return;
        }

        ctx.fillStyle = level.soil;
        ctx.fillRect(run.cameraX - 80, run.groundY, view.w + 160, view.h - run.groundY + 80);
        ctx.fillStyle = level.ground;
        ctx.fillRect(run.cameraX - 80, run.groundY - 18, view.w + 160, 22);

        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = 2;
        for (let x = Math.floor((run.cameraX - 80) / 120) * 120; x < run.cameraX + view.w + 160; x += 120) {
            ctx.beginPath();
            ctx.moveTo(x, run.groundY - 18);
            ctx.quadraticCurveTo(x + 40, run.groundY - 30 - Math.sin(x) * 7, x + 92, run.groundY - 18);
            ctx.stroke();
        }
    }

    function drawPlatforms() {
        run.platforms.forEach((platform) => {
            ctx.fillStyle = "rgba(0,0,0,0.24)";
            ctx.fillRect(platform.x + 5, platform.y + 8, platform.w, platform.h);
            ctx.fillStyle = platform.color;
            roundRect(platform.x, platform.y, platform.w, platform.h, 7);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.22)";
            ctx.fillRect(platform.x + 10, platform.y + 3, platform.w - 20, 3);
        });
    }

    function drawPickups() {
        run.pickups.forEach((pickup) => {
            if (pickup.type === "bike") {
                drawBike(pickup.x, pickup.y, 1);
                if (player.nearbyBike === pickup) {
                    drawWorldLabel("Ride", pickup.x + pickup.w / 2, pickup.y - 12, "#ffd166");
                }
                return;
            }

            if (pickup.type === "heart") {
                ctx.fillStyle = "#ff6b6b";
                ctx.beginPath();
                ctx.arc(pickup.x + 9, pickup.y + 10, 9, 0, Math.PI * 2);
                ctx.arc(pickup.x + 21, pickup.y + 10, 9, 0, Math.PI * 2);
                ctx.moveTo(pickup.x + 2, pickup.y + 15);
                ctx.lineTo(pickup.x + 15, pickup.y + 30);
                ctx.lineTo(pickup.x + 28, pickup.y + 15);
                ctx.fill();
                return;
            }

            const img = images.mushroomPickup;
            if (img.complete) {
                ctx.drawImage(img, pickup.x, pickup.y, pickup.w, pickup.h);
            } else {
                ctx.fillStyle = "#ffd166";
                ctx.beginPath();
                ctx.arc(pickup.x + pickup.w / 2, pickup.y + pickup.h / 2, pickup.w / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function drawEnemies() {
        run.enemies.forEach((enemy) => {
            if (enemy.dead && enemy.hitTimer <= 0) {
                return;
            }

            ctx.save();
            ctx.globalAlpha = enemy.frozen > 0 ? 0.62 : 1;
            ctx.translate(enemy.x, enemy.y);
            if (enemy.hitTimer > 0) {
                ctx.translate(rand(-3, 3), rand(-2, 2));
            }

            ctx.fillStyle = enemy.color;
            if (enemy.flying) {
                ctx.fillStyle = "rgba(255,255,255,0.38)";
                ctx.beginPath();
                ctx.ellipse(enemy.w * 0.18, enemy.h * 0.35, enemy.w * 0.28, enemy.h * 0.28, -0.5, 0, Math.PI * 2);
                ctx.ellipse(enemy.w * 0.72, enemy.h * 0.35, enemy.w * 0.28, enemy.h * 0.28, 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                ctx.ellipse(enemy.w * 0.5, enemy.h * 0.58, enemy.w * 0.42, enemy.h * 0.34, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#121212";
                ctx.beginPath();
                ctx.arc(enemy.w * 0.62, enemy.h * 0.48, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (enemy.kind === "roller") {
                ctx.beginPath();
                ctx.arc(enemy.w / 2, enemy.h / 2, enemy.w / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.22)";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(enemy.w / 2, enemy.h / 2, enemy.w * 0.28, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                roundRect(0, 6, enemy.w, enemy.h - 6, 12);
                ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.18)";
                ctx.fillRect(8, 12, enemy.w - 16, 4);
            }

            drawMiniBar(0, -8, enemy.w, 4, enemy.hp / enemy.maxHp, "#ff6b6b");
            ctx.restore();
        });
    }

    function drawBoss() {
        const boss = run.boss;
        if (!boss || !boss.active || boss.dead) {
            return;
        }

        ctx.save();
        ctx.translate(boss.x, boss.y);
        if (boss.hitTimer > 0) {
            ctx.translate(rand(-4, 4), rand(-3, 3));
        }
        ctx.globalAlpha = boss.frozen > 0 ? 0.7 : 1;

        if (boss.shieldTimer > 0) {
            ctx.strokeStyle = "rgba(124, 231, 255, 0.78)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.ellipse(boss.w / 2, boss.h / 2, boss.w * 0.64, boss.h * 0.62, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = boss.color;
        ctx.beginPath();
        ctx.ellipse(boss.w / 2, boss.h / 2, boss.w * 0.42, boss.h * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        ctx.ellipse(boss.w * 0.25, boss.h * 0.36, boss.w * 0.28, boss.h * 0.2, -0.5, 0, Math.PI * 2);
        ctx.ellipse(boss.w * 0.75, boss.h * 0.36, boss.w * 0.28, boss.h * 0.2, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#101018";
        ctx.beginPath();
        ctx.arc(boss.w * 0.6, boss.h * 0.45, 6, 0, Math.PI * 2);
        ctx.arc(boss.w * 0.73, boss.h * 0.45, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#101018";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(boss.w * 0.64, boss.h * 0.66, 20, 0.1, Math.PI - 0.1);
        ctx.stroke();
        ctx.restore();
    }

    function drawBullets() {
        run.playerBullets.forEach((bullet) => {
            drawBullet(bullet);
        });
        run.enemyBullets.forEach((bullet) => {
            drawBullet(bullet);
        });
    }

    function drawBullet(bullet) {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.fillStyle = bullet.color || (bullet.owner === "player" ? "#ffffff" : "#ff6b6b");
        if (bullet.type === "comet" || bullet.type === "fire") {
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        if (bullet.type === "leaf" || bullet.type === "spark") {
            ctx.strokeStyle = "rgba(255,255,255,0.48)";
            ctx.beginPath();
            ctx.moveTo(-bullet.radius * 2, 0);
            ctx.lineTo(bullet.radius * 2, 0);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawHazards() {
        run.hazards.forEach((hazard) => {
            if (hazard.type === "lightning") {
                const armed = hazard.timer < hazard.warn;
                ctx.fillStyle = armed ? "rgba(255,240,112,0.5)" : "rgba(255,240,112,0.14)";
                ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
                if (armed) {
                    ctx.strokeStyle = "#fff070";
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(hazard.x + hazard.w / 2, hazard.y);
                    ctx.lineTo(hazard.x + 8, hazard.y + hazard.h * 0.3);
                    ctx.lineTo(hazard.x + hazard.w - 8, hazard.y + hazard.h * 0.6);
                    ctx.lineTo(hazard.x + hazard.w / 2, hazard.y + hazard.h);
                    ctx.stroke();
                }
                return;
            }

            ctx.fillStyle = hazard.color || "#9fff62";
            ctx.globalAlpha = 0.75;
            roundRect(hazard.x, hazard.y, hazard.w, hazard.h, 12);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function drawPlayer() {
        const hero = currentHero();
        ctx.save();
        ctx.translate(player.x + player.w / 2, player.y + player.h / 2);

        if (player.phaseTimer > 0) {
            ctx.globalAlpha = 0.52 + Math.sin(run.time * 18) * 0.16;
        } else if (player.invuln > 0) {
            ctx.globalAlpha = 0.58 + Math.sin(run.time * 24) * 0.22;
        }

        if (player.vehicle === "bike") {
            drawBike(-44, player.h / 2 - 20, 1);
        }
        if (player.vehicle === "kayak") {
            drawKayak(-52, player.h / 2 - 18);
        }

        if (player.flipTimer > 0 || Math.abs(player.flipAngle) > 0.01) {
            ctx.rotate(player.flipAngle);
        }

        if (player.dir < 0) {
            ctx.scale(-1, 1);
        }

        const bodyBob = player.onGround && !player.vehicle ? Math.sin(run.time * 12) * Math.min(2.5, Math.abs(player.vx) / 90) : 0;
        ctx.translate(0, bodyBob);
        drawSpriteLimbs(hero, "back");

        const img = images[hero.image];
        if (img && img.complete) {
            ctx.drawImage(img, -player.w / 2 - 4, -player.h / 2 - 6, player.w + 8, player.h + 8);
        } else {
            ctx.fillStyle = hero.color;
            roundRect(-player.w / 2, -player.h / 2, player.w, player.h, 12);
            ctx.fill();
        }

        drawSpriteLimbs(hero, "front");
        ctx.restore();

        drawAimLine(hero);

        if (player.shieldTimer > 0) {
            ctx.strokeStyle = "rgba(184,192,200,0.82)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.75, player.h * 0.62, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function drawSpriteLimbs(hero, layer) {
        const front = layer === "front";
        const movement = clamp(Math.abs(player.vx) / 220, 0, 1);
        const stride = player.onGround && !player.vehicle ? Math.sin(run.time * 11 + player.x * 0.035) * movement : 0;
        const phase = front ? stride : -stride;
        const alpha = front ? 1 : 0.72;
        const color = hero.color;
        const bootColor = player.vehicle === "kayak" ? "#e78d36" : "#101820";
        const side = front ? 1 : -1;
        const assetBottomY = player.h / 2 + 2;
        const legRootX = side * 10;
        const armRootX = side * 17;
        const legRootY = assetBottomY - 7;
        const armRootY = assetBottomY - 17;

        ctx.save();
        ctx.globalAlpha *= alpha;

        let armAngle = -0.1 - phase * 0.5;
        let armBend = 0.35 + Math.abs(phase) * 0.2;
        let legAngle = phase * 0.72;
        let legBend = 0.46 - Math.min(0.26, phase * 0.16);

        if (!player.onGround && !player.vehicle) {
            const tuck = player.flipTimer > 0 ? 0.95 : 0.52;
            armAngle = front ? -1.18 : 0.82;
            armBend = front ? 0.74 : -0.56;
            legAngle = front ? -0.56 * tuck : 0.58 * tuck;
            legBend = 0.92;
        }

        if (player.vehicle === "bike") {
            armAngle = front ? -1.15 : -0.86;
            armBend = front ? 0.22 : -0.18;
            legAngle = front ? 0.92 : 0.42;
            legBend = front ? -1.05 : -0.72;
        }

        if (player.vehicle === "kayak") {
            const paddle = Math.sin(run.time * 5.2);
            armAngle = front ? -1.25 + paddle * 0.28 : 0.92 - paddle * 0.24;
            armBend = front ? -0.3 : 0.45;
            legAngle = front ? 0.58 : 0.32;
            legBend = front ? -0.7 : -0.45;
        }

        const aim = getAimVector();
        const localAimX = aim.x * (player.dir < 0 ? -1 : 1);
        const localAimY = aim.y;
        const aimAngle = Math.atan2(localAimX, localAimY);
        armAngle = aimAngle + (front ? -0.02 : 0.26);
        armBend = front ? 0 : 0.2;

        drawSegmentedLimb({
            x: legRootX,
            y: legRootY,
            upper: 14,
            lower: 14,
            width: 9,
            angle: legAngle,
            bend: legBend,
            color,
            capColor: bootColor,
            cap: "foot"
        });

        drawSegmentedLimb({
            x: armRootX,
            y: armRootY,
            upper: front ? 24 : 15,
            lower: front ? 14 : 12,
            width: 8,
            angle: armAngle,
            bend: armBend,
            color,
            capColor: "#ffe0bd",
            cap: "hand"
        });

        if (front) {
            drawHeldWeaponLocal(hero, armRootX, armRootY, armAngle, 24, localAimX, localAimY);
        }

        ctx.restore();
    }

    function drawHeldWeaponLocal(hero, armRootX, armRootY, armAngle, armLength, aimX, aimY) {
        const handX = armRootX + Math.sin(armAngle) * armLength;
        const handY = armRootY + Math.cos(armAngle) * armLength;
        const length = Math.hypot(aimX, aimY) || 1;
        const ax = aimX / length;
        const ay = aimY / length;
        const sideX = -ay;
        const sideY = ax;
        const stockX = handX - ax * 18 - sideX * 4;
        const stockY = handY - ay * 18 - sideY * 4;
        const muzzleX = handX + ax * 38;
        const muzzleY = handY + ay * 38;
        const topX = handX + sideX * 5;
        const topY = handY + sideY * 5;

        ctx.save();
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(7, 12, 20, 0.9)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(stockX, stockY);
        ctx.lineTo(muzzleX, muzzleY);
        ctx.stroke();

        ctx.strokeStyle = hero.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(handX - ax * 7, handY - ay * 7);
        ctx.lineTo(muzzleX, muzzleY);
        ctx.stroke();

        ctx.strokeStyle = "#f6fbff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(muzzleX - ax * 8 + sideX * 5, muzzleY - ay * 8 + sideY * 5);
        ctx.stroke();
        ctx.restore();
    }

    function drawSegmentedLimb({ x, y, upper, lower, width, angle, bend, color, capColor, cap }) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.strokeStyle = "rgba(7, 12, 20, 0.58)";
        ctx.lineWidth = 1.5;
        roundRect(-width / 2, 0, width, upper, width / 2);
        ctx.fill();
        ctx.stroke();
        ctx.translate(0, upper - 2);
        ctx.rotate(bend);
        roundRect(-width / 2, 0, width, lower, width / 2);
        ctx.fill();
        ctx.stroke();
        ctx.translate(0, lower);
        ctx.fillStyle = capColor;

        if (cap === "foot") {
            roundRect(-width / 2 - 3, -2, width + 10, 7, 4);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(0, 2, width * 0.56, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawAimLine(hero) {
        const aim = getAimVector();
        const muzzle = weaponMuzzlePoint(aim);

        if (controls.aimActive || isShooting()) {
            ctx.save();
            ctx.globalAlpha = 0.52;
            ctx.strokeStyle = "rgba(255,255,255,0.78)";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            const reticleX = muzzle.x + aim.x * 32;
            const reticleY = muzzle.y + aim.y * 32;
            ctx.beginPath();
            ctx.arc(reticleX, reticleY, 9, 0, Math.PI * 2);
            ctx.moveTo(reticleX - 14, reticleY);
            ctx.lineTo(reticleX + 14, reticleY);
            ctx.moveTo(reticleX, reticleY - 14);
            ctx.lineTo(reticleX, reticleY + 14);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.lineCap = "butt";
            ctx.restore();
        }
    }

    function drawBike(x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = "#121820";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(17, 31, 13, 0, Math.PI * 2);
        ctx.arc(69, 31, 13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(17, 31);
        ctx.lineTo(38, 12);
        ctx.lineTo(57, 31);
        ctx.lineTo(30, 31);
        ctx.lineTo(48, 12);
        ctx.lineTo(69, 31);
        ctx.stroke();
        ctx.restore();
    }

    function drawKayak(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#e78d36";
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.quadraticCurveTo(52, -8, 104, 22);
        ctx.quadraticCurveTo(52, 38, 0, 22);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.ellipse(52, 20, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawParticles() {
        run.particles.forEach((particle) => {
            ctx.globalAlpha = clamp(particle.life * 2, 0, 1);
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function drawMiniBar(x, y, w, h, ratio, color) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, Math.max(0, w * ratio), h);
    }

    function drawBossHud() {
        const boss = run.boss;
        if (!boss || !boss.active || boss.dead) {
            return;
        }

        const width = Math.min(520, view.w - 32);
        const x = (view.w - width) / 2;
        const y = Math.max(58, 16);
        ctx.fillStyle = "rgba(7,12,20,0.74)";
        roundRect(x, y, width, 42, 8);
        ctx.fill();
        ctx.fillStyle = "#f6fbff";
        ctx.font = "900 13px system-ui, sans-serif";
        ctx.fillText(boss.name, x + 12, y + 17);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        roundRect(x + 12, y + 25, width - 24, 8, 4);
        ctx.fill();
        ctx.fillStyle = boss.color;
        roundRect(x + 12, y + 25, (width - 24) * clamp(boss.hp / boss.maxHp, 0, 1), 8, 4);
        ctx.fill();
    }

    function drawMessage() {
        if (!run.message || run.messageTimer <= 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = clamp(run.messageTimer, 0, 1);
        ctx.fillStyle = "rgba(7,12,20,0.82)";
        const text = run.message;
        ctx.font = "900 15px system-ui, sans-serif";
        const width = Math.min(view.w - 32, ctx.measureText(text).width + 34);
        const x = (view.w - width) / 2;
        const y = Math.max(92, view.h - gameplayBottomReserve() - 58);
        roundRect(x, y, width, 38, 8);
        ctx.fill();
        ctx.fillStyle = "#f6fbff";
        ctx.textAlign = "center";
        ctx.fillText(text, view.w / 2, y + 24);
        ctx.restore();
    }

    function drawProgressBar() {
        if (!run.level) {
            return;
        }

        const width = Math.min(360, view.w - 32);
        const x = 16;
        const y = view.h - gameplayBottomReserve() + 24;
        const ratio = clamp(player.x / run.level.width, 0, 1);
        ctx.fillStyle = "rgba(7,12,20,0.65)";
        roundRect(x, y, width, 8, 4);
        ctx.fill();
        ctx.fillStyle = "#50d8c8";
        roundRect(x, y, width * ratio, 8, 4);
        ctx.fill();
    }

    function drawWorldLabel(text, x, y, color) {
        ctx.fillStyle = "rgba(7,12,20,0.75)";
        ctx.font = "900 13px system-ui, sans-serif";
        const w = ctx.measureText(text).width + 18;
        roundRect(x - w / 2, y - 22, w, 24, 6);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, x, y - 6);
        ctx.textAlign = "left";
    }

    function roundRect(x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    function handleKey(event, pressed) {
        const code = event.code;
        let handledAim = false;

        if (code === "ArrowLeft" || code === "KeyA") {
            controls.left = pressed;
        }
        if (code === "ArrowRight" || code === "KeyD") {
            controls.right = pressed;
        }
        if (code === "ArrowDown" || code === "KeyS") {
            controls.down = pressed;
        }
        if (code === "ArrowUp" || code === "KeyW" || code === "Space") {
            event.preventDefault();
            controls.jump = pressed;
            if (pressed) {
                controls.jumpPressed = true;
            }
        }

        if (code === "KeyJ") {
            controls.aimKeys.left = pressed;
            handledAim = true;
        }
        if (code === "KeyL") {
            controls.aimKeys.right = pressed;
            handledAim = true;
        }
        if (code === "KeyI") {
            controls.aimKeys.up = pressed;
            handledAim = true;
        }
        if (code === "KeyK") {
            controls.aimKeys.down = pressed;
            handledAim = true;
        }
        if (handledAim) {
            event.preventDefault();
            updateAimFromKeys();
        }

        if (code === "KeyF" || code === "ControlLeft") {
            event.preventDefault();
            controls.fireHeld = pressed;
        }

        if (code === "KeyE" || code === "KeyQ" || code === "ShiftLeft" || code === "ShiftRight") {
            event.preventDefault();
            controls.skill = pressed;
        }
        if (code === "Enter" || code === "KeyR") {
            event.preventDefault();
            controls.action = pressed;
            if (pressed) {
                controls.actionPressed = true;
            }
        }
    }

    function bindMobileControls() {
        document.querySelectorAll("[data-control]").forEach((button) => {
            const name = button.dataset.control;
            button.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                button.setPointerCapture(event.pointerId);
                button.classList.add("is-pressed");
                controls[name] = true;
                if (name === "jump") {
                    controls.jumpPressed = true;
                }
                if (name === "action") {
                    controls.actionPressed = true;
                }
            });

            ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
                button.addEventListener(eventName, () => {
                    button.classList.remove("is-pressed");
                    controls[name] = false;
                });
            });
        });
    }

    function aimFromClientPoint(clientX, clientY) {
        if (!run.level) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const worldX = clientX - rect.left + run.cameraX;
        const worldY = clientY - rect.top;
        const originX = player.x + player.w / 2;
        const originY = player.y + player.h * 0.43;
        setAimVector(worldX - originX, worldY - originY, true);
    }

    function bindPointerAim() {
        canvas.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }
            if (run.state !== "playing") {
                return;
            }

            event.preventDefault();
            controls.pointerShoot = true;
            controls.aimPointerId = event.pointerId;
            canvas.setPointerCapture(event.pointerId);
            aimFromClientPoint(event.clientX, event.clientY);
            shoot();
        });

        canvas.addEventListener("pointermove", (event) => {
            if (run.state !== "playing") {
                return;
            }
            if (event.pointerType === "mouse" || controls.pointerShoot) {
                aimFromClientPoint(event.clientX, event.clientY);
            }
        });

        ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
            canvas.addEventListener(eventName, (event) => {
                if (controls.aimPointerId === null || controls.aimPointerId === event.pointerId) {
                    controls.pointerShoot = false;
                    controls.aimPointerId = null;
                }
            });
        });
    }

    function bindAimStick() {
        const stick = document.getElementById("aim-stick");
        const knob = document.getElementById("aim-knob");
        if (!stick || !knob) {
            return;
        }

        const updateStick = (event) => {
            const rect = stick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = event.clientX - centerX;
            let dy = event.clientY - centerY;
            const distance = Math.hypot(dx, dy);
            const maxDistance = rect.width * 0.34;

            if (distance < 8) {
                dx = player.dir || 1;
                dy = 0;
            }

            setAimVector(dx, dy, true);

            const clamped = distance > maxDistance ? maxDistance / distance : 1;
            knob.style.transform = `translate(${dx * clamped}px, ${dy * clamped}px)`;
            controls.aimStickShoot = true;
            shoot();
        };

        stick.addEventListener("pointerdown", (event) => {
            if (run.state !== "playing") {
                return;
            }

            event.preventDefault();
            stick.setPointerCapture(event.pointerId);
            stick.classList.add("is-active");
            updateStick(event);
        });

        stick.addEventListener("pointermove", (event) => {
            if (!controls.aimStickShoot || run.state !== "playing") {
                return;
            }

            event.preventDefault();
            updateStick(event);
        });

        ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
            stick.addEventListener(eventName, () => {
                controls.aimStickShoot = false;
                stick.classList.remove("is-active");
                knob.style.transform = "";
            });
        });
    }

    function bindUi() {
        document.getElementById("start-button").addEventListener("click", startCampaign);
        document.getElementById("heroes-button").addEventListener("click", () => openHeroes("menu"));
        document.getElementById("reset-button").addEventListener("click", resetSave);
        document.getElementById("heroes-back").addEventListener("click", closeHeroes);
        ui.pauseButton.addEventListener("click", () => {
            if (run.state === "playing") {
                showPause();
            } else {
                showScreen("menu");
            }
        });
        document.getElementById("resume-button").addEventListener("click", resumeGame);
        document.getElementById("pause-heroes-button").addEventListener("click", () => openHeroes("pause"));
        document.getElementById("restart-zone-button").addEventListener("click", () => startLevel(run.levelIndex));
        document.getElementById("pause-menu-button").addEventListener("click", () => {
            run.state = "menu";
            showScreen("menu");
        });
        ui.nextZoneButton.addEventListener("click", nextZone);
        document.getElementById("result-heroes-button").addEventListener("click", () => openHeroes("result"));
        document.getElementById("retry-button").addEventListener("click", () => startLevel(run.levelIndex));
        document.getElementById("gameover-heroes-button").addEventListener("click", () => openHeroes("gameover"));
        document.getElementById("gameover-menu-button").addEventListener("click", () => {
            run.state = "menu";
            showScreen("menu");
        });
    }

    function initTelegramWebApp() {
        const telegramApp = window.Telegram && window.Telegram.WebApp;
        if (!telegramApp) {
            return;
        }

        telegramApp.ready();
        telegramApp.expand();
        if (typeof telegramApp.setHeaderColor === "function") {
            telegramApp.setHeaderColor("#101820");
        }
        if (typeof telegramApp.setBackgroundColor === "function") {
            telegramApp.setBackgroundColor("#101820");
        }
        if (typeof telegramApp.disableVerticalSwipes === "function") {
            telegramApp.disableVerticalSwipes();
        }
    }

    function loop(timestamp) {
        const dt = Math.min(0.033, (timestamp - lastFrame) / 1000 || 0);
        lastFrame = timestamp;
        update(dt);
        render();
        requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", (event) => {
        if (event.code === "Escape" || event.code === "KeyP") {
            event.preventDefault();
            if (run.state === "playing") {
                showPause();
            } else if (run.state === "paused") {
                resumeGame();
            }
            return;
        }
        handleKey(event, true);
    });
    window.addEventListener("keyup", (event) => handleKey(event, false));

    bindUi();
    bindMobileControls();
    bindPointerAim();
    bindAimStick();
    resizeCanvas();
    renderHeroGrid();
    renderUpgrades();
    updateHud();
    initTelegramWebApp();
    requestAnimationFrame(loop);
})();
