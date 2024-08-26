/**
 * Control the footer of the game
 * Display the realtime word, and the words both players got
 * @author wheatup
 */

import Hexagon from "./Hexagon";
import Events from "../Misc/Events";
import { _decorator, Component, director, Label, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class Footer extends Component {
	label: Label = null;
	leftLabel: Label = null;
	rightLabel: Label = null;

	onLoad() {
		this.label = this.node.getChildByName('Label').getComponent(Label);
		this.leftLabel = this.node.getChildByName('LeftLabel').getComponent(Label);
		this.rightLabel = this.node.getChildByName('RightLabel').getComponent(Label);
		director.on(Events.GAME_START, this.onGameStart, this);
		director.on(Events.CHAIN, this.onChain, this);
		director.on(Events.CORRECT, this.onCorrect, this);
	}

	onDestroy() {
		director.off(Events.GAME_START, this.onGameStart, this);
		director.off(Events.CHAIN, this.onChain, this);
		director.off(Events.CORRECT, this.onCorrect, this);
	}

	onCorrect({ me, word }) {
		let label = me ? this.rightLabel : this.rightLabel;
		// label.string = word + '\n' + label.string;
	}

	onGameStart() {
		let text = '';
		this.label.string = text;
		this.leftLabel.string = '';
		this.rightLabel.string = '';
	}

	onChain(chain: Node[]) {
		let text = '';
		chain.forEach(hexagon => text += hexagon.getComponent(Hexagon).content);
		this.label.string = text;
	}
}
