/**
 * Hexagon behavior
 * @author wheatup
 */
import { _decorator, Color, Component, easing, Label, Node, randomRangeInt, Sprite, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import PlayerTag from './PlayerTag';

const { ccclass, property } = _decorator;

@ccclass
export default class Hexagon extends Component {
	id: number = null;
	content: string = null;
	column: number = null;
	row: number = null;

	// Color settings
	color: Color = new Color(233, 233, 233, 255);
	normalColor: Color = new Color(233, 233, 233, 255);
	activateColor: Color = new Color(100, 150, 240, 255);
	incorrectColor: Color = new Color(230, 75, 30, 255);
	correctColor: Color = new Color(100, 255, 0, 255);
	opponentColor: Color = new Color(150, 150, 150, 255);

	textColor: Color = new Color(100, 100, 100, 255);
	textNormalColor: Color = new Color(100, 100, 100, 255);
	textActivateColor: Color = new Color(255, 255, 255, 255);
	textIncorrectColor: Color = new Color(255, 255, 255, 255);
	textCorrectColor: Color = new Color(20, 50, 0, 255);

	brightness: number = 1;

	_updatingColor: boolean = false;

	// background: Node = null;

	// label: Label = null;
	activated: boolean = false;

	orgPos: Vec2 = null;
	locked: boolean = false;

	@property(Node)
	background: Node = null;
	@property(Node)
	label: Node = null;
	onLoad() {
		// this.background = this.node.getChildByName('Background');


		// this.label = this.node.getChildByName('Label').getComponent(Label);
	}

	start() {

		this.node.setScale(0, 0, 0);
		tween(this.node).delay(0.3 * Math.random()).to(0.2, { scale: new Vec3(1.1, 1.1, 0) }, { easing: "bounceOut" }).to(0.15, { scale: new Vec3(1, 1, 0) }, { easing: "bounceIn" }).start()
		// new Wheen(this.node)
		// 	.wait(300 * Math.random())
		// 	.to({ scale: 1.1 }, 200, Wheen.Easing.Cubic.easeOut)
		// 	.to({ scale: 1 }, 150, Wheen.Easing.Cubic.easeOut)
		// 	.start();
	}

	setPosition(pos: Vec2) {
		this.node.setPosition(new Vec3(pos.x, pos.y, 0));
		this.orgPos = new Vec2(this.node.getPosition().x, this.node.getPosition().y);
	}

	setId(id: number) {
		this.id = id;
	}

	setColumnAndRow(column: number, row: number) {
		this.column = column;
		this.row = row;
		this.brightness = 1;

		this.color = new Color(this.color.r * this.brightness, this.color.g * this.brightness, this.color.r * this.brightness, 255);
		this.normalColor = new Color(this.normalColor.r * this.brightness, this.normalColor.g * this.brightness, this.normalColor.r * this.brightness, 255);
		this.activateColor = new Color(randomRangeInt(0, 255), randomRangeInt(0, 255), randomRangeInt(0, 255), 255);;
		this.incorrectColor = new Color(255, 0, 0, 255);
		this.correctColor = new Color(this.correctColor.r * this.brightness, this.correctColor.g * this.brightness, this.correctColor.r * this.brightness, 255);

		this.textColor = new Color(this.textColor.r * this.brightness, this.textColor.g * this.brightness, this.textColor.r * this.brightness, 255);
		this.textActivateColor = new Color(this.textActivateColor.r * this.brightness, this.textActivateColor.g * this.brightness, this.textActivateColor.r * this.brightness, 255);
		this.textCorrectColor = new Color(this.textCorrectColor.r * this.brightness, this.textCorrectColor.g * this.brightness, this.textCorrectColor.r * this.brightness, 255);
		this.textIncorrectColor = new Color(this.textIncorrectColor.r * this.brightness, this.textIncorrectColor.g * this.brightness, this.textIncorrectColor.r * this.brightness, 255);
		this.textNormalColor = new Color(this.textNormalColor.r * this.brightness, this.textNormalColor.g * this.brightness, this.textNormalColor.r * this.brightness, 255);

		this.background.getComponent(Sprite).color = this.color;
		this.label.getComponent(Label).color = this.textColor;
	}

	setContent(content: string) {
		this.content = content;
		this.label.getComponent(Label).string = content.toUpperCase();
	}

	update() {
		if (this._updatingColor && this.background) {
			this.background.getComponent(Sprite).color = this.color;
			this.label.getComponent(Label).color = this.textColor;
		}
	}

	activate() {
		if (this.activated || this.locked) return;
		this.activated = true;
		this._updatingColor = true;

		this.node.setScale(new Vec3(1, 1, 0));
		Tween.stopAllByTarget(this.textColor)
		// Wheen.stop(this.textColor);
		tween(this.textColor)
			.to(0.2, { r: this.textActivateColor.r, g: this.textActivateColor.g, b: this.textActivateColor.b })
			.start();

		// Animate background color to the activated color
		tween(this.color)
			.to(0.2, { r: this.activateColor.r, g: this.activateColor.g, b: this.activateColor.b })
			.delay(0.1) // wait 100ms
			.call(() => (this._updatingColor = false))
			.start();
		// Wheen.stop(this.node);
		Tween.stopAllByTarget(this.node)

		tween(this.node)
			.to(0.01, { position: new Vec3(this.orgPos.x, this.orgPos.y + 10, 0) }, { easing: "bounceIn" })
			.to(0.1, { position: new Vec3(this.orgPos.x, this.orgPos.y, 0) }, { easing: "bounceIn" })
			.to(0.1, { position: new Vec3(this.orgPos.x, this.orgPos.y + 2, 0) }, { easing: "bounceIn" })
			.to(0.1, { position: new Vec3(this.orgPos.x, this.orgPos.y, 0) }, { easing: "bounceIn" })
			.start();
	}

	deactivate(success?: boolean, replace?: string, me: boolean = true) {
		this.activated = false;
		this._updatingColor = true;

		if (success === undefined) {

			// Move node to original position
			tween(this.node)
				.to(0.05, { position: new Vec3(this.orgPos.x, this.node.getPosition().y) }, { easing: 'cubicOut' })
				.start();

			Tween.stopAllByTarget(this.textColor)
			// Animate text color using RGB values
			tween(this.textColor)
				.to(0.2, { r: this.textNormalColor.r, g: this.textNormalColor.g, b: this.textNormalColor.b })
				.start();
			Tween.stopAllByTarget(this.color)
			// Animate background color using RGB values
			tween(this.color)
				.to(0.2, { r: this.normalColor.r, g: this.normalColor.g, b: this.normalColor.b })
				.delay(0.05)
				.call(() => (this._updatingColor = false))
				.start();

		} else if (!success) {
			// Shake effect
			tween(this.node)
				.to(0.03, { position: new Vec3(this.orgPos.x - 2, this.node.getPosition().y) }, { easing: 'cubicOut' })
				.to(0.03, { position: new Vec3(this.orgPos.x + 2, this.node.getPosition().y) }, { easing: 'cubicOut' })
				.union()
				.repeat(2)
				.to(0.05, { position: new Vec3(this.orgPos.x, this.node.getPosition().y) }, { easing: 'cubicOut' })
				.start();

			Tween.stopAllByTarget(this.textColor)
			// Animate incorrect text color using RGB values
			tween(this.textColor)
				.to(0.01, { r: this.textIncorrectColor.r, g: this.textIncorrectColor.g, b: this.textIncorrectColor.b })
				.to(0.5, { r: this.textNormalColor.r, g: this.textNormalColor.g, b: this.textNormalColor.b })
				.start();

			Tween.stopAllByTarget(this.color)
			// Animate incorrect background color using RGB values
			tween(this.color)
				.to(0.01, { r: this.incorrectColor.r, g: this.incorrectColor.g, b: this.incorrectColor.b })
				.to(0.5, { r: this.normalColor.r, g: this.normalColor.g, b: this.normalColor.b })
				.delay(0.1)
				.call(() => {
					this._updatingColor = false;
				})
				.start();
		} else {
			this.locked = true;
			this.content = replace;
			this.node.setPosition(new Vec3(this.orgPos.x, this.node.getPosition().y));


			let posMe = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(PlayerTag.me.node.parent.getComponent(UITransform).convertToWorldSpaceAR(PlayerTag.me.node.getPosition()));
			// let posOpponent = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(PlayerTag.opponent.node.parent.getComponent(UITransform).convertToWorldSpaceAR(PlayerTag.opponent.node.getPosition()));
			// let pos = me ? posMe : posOpponent;
			let pos = posMe;
			// Tween the node
			tween(this.node)
				.delay(Math.random() * 0.1)
				.to(0.2, { position: new Vec3(this.node.getPosition().x, this.node.getPosition().y + 10) }, { easing: 'cubicIn' })
				.delay(0.1 + Math.random() * 0.2)
				.to(0.5, { position: new Vec3(pos.x, pos.y, 0), scale: new Vec3(0.5, 0.5, 1) }, { easing: 'cubicOut' })
				.call(() => {
					this.node.scale = new Vec3(0, 0, 1);
					this.label.getComponent(Label).string = this.content;
					this.node.setPosition(new Vec3(this.orgPos.x, this.orgPos.y));
				})
				.to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'cubicOut' })
				.call(() => {
					this.locked = false;
					if (this.activated) {
						// Set the activated color
						this.color = this.activateColor;
						this.textColor = this.textActivateColor;
						this.background.getComponent(Sprite).color = this.color;
						this.label.getComponent(Label).color = this.textColor;
					}
				})
				.start();

			// Correct color animation for 'me' using RGB values
			if (me) {
				Tween.stopAllByTarget(this.textColor)
				tween(this.textColor)
					.to(0.01, { r: this.textCorrectColor.r, g: this.textCorrectColor.g, b: this.textCorrectColor.b })
					.to(0.5, { r: this.textNormalColor.r, g: this.textNormalColor.g, b: this.textNormalColor.b })
					.start();

				Tween.stopAllByTarget(this.color)
				tween(this.color)
					.to(0.01, { r: this.correctColor.r, g: this.correctColor.g, b: this.correctColor.b })
					.to(0.5, { r: this.normalColor.r, g: this.normalColor.g, b: this.normalColor.b })
					.delay(0.1)
					.call(() => (this._updatingColor = false))
					.start();
			} else {
				// Correct color animation for opponent using RGB values
				Tween.stopAllByTarget(this.color)
				tween(this.color)
					.to(0.01, { r: this.opponentColor.r, g: this.opponentColor.g, b: this.opponentColor.b })
					.to(0.5, { r: this.normalColor.r, g: this.normalColor.g, b: this.normalColor.b })
					.delay(0.1)
					.call(() => (this._updatingColor = false))
					.start();
			}
		}
	}


}
