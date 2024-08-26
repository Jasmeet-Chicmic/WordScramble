/**
 * Menu view manager
 * @author wheatup
 */

import Events from '../Misc/Events';
import GameManager from '../Managers/GameManager';
import { _decorator, Button, Component, director, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass
export default class MenuView extends Component {
	@property(Node)
	btnOffline: Node = null;

	@property(Node)
	btnOnline: Node = null;

	onLoad() {

		// this.btnOffline.on(Node.EventType.TOUCH_END, this.onClickPlayOffline, this);
		// this.btnOnline.on(Node.EventType.TOUCH_END, this.onClickPlayOnline, this);
		director.on(Events.GAME_READY, this.onGameReady, this);
		director.on(Events.GAME_START, this.hide, this);
		director.on(Events.LOST_CONNECTION, this.show, this);
		director.on(Events.MAIN_MENU, this.show, this);

	}

	onDestroy() {
		// this.btnOffline.off(Node.EventType.TOUCH_END, this.onClickPlayOffline, this);
		// this.btnOnline.off(Node.EventType.TOUCH_END, this.onClickPlayOnline, this);
		director.off(Events.GAME_READY, this.onGameReady, this);
		director.off(Events.GAME_START, this.hide, this);
		director.off(Events.LOST_CONNECTION, this.show, this);
		director.off(Events.MAIN_MENU, this.show, this);
	}

	start() {
		this.node.active = true;
		// this.btnOffline.getComponent(Button).interactable = false;
		// this.btnOnline.getComponent(Button).interactable = false;
		GameManager.$.playOffline();

	}

	onClickPlayOffline() {
		if (!this.btnOffline.getComponent(Button).interactable) return;
		GameManager.$.playOffline();
	}

	onClickPlayOnline() {
		if (!this.btnOnline.getComponent(Button).interactable) return;
		GameManager.$.playOnline();
	}

	onGameStart() {
		this.hide();
	}

	onGameReady() {
		this.btnOffline.getComponent(Button).interactable = true;
		this.btnOnline.getComponent(Button).interactable = true;
	}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	back() {

		director.loadScene("lobby")
	}
}
