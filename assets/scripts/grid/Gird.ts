import { _decorator, Component, Game, instantiate, Node, Prefab } from 'cc';
import { GameData } from '../../constants/GameConfig';
import { GridNode } from './GridNode';
const { ccclass, property } = _decorator;

@ccclass('Gird')
export class Gird extends Component {
    @property({ type: Prefab })
    gridNode: Node = null;

    matrix = []
    MATRIX_ROW_MAX = GameData.gridSizeRow;
    MATRIX_COL_MAX = GameData.gridSizeCol;


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
                    boxSpriteName: "."
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

