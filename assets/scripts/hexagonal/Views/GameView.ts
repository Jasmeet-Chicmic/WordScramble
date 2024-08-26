/**
 * Game view manager
 * @author wheatup
 */

import { _decorator, Component, director } from 'cc';
import Events from '../Misc/Events';

const { ccclass, property } = _decorator;

@ccclass
export default class GameView extends Component {
	onLoad() {
		director.on(Events.GAME_START, this.onGameStart, this);
		director.on(Events.LOST_CONNECTION, this.hide, this);
		director.on(Events.MAIN_MENU, this.hide, this);
	}

	onDestroy() {
		director.off(Events.GAME_START, this.onGameStart, this);
		director.off(Events.LOST_CONNECTION, this.hide, this);
		director.on(Events.MAIN_MENU, this.hide, this);
	}

	start() {
		this.hide();
	}

	onGameStart() {
		this.node.active = true;
	}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}
}
