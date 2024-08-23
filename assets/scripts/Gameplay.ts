import { _decorator, Component, director, Node } from 'cc';
import { WordsList } from './WordsList';
import { GameData, GameEvent } from '../constants/GameConfig';
import { CircularLoader } from './circularLoader';
const { ccclass, property } = _decorator;

@ccclass('Gameplay')
export class Gameplay extends Component {

    @property({ type: Node })
    wordsList: Node = null;

    @property({ type: Node })
    loader: Node = null;

    start() {
        this.loader.getComponent(CircularLoader).stopLoader();
        this.wordsList.getComponent(WordsList).addWords(GameData.words);
    }

    playAgain() {
        this.loader.getComponent(CircularLoader).showLoader();
        director.off(GameEvent.ON_SELECT);
        director.loadScene("gameplay", () => {

        })
    }


    update(deltaTime: number) {

    }
}

