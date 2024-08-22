import { _decorator, Component, Label, Node, randomRangeInt, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GridNode')
export class GridNode extends Component {


    @property({ type: Node })
    alphabet: Node = null;

    @property({ type: SpriteFrame })
    gridSprites: SpriteFrame[] = [];
    positionAdjustment = 20;
    setData(name: string, col, row) {
        this.node.getComponent(Sprite).spriteFrame = this.gridSprites[randomRangeInt(0, 4)]
        this.node.setPosition(
            this.positionAdjustment + col * this.node.getComponent(UITransform).width,
            this.positionAdjustment + row * this.node.getComponent(UITransform).height
        );
        this.alphabet.getComponent(Label).string = name;
    }
}

