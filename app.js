// ========================================
// HOLLOW FORGE - Main Application
// High Quality Character Creator
// ========================================

class HollowForge {
    constructor() {
        // Get canvas and set size
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Create offscreen buffer
        this.buffer = new PixelCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        // Character state
        this.character = {
            skin: 'hollow',
            body: 'normal',
            face: 'normal',
            hair: 'none',
            helmet: 'none',
            chest: 'leather',
            legs: 'pants',
            cape: 'none',
            weapon: 'sword',
            shield: 'none',
            aura: 'none',
            background: 'bonfire'
        };

        // Animation state
        this.time = 0;
        this.breathOffset = 0;

        // Initialize
        this.setupTabs();
        this.setupOptions();
        this.setupButtons();
        this.startAnimation();
        this.updateBadge();
    }

    // =====================================
    // UI SETUP
    // =====================================

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                document.querySelector(`[data-panel="${tabId}"]`).classList.add('active');
            });
        });
    }

    setupOptions() {
        const mappings = [
            { gridId: 'skinGrid', options: OPTIONS.skin, prop: 'skin' },
            { gridId: 'bodyGrid', options: OPTIONS.body, prop: 'body' },
            { gridId: 'faceGrid', options: OPTIONS.face, prop: 'face' },
            { gridId: 'hairGrid', options: OPTIONS.hair, prop: 'hair' },
            { gridId: 'helmetGrid', options: OPTIONS.helmet, prop: 'helmet' },
            { gridId: 'chestGrid', options: OPTIONS.chest, prop: 'chest' },
            { gridId: 'legsGrid', options: OPTIONS.legs, prop: 'legs' },
            { gridId: 'capeGrid', options: OPTIONS.cape, prop: 'cape' },
            { gridId: 'weaponGrid', options: OPTIONS.weapon, prop: 'weapon' },
            { gridId: 'shieldGrid', options: OPTIONS.shield, prop: 'shield' },
            { gridId: 'auraGrid', options: OPTIONS.aura, prop: 'aura' },
            { gridId: 'bgGrid', options: OPTIONS.background, prop: 'background' }
        ];

        mappings.forEach(({ gridId, options, prop }) => {
            this.createOptionGrid(gridId, options, prop);
        });
    }

    createOptionGrid(gridId, options, prop) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card' + (opt.id === 'none' ? ' none-card' : '');
            card.dataset.id = opt.id;

            if (this.character[prop] === opt.id) {
                card.classList.add('selected');
            }

            // Create thumbnail
            if (opt.id !== 'none') {
                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.width = 32;
                thumbCanvas.height = 32;
                this.drawThumbnail(thumbCanvas, prop, opt.id);
                card.appendChild(thumbCanvas);
            }

            const label = document.createElement('span');
            label.className = 'option-name';
            label.textContent = opt.name;
            card.appendChild(label);

            card.addEventListener('click', () => {
                this.selectOption(prop, opt.id, grid);
            });

            grid.appendChild(card);
        });
    }

    drawThumbnail(canvas, prop, id) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 32, 32);

        const pc = new PixelCanvas(32, 32);

        switch (prop) {
            case 'skin':
                const skinPal = SKIN_PALETTES[id] || SKIN_PALETTES.hollow;
                // Simple body preview
                const miniBody = [
                    [0,0,0,1,1,1,1,0,0,0],
                    [0,0,1,2,2,2,2,1,0,0],
                    [0,0,1,2,3,3,2,1,0,0],
                    [0,0,1,2,3,3,2,1,0,0],
                    [0,0,0,1,2,2,1,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,1,2,2,1,0,0,0],
                    [0,0,1,2,3,3,2,1,0,0],
                    [0,0,1,2,3,3,2,1,0,0],
                    [0,0,1,2,3,3,2,1,0,0],
                    [0,0,0,1,2,2,1,0,0,0],
                    [0,0,0,1,1,1,1,0,0,0]
                ];
                pc.drawSprite(11, 10, miniBody, skinPal);
                break;

            case 'body':
                if (SPRITES.body[id]) {
                    // Draw scaled down body
                    const pal = ['#222', '#444', '#666', '#888', '#aaa'];
                    this.drawScaledSprite(pc, 4, 2, SPRITES.body[id], pal, 0.6);
                }
                break;

            case 'face':
                const facePal = ['#111', '#602020', '#ffa030', '#333', '#fff'];
                pc.rect(10, 10, 12, 12, '#6b5a4a');
                if (SPRITES.face[id]) {
                    pc.drawSprite(12, 12, SPRITES.face[id], facePal);
                }
                break;

            case 'hair':
                if (SPRITES.hair[id]) {
                    pc.drawSprite(8, 10, SPRITES.hair[id], HAIR_PALETTES.brown);
                }
                break;

            case 'helmet':
                if (SPRITES.helmet[id]) {
                    const helmetPal = id === 'crown' ? METAL_PALETTES.gold :
                                      id === 'hood' ? FABRIC_PALETTES.brown :
                                      METAL_PALETTES.iron;
                    pc.drawSprite(7, 8, SPRITES.helmet[id], helmetPal);
                }
                break;

            case 'chest':
                if (SPRITES.chest[id]) {
                    const chestPal = this.getArmorPalette(id);
                    pc.drawSprite(6, 9, SPRITES.chest[id], chestPal);
                }
                break;

            case 'legs':
                const legsPal = id === 'plate' || id === 'chain' ? METAL_PALETTES.iron : FABRIC_PALETTES.brown;
                pc.rect(11, 10, 4, 14, legsPal[1]);
                pc.rect(17, 10, 4, 14, legsPal[1]);
                pc.rect(12, 11, 2, 12, legsPal[2]);
                pc.rect(18, 11, 2, 12, legsPal[2]);
                break;

            case 'cape':
                if (SPRITES.cape[id]) {
                    const capePal = id === 'royal'
                        ? [...FABRIC_PALETTES.red.slice(0, 3), METAL_PALETTES.gold[2], METAL_PALETTES.gold[3]]
                        : FABRIC_PALETTES.black;
                    pc.drawSprite(4, 6, SPRITES.cape[id], capePal);
                }
                break;

            case 'weapon':
                if (SPRITES.weapon[id]) {
                    const weaponPal = id === 'staff'
                        ? [...FABRIC_PALETTES.brown.slice(0, 2), '#6040a0', '#9060d0', '#c080ff']
                        : METAL_PALETTES.steel;
                    pc.drawSprite(11, 0, SPRITES.weapon[id], weaponPal);
                }
                break;

            case 'shield':
                if (SPRITES.shield[id]) {
                    const shieldPal = id === 'crest' ? FABRIC_PALETTES.red : METAL_PALETTES.iron;
                    pc.drawSprite(9, 8, SPRITES.shield[id], shieldPal);
                }
                break;

            case 'aura':
                const auraCols = {
                    ember: ['#400', '#800', '#f60', '#ff0', '#fff'],
                    souls: ['#004', '#048', '#08f', '#4cf', '#fff'],
                    curse: ['#204', '#408', '#60c', '#a4f', '#f8f'],
                    holy: ['#440', '#880', '#ff0', '#fff', '#fff']
                };
                if (auraCols[id]) {
                    const cols = auraCols[id];
                    pc.rect(12, 12, 8, 8, cols[2]);
                    pc.pixel(10, 10, cols[3]);
                    pc.pixel(22, 12, cols[3]);
                    pc.pixel(14, 8, cols[1]);
                    pc.pixel(10, 20, cols[1]);
                    pc.pixel(24, 18, cols[2]);
                }
                break;

            case 'background':
                this.drawMiniBackground(pc, id);
                break;
        }

        ctx.drawImage(pc.canvas, 0, 0);
    }

    drawScaledSprite(pc, x, y, data, palette, scale) {
        const h = data.length;
        const w = data[0] ? data[0].length : 0;

        for (let py = 0; py < h; py++) {
            for (let px = 0; px < w; px++) {
                const colorIndex = data[py][px];
                if (colorIndex > 0 && palette[colorIndex - 1]) {
                    const dx = x + Math.floor(px * scale);
                    const dy = y + Math.floor(py * scale);
                    pc.pixel(dx, dy, palette[colorIndex - 1]);
                }
            }
        }
    }

    drawMiniBackground(pc, id) {
        switch (id) {
            case 'void':
                pc.rect(0, 0, 32, 32, '#0a0908');
                pc.rect(8, 8, 16, 16, '#151210');
                break;
            case 'bonfire':
                pc.rect(0, 0, 32, 32, '#0a0908');
                pc.rect(14, 16, 4, 10, '#333');
                pc.rect(12, 20, 8, 6, '#f80');
                pc.rect(13, 18, 6, 6, '#ff0');
                break;
            case 'ruins':
                pc.rect(0, 0, 32, 32, '#0d0c0a');
                pc.rect(2, 6, 8, 24, '#252220');
                pc.rect(22, 10, 8, 20, '#252220');
                break;
            case 'fog':
                pc.rect(0, 0, 32, 32, '#0a0908');
                pc.rect(4, 8, 24, 16, 'rgba(180,180,200,0.15)');
                pc.rect(2, 6, 6, 24, '#252220');
                pc.rect(24, 6, 6, 24, '#252220');
                break;
            case 'abyss':
                pc.rect(0, 0, 32, 32, '#000');
                pc.rect(8, 8, 16, 16, '#080408');
                pc.pixel(6, 12, '#201030');
                pc.pixel(24, 16, '#201030');
                break;
        }
    }

    selectOption(prop, id, grid) {
        this.character[prop] = id;

        grid.querySelectorAll('.option-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === id);
        });

        this.updateBadge();
        this.render();
    }

    updateBadge() {
        const badge = document.getElementById('classBadge');
        const classes = {
            'none': 'DEPRIVED',
            'rags': 'DEPRIVED',
            'tunic': 'WANDERER',
            'leather': 'THIEF',
            'chain': 'WARRIOR',
            'plate': 'KNIGHT',
            'knight': 'ELITE KNIGHT',
            'dark': 'DARKWRAITH'
        };
        badge.textContent = classes[this.character.chest] || 'UNDEAD';
    }

    setupButtons() {
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomize());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
        document.getElementById('copyBtn').addEventListener('click', () => this.copy());
        document.getElementById('beginBtn').addEventListener('click', () => this.showToast('Your journey begins...'));
    }

    randomize() {
        const pick = arr => arr[Math.floor(Math.random() * arr.length)].id;

        this.character = {
            skin: pick(OPTIONS.skin),
            body: pick(OPTIONS.body),
            face: pick(OPTIONS.face),
            hair: pick(OPTIONS.hair),
            helmet: pick(OPTIONS.helmet),
            chest: pick(OPTIONS.chest),
            legs: pick(OPTIONS.legs),
            cape: pick(OPTIONS.cape),
            weapon: pick(OPTIONS.weapon),
            shield: pick(OPTIONS.shield),
            aura: pick(OPTIONS.aura),
            background: pick(OPTIONS.background)
        };

        document.querySelectorAll('.option-grid').forEach(grid => {
            const prop = this.getGridProp(grid.id);
            if (prop) {
                grid.querySelectorAll('.option-card').forEach(card => {
                    card.classList.toggle('selected', card.dataset.id === this.character[prop]);
                });
            }
        });

        this.updateBadge();
        this.render();
        this.showToast('Character randomized!');
    }

    getGridProp(gridId) {
        const map = {
            skinGrid: 'skin', bodyGrid: 'body', faceGrid: 'face',
            hairGrid: 'hair', helmetGrid: 'helmet', chestGrid: 'chest',
            legsGrid: 'legs', capeGrid: 'cape', weaponGrid: 'weapon',
            shieldGrid: 'shield', auraGrid: 'aura', bgGrid: 'background'
        };
        return map[gridId];
    }

    // =====================================
    // RENDERING
    // =====================================

    startAnimation() {
        const animate = (timestamp) => {
            this.time = timestamp;
            this.breathOffset = Math.sin(timestamp / 600) * 0.8;
            this.render();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    render() {
        const buf = this.buffer;
        buf.clear();

        // Draw background
        this.drawBackground(buf);

        // Character center position
        const cx = CANVAS_WIDTH / 2;
        const cy = 58 + Math.round(this.breathOffset);

        // Get palettes
        const skinPal = SKIN_PALETTES[this.character.skin] || SKIN_PALETTES.hollow;
        const bodyType = this.character.body;
        const bodyData = SPRITES.body[bodyType];

        // Calculate offsets (body sprite is 24 wide)
        const bodyOffsetX = -12;
        const bodyOffsetY = -40;

        // Draw shadow
        buf.ellipse(cx, cy + 6, 10, 3, 'rgba(0,0,0,0.4)');

        // LAYER 1: Cape (behind character)
        if (this.character.cape !== 'none' && SPRITES.cape[this.character.cape]) {
            const capePal = this.character.cape === 'royal'
                ? [...FABRIC_PALETTES.red.slice(0, 3), METAL_PALETTES.gold[2], METAL_PALETTES.gold[3]]
                : FABRIC_PALETTES.black;
            buf.drawSprite(cx - 12, cy - 30, SPRITES.cape[this.character.cape], capePal);
        }

        // LAYER 2: Shield (behind body, on left side)
        if (this.character.shield !== 'none' && SPRITES.shield[this.character.shield]) {
            const shieldPal = this.character.shield === 'crest'
                ? [...FABRIC_PALETTES.red]
                : METAL_PALETTES.iron;
            buf.drawSprite(cx - 22, cy - 24, SPRITES.shield[this.character.shield], shieldPal);
        }

        // LAYER 3: Body (base character)
        if (bodyData) {
            buf.drawSprite(cx + bodyOffsetX, cy + bodyOffsetY, bodyData, skinPal);
        }

        // LAYER 4: Chest armor (overlay on torso)
        if (this.character.chest !== 'none' && SPRITES.chest[this.character.chest]) {
            const chestPal = this.getArmorPalette(this.character.chest);
            buf.drawSprite(cx - 10, cy - 28, SPRITES.chest[this.character.chest], chestPal);
        }

        // LAYER 5: Face (if no helmet)
        if (this.character.helmet === 'none' && SPRITES.face[this.character.face]) {
            const facePal = ['#111', '#602020', '#ffa030', '#333', skinPal[4]];
            buf.drawSprite(cx - 4, cy - 36, SPRITES.face[this.character.face], facePal);
        }

        // LAYER 6: Hair (if no helmet)
        if (this.character.helmet === 'none' && this.character.hair !== 'none' && SPRITES.hair[this.character.hair]) {
            buf.drawSprite(cx - 8, cy - 42, SPRITES.hair[this.character.hair], HAIR_PALETTES.brown);
        }

        // LAYER 7: Helmet
        if (this.character.helmet !== 'none' && SPRITES.helmet[this.character.helmet]) {
            const helmetPal = this.getHelmetPalette(this.character.helmet);
            buf.drawSprite(cx - 9, cy - 42, SPRITES.helmet[this.character.helmet], helmetPal);
        }

        // LAYER 8: Weapon (on right side)
        if (this.character.weapon !== 'none' && SPRITES.weapon[this.character.weapon]) {
            const weaponPal = this.character.weapon === 'staff'
                ? [...FABRIC_PALETTES.brown.slice(0, 2), '#6040a0', '#9060d0', '#c080ff']
                : METAL_PALETTES.steel;
            buf.drawSprite(cx + 10, cy - 40, SPRITES.weapon[this.character.weapon], weaponPal);
        }

        // LAYER 9: Aura effects
        this.drawAura(buf, cx, cy);

        // Copy buffer to display canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(buf.canvas, 0, 0);
    }

    getArmorPalette(type) {
        switch (type) {
            case 'rags':
            case 'tunic':
            case 'leather':
                return FABRIC_PALETTES.brown;
            case 'chain':
                return METAL_PALETTES.iron;
            case 'plate':
            case 'knight':
                return METAL_PALETTES.steel;
            case 'dark':
                return METAL_PALETTES.dark;
            default:
                return FABRIC_PALETTES.grey;
        }
    }

    getHelmetPalette(type) {
        switch (type) {
            case 'crown':
                return METAL_PALETTES.gold;
            case 'hood':
                return FABRIC_PALETTES.brown;
            case 'mask':
                return ['#303030', '#606060', '#909090', '#c0c0c0', '#f0f0f0'];
            default:
                return METAL_PALETTES.iron;
        }
    }

    drawBackground(buf) {
        const bg = this.character.background;
        const w = CANVAS_WIDTH;
        const h = CANVAS_HEIGHT;

        switch (bg) {
            case 'void':
                buf.rect(0, 0, w, h, '#0a0908');
                // Subtle radial gradient effect
                for (let i = 0; i < 6; i++) {
                    const alpha = 0.08 - i * 0.01;
                    buf.rect(i * 2, i * 2, w - i * 4, h - i * 4, `rgba(20,18,16,${alpha})`);
                }
                // Ground
                buf.rect(0, h - 12, w, 12, '#151210');
                break;

            case 'bonfire':
                buf.rect(0, 0, w, h, '#0a0908');
                this.drawBonfire(buf, w / 2, h - 16);
                // Ground
                buf.rect(0, h - 12, w, 12, '#151210');
                break;

            case 'ruins':
                buf.rect(0, 0, w, h, '#0d0c0a');
                // Left pillar
                buf.rect(4, 24, 14, 100, '#1a1815');
                buf.rect(6, 26, 10, 96, '#252220');
                buf.rect(8, 28, 6, 92, '#2d2a27');
                // Right pillar
                buf.rect(w - 18, 36, 14, 88, '#1a1815');
                buf.rect(w - 16, 38, 10, 84, '#252220');
                buf.rect(w - 14, 40, 6, 80, '#2d2a27');
                // Archway
                buf.rect(18, 8, w - 36, 8, '#1a1815');
                buf.rect(20, 10, w - 40, 4, '#252220');
                // Ground
                buf.rect(0, h - 12, w, 12, '#151210');
                break;

            case 'fog':
                buf.rect(0, 0, w, h, '#0a0908');
                // Fog swirls
                const fogPhase = Math.sin(this.time / 2000);
                for (let i = 0; i < 5; i++) {
                    const y = 30 + i * 18 + fogPhase * 4;
                    const alpha = 0.04 + Math.sin(this.time / 1000 + i) * 0.02;
                    buf.rect(10, y, w - 20, 10, `rgba(180,180,200,${alpha})`);
                }
                // Gate pillars
                buf.rect(8, 10, 12, 110, '#252220');
                buf.rect(10, 12, 8, 106, '#2d2a27');
                buf.rect(w - 20, 10, 12, 110, '#252220');
                buf.rect(w - 18, 12, 8, 106, '#2d2a27');
                // Gate top
                buf.rect(8, 6, w - 16, 8, '#252220');
                buf.rect(10, 8, w - 20, 4, '#2d2a27');
                break;

            case 'abyss':
                buf.rect(0, 0, w, h, '#000000');
                // Dark particles rising
                for (let i = 0; i < 10; i++) {
                    const px = (w / 10) * i + Math.sin(this.time / 1000 + i) * 4;
                    const py = (this.time / 40 + i * 20) % h;
                    const alpha = 0.2 + Math.sin(this.time / 500 + i) * 0.15;
                    buf.pixel(px, h - py, `rgba(40,20,60,${alpha})`);
                    buf.pixel(px + 1, h - py - 1, `rgba(60,30,90,${alpha * 0.6})`);
                }
                // Subtle purple glow from below
                for (let i = 0; i < 4; i++) {
                    buf.rect(0, h - 4 - i * 2, w, 2, `rgba(30,15,45,${0.1 - i * 0.02})`);
                }
                break;
        }
    }

    drawBonfire(buf, x, y) {
        const flicker = Math.sin(this.time / 80) * 2 + Math.sin(this.time / 120) * 1;

        // Coiled sword (curved)
        buf.rect(x - 1, y - 36, 2, 34, '#4a4540');
        buf.rect(x, y - 34, 1, 30, '#3a3530');
        buf.pixel(x - 1, y - 38, '#5a5550');
        buf.pixel(x, y - 38, '#4a4540');

        // Fire glow (background)
        for (let r = 18; r > 4; r -= 3) {
            const alpha = 0.12 * (18 - r) / 14;
            buf.rect(x - r, y - r - 6, r * 2, r * 2, `rgba(255,100,20,${alpha})`);
        }

        // Flames (layered)
        const flameHeight = 14 + flicker;
        buf.rect(x - 5, y - flameHeight, 10, flameHeight - 2, '#d04010');
        buf.rect(x - 4, y - flameHeight + 2, 8, flameHeight - 4, '#f06020');
        buf.rect(x - 3, y - flameHeight + 3, 6, flameHeight - 5, '#ff8040');
        buf.rect(x - 2, y - flameHeight + 4, 4, flameHeight - 6, '#ffa060');
        buf.rect(x - 1, y - flameHeight + 5, 2, flameHeight - 8, '#ffc090');

        // Embers
        for (let i = 0; i < 4; i++) {
            const ex = x - 4 + Math.sin(this.time / 150 + i * 1.5) * 5;
            const ey = y - 16 - (this.time / 80 + i * 8) % 24;
            const alpha = 1 - ((this.time / 80 + i * 8) % 24) / 24;
            buf.pixelAlpha(ex, ey, '#ff8040', alpha);
        }

        // Bones around fire
        buf.rect(x - 14, y + 2, 10, 2, '#5a5550');
        buf.rect(x - 12, y + 1, 2, 4, '#4a4540');
        buf.rect(x + 6, y + 3, 8, 2, '#5a5550');
        buf.rect(x + 10, y + 2, 2, 4, '#4a4540');
    }

    drawAura(buf, cx, cy) {
        const aura = this.character.aura;
        if (aura === 'none') return;

        const t = this.time;

        switch (aura) {
            case 'ember':
                // Ember particles rising around character
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + t / 800;
                    const radius = 10 + Math.sin(t / 300 + i) * 4;
                    const px = cx + Math.cos(angle) * radius;
                    const py = cy - 10 - (t / 50 + i * 12) % 50;
                    const alpha = 1 - ((t / 50 + i * 12) % 50) / 50;
                    if (alpha > 0) {
                        buf.pixelAlpha(px, py, `#ff${Math.floor(100 + i * 15).toString(16).padStart(2, '0')}00`, alpha);
                    }
                }
                // Eye glow
                if (this.character.helmet === 'none') {
                    const eyeGlow = 0.4 + Math.sin(t / 200) * 0.3;
                    buf.pixelAlpha(cx - 3, cy - 34, '#ff8040', eyeGlow);
                    buf.pixelAlpha(cx + 2, cy - 34, '#ff8040', eyeGlow);
                }
                break;

            case 'souls':
                // Blue soul wisps orbiting
                for (let i = 0; i < 6; i++) {
                    const angle = t / 1200 + i * 1.05;
                    const radius = 14 + Math.sin(t / 400 + i) * 5;
                    const px = cx + Math.cos(angle) * radius;
                    const py = cy - 18 + Math.sin(angle) * radius * 0.4;
                    const alpha = 0.5 + Math.sin(t / 250 + i) * 0.3;
                    buf.pixelAlpha(px, py, '#60b0ff', alpha);
                    buf.pixelAlpha(px + 1, py, '#a0d0ff', alpha * 0.6);
                }
                break;

            case 'curse':
                // Purple curse marks pulsing
                for (let i = 0; i < 5; i++) {
                    const px = cx - 8 + (i % 3) * 8 + Math.sin(t / 350 + i) * 2;
                    const py = cy - 25 + Math.floor(i / 3) * 20 + Math.cos(t / 350 + i) * 2;
                    const alpha = 0.4 + Math.sin(t / 200 + i) * 0.3;
                    buf.pixelAlpha(px, py, '#9050c0', alpha);
                }
                // Curse mark on body
                buf.pixelAlpha(cx + 4, cy - 30, '#6030a0', 0.3 + Math.sin(t / 300) * 0.2);
                break;

            case 'holy':
                // Golden light rays emanating
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + t / 3000;
                    const len = 10 + Math.sin(t / 350 + i) * 4;
                    for (let j = 0; j < len; j++) {
                        const px = cx + Math.cos(angle) * (8 + j);
                        const py = cy - 20 + Math.sin(angle) * (4 + j * 0.5);
                        const alpha = (1 - j / len) * 0.35;
                        buf.pixelAlpha(px, py, '#fff0a0', alpha);
                    }
                }
                // Halo effect
                const haloAlpha = 0.2 + Math.sin(t / 400) * 0.1;
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const px = cx + Math.cos(angle) * 8;
                    const py = cy - 46 + Math.sin(angle) * 2;
                    buf.pixelAlpha(px, py, '#ffd040', haloAlpha);
                }
                break;
        }
    }

    // =====================================
    // EXPORT
    // =====================================

    download() {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = CANVAS_WIDTH * 4;
        exportCanvas.height = CANVAS_HEIGHT * 4;
        const exportCtx = exportCanvas.getContext('2d');
        exportCtx.imageSmoothingEnabled = false;
        exportCtx.drawImage(this.buffer.canvas, 0, 0, exportCanvas.width, exportCanvas.height);

        const link = document.createElement('a');
        link.download = 'hollow_warrior.png';
        link.href = exportCanvas.toDataURL('image/png');
        link.click();

        this.showToast('Image saved!');
    }

    async copy() {
        try {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = CANVAS_WIDTH * 4;
            exportCanvas.height = CANVAS_HEIGHT * 4;
            const exportCtx = exportCanvas.getContext('2d');
            exportCtx.imageSmoothingEnabled = false;
            exportCtx.drawImage(this.buffer.canvas, 0, 0, exportCanvas.width, exportCanvas.height);

            const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            this.showToast('Copied to clipboard!');
        } catch (e) {
            this.showToast('Copy failed');
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HollowForge();
});
