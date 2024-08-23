import { _decorator, Color, Component, Label, Node, randomRangeInt, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GridNode')
export class GridNode extends Component {


    @property({ type: Node })
    alphabet: Node = null;

    @property({ type: SpriteFrame })
    gridSprites: SpriteFrame[] = [];

    @property({ type: Node })
    selecdNode = null;
    @property({ type: Node })
    winNode = null;

    positionAdjustment = 20;

    position = { col: 0, row: 0 };
    letter = '';

    whiteColor = new Color("#ffffff")
    blackColor = new Color("#000000")
    protected onLoad(): void {
        // this.node.on(Node.EventType.TOUCH_START, () => {
        //     console.log("grid position", this.position, "Letter", this.letter);

        // })
    }
    setData(name: string, col, row) {
        this.node.getComponent(Sprite).spriteFrame = this.gridSprites[randomRangeInt(0, 4)]
        this.node.setPosition(
            this.positionAdjustment + col * this.node.getComponent(UITransform).width,
            this.positionAdjustment + row * this.node.getComponent(UITransform).height
        );
        this.alphabet.getComponent(Label).string = name;
        this.position.col = col;
        this.position.row = row;
        this.letter = name;
    }

    updateData() {
        this.selecdNode.active = true;
        this.alphabet.getComponent(Label).color = this.whiteColor;
    }

    unselectGrid() {
        this.selecdNode.active = false;
        this.alphabet.getComponent(Label).color = this.blackColor;
    }


    onWin() {
        this.winNode.active = true;
    }
}

