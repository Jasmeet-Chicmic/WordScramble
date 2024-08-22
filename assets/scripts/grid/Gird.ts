import { _decorator, Component, director, Game, instantiate, Node, Prefab, UITransform, Vec2, Vec3 } from 'cc';
import { GameData } from '../../constants/GameConfig';
import { GridNode } from './GridNode';
const { ccclass, property } = _decorator;

@ccclass('Gird')
export class Gird extends Component {
    @property({ type: Prefab })
    gridNode: Node = null;

    @property({ type: Node })
    gameOverNode = null;

    matrix = []
    MATRIX_ROW_MAX = GameData.gridSizeRow;
    MATRIX_COL_MAX = GameData.gridSizeCol;
    touchCancle = false;
    protected onLoad(): void {
        this.gameOverNode.active = false;
        this.node.on(Node.EventType.TOUCH_START, (e) => {

            this.onTouchBegan(e);
        })
        this.node.on(Node.EventType.TOUCH_MOVE, (e) => {

            this.onTouchMoved(e);
        })
        this.node.on(Node.EventType.TOUCH_END, (e) => {

            this.onTouchEnded();
        })
        this.node.on(Node.EventType.TOUCH_CANCEL, (e) => {
            this.clearHighlight()

        })

    }
    isGameOver = false;
    selectFrom = null;
    found = 0
    selected = []
    getItems(rowFrom, colFrom, rowTo, colTo) {
        var items = [];

        if (
            rowFrom === rowTo ||
            colFrom === colTo ||
            Math.abs(rowTo - rowFrom) == Math.abs(colTo - colFrom)
        ) {
            var shiftY = rowFrom === rowTo ? 0 : rowTo > rowFrom ? 1 : -1,
                shiftX = colFrom === colTo ? 0 : colTo > colFrom ? 1 : -1,
                row = rowFrom,
                col = colFrom;

            items.push(this.getItem(row, col));
            do {
                row += shiftY;
                col += shiftX;
                items.push(this.getItem(row, col));
            } while (row !== rowTo || col !== colTo);
        }
        // console.log("Items", items);

        return items;
    }

    getItem(row, col) {
        return this.matrix[row] ? this.matrix[row][col] : undefined;
    }
    clearHighlight() {

        for (var i = 0; i < this.selected.length; i++) {

            let current = this.selected[i]
            if (current) {
                let row = current?.row
                let col = current?.col;

                this.matrix[row][col].node.getComponent(GridNode).unselectGrid()
            }
            //   var boxSprite = this.getChildByTag(this.matrix[row][col].boxTag);
            //   boxSprite.setTexture(
            //     cc.Sprite.create(this.matrix[row][col].boxSpriteName).getTexture()
            //   );

            //   var alphabetLabel = boxSprite.getChildByTag(this.matrix[row][col].boxTag);
            //   alphabetLabel.setColor(new cc.Color3B(0, 0, 0));
        }

    }
    onTouchMoved(touch) {
        if (this.selectFrom) {
            this.clearHighlight();
            var grid = this.calculateGridNumber(touch);
            this.selected = this.getItems(
                this.selectFrom.row,
                this.selectFrom.col,
                grid.y,
                grid.x
            );

            // console.log("Select", this.selected);
            for (var i = 0; i < this.selected.length; i++) {
                var current = this.selected[i];
                if (current) {
                    let row = current.row;
                    let col = current.col;



                    this.matrix[row][col].node.getComponent(GridNode).updateData()

                }// var boxSprite = this.getChildByTag(this.matrix[row][col].boxTag);
                // boxSprite.setTexture(cc.Sprite.create(s_SelectedBox).getTexture());

                // var alphabetLabel = boxSprite.getChildByTag(
                //   this.matrix[row][col].boxTag
                // );
                // alphabetLabel.setColor(new cc.Color3B(255, 255, 255));


            }

        }
    }
    lookup(selected) {
        var words = [""];

        for (var i = 0; i < selected.length; i++) {
            words[0] += selected[i].letter;
        }
        words.push(words[0].split("").reverse().join(""));

        if (
            GameData.words.indexOf(words[0]) > -1 ||
            GameData.words.indexOf(words[1]) > -1
        ) {
            this.found++;
            for (var i = 0; i < selected.length; i++) {
                var row = selected[i].row,
                    col = selected[i].col;
                this.matrix[row][col].node.getComponent(GridNode).onWin()
                // var boxSprite   = this.getChildByTag(this.matrix[row][col].boxTag);
                // boxSprite.setTexture(cc.Sprite.create(s_CorrectBox).getTexture());
                // this.matrix[row][col].boxSpriteName = s_CorrectBox;

                // var alphabetLabel = boxSprite.getChildByTag(
                //   this.matrix[row][col].boxTag
                // );
                // alphabetLabel.setColor(new cc.Color3B(0, 0, 0));

                var wordIndex;
                if (GameData.words.indexOf(words[0]) > -1) {
                    wordIndex = GameData.words.indexOf(words[0]);
                } else if (GameData.words.indexOf(words[1]) > -1) {
                    wordIndex = GameData.words.indexOf(words[1]);
                }
                console.log(wordIndex);
                director.emit("onWin", wordIndex)
                // var answerLabel = this.getChildByTag(answerLabelTag + wordIndex);
                // //                answerLabel.setOpacity(0.8);
                // answerLabel.setColor(new cc.Color3B(0, 255, 0));


            }
        }
    }
    onTouchEnded() {
        this.selectFrom = null;
        this.clearHighlight();
        this.lookup(this.selected);
        this.selected = [];

        if (GameData.words.length === this.found) {
            console.log("Game Over");
            this.gameOverNode.active = true
            // this.addGameOver();
        }
    }
    calculateGridNumber(touch) {
        var touchLocation = touch.getUILocation();
        const position = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchLocation.x, touchLocation.y, 0));
        var grid = new Vec2(Math.floor((position.x) / 40), Math.floor((position.y) / 40))
        return grid;
    }
    onTouchBegan(touch) {

        if (!this.isGameOver) {
            var grid = this.calculateGridNumber(touch);
            // console.log(grid);
            // console.log(this.matrix);
            //change y with x
            this.selectFrom = this.matrix[grid.y][grid.x];
        }

    }
    protected start(): void {
        var isWorked = false;
        while (isWorked == false) {
            // initialize the application
            this.initMatrix();

            isWorked = this.addWords();
        }
        if (!GameData.debug) {
            this.fillUpFools();
        }
        this.addGridNodes();


    }
    fillUpFools() {
        for (var row = 0; row < GameData.gridSizeRow; row++) {
            for (var col = 0; col < GameData.gridSizeCol; col++) {
                if (this.matrix[row][col].letter == ".") {
                    // Math.rangeInt(65, 90) => A ~ Z
                    this.matrix[row][col].letter = String.fromCharCode(
                        this.getRandomInt(65, 90)
                    );
                }
            }
        }
    }

    addGridNodes() {
        for (let row = 0; row < this.MATRIX_ROW_MAX; row++) {
            for (let col = 0; col < this.MATRIX_COL_MAX; col++) {
                const gridNode = instantiate(this.gridNode)
                this.matrix[row][col].node = gridNode;
                gridNode.getComponent(GridNode).setData(this.matrix[row][col].letter.toUpperCase(), col, row);
                this.node.addChild(gridNode)
            }
        }
    }
    getRandomInt(min, max?) {
        if (max == undefined) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    initMatrix() {
        for (var row = 0; row < this.MATRIX_ROW_MAX; row++) {
            for (var col = 0; col < this.MATRIX_COL_MAX; col++) {
                var item = {
                    letter: '.', // Default value
                    row: row,
                    col: col,
                    boxTag: -1,
                    boxSpriteName: ".",
                    node: null
                }
                if (!this.matrix[row]) {
                    this.matrix[row] = [];
                }

                this.matrix[row][col] = item;
            }
        }


    }

    addWords() {
        var keepGoing = true,
            counter = 0,
            isWorked = true;

        while (keepGoing) {
            // Getting random direction
            var dir = GameData.directions[this.getRandomInt(GameData.directions.length - 1)],
                result = this.addWord(GameData.words[counter], dir),
                isWorked = true;

            if (result == false) {
                keepGoing = false;
                isWorked = false;
            }

            counter++;
            if (counter >= GameData.words.length) {
                keepGoing = false;
            }
        }

        return isWorked;
    }


    addWord(word, direction) {
        var itWorked = true,
            directions = {
                'W': [0, 1], // Horizontal (From left to right)
                'N': [1, 0], // Vertical (From top to bottom)
                'WN': [1, 1], // From top left to bottom right
                'EN': [1, -1] // From top right to bottom left
            },
            row, col; // y, x

        switch (direction) {
            case 'W': // Horizontal (From left to right)
                var row = this.getRandomInt(GameData.gridSizeRow - 1),
                    col = this.getRandomInt(GameData.gridSizeCol - word.length);
                break;

            case 'N': // Vertical (From top to bottom)
                var row = this.getRandomInt(GameData.gridSizeRow - word.length),
                    col = this.getRandomInt(GameData.gridSizeCol - 1);
                break;

            case 'WN': // From top left to bottom right
                var row = this.getRandomInt(GameData.gridSizeRow - word.length),
                    col = this.getRandomInt(GameData.gridSizeCol - word.length);
                break;

            case 'EN': // From top right to bottom left
                var row = this.getRandomInt(GameData.gridSizeRow - word.length),
                    col = this.getRandomInt(word.length - 1, GameData.gridSizeCol - 1);
                break;

            default:
                var error = 'UNKNOWN DIRECTION ' + direction + '!';
                alert(error);
                console.log(error);
                break;
        }

        // Add words to the matrix
        for (var i = 0; i < word.length; i++) {
            var newRow = row + i * directions[direction][0],
                newCol = col + i * directions[direction][1];
            // The letter on the board
            var origin = this.matrix[newRow][newCol].letter;

            if (origin == '.' || origin == word[i]) {
                this.matrix[newRow][newCol].letter = word[i];
            } else {
                itWorked = false;
            }
        }




        return itWorked;
    }
}

