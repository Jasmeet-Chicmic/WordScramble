/**
 * Draw lines while player connecting hexagons
 * @author wheatup
 */

import { _decorator, Component, director, Graphics, Node } from 'cc';
import Events from '../Misc/Events';

const { ccclass, property } = _decorator;

@ccclass
export default class Line extends Component {
	graphics: Graphics = null;

	onLoad() {
		director.on(Events.CHAIN, this.onChain, this);
		director.on(Events.GAME_START, this.onGameStart, this);
		this.graphics = this.node.getComponent(Graphics);
	}

	onDestroy() {
		director.off(Events.CHAIN, this.onChain, this);
		director.off(Events.GAME_START, this.onGameStart, this);
	}

	onGameStart() {
		this.graphics.clear();
	}

	onChain(chain: Node[]) {
		this.graphics.clear();
		for (let i = 0; i < chain.length; i++) {
			let hex = chain[i];
			if (i === 0) {
				this.graphics.moveTo(hex.getPosition().x, hex.getPosition().y);
			} else {
				this.graphics.lineTo(hex.getPosition().x, hex.getPosition().y);
			}
		}
		this.graphics.stroke();
	}
}
