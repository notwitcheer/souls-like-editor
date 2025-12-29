// Hollow Forge - Dark Fantasy Character Creator
// Main Application

class CharacterCreator {
    constructor() {
        this.canvas = document.getElementById('characterCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Character state
        this.character = {
            skin: 'hollow',
            head: 'normal',
            hair: 'none',
            helmet: 'none',
            armor: 'leather',
            cloak: 'none',
            boots: 'leather',
            weapon: 'sword',
            shield: 'none',
            scars: 'none',
            background: 'void'
        };

        // Animation state
        this.animationFrame = 0;
        this.lastFrameTime = 0;
        this.isAnimating = true;

        // Initialize
        this.initializeUI();
        this.startAnimation();
    }

    initializeUI() {
        // Generate option buttons for each category
        this.createOptionButtons('skinOptions', CHARACTER_PARTS.skins, 'skin');
        this.createOptionButtons('headOptions', CHARACTER_PARTS.heads, 'head');
        this.createOptionButtons('hairOptions', CHARACTER_PARTS.hairs, 'hair');
        this.createOptionButtons('helmetOptions', CHARACTER_PARTS.helmets, 'helmet');
        this.createOptionButtons('armorOptions', CHARACTER_PARTS.armors, 'armor');
        this.createOptionButtons('cloakOptions', CHARACTER_PARTS.cloaks, 'cloak');
        this.createOptionButtons('bootsOptions', CHARACTER_PARTS.boots, 'boots');
        this.createOptionButtons('weaponOptions', CHARACTER_PARTS.weapons, 'weapon');
        this.createOptionButtons('shieldOptions', CHARACTER_PARTS.shields, 'shield');
        this.createOptionButtons('scarsOptions', CHARACTER_PARTS.scars, 'scars');
        this.createOptionButtons('backgroundOptions', CHARACTER_PARTS.backgrounds, 'background');

        // Export buttons
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
    }

    createOptionButtons(containerId, options, category) {
        const container = document.getElementById(containerId);
        if (!container) return;

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn' + (option.id === 'none' ? ' none' : '');
            btn.textContent = option.name;
            btn.dataset.id = option.id;

            if (this.character[category] === option.id) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                this.selectOption(category, option.id, container);
                this.triggerReaction();
            });

            container.appendChild(btn);
        });
    }

    selectOption(category, optionId, container) {
        this.character[category] = optionId;

        // Update button states
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.id === optionId) {
                btn.classList.add('active');
            }
        });
    }

    triggerReaction() {
        // Trigger a small "reaction" animation when changing equipment
        this.reactionTime = performance.now();
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (timestamp - this.lastFrameTime >= ANIMATION.frameRate) {
                this.animationFrame = (this.animationFrame + 1) % ANIMATION.breathingOffsets.length;
                this.lastFrameTime = timestamp;
            }

            this.render();

            if (this.isAnimating) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get current animation offset
        const anim = ANIMATION.breathingOffsets[this.animationFrame];
        const cloakOffset = ANIMATION.cloakSway[this.animationFrame];

        // Check for reaction animation
        let reactionOffset = 0;
        if (this.reactionTime) {
            const elapsed = performance.now() - this.reactionTime;
            if (elapsed < 300) {
                reactionOffset = Math.sin(elapsed / 30) * 2;
            } else {
                this.reactionTime = null;
            }
        }

        // Draw background
        this.drawBackground(ctx, width, height);

        // Draw character layers (back to front)
        ctx.save();
        ctx.translate(0, reactionOffset);

        // Cloak (back layer)
        if (this.character.cloak !== 'none') {
            this.drawCloak(ctx, cloakOffset, true);
        }

        // Body and armor
        this.drawBody(ctx, anim);

        // Shield (if any, behind character's left side)
        if (this.character.shield !== 'none') {
            this.drawShield(ctx, anim);
        }

        // Legs and boots
        this.drawLegs(ctx, anim);
        this.drawBoots(ctx, anim);

        // Arms
        this.drawArms(ctx, anim);

        // Head
        this.drawHead(ctx, anim);

        // Hair (under helmet)
        if (this.character.hair !== 'none' && this.character.helmet === 'none') {
            this.drawHair(ctx, anim);
        }

        // Helmet
        if (this.character.helmet !== 'none') {
            this.drawHelmet(ctx, anim);
        }

        // Weapon
        if (this.character.weapon !== 'none') {
            this.drawWeapon(ctx, anim);
        }

        // Scars/Effects (overlay)
        if (this.character.scars !== 'none') {
            this.drawScars(ctx, anim);
        }

        // Cloak (front layer for hooded)
        if (this.character.cloak !== 'none') {
            this.drawCloak(ctx, cloakOffset, false);
        }

        ctx.restore();
    }

    // Get skin colors based on selection
    getSkinColors() {
        const skinData = CHARACTER_PARTS.skins.find(s => s.id === this.character.skin);
        return skinData ? skinData.colors : CHARACTER_PARTS.skins[0].colors;
    }

    drawBackground(ctx, width, height) {
        const bg = this.character.background;

        // Base gradient
        let gradient;

        switch (bg) {
            case 'void':
                gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, height);
                gradient.addColorStop(0, '#1a1815');
                gradient.addColorStop(1, '#0a0908');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                break;

            case 'bonfire':
                gradient = ctx.createRadialGradient(width/2, height - 40, 20, width/2, height - 40, 150);
                gradient.addColorStop(0, 'rgba(255, 147, 41, 0.3)');
                gradient.addColorStop(0.5, 'rgba(139, 69, 19, 0.2)');
                gradient.addColorStop(1, '#0a0908');
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                // Draw bonfire
                this.drawBonfire(ctx, width/2, height - 30);
                break;

            case 'ruins':
                ctx.fillStyle = '#0d0c0a';
                ctx.fillRect(0, 0, width, height);
                this.drawRuins(ctx, width, height);
                break;

            case 'castle':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#1a1815');
                gradient.addColorStop(1, '#0d0c0a');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                this.drawCastle(ctx, width, height);
                break;

            case 'fog':
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, width, height);
                this.drawFogGate(ctx, width, height);
                break;

            case 'abyss':
                gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, height);
                gradient.addColorStop(0, '#0d0808');
                gradient.addColorStop(1, '#000000');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                this.drawAbyssParticles(ctx, width, height);
                break;

            case 'shrine':
                gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#151210');
                gradient.addColorStop(1, '#0a0908');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                this.drawShrine(ctx, width, height);
                break;

            default:
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, width, height);
        }
    }

    drawBonfire(ctx, x, y) {
        const flicker = Math.sin(performance.now() / 100) * 2;

        // Coiled sword
        ctx.fillStyle = '#4a4540';
        this.drawPixelRect(ctx, x - 2, y - 40 + flicker/2, 4, 40);
        ctx.fillStyle = '#3a3530';
        this.drawPixelRect(ctx, x - 1, y - 35 + flicker/2, 2, 30);

        // Flames
        ctx.fillStyle = `rgba(255, 147, 41, ${0.8 + Math.sin(performance.now()/50) * 0.2})`;
        this.drawPixelRect(ctx, x - 8, y - 15 + flicker, 16, 12);
        ctx.fillStyle = `rgba(255, 100, 20, ${0.6 + Math.sin(performance.now()/70) * 0.2})`;
        this.drawPixelRect(ctx, x - 6, y - 20 + flicker, 12, 8);
        ctx.fillStyle = `rgba(255, 200, 100, ${0.9 + Math.sin(performance.now()/30) * 0.1})`;
        this.drawPixelRect(ctx, x - 4, y - 10 + flicker, 8, 6);

        // Bones around fire
        ctx.fillStyle = '#5a5550';
        this.drawPixelRect(ctx, x - 20, y + 5, 12, 3);
        this.drawPixelRect(ctx, x + 10, y + 8, 10, 2);
    }

    drawRuins(ctx, width, height) {
        ctx.fillStyle = '#2a2520';
        // Broken pillars
        this.drawPixelRect(ctx, 20, height - 120, 20, 120);
        this.drawPixelRect(ctx, width - 40, height - 100, 20, 100);
        // Rubble
        ctx.fillStyle = '#1a1815';
        this.drawPixelRect(ctx, 10, height - 20, 60, 20);
        this.drawPixelRect(ctx, width - 70, height - 15, 50, 15);
        // Cracks
        ctx.fillStyle = '#151210';
        this.drawPixelRect(ctx, 25, height - 80, 2, 30);
        this.drawPixelRect(ctx, 30, height - 60, 2, 20);
    }

    drawCastle(ctx, width, height) {
        // Distant castle silhouette
        ctx.fillStyle = '#1a1815';
        // Main tower
        this.drawPixelRect(ctx, width/2 - 30, 20, 60, 80);
        // Battlements
        for (let i = 0; i < 5; i++) {
            this.drawPixelRect(ctx, width/2 - 28 + i * 14, 12, 8, 12);
        }
        // Side towers
        this.drawPixelRect(ctx, 20, 60, 30, 60);
        this.drawPixelRect(ctx, width - 50, 50, 30, 70);
        // Ground
        ctx.fillStyle = '#151210';
        this.drawPixelRect(ctx, 0, height - 30, width, 30);
    }

    drawFogGate(ctx, width, height) {
        const time = performance.now() / 1000;

        // Fog swirls
        for (let i = 0; i < 5; i++) {
            const alpha = 0.1 + Math.sin(time + i) * 0.05;
            ctx.fillStyle = `rgba(200, 200, 220, ${alpha})`;
            const y = height/2 + Math.sin(time * 0.5 + i * 0.8) * 30;
            const x = width/2 + Math.cos(time * 0.3 + i * 1.2) * 40;
            this.drawPixelRect(ctx, x - 40, y - 20, 80, 40);
        }

        // Gate frame
        ctx.fillStyle = '#2a2520';
        this.drawPixelRect(ctx, 30, 40, 15, height - 80);
        this.drawPixelRect(ctx, width - 45, 40, 15, height - 80);
        this.drawPixelRect(ctx, 30, 30, width - 60, 15);
    }

    drawAbyssParticles(ctx, width, height) {
        const time = performance.now() / 1000;

        // Dark particles rising
        for (let i = 0; i < 10; i++) {
            const alpha = 0.3 + Math.sin(time + i * 0.5) * 0.2;
            ctx.fillStyle = `rgba(30, 20, 40, ${alpha})`;
            const x = (width/10) * i + Math.sin(time + i) * 10;
            const y = height - ((time * 20 + i * 40) % height);
            this.drawPixelRect(ctx, x, y, 4, 4);
        }
    }

    drawShrine(ctx, width, height) {
        // Stone shrine structure
        ctx.fillStyle = '#2a2520';
        this.drawPixelRect(ctx, width/2 - 40, height - 60, 80, 60);
        ctx.fillStyle = '#3a3530';
        this.drawPixelRect(ctx, width/2 - 35, height - 55, 70, 50);

        // Altar
        ctx.fillStyle = '#4a4540';
        this.drawPixelRect(ctx, width/2 - 20, height - 35, 40, 8);

        // Candles
        const flicker = Math.sin(performance.now() / 80);
        ctx.fillStyle = '#5a5550';
        this.drawPixelRect(ctx, width/2 - 30, height - 45, 4, 10);
        this.drawPixelRect(ctx, width/2 + 26, height - 45, 4, 10);
        ctx.fillStyle = `rgba(255, 180, 80, ${0.8 + flicker * 0.2})`;
        this.drawPixelRect(ctx, width/2 - 31, height - 50, 6, 5);
        this.drawPixelRect(ctx, width/2 + 25, height - 50, 6, 5);
    }

    drawBody(ctx, anim) {
        const skin = this.getSkinColors();
        const yOffset = Math.round(anim.torso);

        // Torso shadow
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 90, 115 + yOffset, 76, 75);

        // Torso base
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 92, 112 + yOffset, 72, 72);

        // Draw armor over body
        this.drawArmor(ctx, anim);
    }

    drawArmor(ctx, anim) {
        const armor = this.character.armor;
        const yOffset = Math.round(anim.torso);

        let armorColor, armorShadow, armorHighlight;

        switch (armor) {
            case 'rags':
                armorColor = '#3a3028';
                armorShadow = '#2a2018';
                armorHighlight = '#4a4038';
                break;
            case 'leather':
                armorColor = '#4a3828';
                armorShadow = '#3a2818';
                armorHighlight = '#5a4838';
                break;
            case 'chainmail':
                armorColor = '#5a5550';
                armorShadow = '#4a4540';
                armorHighlight = '#6a6560';
                break;
            case 'plate':
                armorColor = '#606058';
                armorShadow = '#505048';
                armorHighlight = '#707068';
                break;
            case 'knight':
                armorColor = '#5a5a58';
                armorShadow = '#4a4a48';
                armorHighlight = '#6a6a68';
                break;
            case 'wanderer':
                armorColor = '#4a4038';
                armorShadow = '#3a3028';
                armorHighlight = '#5a5048';
                break;
            case 'elite':
                armorColor = '#555555';
                armorShadow = '#404040';
                armorHighlight = '#666666';
                break;
            case 'black_iron':
                armorColor = '#2a2a2a';
                armorShadow = '#1a1a1a';
                armorHighlight = '#3a3a3a';
                break;
            default:
                armorColor = '#4a3828';
                armorShadow = '#3a2818';
                armorHighlight = '#5a4838';
        }

        // Main torso armor
        ctx.fillStyle = armorShadow;
        this.drawPixelRect(ctx, 88, 114 + yOffset, 80, 72);

        ctx.fillStyle = armorColor;
        this.drawPixelRect(ctx, 92, 112 + yOffset, 72, 68);

        // Armor details based on type
        if (armor === 'chainmail' || armor === 'plate' || armor === 'knight' || armor === 'elite' || armor === 'black_iron') {
            // Metal armor details
            ctx.fillStyle = armorHighlight;
            this.drawPixelRect(ctx, 96, 116 + yOffset, 8, 24);
            this.drawPixelRect(ctx, 152, 116 + yOffset, 8, 24);

            // Shoulder plates
            ctx.fillStyle = armorShadow;
            this.drawPixelRect(ctx, 76, 112 + yOffset, 20, 16);
            this.drawPixelRect(ctx, 160, 112 + yOffset, 20, 16);
            ctx.fillStyle = armorColor;
            this.drawPixelRect(ctx, 78, 110 + yOffset, 18, 14);
            this.drawPixelRect(ctx, 160, 110 + yOffset, 18, 14);
        }

        if (armor === 'elite' || armor === 'black_iron') {
            // Extra plating
            ctx.fillStyle = armorHighlight;
            this.drawPixelRect(ctx, 118, 120 + yOffset, 20, 4);
            this.drawPixelRect(ctx, 118, 140 + yOffset, 20, 4);
            this.drawPixelRect(ctx, 118, 160 + yOffset, 20, 4);
        }

        // Belt
        ctx.fillStyle = '#3a2818';
        this.drawPixelRect(ctx, 90, 176 + yOffset, 76, 8);
        ctx.fillStyle = '#6a5030';
        this.drawPixelRect(ctx, 124, 176 + yOffset, 8, 8);
    }

    drawLegs(ctx, anim) {
        const skin = this.getSkinColors();

        // Left leg
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 98, 188, 28, 76);
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 100, 186, 24, 72);

        // Right leg
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 130, 188, 28, 76);
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 132, 186, 24, 72);

        // Leg armor (matches body armor style)
        const armor = this.character.armor;
        if (armor !== 'rags') {
            let legColor = armor === 'leather' || armor === 'wanderer' ? '#4a3828' : '#5a5550';
            if (armor === 'black_iron') legColor = '#2a2a2a';

            ctx.fillStyle = legColor;
            this.drawPixelRect(ctx, 100, 186, 24, 40);
            this.drawPixelRect(ctx, 132, 186, 24, 40);
        }
    }

    drawBoots(ctx, anim) {
        const boots = this.character.boots;

        let bootColor, bootShadow;

        switch (boots) {
            case 'bare':
                const skin = this.getSkinColors();
                bootColor = skin.base;
                bootShadow = skin.shadow;
                break;
            case 'wraps':
                bootColor = '#5a5048';
                bootShadow = '#4a4038';
                break;
            case 'leather':
                bootColor = '#4a3828';
                bootShadow = '#3a2818';
                break;
            case 'iron':
                bootColor = '#5a5550';
                bootShadow = '#4a4540';
                break;
            case 'knight':
                bootColor = '#606058';
                bootShadow = '#505048';
                break;
            case 'plated':
                bootColor = '#555555';
                bootShadow = '#454545';
                break;
            default:
                bootColor = '#4a3828';
                bootShadow = '#3a2818';
        }

        // Left boot
        ctx.fillStyle = bootShadow;
        this.drawPixelRect(ctx, 94, 254, 36, 28);
        ctx.fillStyle = bootColor;
        this.drawPixelRect(ctx, 96, 252, 32, 24);

        // Right boot
        ctx.fillStyle = bootShadow;
        this.drawPixelRect(ctx, 126, 254, 36, 28);
        ctx.fillStyle = bootColor;
        this.drawPixelRect(ctx, 128, 252, 32, 24);

        // Boot details for armored types
        if (boots === 'iron' || boots === 'knight' || boots === 'plated') {
            ctx.fillStyle = '#3a3530';
            this.drawPixelRect(ctx, 98, 256, 28, 4);
            this.drawPixelRect(ctx, 130, 256, 28, 4);
        }
    }

    drawArms(ctx, anim) {
        const skin = this.getSkinColors();
        const armOffset = Math.round(anim.arms);
        const yOffset = Math.round(anim.torso);

        // Left arm
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 64, 120 + yOffset + armOffset, 26, 64);
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 66, 118 + yOffset + armOffset, 22, 60);

        // Right arm
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 166, 120 + yOffset + armOffset, 26, 64);
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 168, 118 + yOffset + armOffset, 22, 60);

        // Arm armor
        const armor = this.character.armor;
        if (armor !== 'rags' && armor !== 'wanderer') {
            let armArmorColor = armor === 'leather' ? '#4a3828' : '#5a5550';
            if (armor === 'black_iron') armArmorColor = '#2a2a2a';

            ctx.fillStyle = armArmorColor;
            this.drawPixelRect(ctx, 66, 118 + yOffset + armOffset, 22, 32);
            this.drawPixelRect(ctx, 168, 118 + yOffset + armOffset, 22, 32);
        }

        // Hands
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 62, 176 + yOffset + armOffset, 16, 16);
        this.drawPixelRect(ctx, 178, 176 + yOffset + armOffset, 16, 16);
    }

    drawHead(ctx, anim) {
        const skin = this.getSkinColors();
        const headOffset = Math.round(anim.head);
        const head = this.character.head;

        // Head shadow
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 98, 36 + headOffset, 60, 68);

        // Head base
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 100, 34 + headOffset, 56, 64);

        // Face details based on head type
        ctx.fillStyle = skin.shadow;

        switch (head) {
            case 'normal':
                // Eyes
                ctx.fillStyle = '#1a1512';
                this.drawPixelRect(ctx, 110, 54 + headOffset, 8, 8);
                this.drawPixelRect(ctx, 138, 54 + headOffset, 8, 8);
                // Nose
                ctx.fillStyle = skin.shadow;
                this.drawPixelRect(ctx, 124, 66 + headOffset, 8, 12);
                // Mouth
                this.drawPixelRect(ctx, 118, 82 + headOffset, 20, 4);
                break;

            case 'gaunt':
                // Sunken eyes
                ctx.fillStyle = '#0a0808';
                this.drawPixelRect(ctx, 108, 52 + headOffset, 12, 12);
                this.drawPixelRect(ctx, 136, 52 + headOffset, 12, 12);
                ctx.fillStyle = '#1a1512';
                this.drawPixelRect(ctx, 110, 54 + headOffset, 8, 8);
                this.drawPixelRect(ctx, 138, 54 + headOffset, 8, 8);
                // Hollow cheeks
                ctx.fillStyle = skin.shadow;
                this.drawPixelRect(ctx, 102, 66 + headOffset, 8, 16);
                this.drawPixelRect(ctx, 146, 66 + headOffset, 8, 16);
                break;

            case 'skull':
                // Empty eye sockets
                ctx.fillStyle = '#000000';
                this.drawPixelRect(ctx, 108, 50 + headOffset, 14, 14);
                this.drawPixelRect(ctx, 134, 50 + headOffset, 14, 14);
                // Nose hole
                this.drawPixelRect(ctx, 122, 68 + headOffset, 12, 8);
                // Teeth
                ctx.fillStyle = skin.highlight;
                this.drawPixelRect(ctx, 112, 82 + headOffset, 32, 8);
                ctx.fillStyle = '#0a0808';
                for (let i = 0; i < 4; i++) {
                    this.drawPixelRect(ctx, 116 + i * 8, 82 + headOffset, 2, 8);
                }
                break;

            case 'noble':
                // Refined eyes
                ctx.fillStyle = '#1a1512';
                this.drawPixelRect(ctx, 112, 56 + headOffset, 6, 6);
                this.drawPixelRect(ctx, 138, 56 + headOffset, 6, 6);
                // Eyebrows
                ctx.fillStyle = skin.shadow;
                this.drawPixelRect(ctx, 110, 50 + headOffset, 10, 3);
                this.drawPixelRect(ctx, 136, 50 + headOffset, 10, 3);
                // Nose
                this.drawPixelRect(ctx, 125, 64 + headOffset, 6, 14);
                break;

            case 'scarred':
                // Eyes (one damaged)
                ctx.fillStyle = '#1a1512';
                this.drawPixelRect(ctx, 110, 54 + headOffset, 8, 8);
                ctx.fillStyle = '#3a2a2a';
                this.drawPixelRect(ctx, 138, 54 + headOffset, 8, 8);
                // Scar across face
                ctx.fillStyle = '#5a3030';
                this.drawPixelRect(ctx, 134, 46 + headOffset, 4, 32);
                this.drawPixelRect(ctx, 130, 50 + headOffset, 4, 4);
                this.drawPixelRect(ctx, 138, 74 + headOffset, 4, 4);
                break;

            case 'hollow_eyes':
                // Glowing hollow eyes
                ctx.fillStyle = '#000000';
                this.drawPixelRect(ctx, 106, 50 + headOffset, 16, 16);
                this.drawPixelRect(ctx, 134, 50 + headOffset, 16, 16);
                // Inner glow
                const glowIntensity = 0.5 + Math.sin(performance.now() / 200) * 0.3;
                ctx.fillStyle = `rgba(200, 150, 50, ${glowIntensity})`;
                this.drawPixelRect(ctx, 110, 54 + headOffset, 8, 8);
                this.drawPixelRect(ctx, 138, 54 + headOffset, 8, 8);
                break;
        }

        // Neck
        ctx.fillStyle = skin.shadow;
        this.drawPixelRect(ctx, 114, 98 + headOffset, 28, 16);
        ctx.fillStyle = skin.base;
        this.drawPixelRect(ctx, 116, 96 + headOffset, 24, 16);
    }

    drawHair(ctx, anim) {
        const hair = this.character.hair;
        const headOffset = Math.round(anim.head);

        const hairData = CHARACTER_PARTS.hairs.find(h => h.id === hair);
        if (!hairData) return;

        const color = hairData.color;
        const shadow = this.darkenColor(color, 20);

        switch (hair) {
            case 'short':
                ctx.fillStyle = shadow;
                this.drawPixelRect(ctx, 98, 30 + headOffset, 60, 28);
                ctx.fillStyle = color;
                this.drawPixelRect(ctx, 100, 28 + headOffset, 56, 24);
                break;

            case 'long':
                ctx.fillStyle = shadow;
                this.drawPixelRect(ctx, 96, 28 + headOffset, 64, 80);
                ctx.fillStyle = color;
                this.drawPixelRect(ctx, 98, 26 + headOffset, 60, 76);
                // Hair over shoulders
                this.drawPixelRect(ctx, 80, 90 + headOffset, 16, 40);
                this.drawPixelRect(ctx, 160, 90 + headOffset, 16, 40);
                break;

            case 'messy':
                ctx.fillStyle = color;
                this.drawPixelRect(ctx, 96, 24 + headOffset, 64, 32);
                // Messy strands
                this.drawPixelRect(ctx, 92, 32 + headOffset, 8, 20);
                this.drawPixelRect(ctx, 156, 28 + headOffset, 8, 24);
                this.drawPixelRect(ctx, 108, 20 + headOffset, 12, 12);
                this.drawPixelRect(ctx, 136, 18 + headOffset, 16, 14);
                break;

            case 'slicked':
                ctx.fillStyle = shadow;
                this.drawPixelRect(ctx, 100, 28 + headOffset, 56, 20);
                ctx.fillStyle = color;
                this.drawPixelRect(ctx, 102, 26 + headOffset, 52, 18);
                // Highlight
                ctx.fillStyle = this.lightenColor(color, 30);
                this.drawPixelRect(ctx, 110, 28 + headOffset, 20, 4);
                break;

            case 'wild':
                ctx.fillStyle = color;
                this.drawPixelRect(ctx, 92, 22 + headOffset, 72, 36);
                // Wild spikes
                this.drawPixelRect(ctx, 88, 30 + headOffset, 12, 28);
                this.drawPixelRect(ctx, 156, 26 + headOffset, 12, 32);
                this.drawPixelRect(ctx, 104, 14 + headOffset, 16, 16);
                this.drawPixelRect(ctx, 136, 12 + headOffset, 20, 18);
                this.drawPixelRect(ctx, 120, 10 + headOffset, 16, 18);
                break;

            case 'white':
                ctx.fillStyle = '#787068';
                this.drawPixelRect(ctx, 96, 26 + headOffset, 64, 40);
                ctx.fillStyle = '#a8a098';
                this.drawPixelRect(ctx, 98, 24 + headOffset, 60, 36);
                // Wisps
                this.drawPixelRect(ctx, 86, 50 + headOffset, 12, 30);
                this.drawPixelRect(ctx, 158, 48 + headOffset, 12, 32);
                break;
        }
    }

    drawHelmet(ctx, anim) {
        const helmet = this.character.helmet;
        const headOffset = Math.round(anim.head);

        let metalColor = '#5a5550';
        let metalShadow = '#4a4540';
        let metalHighlight = '#6a6560';

        // Adjust colors for black iron armor
        if (this.character.armor === 'black_iron') {
            metalColor = '#2a2a2a';
            metalShadow = '#1a1a1a';
            metalHighlight = '#3a3a3a';
        }

        switch (helmet) {
            case 'knight':
                // Base helm
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, 94, 28 + headOffset, 68, 76);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, 96, 26 + headOffset, 64, 72);
                // Visor slit
                ctx.fillStyle = '#0a0808';
                this.drawPixelRect(ctx, 104, 54 + headOffset, 48, 8);
                // Top ridge
                ctx.fillStyle = metalHighlight;
                this.drawPixelRect(ctx, 124, 22 + headOffset, 8, 8);
                break;

            case 'bucket':
                // Flat top bucket helm
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, 92, 24 + headOffset, 72, 80);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, 94, 22 + headOffset, 68, 76);
                // Eye slits
                ctx.fillStyle = '#0a0808';
                this.drawPixelRect(ctx, 104, 50 + headOffset, 16, 6);
                this.drawPixelRect(ctx, 136, 50 + headOffset, 16, 6);
                // Breathing holes
                for (let i = 0; i < 4; i++) {
                    this.drawPixelRect(ctx, 116 + i * 6, 70 + headOffset, 4, 4);
                }
                break;

            case 'crown':
                // Broken crown
                ctx.fillStyle = '#6a5020';
                this.drawPixelRect(ctx, 96, 24 + headOffset, 64, 16);
                ctx.fillStyle = '#8a7030';
                this.drawPixelRect(ctx, 98, 22 + headOffset, 60, 14);
                // Crown points (some broken)
                this.drawPixelRect(ctx, 100, 12 + headOffset, 8, 14);
                this.drawPixelRect(ctx, 124, 8 + headOffset, 8, 18);
                this.drawPixelRect(ctx, 148, 16 + headOffset, 8, 10);
                // Broken point
                ctx.fillStyle = '#5a4010';
                this.drawPixelRect(ctx, 136, 18 + headOffset, 6, 8);
                break;

            case 'hood':
                // Leather hood
                ctx.fillStyle = '#3a2818';
                this.drawPixelRect(ctx, 92, 22 + headOffset, 72, 72);
                ctx.fillStyle = '#4a3828';
                this.drawPixelRect(ctx, 94, 20 + headOffset, 68, 68);
                // Face opening
                ctx.fillStyle = '#2a1808';
                this.drawPixelRect(ctx, 104, 44 + headOffset, 48, 44);
                break;

            case 'armet':
                // Armet helm with visor
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, 92, 26 + headOffset, 72, 78);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, 94, 24 + headOffset, 68, 74);
                // Pointed visor
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, 100, 50 + headOffset, 56, 24);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, 102, 48 + headOffset, 52, 20);
                // Visor slit
                ctx.fillStyle = '#0a0808';
                this.drawPixelRect(ctx, 106, 54 + headOffset, 44, 6);
                // Plume holder
                ctx.fillStyle = metalHighlight;
                this.drawPixelRect(ctx, 122, 18 + headOffset, 12, 10);
                break;

            case 'barbute':
                // Y-shaped face opening
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, 94, 24 + headOffset, 68, 80);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, 96, 22 + headOffset, 64, 76);
                // Face opening
                ctx.fillStyle = '#0a0808';
                this.drawPixelRect(ctx, 120, 42 + headOffset, 16, 50);
                this.drawPixelRect(ctx, 108, 42 + headOffset, 40, 20);
                break;

            case 'skull_mask':
                // Skull-shaped mask
                ctx.fillStyle = '#a8a098';
                this.drawPixelRect(ctx, 98, 30 + headOffset, 60, 64);
                ctx.fillStyle = '#c8c0b8';
                this.drawPixelRect(ctx, 100, 28 + headOffset, 56, 60);
                // Eye holes
                ctx.fillStyle = '#000000';
                this.drawPixelRect(ctx, 106, 44 + headOffset, 16, 16);
                this.drawPixelRect(ctx, 134, 44 + headOffset, 16, 16);
                // Nose hole
                this.drawPixelRect(ctx, 122, 64 + headOffset, 12, 10);
                // Teeth
                ctx.fillStyle = '#d8d0c8';
                this.drawPixelRect(ctx, 108, 78 + headOffset, 40, 12);
                ctx.fillStyle = '#0a0808';
                for (let i = 0; i < 5; i++) {
                    this.drawPixelRect(ctx, 112 + i * 8, 78 + headOffset, 2, 12);
                }
                break;
        }
    }

    drawCloak(ctx, swayOffset, isBack) {
        const cloak = this.character.cloak;
        if (cloak === 'none') return;

        let cloakColor, cloakShadow;

        // Use darker versions for back layer
        switch (this.character.armor) {
            case 'black_iron':
                cloakColor = '#1a1815';
                cloakShadow = '#0a0808';
                break;
            case 'knight':
            case 'elite':
                cloakColor = '#2a1a1a';
                cloakShadow = '#1a0a0a';
                break;
            default:
                cloakColor = '#2a2520';
                cloakShadow = '#1a1510';
        }

        const sway = Math.round(swayOffset);

        if (isBack) {
            // Back layer of cloak
            switch (cloak) {
                case 'tattered':
                    ctx.fillStyle = cloakShadow;
                    this.drawPixelRect(ctx, 80 + sway, 110, 96, 140);
                    // Tattered edges
                    ctx.fillStyle = cloakColor;
                    this.drawPixelRect(ctx, 82 + sway, 108, 92, 130);
                    // Holes and tears
                    ctx.fillStyle = 'transparent';
                    ctx.clearRect(90 + sway * SCALE, 200 * SCALE, 8 * SCALE, 16 * SCALE);
                    ctx.clearRect(150 + sway * SCALE, 180 * SCALE, 12 * SCALE, 24 * SCALE);
                    break;

                case 'short':
                    ctx.fillStyle = cloakShadow;
                    this.drawPixelRect(ctx, 84 + sway, 108, 88, 60);
                    ctx.fillStyle = cloakColor;
                    this.drawPixelRect(ctx, 86 + sway, 106, 84, 56);
                    break;

                case 'long':
                    ctx.fillStyle = cloakShadow;
                    this.drawPixelRect(ctx, 76 + sway, 106, 104, 160);
                    ctx.fillStyle = cloakColor;
                    this.drawPixelRect(ctx, 78 + sway, 104, 100, 156);
                    break;

                case 'hood_cloak':
                    ctx.fillStyle = cloakShadow;
                    this.drawPixelRect(ctx, 76 + sway, 100, 104, 166);
                    ctx.fillStyle = cloakColor;
                    this.drawPixelRect(ctx, 78 + sway, 98, 100, 162);
                    break;

                case 'royal':
                    ctx.fillStyle = '#1a0a0a';
                    this.drawPixelRect(ctx, 72 + sway, 104, 112, 164);
                    ctx.fillStyle = '#2a1a1a';
                    this.drawPixelRect(ctx, 74 + sway, 102, 108, 160);
                    // Gold trim
                    ctx.fillStyle = '#8a7020';
                    this.drawPixelRect(ctx, 74 + sway, 102, 4, 160);
                    this.drawPixelRect(ctx, 178 + sway, 102, 4, 160);
                    this.drawPixelRect(ctx, 74 + sway, 258, 108, 4);
                    break;
            }
        } else {
            // Front elements (like hood over head)
            if (cloak === 'hood_cloak' && this.character.helmet === 'none') {
                const headOffset = Math.round(ANIMATION.breathingOffsets[this.animationFrame].head);
                ctx.fillStyle = cloakShadow;
                this.drawPixelRect(ctx, 92, 18 + headOffset, 72, 72);
                ctx.fillStyle = cloakColor;
                this.drawPixelRect(ctx, 94, 16 + headOffset, 68, 68);
                // Face shadow
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                this.drawPixelRect(ctx, 100, 40 + headOffset, 56, 40);
            }

            // Front clasp for all cloaks
            if (cloak !== 'none') {
                ctx.fillStyle = '#5a4530';
                this.drawPixelRect(ctx, 120, 108, 16, 8);
                ctx.fillStyle = '#6a5540';
                this.drawPixelRect(ctx, 122, 106, 12, 6);
            }
        }
    }

    drawWeapon(ctx, anim) {
        const weapon = this.character.weapon;
        const armOffset = Math.round(anim.arms);
        const yOffset = Math.round(anim.torso);

        let metalColor = '#5a5550';
        let metalShadow = '#4a4540';
        let handleColor = '#3a2818';

        // Weapon position (right hand)
        const baseX = 186;
        const baseY = 150 + yOffset + armOffset;

        switch (weapon) {
            case 'sword':
                // Handle
                ctx.fillStyle = handleColor;
                this.drawPixelRect(ctx, baseX, baseY + 20, 8, 28);
                // Guard
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 8, baseY + 16, 24, 6);
                // Blade
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX, baseY - 60, 8, 76);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX + 2, baseY - 58, 4, 72);
                // Edge highlight
                ctx.fillStyle = '#7a7570';
                this.drawPixelRect(ctx, baseX + 2, baseY - 56, 2, 68);
                break;

            case 'greatsword':
                // Handle (longer)
                ctx.fillStyle = handleColor;
                this.drawPixelRect(ctx, baseX - 2, baseY + 20, 12, 44);
                // Guard (larger)
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 16, baseY + 14, 40, 8);
                // Massive blade
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 4, baseY - 100, 16, 116);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 2, baseY - 98, 12, 112);
                // Fuller
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX + 2, baseY - 90, 4, 80);
                break;

            case 'axe':
                // Handle
                ctx.fillStyle = handleColor;
                this.drawPixelRect(ctx, baseX + 2, baseY - 40, 8, 88);
                // Axe head
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 12, baseY - 60, 36, 36);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 10, baseY - 58, 32, 32);
                // Blade edge
                ctx.fillStyle = '#6a6560';
                this.drawPixelRect(ctx, baseX - 14, baseY - 54, 6, 24);
                break;

            case 'spear':
                // Long shaft
                ctx.fillStyle = handleColor;
                this.drawPixelRect(ctx, baseX + 2, baseY - 80, 6, 140);
                // Spear head
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX, baseY - 110, 10, 32);
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX + 2, baseY - 112, 6, 34);
                // Point
                ctx.fillStyle = '#6a6560';
                this.drawPixelRect(ctx, baseX + 3, baseY - 118, 4, 8);
                break;

            case 'katana':
                // Handle (wrapped)
                ctx.fillStyle = '#1a1512';
                this.drawPixelRect(ctx, baseX, baseY + 20, 8, 32);
                ctx.fillStyle = '#3a3028';
                for (let i = 0; i < 4; i++) {
                    this.drawPixelRect(ctx, baseX, baseY + 22 + i * 8, 8, 2);
                }
                // Tsuba (guard)
                ctx.fillStyle = '#5a4030';
                this.drawPixelRect(ctx, baseX - 4, baseY + 16, 16, 6);
                // Curved blade
                ctx.fillStyle = '#787878';
                this.drawPixelRect(ctx, baseX, baseY - 64, 6, 80);
                this.drawPixelRect(ctx, baseX - 2, baseY - 62, 6, 4);
                ctx.fillStyle = '#989898';
                this.drawPixelRect(ctx, baseX + 2, baseY - 60, 2, 74);
                break;

            case 'mace':
                // Handle
                ctx.fillStyle = handleColor;
                this.drawPixelRect(ctx, baseX + 2, baseY - 20, 8, 68);
                // Mace head
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 8, baseY - 48, 28, 32);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 6, baseY - 46, 24, 28);
                // Flanges
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 12, baseY - 40, 8, 16);
                this.drawPixelRect(ctx, baseX + 16, baseY - 40, 8, 16);
                this.drawPixelRect(ctx, baseX, baseY - 54, 12, 8);
                break;

            case 'scythe':
                // Long handle
                ctx.fillStyle = handleColor;
                this.drawPixelRect(ctx, baseX, baseY - 60, 6, 120);
                // Scythe blade
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 40, baseY - 70, 48, 8);
                this.drawPixelRect(ctx, baseX - 44, baseY - 66, 8, 24);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 38, baseY - 68, 44, 4);
                this.drawPixelRect(ctx, baseX - 42, baseY - 64, 4, 20);
                // Edge
                ctx.fillStyle = '#6a6560';
                this.drawPixelRect(ctx, baseX - 44, baseY - 68, 2, 22);
                break;

            case 'staff':
                // Wooden staff
                ctx.fillStyle = '#4a3020';
                this.drawPixelRect(ctx, baseX + 2, baseY - 80, 8, 140);
                ctx.fillStyle = '#5a4030';
                this.drawPixelRect(ctx, baseX + 3, baseY - 78, 6, 136);
                // Crystal/orb at top
                ctx.fillStyle = '#4a0060';
                this.drawPixelRect(ctx, baseX - 4, baseY - 100, 20, 24);
                ctx.fillStyle = '#6a2080';
                this.drawPixelRect(ctx, baseX - 2, baseY - 98, 16, 20);
                // Glow effect
                const glowPulse = 0.3 + Math.sin(performance.now() / 300) * 0.2;
                ctx.fillStyle = `rgba(140, 80, 200, ${glowPulse})`;
                this.drawPixelRect(ctx, baseX, baseY - 96, 12, 16);
                break;
        }
    }

    drawShield(ctx, anim) {
        const shield = this.character.shield;
        const armOffset = Math.round(anim.arms);
        const yOffset = Math.round(anim.torso);

        let metalColor = '#5a5550';
        let metalShadow = '#4a4540';

        // Shield position (left arm)
        const baseX = 44;
        const baseY = 140 + yOffset + armOffset;

        switch (shield) {
            case 'buckler':
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 4, baseY - 16, 36, 36);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 2, baseY - 14, 32, 32);
                // Boss
                ctx.fillStyle = '#6a6560';
                this.drawPixelRect(ctx, baseX + 8, baseY - 4, 12, 12);
                break;

            case 'kite':
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 8, baseY - 32, 44, 72);
                this.drawPixelRect(ctx, baseX, baseY + 36, 28, 16);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 6, baseY - 30, 40, 68);
                this.drawPixelRect(ctx, baseX + 2, baseY + 34, 24, 14);
                // Cross design
                ctx.fillStyle = '#3a3028';
                this.drawPixelRect(ctx, baseX + 10, baseY - 24, 8, 56);
                this.drawPixelRect(ctx, baseX - 2, baseY - 8, 32, 8);
                break;

            case 'tower':
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 12, baseY - 40, 52, 96);
                ctx.fillStyle = metalColor;
                this.drawPixelRect(ctx, baseX - 10, baseY - 38, 48, 92);
                // Reinforcement bands
                ctx.fillStyle = metalShadow;
                this.drawPixelRect(ctx, baseX - 10, baseY - 20, 48, 4);
                this.drawPixelRect(ctx, baseX - 10, baseY + 16, 48, 4);
                break;

            case 'crest':
                ctx.fillStyle = '#3a1818';
                this.drawPixelRect(ctx, baseX - 8, baseY - 28, 44, 60);
                ctx.fillStyle = '#4a2828';
                this.drawPixelRect(ctx, baseX - 6, baseY - 26, 40, 56);
                // Crest emblem
                ctx.fillStyle = '#6a5020';
                this.drawPixelRect(ctx, baseX + 4, baseY - 16, 20, 32);
                ctx.fillStyle = '#8a7030';
                this.drawPixelRect(ctx, baseX + 6, baseY - 14, 16, 28);
                // Lion/beast design
                ctx.fillStyle = '#5a4010';
                this.drawPixelRect(ctx, baseX + 10, baseY - 8, 8, 16);
                break;

            case 'skull':
                ctx.fillStyle = '#2a2520';
                this.drawPixelRect(ctx, baseX - 8, baseY - 28, 44, 56);
                ctx.fillStyle = '#3a3530';
                this.drawPixelRect(ctx, baseX - 6, baseY - 26, 40, 52);
                // Skull decoration
                ctx.fillStyle = '#a8a098';
                this.drawPixelRect(ctx, baseX + 2, baseY - 18, 24, 28);
                ctx.fillStyle = '#c8c0b8';
                this.drawPixelRect(ctx, baseX + 4, baseY - 16, 20, 24);
                // Eye holes
                ctx.fillStyle = '#000000';
                this.drawPixelRect(ctx, baseX + 6, baseY - 10, 6, 6);
                this.drawPixelRect(ctx, baseX + 16, baseY - 10, 6, 6);
                // Nose
                this.drawPixelRect(ctx, baseX + 12, baseY - 2, 4, 4);
                break;
        }
    }

    drawScars(ctx, anim) {
        const scars = this.character.scars;
        const headOffset = Math.round(anim.head);
        const yOffset = Math.round(anim.torso);

        switch (scars) {
            case 'face_scar':
                ctx.fillStyle = '#5a3030';
                // Diagonal scar across face
                this.drawPixelRect(ctx, 108, 48 + headOffset, 4, 40);
                this.drawPixelRect(ctx, 112, 52 + headOffset, 4, 4);
                this.drawPixelRect(ctx, 104, 84 + headOffset, 4, 4);
                break;

            case 'burn':
                ctx.fillStyle = 'rgba(80, 30, 20, 0.6)';
                // Burn marks
                this.drawPixelRect(ctx, 144, 50 + headOffset, 16, 24);
                this.drawPixelRect(ctx, 140, 70 + headOffset, 20, 16);
                ctx.fillStyle = 'rgba(40, 20, 15, 0.4)';
                this.drawPixelRect(ctx, 96, 140 + yOffset, 24, 28);
                break;

            case 'decay':
                ctx.fillStyle = 'rgba(50, 40, 30, 0.5)';
                // Decaying patches
                this.drawPixelRect(ctx, 102, 60 + headOffset, 12, 16);
                this.drawPixelRect(ctx, 148, 66 + headOffset, 8, 12);
                this.drawPixelRect(ctx, 68, 130 + yOffset, 16, 24);
                this.drawPixelRect(ctx, 172, 138 + yOffset, 12, 20);
                // Darker spots
                ctx.fillStyle = 'rgba(30, 20, 15, 0.6)';
                this.drawPixelRect(ctx, 106, 64 + headOffset, 4, 8);
                break;

            case 'curse_mark':
                ctx.fillStyle = 'rgba(80, 0, 100, 0.6)';
                // Glowing curse marks
                this.drawPixelRect(ctx, 136, 56 + headOffset, 16, 4);
                this.drawPixelRect(ctx, 140, 52 + headOffset, 8, 16);
                this.drawPixelRect(ctx, 136, 64 + headOffset, 4, 8);
                this.drawPixelRect(ctx, 148, 60 + headOffset, 4, 8);
                // Glow effect
                const glowIntensity = 0.3 + Math.sin(performance.now() / 400) * 0.2;
                ctx.fillStyle = `rgba(140, 60, 180, ${glowIntensity})`;
                this.drawPixelRect(ctx, 138, 54 + headOffset, 12, 12);
                break;

            case 'ember':
                // Ember glow cracks
                const emberPulse = 0.5 + Math.sin(performance.now() / 200) * 0.3;
                ctx.fillStyle = `rgba(255, 100, 20, ${emberPulse})`;
                // Crack patterns
                this.drawPixelRect(ctx, 130, 50 + headOffset, 2, 20);
                this.drawPixelRect(ctx, 126, 58 + headOffset, 6, 2);
                this.drawPixelRect(ctx, 100, 130 + yOffset, 2, 16);
                this.drawPixelRect(ctx, 98, 138 + yOffset, 6, 2);
                this.drawPixelRect(ctx, 156, 136 + yOffset, 2, 12);
                // Core glow
                ctx.fillStyle = `rgba(255, 180, 60, ${emberPulse * 0.7})`;
                this.drawPixelRect(ctx, 128, 54 + headOffset, 6, 12);
                break;

            case 'bleeding':
                ctx.fillStyle = 'rgba(100, 20, 20, 0.8)';
                // Blood drips
                this.drawPixelRect(ctx, 112, 70 + headOffset, 4, 24);
                this.drawPixelRect(ctx, 114, 90 + headOffset, 4, 8);
                this.drawPixelRect(ctx, 142, 64 + headOffset, 4, 28);
                // Body wounds
                this.drawPixelRect(ctx, 92, 148 + yOffset, 8, 4);
                this.drawPixelRect(ctx, 90, 152 + yOffset, 4, 16);
                break;
        }
    }

    // Utility function to draw a pixelated rectangle
    drawPixelRect(ctx, x, y, width, height) {
        ctx.fillRect(x, y, width, height);
    }

    // Color manipulation utilities
    darkenColor(hex, amount) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.max(0, (num >> 16) - amount);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
        const b = Math.max(0, (num & 0x0000FF) - amount);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    lightenColor(hex, amount) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
        const b = Math.min(255, (num & 0x0000FF) + amount);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    // Export functions
    downloadImage() {
        // Create a temporary canvas for export (without animation)
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.canvas.width;
        exportCanvas.height = this.canvas.height;
        const exportCtx = exportCanvas.getContext('2d');

        // Draw current frame
        exportCtx.drawImage(this.canvas, 0, 0);

        // Get character name
        const nameInput = document.getElementById('characterName');
        const characterName = nameInput.value.trim() || 'hollow_warrior';
        const fileName = characterName.toLowerCase().replace(/\s+/g, '_') + '.png';

        // Create download link
        const link = document.createElement('a');
        link.download = fileName;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();

        this.showNotification('Image saved to your realm');
    }

    async copyToClipboard() {
        try {
            // Create blob from canvas
            const blob = await new Promise(resolve => {
                this.canvas.toBlob(resolve, 'image/png');
            });

            // Copy to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            this.showNotification('Image copied to clipboard');
        } catch (err) {
            // Fallback: copy as data URL
            try {
                const dataUrl = this.canvas.toDataURL('image/png');
                await navigator.clipboard.writeText(dataUrl);
                this.showNotification('Image URL copied to clipboard');
            } catch (fallbackErr) {
                this.showNotification('Failed to copy - try downloading instead');
            }
        }
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');

        notificationText.textContent = message;
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 2500);
    }
}

// Initialize the character creator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.characterCreator = new CharacterCreator();
});
