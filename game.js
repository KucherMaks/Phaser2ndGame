var config = {
    // налаштування вигляду гри
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
    playerSpeed: 500,
    // фізика гри
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var worldWidth = config.width*6;
var lives = 5;

function preload() {
    // передзавантаження хмар, землі, зірочок та бомб, налаштування виду гравця
    // фон
    this.load.image('bg', 'assets/fon+.png');
    
    // платформа літаюча
    this.load.image('ground', 'assets/platform3.png');
    this.load.image('skyGround', 'assets/14.png')
    this.load.image('skyGroundStart', 'assets/13.png')
    this.load.image('skyGroundEnd', 'assets/15.png')

    // земля
    this.load.image('ground++', 'assets/floor 1+.png')

    // трофей
    this.load.image('trophy', 'assets/trophy.png');

    // бомба
    this.load.image('bomb', 'assets/bomb.png');

    // земля під землею
    this.load.image('dirt', 'assets/dirt-wall.png')

    //додаткові об'єкти
    this.load.image('bush', 'assets/bush-1.png')
    this.load.image('crate', 'assets/crate.png')
    this.load.image('rock', 'assets/rock.png')

    this.load.image('reset', 'assets/reset.png')

    // гравець
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

// опис бомбочок
function hitBomb(player, bomb) {
    lives -= 1;
    bomb.disableBody(true, true);
    live.setText('Lives: ' + lives);
}

var platforms;

function create() {
    // тло
    // this.add.image(0, 0, 'bg').setOrigin(0,0);


    // тло на всю ширину екрану
    this.add.tileSprite(0, 0, worldWidth, 1080, "bg")
        .setOrigin(0, 0)
        .setScale(1)
        .setDepth(0);
    
    platforms = this.physics.add.staticGroup();

    // Земля на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + 100) {
        console.log(x);
        platforms.create(x, 1080 - 400, 'ground++')
            .setScale(0.2)
            .setOrigin(0, 0)
            .refreshBody();
    }

    // Земля під землею
    for (var x = 0; x < worldWidth; x = x + 50) {
        console.log(x);
        platforms.create(x, 1080 - 352, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 302, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 252, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 202, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 152, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
    }

    // Додавання платформ випадковим чином на всю ширину екрану
    // for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(400, 500)) {
    //     var y = Phaser.Math.FloatBetween(400, 600);
    //     console.log(x, y);
    //     platforms.create(x, y, 'ground').setDepth(10);
    // }

    for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(400, 500)) {
        var y = Phaser.Math.Between(200, 550)

        platforms.create(x,y, 'skyGroundStart');

        var i;
        for (i = 1; i < Phaser.Math.Between(0,5); i++){
            platforms.create(x + 128 * i, y, 'skyGround').setScale;
        }

        platforms.create(x+128*i, y, 'skyGroundEnd');
    }

    box = this.physics.add.staticGroup();
    // Додавання ящиків випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(100, 300)) {
        var y = 680;
        console.log(x, y);
        box.create(x, y, 'crate').setScale(Phaser.Math.FloatBetween(0.3, 0.6)).setOrigin(0, 1).setDepth(Phaser.Math.FloatBetween(0, 10)).refreshBody();
    }

    bush = this.physics.add.staticGroup();
    // Додавання кущів випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(100, 300)) {
        var y = 680;
        console.log(x, y);
        bush.create(x, y, 'bush').setScale(Phaser.Math.FloatBetween(0.1, 0.4)).setOrigin(0, 1).setDepth(Phaser.Math.FloatBetween(0, 10)).refreshBody();
    }

    rock = this.physics.add.staticGroup();
    // Додавання каменів випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(100, 300)) {
        var y = 680;
        console.log(x, y);
        rock.create(x, y, 'rock').setScale(Phaser.Math.FloatBetween(1, 3)).setOrigin(0, 1).setDepth(Phaser.Math.FloatBetween(0, 10)).refreshBody();
    }

    // про гравця
    player = this.physics.add.sprite(100, 450, 'dude')
        .setDepth(5)
        .setBounce(0.2)
        .setCollideWorldBounds(false);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // коллайдер гравця та платформ
    this.physics.add.collider(player, platforms);

    //  задання управління
    cursors = this.input.keyboard.createCursorKeys();

    // зірочки
    stars = this.physics.add.group({
        key: 'trophy',
        repeat: worldWidth/100,
        setXY: { x: 12, y: 0, stepX: 100 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // коллайдер зірочок та платформ
    this.physics.add.collider(stars, platforms);

    //  стикання колайдера гравця з колайдером зірочок
    this.physics.add.overlap(player, stars, collectStar, null, this);

    //  рахунок
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })
        .setOrigin(0,0)
        .setScrollFactor(0);

    //життя
    live = this.add.text(1700, 16, 'Lives: ' + lives, { fontSize: '32px', fill: '#000'})
        .setOrigin(0,0)
        .setScrollFactor(0);
    
    // бомбочки
    bombs = this.physics.add.group();

    // коллайдер бомбочок і платформ
    this.physics.add.collider(bombs, platforms);

    // коллайдер гравця і бомбочок
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);

    // Слідкування камери за гравцем
    this.cameras.main.startFollow(player);
}

function update() {
    // саме управління
    if (cursors.left.isDown) {
        player.setVelocityX(-config.playerSpeed);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(config.playerSpeed);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

//функція збір зірочок
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    var x = Phaser.Math.Between(0, config.width);
    var y = Phaser.Math.Between(0, 680);
    var bomb = bombs.create(x, y, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
    }
}

// змінні для рахунку
var score = 0;
var scoreText;
var playbtn;


// кінець гри
function end(player) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    const helloButton = this.add.text(700, 400, 'Restart game', {fontSize: 70, fill: '#FFF', backgroundColor: '#111' })
        .on('pointerdown', () => this.scene.restart())
        .setScrollFactor(0)
        .setInteractive();
}