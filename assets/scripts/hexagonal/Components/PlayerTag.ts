/**
 * Player's tag, name, avartar and score
 * @author wheatup
 */
import { _decorator, Component, director, Label, Node } from "cc";
import Events from "../Misc/Events";

const { ccclass, property } = _decorator;

@ccclass
export default class PlayerTag extends Component {
	nameLabel: Label = null;
	scoreLabel: Label = null;

	static me: PlayerTag = null;
	static opponent: PlayerTag = null;


	@property
	me: boolean = false;
	score: number = 0;

	onLoad() {
		director.on(Events.GAME_START, this.onGameStart, this)
		director.on(Events.CORRECT, this.onCorrect, this)
		this.nameLabel = this.node.getChildByName('Username').getComponent(Label);
		this.scoreLabel = this.node.getChildByName('Score').getComponent(Label);
		if (this.me) {
			PlayerTag.me = this;
		} else {
			PlayerTag.opponent = this;
		}
	}

	onDestroy() {
		director.off(Events.GAME_START, this.onGameStart, this)
		director.off(Events.CORRECT, this.onCorrect, this)
	}

	onGameStart({ online }) {
		this.score = 0;
		if (!this.me && !online) {
			this.node.active = false;
		} else {
			this.node.active = true;
		}
		this.updateScore();
	}

	onCorrect({ me, score }) {
		if (me === this.me) {
			this.score += score;
			this.updateScore();
		}
	}

	updateScore() {
		this.scoreLabel.string = this.score + '';
	}
}
