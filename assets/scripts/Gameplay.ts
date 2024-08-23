import { _decorator, Component, director, Node } from 'cc';
import { WordsList } from './WordsList';
import { GameData, GameEvent } from '../constants/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('Gameplay')
export class Gameplay extends Component {

    @property({ type: Node })
    wordsList: Node = null;



    start() {
        this.wordsList.getComponent(WordsList).addWords(GameData.words);
    }

    playAgain() {
        director.off(GameEvent.ON_SELECT);
        director.loadScene("gameplay")
    }

    update(deltaTime: number) {

    }
}

