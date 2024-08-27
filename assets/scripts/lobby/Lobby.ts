import { _decorator, Component, director, Node } from 'cc';
import GameManager from '../hexagonal/Managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends Component {
    protected onLoad(): void {
        director.preloadScene("lobby")
        director.preloadScene("gameplay")
        director.preloadScene("hexGameplay")
    }
    openGameplay() {
        director.loadScene("gameplay");
    }
    openHexGameplay() {

        director.loadScene("hexGameplay", () => {

        });
    }
}

