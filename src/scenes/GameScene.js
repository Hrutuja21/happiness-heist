
import { GAME_WIDTH, GAME_HEIGHT, LEVELS, INITIAL, clamp } from '../gameConfig.js';
import Player from '../entities/Player.js';
import { makeToken } from '../entities/Collectible.js';
import { makeEnemy } from '../entities/Enemy.js';
import {
  overallScore,
  balanceScore,
  stabilityScore,
  mirrorMessage
} from '../systems/scoring.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.levelIndex = 0;
    this.stats = { ...INITIAL };
    this.history = [50];
    this.collected = 0;
    this.levelCollected = 0;
    this.facilityCount = 0;
    this.sukhActions = 0;
    this.hits = 0;
    this.decisions = [];
    this.startedAt = 0;
    this.paused = false;
    this.experiment = false;
    this.participant = '';
  }

  init(data = {}) {
    if (data.level !== undefined) this.levelIndex = data.level;
    if (data.experiment !== undefined) this.experiment = data.experiment;
    if (data.participant !== undefined) this.participant = data.participant;

    if (data.fresh) {
      this.stats = { ...INITIAL };
      this.history = [50];
      this.collected = 0;
      this.levelCollected = 0;
      this.facilityCount = 0;
      this.sukhActions = 0;
      this.hits = 0;
      this.decisions = [];
    }
  }

  create() {
    this.levelCollected = 0;
    this.level = LEVELS[this.levelIndex];
    this.startedAt = this.startedAt || Date.now();
    this.paused = false;

    this.drawWorld();

    this.player = new Player(this, 75, 300);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC,P');

    this.tokens = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.walls = this.physics.add.staticGroup();

    this.spawnLevel();

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.overlap(
      this.player,
      this.tokens,
      (p, t) => this.collect(t)
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      (p, e) => this.hitEnemy(e)
    );

    // Use the Phaser game-level event emitter.
    this.game.events.off('move');
    this.game.events.off('touch-action');

    this.game.events.on('move', v => {
      this.touchVector = v;
    });

    this.game.events.on('touch-action', () => this.action());

    this.touchVector = { x: 0, y: 0 };

    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());
    this.input.keyboard.on('keydown-SPACE', () => this.action());

    this.input.keyboard.on('keydown-ONE', () => this.decision('gadget'));
    this.input.keyboard.on('keydown-TWO', () => this.decision('friend'));
    this.input.keyboard.on('keydown-THREE', () => this.decision('sleep'));
    this.input.keyboard.on('keydown-FOUR', () => this.decision('study'));
    this.input.keyboard.on('keydown-FIVE', () => this.decision('exercise'));
    this.input.keyboard.on('keydown-SIX', () => this.decision('entertainment'));

    this.emitHUD();

    this.game.events.emit('level-start', {
      level: this.levelIndex,
      stats: this.stats
    });
  }

  drawWorld() {
    const [a, b] = this.level.colors;

    this.cameras.main.setBackgroundColor(a);

    const bg = this.add.graphics();

    bg.fillGradientStyle(a, b, b, a, 1)
      .fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    bg.fillStyle(0x16223a, 0.35)
      .fillRect(0, 455, GAME_WIDTH, 145);

    for (let i = 0; i < 7; i++) {
      const x = 65 + i * 145;

      bg.fillStyle(i % 2 ? 0x7895a8 : 0x8ba9a1, 0.2)
        .fillRoundedRect(x, 75, 95, 110, 12);

      bg.fillStyle(0xffd166, 0.6);

      for (let j = 0; j < 3; j++) {
        bg.fillRect(x + 15 + j * 25, 95, 11, 15);
      }
    }

    bg.fillStyle(0xffffff, 0.08)
      .fillRoundedRect(20, 20, 920, 560, 24);

    this.add.text(38, 34, this.level.place, {
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#dce9ff',
      letterSpacing: 3
    }).setDepth(2);

    this.add.text(
      480,
      554,
      'CAMPUS PATH  •  COLLECT THE GLOWING TOKENS  •  REACH THE EXIT',
      {
        fontSize: '11px',
        color: '#d5e3ee'
      }
    ).setOrigin(0.5).setDepth(2);
  }

  spawnLevel() {
    const positions = [
      [190, 155], [325, 395], [470, 190],
      [620, 390], [775, 170], [850, 400],
      [270, 275], [550, 300], [710, 270],
      [400, 470], [120, 465], [830, 300]
    ];

    const items = this.level.items;

    positions.slice(0, this.level.target).forEach((p, i) => {
      const token = makeToken(
        this,
        p[0],
        p[1],
        items[i % items.length],
        i % 3 === 0 ? 'facility' : 'sukh'
      );

      this.tokens.add(token);
    });

    const walls = [
      [275, 250],
      [500, 100],
      [690, 480],
      [150, 330]
    ];

    walls.forEach(([x, y]) => {
      const w = this.add.rectangle(
        x, y, 52, 38, 0x26354d, 0.85
      ).setStrokeStyle(2, 0x91a8bb, 0.55);

      this.physics.add.existing(w, true);
      this.walls.add(w);

      this.add.text(x, y - 1, '▧', {
        fontSize: '18px',
        color: '#b9c9d6'
      }).setOrigin(0.5).setDepth(2);
    });

    for (let i = 0; i < 3; i++) {
      const [x, y] = positions[(i * 3 + 1) % positions.length];
      this.enemies.add(
        makeEnemy(this, x + 40, y + 35, this.level.enemy)
      );
    }

    this.exit = this.add.circle(
      900, 300, 31, 0x6ee7b7, 0.22
    ).setStrokeStyle(3, 0x8fffd2).setDepth(3);

    this.add.text(900, 300, '🚪', {
      fontSize: '30px'
    }).setOrigin(0.5).setDepth(4);

    this.physics.add.existing(this.exit);
    this.exit.body.setCircle(27);

    this.physics.add.overlap(
      this.player,
      this.exit,
      () => this.tryFinish()
    );
  }

  collect(t) {
    if (!t.active) return;

    t.destroy();

    this.collected++;
    this.levelCollected++;

    if (t.kind === 'facility') {
      this.facilityCount++;
      this.stats.suvidha = clamp(this.stats.suvidha + 7);
      this.stats.money = clamp(this.stats.money - 18, 0, 1000);
    } else {
      this.sukhActions++;
      this.stats.sukh = clamp(this.stats.sukh + 8);
      this.stats.stress = clamp(this.stats.stress - 3);
    }

    this.stats.energy = clamp(this.stats.energy - 1);
    this.history.push(this.stats.sukh);

    this.playTone(620, 0.07);
    this.emitHUD();

    this.game.events.emit(
      'toast',
      t.kind === 'facility' ? 'Suvidha +7' : 'Sukh +8'
    );
  }

  hitEnemy(e) {
    if (this.time.now < this.player.invulnerableUntil) return;

    this.player.hurt();

    this.hits++;
    this.stats.health = clamp(this.stats.health - 8);
    this.stats.energy = clamp(this.stats.energy - 7);
    this.stats.stress = clamp(this.stats.stress + 9);
    this.stats.sukh = clamp(this.stats.sukh - 4);

    this.playTone(130, 0.14);
    this.emitHUD();

    this.game.events.emit('toast', 'Ouch! Take a breath.');
  }

  decision(kind) {
    if (this.paused) return;

    const s = this.stats;

    const apply = (key, delta, max = 100) => {
      s[key] = clamp(s[key] + delta, 0, max);
    };

    const choices = {
      gadget: () => {
        apply('suvidha', 20);
        apply('money', -100, 1000);
        apply('sukh', 3);
        apply('stress', 2);
      },

      friend: () => {
        apply('relationships', 15);
        apply('sukh', 12);
        apply('stress', -8);
        apply('energy', -5);
      },

      sleep: () => {
        apply('health', 12);
        apply('energy', 25);
        apply('stress', -10);
        apply('sukh', 5);
      },

      study: () => {
        apply('academic', 15);
        apply('energy', -20);
        apply('stress', 12);
        apply('sukh', -3);
      },

      exercise: () => {
        apply('health', 10);
        apply('stress', -10);
        apply('sukh', 8);
        apply('energy', -10);
      },

      entertainment: () => {
        apply('suvidha', 8);
        apply('money', -50, 1000);
        apply('sukh', 5);

        this.time.delayedCall(7000, () => {
          if (this.stats) {
            this.stats.sukh = clamp(this.stats.sukh - 3);
          }

          this.emitHUD();

          this.game.events.emit(
            'toast',
            'The quick boost faded a little.'
          );
        });
      }
    };

    if (!choices[kind]) return;

    choices[kind]();

    this.decisions.push(kind);
    this.history.push(s.sukh);

    this.playTone(540, 0.08);
    this.emitHUD();

    this.game.events.emit(
      'toast',
      `${kind[0].toUpperCase() + kind.slice(1)} choice recorded`
    );
  }

  action() {
    if (this.paused) return;

    this.stats.sukh = clamp(this.stats.sukh + 5);
    this.stats.stress = clamp(this.stats.stress - 6);
    this.stats.energy = clamp(this.stats.energy + 3);

    this.sukhActions++;
    this.history.push(this.stats.sukh);
    this.decisions.push('Reflection break');

    this.playTone(520, 0.08);
    this.emitHUD();

    this.game.events.emit('toast', 'A mindful pause: Sukh +5');
  }

  update() {
    if (this.paused || !this.player?.active) return;

    let x = 0;
    let y = 0;

    if (this.cursors.left.isDown || this.keys.A.isDown) x--;
    if (this.cursors.right.isDown || this.keys.D.isDown) x++;
    if (this.cursors.up.isDown || this.keys.W.isDown) y--;
    if (this.cursors.down.isDown || this.keys.S.isDown) y++;

    if (this.touchVector.x || this.touchVector.y) {
      x = this.touchVector.x;
      y = this.touchVector.y;
    }

    this.player.move(x, y);

    if (this.player.x > GAME_WIDTH - 25) {
      this.player.x = GAME_WIDTH - 25;
    }
  }

  tryFinish() {
    if (this.levelCollected < this.level.target) {
      this.game.events.emit(
        'toast',
        `Collect ${this.level.target - this.levelCollected} more tokens to unlock the exit.`
      );

      return;
    }

    this.physics.pause();

    const report = this.report();

    this.game.events.emit('mirror', report);
  }

  report() {
    return {
      level: this.levelIndex,
      levelName: this.level.name,
      stats: { ...this.stats },
      collected: this.levelCollected,
      totalCollected: this.collected,
      facilityCount: this.facilityCount,
      sukhActions: this.sukhActions,
      hits: this.hits,
      decisions: [...this.decisions],
      overall: overallScore(this.stats),
      balance: balanceScore(this.stats),
      stability: stabilityScore(this.history),
      message: mirrorMessage(this.stats),
      duration: Math.round((Date.now() - this.startedAt) / 1000)
    };
  }

  nextLevel() {
    this.scene.restart({
      level: this.levelIndex + 1,
      experiment: this.experiment,
      participant: this.participant
    });
  }

  restartLevel() {
    this.scene.restart({
      level: this.levelIndex,
      experiment: this.experiment,
      participant: this.participant
    });
  }

  pauseGame() {
    if (this.paused) return;

    this.paused = true;
    this.physics.pause();

    this.game.events.emit('paused');
  }

  resumeGame() {
    this.paused = false;
    this.physics.resume();

    this.game.events.emit('resumed');
  }

  emitHUD() {
    this.game.events.emit('hud', {
      level: this.levelIndex,
      levelName: this.level.name,
      stats: { ...this.stats },
      collected: this.levelCollected,
      target: this.level.target
    });
  }

  // Use playTone instead of this.sound(), which is a Phaser audio manager property.
  playTone(freq, duration) {
    if (!this.registry.get('soundOn')) return;

    try {
      const ctx = this.game.audioContext ||
        (this.game.audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )());

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.frequency.value = freq;

      g.gain.setValueAtTime(
        0.045 * (this.registry.get('volume') ?? 0.55),
        ctx.currentTime
      );

      g.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
      );

      o.connect(g);
      g.connect(ctx.destination);

      o.start();
      o.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback unavailable:', error);
    }
  }
}
