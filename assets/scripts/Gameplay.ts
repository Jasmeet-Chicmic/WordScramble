import { _decorator, Component, Node } from 'cc';
import { WordsList } from './WordsList';
import { GameData } from '../constants/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('Gameplay')
export class Gameplay extends Component {

    @property({ type: Node })
    wordsList: Node = null;
    start() {
        this.wordsList.getComponent(WordsList).addWords(GameData.words);
    }

    update(deltaTime: number) {

    }
}

