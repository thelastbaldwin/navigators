
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameContainer');

var map;
var tileset;
var layer;
var pathfinder;

var cursors;
var sprite;
var marker;
var blocked = false;

var agents = [];

function setupAgents(count){
    for(var i = 0; i < count; i++){0
        agents.push({
            steps: [],
            stepsIndex: 0
        });
    }
}

var mainState = {
    preload: function(){
        game.load.tilemap('desert', 'assets/img/desert.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/img/tmw_desert_spacing.png');
        game.load.image('car', 'assets/img/car90.png');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        map = game.add.tilemap('desert');
        map.addTilesetImage('Desert', 'tiles');
        currentTile = map.getTile(2, 3);
        layer = map.createLayer('Ground');
        layer.resizeWorld();

        var walkables = [30];

        pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        pathfinder.setGrid(map.layers[0].data, walkables);

        sprite = game.add.sprite(450, 80, 'car');
        sprite.anchor.setTo(0.5, 0.5);

        game.physics.enable(sprite);

        game.camera.follow(sprite);

        cursors = game.input.keyboard.createCursorKeys();
        marker = game.add.graphics();
        marker.lineStyle(2, 0x000000, 1);
        marker.drawRect(0, 0, 32, 32);
    },
    update: function() {
        game.physics.arcade.collide(sprite, layer);

        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        sprite.body.angularVelocity = 0;

        if (cursors.left.isDown)
        {
            sprite.body.angularVelocity = -200;
        }
        else if (cursors.right.isDown)
        {
            sprite.body.angularVelocity = 200;
        }

        if (cursors.up.isDown)
        {
            sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(sprite.angle, 300));
        }

        marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
        marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

        if (game.input.mousePointer.isDown)
        {
            blocked = true;
            findPathTo(layer.getTileX(marker.x), layer.getTileY(marker.y));
        }

    },
    render: function(){

    }
}


function findPathTo(tilex, tiley) {

    pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        for(var i = 0, ilen = path.length; i < ilen; i++) {
            console.log(path[i].x, path[i].y);
            map.putTile(46, path[i].x, path[i].y);
        }
        blocked = false;
    });

    pathfinder.preparePathCalculation([0,0], [tilex,tiley]);
    pathfinder.calculatePath();
}

game.state.add('main', mainState);
game.state.start('main');
