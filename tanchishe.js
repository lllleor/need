var sw = 20,
    sh = 20,
    tr = 30,
    td = 30;
var snake = null;
var food = null;
var game = null;

function Square(x, y, classname) {
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;
    this.viewContent = document.createElement("div");
    this.viewContent.className = this.class;
    this.parent = document.getElementById("snakeWrap");
}
Square.prototype.create = function() {
    this.viewContent.style.position = "absolute";
    this.viewContent.style.width = sw + "px";
    this.viewContent.style.height = sh + "px";
    this.viewContent.style.left = this.x + "px";
    this.viewContent.style.top = this.y + "px";
    this.parent.appendChild(this.viewContent);
};
Square.prototype.remove = function() {
    this.parent.removeChild(this.viewContent);
};

function Snake() {
    this.head = null;
    this.tail = null;
    this.pos = [];
    this.directionNum = {
        left: {
            x: -1,
            y: 0,
            rotate: 180 //蛇头旋转
        },
        right: {
            x: 1,
            y: 0,
            rotate: 0
        },
        up: {
            x: 0,
            y: -1,
            rotate: -90
        },
        down: {
            x: 0,
            y: 1,
            rotate: 90
        }
    };
}
Snake.prototype.init = function() {
    var snakeHead = new Square(2, 0, "snakeHead");

    snakeHead.create();
    this.head = snakeHead;
    this.pos.push([2, 0]); //蛇头

    //身体
    var snakeBody1 = new Square(1, 0, "snakeBody");
    snakeBody1.create();
    this.pos.push([1, 0]);

    var snakeBody2 = new Square(0, 0, "snakeBody");
    snakeBody2.create();
    this.tail = snakeBody2;
    this.pos.push([0, 0]);

    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    this.direction = this.directionNum.right;
};

Snake.prototype.getNextPos = function() {
    var nextPos = [
        //走的下个位置
        this.head.x / sw + this.direction.x,
        this.head.y / sh + this.direction.y
    ];

    var selfCollided = false;
    this.pos.forEach(function(value) {
        if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
            selfCollided = true;
        }
    });
    if (selfCollided) {
        console.log("装自己了");
        this.strategies.die.call(this);
        return;
    }
    if (
        nextPos[0] < 0 ||
        nextPos[1] < 0 ||
        nextPos[0] > td - 1 ||
        nextPos[1] > tr - 1
    ) {
        console.log("撞墙了");
        this.strategies.die.call(this);
        return;
    }
    if (food && food.pos[0] == nextPos[0] && food.pos[1] == nextPos[1]) {
        console.log("吃");
        this.strategies.eat.call(this);
        return;
    }
    this.strategies.move.call(this);
};

Snake.prototype.strategies = {
    move: function(format) {
        //新身体
        var newBody = new Square(this.head.x / sw, this.head.y / sh, "snakeBody");
        newBody.next = this.head.next;
        newBody.next.last = newBody;
        newBody.last = null;
        this.head.remove();
        newBody.create();
        //新蛇头
        var newHead = new Square(
            this.head.x / sw + this.direction.x,
            this.head.y / sh + this.direction.y,
            "snakeHead"
        );
        newHead.next = newBody;
        newHead.last = null;
        newBody.last = newHead;
        newHead.viewContent.style.transform =
            "rotate(" + this.direction.rotate + "deg)";
        newHead.create();
        this.pos.splice(0, 0, [
            this.head.x / sw + this.direction.x,
            this.head.y / sh + this.direction.y
        ]);
        this.head = newHead;
        if (!format) {
            this.tail.remove();
            this.tail = this.tail.last;
            this.pos.pop();
        }
    },
    eat: function() {
        this.strategies.move.call(this, true);
        createFood();
        game.score++;
    },
    die: function() {
        game.over();
    }
};

snake = new Snake();

//创建食物
function createFood() {
    var x = null;
    var y = null;
    var include = true;
    while (include) {
        x = Math.round(Math.random() * (td - 1));
        y = Math.round(Math.random() * (tr - 1));
        snake.pos.forEach(function(value) {
            if (x != value[0] && y != value[1]) {
                include = false;
            }
        });
    }
    food = new Square(x, y, "food");
    food.pos = [x, y];
    var foodDom = document.querySelector(".food");
    if (foodDom) {
        foodDom.style.left = x * sw + "px";
        foodDom.style.top = y * sh + "px";
    } else {
        food.create();
    }
}

//创建游戏逻辑
function Game() {
    this.timer = null;
    this.score = 0;
}

Game.prototype.init = function() {
    snake.init();
    createFood();
    document.onkeydown = function(ev) {
        if (ev.which == 37 && snake.direction != snake.directionNum.right) {
            snake.direction = snake.directionNum.left;
        } else if (ev.which == 38 && snake.direction != snake.directionNum.down) {
            snake.direction = snake.directionNum.up;
        } else if (ev.which == 39 && snake.direction != snake.directionNum.left) {
            snake.direction = snake.directionNum.right;
        } else if (ev.which == 40 && snake.direction != snake.directionNum.up) {
            snake.direction = snake.directionNum.down;
        }
    };
    this.start();
};
Game.prototype.start = function() {
    this.timer = setInterval(function() {
        snake.getNextPos();
    }, 200);
};
Game.prototype.pause = function() {
    clearInterval(this.timer);
};
Game.prototype.over = function() {
    clearInterval(this.timer);
    alert("你的得分为" + this.score);
    //初始化；
    var snakeWrap = document.getElementById("snakeWrap");
    snakeWrap.innerHTML = "";
    snake = new Snake();
    game = new Game();
    var startBtnWrap = document.querySelector(".startBtn");
    startBtnWrap.style.display = "block";
};
game = new Game();
var startBtn = document.querySelector(".startBtn button");
startBtn.onclick = function() {
    startBtn.parentNode.style.display = "none";
    game.init();
};

//暂停
var snakeWrap = document.getElementById("snakeWrap");
var pauseBtn = document.querySelector(".pauseBtn button");
snakeWrap.onclick = function() {
    game.pause();

    pauseBtn.parentNode.style.display = "block";
};
pauseBtn.onclick = function() {
    game.start();
    pauseBtn.parentNode.style.display = "none";
};