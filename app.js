// Hollow Forge - Dark Fantasy Character Creator
// Main Application

class CharacterCreator {
    constructor() {
        this.characterCanvas = document.getElementById('characterCanvas');
        this.backgroundCanvas = document.getElementById('backgroundCanvas');
        this.charCtx = this.characterCanvas.getContext('2d');
        this.bgCtx = this.backgroundCanvas.getContext('2d');

        // Disable image smoothing for pixel art
        this.charCtx.imageSmoothingEnabled = false;
        this.bgCtx.imageSmoothingEnabled = false;

        // Character state
        this.character = {
            skin: 'hollow',
            build: 'normal',
            face: 'normal',
            hair: 'none',
            helm: 'none',
            chest: 'leather',
            legs: 'leather',
            boots: 'leather',
            cape: 'none',
            weapon: 'sword',
            shield: 'none',
            scars: 'none',
            effects: 'none',
            background: 'bonfire'
        };

        // Animation state
        this.animationFrame = 0;
        this.time = 0;
        this.lastTime = 0;
        this.breathOffset = 0;
        this.isAnimating = true;

        // Initialize
        this.initializeTabs();
        this.initializeOptions();
        this.initializeButtons();
        this.startAnimation();
    }

    initializeTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

                // Add active to clicked tab and corresponding pane
                tab.classList.add('active');
                const paneId = tab.dataset.tab + '-tab';
                document.getElementById(paneId).classList.add('active');
            });
        });
    }

    initializeOptions() {
        // Map option categories to their containers and character properties
        const optionMappings = [
            { containerId: 'skinOptions', options: CHARACTER_OPTIONS.skin, property: 'skin' },
            { containerId: 'buildOptions', options: CHARACTER_OPTIONS.build, property: 'build' },
            { containerId: 'faceOptions', options: CHARACTER_OPTIONS.face, property: 'face' },
            { containerId: 'hairOptions', options: CHARACTER_OPTIONS.hair, property: 'hair' },
            { containerId: 'helmOptions', options: CHARACTER_OPTIONS.helm, property: 'helm' },
            { containerId: 'chestOptions', options: CHARACTER_OPTIONS.chest, property: 'chest' },
            { containerId: 'legsOptions', options: CHARACTER_OPTIONS.legs, property: 'legs' },
            { containerId: 'bootsOptions', options: CHARACTER_OPTIONS.boots, property: 'boots' },
            { containerId: 'capeOptions', options: CHARACTER_OPTIONS.cape, property: 'cape' },
            { containerId: 'weaponOptions', options: CHARACTER_OPTIONS.weapon, property: 'weapon' },
            { containerId: 'shieldOptions', options: CHARACTER_OPTIONS.shield, property: 'shield' },
            { containerId: 'scarsOptions', options: CHARACTER_OPTIONS.scars, property: 'scars' },
            { containerId: 'effectsOptions', options: CHARACTER_OPTIONS.effects, property: 'effects' },
            { containerId: 'backgroundOptions', options: CHARACTER_OPTIONS.background, property: 'background' }
        ];

        optionMappings.forEach(mapping => {
            this.createOptionCards(mapping.containerId, mapping.options, mapping.property);
        });
    }

    createOptionCards(containerId, options, property) {
        const container = document.getElementById(containerId);
        if (!container) return;

        options.forEach(option => {
            const card = document.createElement('div');
            card.className = 'option-card' + (option.id === 'none' ? ' none-option' : '');
            card.dataset.id = option.id;

            if (this.character[property] === option.id) {
                card.classList.add('selected');
            }

            // Create thumbnail canvas
            if (option.id !== 'none' || property === 'background') {
                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.width = 32;
                thumbCanvas.height = 32;
                const thumbCtx = thumbCanvas.getContext('2d');
                thumbCtx.imageSmoothingEnabled = false;

                this.drawThumbnail(thumbCtx, property, option);
                card.appendChild(thumbCanvas);
            }

            // Create label
            const label = document.createElement('span');
            label.className = 'option-label';
            label.textContent = option.name;
            card.appendChild(label);

            // Click handler
            card.addEventListener('click', () => {
                this.selectOption(property, option.id, container);
                this.triggerReaction();
            });

            container.appendChild(card);
        });
    }

    drawThumbnail(ctx, property, option) {
        ctx.clearRect(0, 0, 32, 32);
        spriteRenderer.pixelSize = 1;

        // Position for thumbnail (centered in 32x32)
        const baseX = 16;
        const baseY = 4;

        switch (property) {
            case 'skin':
                // Draw small body preview
                const p = PALETTES.skin[option.palette] || PALETTES.skin.hollow;
                // Head
                ctx.fillStyle = p.outline;
                ctx.fillRect(12, 4, 8, 8);
                ctx.fillStyle = p.base;
                ctx.fillRect(13, 5, 6, 6);
                // Body
                ctx.fillStyle = p.shadow;
                ctx.fillRect(11, 12, 10, 10);
                ctx.fillStyle = p.base;
                ctx.fillRect(12, 13, 8, 8);
                break;

            case 'build':
                // Silhouette showing build type
                const width = option.id === 'slim' ? 6 : (option.id === 'heavy' ? 12 : 8);
                ctx.fillStyle = '#5a5a58';
                ctx.fillRect(16 - width/2, 8, width, 16);
                ctx.fillRect(14, 4, 4, 6);
                break;

            case 'face':
                spriteRenderer.drawFace(ctx, option.id, 'hollow', baseX, baseY + 2);
                // Draw head outline for context
                ctx.fillStyle = PALETTES.skin.hollow.outline;
                ctx.fillRect(12, 6, 8, 8);
                ctx.fillStyle = PALETTES.skin.hollow.base;
                ctx.fillRect(13, 7, 6, 6);
                spriteRenderer.drawFace(ctx, option.id, 'hollow', 16, 6);
                break;

            case 'hair':
                if (option.id !== 'none') {
                    // Draw head first
                    ctx.fillStyle = PALETTES.skin.hollow.outline;
                    ctx.fillRect(12, 8, 8, 8);
                    ctx.fillStyle = PALETTES.skin.hollow.base;
                    ctx.fillRect(13, 9, 6, 6);
                    spriteRenderer.drawHair(ctx, option.id, option.color || 'black', 16, 8);
                }
                break;

            case 'helm':
                if (option.id !== 'none') {
                    spriteRenderer.drawHelm(ctx, option.id, 16, 6);
                }
                break;

            case 'chest':
                // Show chest armor
                const bodyWidth = 10;
                spriteRenderer.drawChest(ctx, option.id, 16, 2, bodyWidth);
                break;

            case 'legs':
                spriteRenderer.drawLegs(ctx, option.id, 16, 0);
                break;

            case 'boots':
                spriteRenderer.drawBoots(ctx, option.id, 'hollow', 16, 2);
                break;

            case 'cape':
                if (option.id !== 'none') {
                    spriteRenderer.drawCape(ctx, option.id, 16, 4, true);
                }
                break;

            case 'weapon':
                if (option.id !== 'none') {
                    spriteRenderer.drawWeapon(ctx, option.id, 8, 2);
                }
                break;

            case 'shield':
                if (option.id !== 'none') {
                    spriteRenderer.drawShield(ctx, option.id, 20, 4);
                }
                break;

            case 'scars':
                if (option.id !== 'none') {
                    // Draw face with scar
                    ctx.fillStyle = PALETTES.skin.hollow.outline;
                    ctx.fillRect(12, 6, 8, 8);
                    ctx.fillStyle = PALETTES.skin.hollow.base;
                    ctx.fillRect(13, 7, 6, 6);
                    spriteRenderer.drawFace(ctx, 'normal', 'hollow', 16, 6);
                    spriteRenderer.drawScars(ctx, option.id, 16, 6);
                }
                break;

            case 'effects':
                if (option.id !== 'none') {
                    spriteRenderer.drawEffects(ctx, option.id, 16, 8, performance.now());
                }
                break;

            case 'background':
                this.drawBackgroundThumbnail(ctx, option.id);
                break;
        }
    }

    drawBackgroundThumbnail(ctx, bgId) {
        switch (bgId) {
            case 'void':
                const voidGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 20);
                voidGrad.addColorStop(0, '#1a1815');
                voidGrad.addColorStop(1, '#0a0908');
                ctx.fillStyle = voidGrad;
                ctx.fillRect(0, 0, 32, 32);
                break;

            case 'bonfire':
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, 32, 32);
                // Fire glow
                const fireGrad = ctx.createRadialGradient(16, 24, 2, 16, 24, 12);
                fireGrad.addColorStop(0, 'rgba(255, 147, 41, 0.6)');
                fireGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = fireGrad;
                ctx.fillRect(0, 0, 32, 32);
                // Flame
                ctx.fillStyle = '#ff8030';
                ctx.fillRect(14, 20, 4, 6);
                ctx.fillStyle = '#ffa050';
                ctx.fillRect(15, 22, 2, 3);
                break;

            case 'ruins':
                ctx.fillStyle = '#0d0c0a';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#2a2520';
                ctx.fillRect(2, 8, 6, 24);
                ctx.fillRect(24, 12, 6, 20);
                ctx.fillStyle = '#1a1815';
                ctx.fillRect(0, 28, 32, 4);
                break;

            case 'castle':
                ctx.fillStyle = '#1a1815';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#2a2520';
                // Towers
                ctx.fillRect(4, 8, 8, 20);
                ctx.fillRect(20, 6, 8, 22);
                // Battlements
                ctx.fillRect(6, 4, 4, 6);
                ctx.fillRect(22, 2, 4, 6);
                break;

            case 'fog':
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, 32, 32);
                // Fog
                ctx.fillStyle = 'rgba(200, 200, 220, 0.2)';
                ctx.fillRect(4, 10, 24, 12);
                ctx.fillStyle = 'rgba(200, 200, 220, 0.1)';
                ctx.fillRect(2, 8, 28, 16);
                // Gate frame
                ctx.fillStyle = '#2a2520';
                ctx.fillRect(4, 6, 4, 22);
                ctx.fillRect(24, 6, 4, 22);
                break;

            case 'abyss':
                const abyssGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 20);
                abyssGrad.addColorStop(0, '#0d0808');
                abyssGrad.addColorStop(1, '#000000');
                ctx.fillStyle = abyssGrad;
                ctx.fillRect(0, 0, 32, 32);
                // Dark particles
                ctx.fillStyle = 'rgba(30, 20, 40, 0.5)';
                ctx.fillRect(8, 12, 2, 2);
                ctx.fillRect(22, 8, 2, 2);
                ctx.fillRect(14, 20, 2, 2);
                break;

            case 'shrine':
                ctx.fillStyle = '#151210';
                ctx.fillRect(0, 0, 32, 32);
                // Shrine structure
                ctx.fillStyle = '#2a2520';
                ctx.fillRect(8, 16, 16, 14);
                ctx.fillStyle = '#3a3530';
                ctx.fillRect(10, 18, 12, 10);
                // Candles
                ctx.fillStyle = '#ffa050';
                ctx.fillRect(12, 16, 2, 2);
                ctx.fillRect(18, 16, 2, 2);
                break;
        }
    }

    selectOption(property, optionId, container) {
        this.character[property] = optionId;

        // Update card states
        container.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.id === optionId) {
                card.classList.add('selected');
            }
        });

        // Update class badge for certain properties
        if (property === 'chest') {
            this.updateClassBadge();
        }
    }

    updateClassBadge() {
        const badge = document.getElementById('classBadge');
        const armorClasses = {
            'rags': 'DEPRIVED',
            'tunic': 'WANDERER',
            'leather': 'THIEF',
            'chain': 'WARRIOR',
            'plate': 'KNIGHT',
            'knight': 'KNIGHT',
            'elite': 'ELITE KNIGHT',
            'dark': 'DARKWRAITH'
        };
        badge.textContent = armorClasses[this.character.chest] || 'HOLLOW';
    }

    triggerReaction() {
        // Small reaction when changing equipment
        this.reactionTime = performance.now();
    }

    initializeButtons() {
        // Randomize button
        document.getElementById('randomizeBtn').addEventListener('click', () => {
            this.randomizeCharacter();
        });

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadImage();
        });

        // Copy button
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Begin button (just for show, could link to a game)
        document.getElementById('beginBtn').addEventListener('click', () => {
            this.showNotification('Your journey begins...');
        });
    }

    randomizeCharacter() {
        const randomChoice = (options) => {
            return options[Math.floor(Math.random() * options.length)].id;
        };

        // Randomize all options
        this.character.skin = randomChoice(CHARACTER_OPTIONS.skin);
        this.character.build = randomChoice(CHARACTER_OPTIONS.build);
        this.character.face = randomChoice(CHARACTER_OPTIONS.face);
        this.character.hair = randomChoice(CHARACTER_OPTIONS.hair);
        this.character.helm = randomChoice(CHARACTER_OPTIONS.helm);
        this.character.chest = randomChoice(CHARACTER_OPTIONS.chest);
        this.character.legs = randomChoice(CHARACTER_OPTIONS.legs);
        this.character.boots = randomChoice(CHARACTER_OPTIONS.boots);
        this.character.cape = randomChoice(CHARACTER_OPTIONS.cape);
        this.character.weapon = randomChoice(CHARACTER_OPTIONS.weapon);
        this.character.shield = randomChoice(CHARACTER_OPTIONS.shield);
        this.character.scars = randomChoice(CHARACTER_OPTIONS.scars);
        this.character.effects = randomChoice(CHARACTER_OPTIONS.effects);
        this.character.background = randomChoice(CHARACTER_OPTIONS.background);

        // Update all UI selections
        this.updateAllSelections();
        this.updateClassBadge();
        this.triggerReaction();
    }

    updateAllSelections() {
        const mappings = {
            'skinOptions': 'skin',
            'buildOptions': 'build',
            'faceOptions': 'face',
            'hairOptions': 'hair',
            'helmOptions': 'helm',
            'chestOptions': 'chest',
            'legsOptions': 'legs',
            'bootsOptions': 'boots',
            'capeOptions': 'cape',
            'weaponOptions': 'weapon',
            'shieldOptions': 'shield',
            'scarsOptions': 'scars',
            'effectsOptions': 'effects',
            'backgroundOptions': 'background'
        };

        Object.entries(mappings).forEach(([containerId, property]) => {
            const container = document.getElementById(containerId);
            if (container) {
                container.querySelectorAll('.option-card').forEach(card => {
                    card.classList.remove('selected');
                    if (card.dataset.id === this.character[property]) {
                        card.classList.add('selected');
                    }
                });
            }
        });
    }

    startAnimation() {
        const animate = (timestamp) => {
            const delta = timestamp - this.lastTime;
            this.lastTime = timestamp;
            this.time = timestamp;

            // Breathing animation
            this.breathOffset = Math.sin(timestamp / 800) * 1.5;

            // Render
            this.renderBackground();
            this.renderCharacter();

            if (this.isAnimating) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    renderBackground() {
        const ctx = this.bgCtx;
        const width = this.backgroundCanvas.width;
        const height = this.backgroundCanvas.height;
        const bg = this.character.background;

        ctx.clearRect(0, 0, width, height);

        switch (bg) {
            case 'void':
                const voidGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, height * 0.7);
                voidGrad.addColorStop(0, '#1a1815');
                voidGrad.addColorStop(1, '#0a0908');
                ctx.fillStyle = voidGrad;
                ctx.fillRect(0, 0, width, height);
                break;

            case 'bonfire':
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, width, height);
                this.drawBonfire(ctx, width/2, height - 40);
                break;

            case 'ruins':
                ctx.fillStyle = '#0d0c0a';
                ctx.fillRect(0, 0, width, height);
                this.drawRuins(ctx, width, height);
                break;

            case 'castle':
                const castleGrad = ctx.createLinearGradient(0, 0, 0, height);
                castleGrad.addColorStop(0, '#1a1815');
                castleGrad.addColorStop(1, '#0d0c0a');
                ctx.fillStyle = castleGrad;
                ctx.fillRect(0, 0, width, height);
                this.drawCastle(ctx, width, height);
                break;

            case 'fog':
                ctx.fillStyle = '#0a0908';
                ctx.fillRect(0, 0, width, height);
                this.drawFogGate(ctx, width, height);
                break;

            case 'abyss':
                const abyssGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, height * 0.7);
                abyssGrad.addColorStop(0, '#0d0808');
                abyssGrad.addColorStop(1, '#000000');
                ctx.fillStyle = abyssGrad;
                ctx.fillRect(0, 0, width, height);
                this.drawAbyssParticles(ctx, width, height);
                break;

            case 'shrine':
                const shrineGrad = ctx.createLinearGradient(0, 0, 0, height);
                shrineGrad.addColorStop(0, '#151210');
                shrineGrad.addColorStop(1, '#0a0908');
                ctx.fillStyle = shrineGrad;
                ctx.fillRect(0, 0, width, height);
                this.drawShrine(ctx, width, height);
                break;
        }
    }

    drawBonfire(ctx, x, y) {
        const flicker = Math.sin(this.time / 100) * 3;
        const scale = 3;

        // Coiled sword
        ctx.fillStyle = '#4a4540';
        ctx.fillRect(x - 2 * scale, y - 50 * scale + flicker, 4 * scale, 50 * scale);
        ctx.fillStyle = '#3a3530';
        ctx.fillRect(x - 1 * scale, y - 45 * scale + flicker, 2 * scale, 40 * scale);

        // Flames
        ctx.fillStyle = `rgba(255, 147, 41, ${0.8 + Math.sin(this.time/50) * 0.2})`;
        ctx.fillRect(x - 10 * scale, y - 20 * scale + flicker, 20 * scale, 16 * scale);
        ctx.fillStyle = `rgba(255, 100, 20, ${0.6 + Math.sin(this.time/70) * 0.2})`;
        ctx.fillRect(x - 8 * scale, y - 28 * scale + flicker, 16 * scale, 12 * scale);
        ctx.fillStyle = `rgba(255, 200, 100, ${0.9 + Math.sin(this.time/30) * 0.1})`;
        ctx.fillRect(x - 5 * scale, y - 14 * scale + flicker, 10 * scale, 8 * scale);

        // Light glow
        const glowGrad = ctx.createRadialGradient(x, y - 10 * scale, 10, x, y - 10 * scale, 120);
        glowGrad.addColorStop(0, 'rgba(255, 147, 41, 0.4)');
        glowGrad.addColorStop(0.5, 'rgba(139, 69, 19, 0.2)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

        // Bones
        ctx.fillStyle = '#5a5550';
        ctx.fillRect(x - 30 * scale, y + 6 * scale, 16 * scale, 4 * scale);
        ctx.fillRect(x + 15 * scale, y + 10 * scale, 14 * scale, 3 * scale);
    }

    drawRuins(ctx, width, height) {
        const scale = 3;
        ctx.fillStyle = '#2a2520';
        // Broken pillars
        ctx.fillRect(20, height - 160, 30 * scale, 160);
        ctx.fillRect(width - 50 * scale, height - 140, 30 * scale, 140);
        // Rubble
        ctx.fillStyle = '#1a1815';
        ctx.fillRect(10, height - 30, 80 * scale, 30);
        ctx.fillRect(width - 90 * scale, height - 25, 70 * scale, 25);
        // Cracks
        ctx.fillStyle = '#151210';
        ctx.fillRect(35, height - 100, 4, 50);
        ctx.fillRect(45, height - 80, 4, 35);
    }

    drawCastle(ctx, width, height) {
        ctx.fillStyle = '#1a1815';
        // Main tower
        ctx.fillRect(width/2 - 50, 30, 100, 130);
        // Battlements
        for (let i = 0; i < 6; i++) {
            ctx.fillRect(width/2 - 45 + i * 18, 15, 12, 20);
        }
        // Side towers
        ctx.fillRect(30, 80, 50, 100);
        ctx.fillRect(width - 80, 70, 50, 110);
        // Ground
        ctx.fillStyle = '#151210';
        ctx.fillRect(0, height - 50, width, 50);
    }

    drawFogGate(ctx, width, height) {
        // Fog swirls
        for (let i = 0; i < 5; i++) {
            const alpha = 0.1 + Math.sin(this.time / 1000 + i) * 0.05;
            ctx.fillStyle = `rgba(200, 200, 220, ${alpha})`;
            const y = height/2 + Math.sin(this.time / 2000 + i * 0.8) * 40;
            const x = width/2 + Math.cos(this.time / 1500 + i * 1.2) * 50;
            ctx.fillRect(x - 60, y - 30, 120, 60);
        }

        // Gate frame
        ctx.fillStyle = '#2a2520';
        ctx.fillRect(40, 50, 25, height - 100);
        ctx.fillRect(width - 65, 50, 25, height - 100);
        ctx.fillRect(40, 35, width - 80, 25);
    }

    drawAbyssParticles(ctx, width, height) {
        // Dark particles rising
        for (let i = 0; i < 12; i++) {
            const alpha = 0.3 + Math.sin(this.time / 1000 + i * 0.5) * 0.2;
            ctx.fillStyle = `rgba(30, 20, 40, ${alpha})`;
            const x = (width/12) * i + Math.sin(this.time / 1000 + i) * 15;
            const y = height - ((this.time / 50 + i * 50) % height);
            ctx.fillRect(x, y, 6, 6);
        }
    }

    drawShrine(ctx, width, height) {
        const scale = 2;
        // Stone shrine structure
        ctx.fillStyle = '#2a2520';
        ctx.fillRect(width/2 - 70, height - 100, 140, 100);
        ctx.fillStyle = '#3a3530';
        ctx.fillRect(width/2 - 60, height - 90, 120, 85);

        // Altar
        ctx.fillStyle = '#4a4540';
        ctx.fillRect(width/2 - 40, height - 60, 80, 15);

        // Candles
        const flicker = Math.sin(this.time / 80);
        ctx.fillStyle = '#5a5550';
        ctx.fillRect(width/2 - 55, height - 80, 8, 20);
        ctx.fillRect(width/2 + 47, height - 80, 8, 20);
        ctx.fillStyle = `rgba(255, 180, 80, ${0.8 + flicker * 0.2})`;
        ctx.fillRect(width/2 - 57, height - 88, 12, 10);
        ctx.fillRect(width/2 + 45, height - 88, 12, 10);
    }

    renderCharacter() {
        const ctx = this.charCtx;
        const width = this.characterCanvas.width;
        const height = this.characterCanvas.height;

        ctx.clearRect(0, 0, width, height);

        // Scale for main display
        spriteRenderer.pixelSize = 6;

        // Calculate breathing offset
        const breathY = Math.round(this.breathOffset);

        // Reaction animation
        let reactionOffset = 0;
        if (this.reactionTime) {
            const elapsed = this.time - this.reactionTime;
            if (elapsed < 300) {
                reactionOffset = Math.sin(elapsed / 30) * 3;
            } else {
                this.reactionTime = null;
            }
        }

        // Center position
        const baseX = 25;
        const baseY = 8 + breathY;

        ctx.save();
        ctx.translate(0, reactionOffset);

        // Draw cape (behind)
        if (this.character.cape !== 'none') {
            spriteRenderer.drawCape(ctx, this.character.cape, baseX, baseY, true);
        }

        // Draw body
        const bodyInfo = spriteRenderer.drawBody(ctx, this.character.skin, this.character.build, breathY);

        // Draw legs
        spriteRenderer.drawLegs(ctx, this.character.legs, baseX, baseY);

        // Draw boots
        spriteRenderer.drawBoots(ctx, this.character.boots, this.character.skin, baseX, baseY);

        // Draw chest armor
        spriteRenderer.drawChest(ctx, this.character.chest, baseX, baseY, bodyInfo.bodyWidth);

        // Draw shield (behind arm)
        if (this.character.shield !== 'none') {
            spriteRenderer.drawShield(ctx, this.character.shield, baseX, baseY);
        }

        // Draw face (if no helm)
        if (this.character.helm === 'none') {
            spriteRenderer.drawFace(ctx, this.character.face, this.character.skin, baseX, baseY);

            // Draw hair (if no helm)
            if (this.character.hair !== 'none') {
                const hairOption = CHARACTER_OPTIONS.hair.find(h => h.id === this.character.hair);
                spriteRenderer.drawHair(ctx, this.character.hair, hairOption?.color || 'black', baseX, baseY);
            }
        }

        // Draw helm
        if (this.character.helm !== 'none') {
            spriteRenderer.drawHelm(ctx, this.character.helm, baseX, baseY);
        }

        // Draw weapon
        if (this.character.weapon !== 'none') {
            spriteRenderer.drawWeapon(ctx, this.character.weapon, baseX, baseY);
        }

        // Draw scars
        if (this.character.scars !== 'none' && this.character.helm === 'none') {
            spriteRenderer.drawScars(ctx, this.character.scars, baseX, baseY);
        }

        // Draw effects
        if (this.character.effects !== 'none') {
            spriteRenderer.drawEffects(ctx, this.character.effects, baseX, baseY, this.time);
        }

        // Draw cape (front clasp)
        if (this.character.cape !== 'none') {
            spriteRenderer.drawCape(ctx, this.character.cape, baseX, baseY, false);
        }

        ctx.restore();
    }

    downloadImage() {
        // Create export canvas combining both layers
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.characterCanvas.width;
        exportCanvas.height = this.characterCanvas.height;
        const exportCtx = exportCanvas.getContext('2d');

        // Draw background then character
        exportCtx.drawImage(this.backgroundCanvas, 0, 0);
        exportCtx.drawImage(this.characterCanvas, 0, 0);

        // Download
        const link = document.createElement('a');
        link.download = 'hollow_warrior.png';
        link.href = exportCanvas.toDataURL('image/png');
        link.click();

        this.showNotification('Image saved to your realm');
    }

    async copyToClipboard() {
        try {
            // Create export canvas
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = this.characterCanvas.width;
            exportCanvas.height = this.characterCanvas.height;
            const exportCtx = exportCanvas.getContext('2d');

            exportCtx.drawImage(this.backgroundCanvas, 0, 0);
            exportCtx.drawImage(this.characterCanvas, 0, 0);

            const blob = await new Promise(resolve => {
                exportCanvas.toBlob(resolve, 'image/png');
            });

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            this.showNotification('Image copied to clipboard');
        } catch (err) {
            this.showNotification('Failed to copy - try downloading');
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.characterCreator = new CharacterCreator();
});
