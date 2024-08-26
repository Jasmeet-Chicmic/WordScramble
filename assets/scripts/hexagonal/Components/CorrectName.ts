import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CorrectName')
export class CorrectName extends Component {
    @property(Node)
    nameLabel = null;

    setWord(name: string) {
        this.nameLabel.getComponent(Label).string = name.toUpperCase();
    }
}

