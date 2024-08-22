import { _decorator, Color, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WordName')
export class WordName extends Component {
    private wordId = 0;

    setData(wordName: string, wordId: number) {
        this.node.getComponent(Label).string = wordName;
        this.wordId = wordId;
    }

    onWin() {
        this.node.getComponent(Label).color = new Color("#008000");
    }
}

