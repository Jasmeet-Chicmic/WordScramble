import { _decorator, Component, director, Node } from 'cc';
import GameManager from '../hexagonal/Managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends Component {
    openGameplay() {
        director.loadScene("gameplay");
    }
    openHexGameplay() {

        director.loadScene("hexGameplay", () => {
           
        });
    }
}

