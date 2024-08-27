/**
 * Tip view manager
 * @author wheatup
 */

import { _decorator, Component, director, Label, Node } from 'cc';
import Events from '../Misc/Events';

const { ccclass, property } = _decorator;

@ccclass
export default class TipView extends Component {
	background: Node = null;
	label: Label = null;

	showing: boolean = false;
	timer = null;

	onLoad() {
		this.background = this.node.getChildByName('BG');
		this.label = this.node.getChildByName('Label').getComponent(Label);
		director.on(Events.TIP, this.onTip, this);
		this.node.on(Node.EventType.TOUCH_START, this.onTouch, this);
		this.node.active = false;
	}

	onDestroy() {
		director.off(Events.TIP, this.onTip, this);
		this.node.off(Node.EventType.TOUCH_START, this.onTouch, this);
	}

	onTouch() {

	}

	onTip(data) {
		if (!data || !data.message) {
			this.hide();
		} else {
			let time = 2000;
			if (data.time !== undefined) {
				time = data.time;
			}
			this.show(data.message, time);
		}
	}

	show(message, time) {
		this.showing = true;
		this.node.active = true;
		this.label.string = message;
		Wheen.stop(this.background);
		new Wheen(this.background).to({ opacity: 180 }, 200).start();

		Wheen.stop(this.label.node);
		new Wheen(this.label.node).to({ opacity: 255 }, 200).start();

		if (this.timer) {
			clearTimeout(this.timer);
		}
		if (time > 0) {
			this.timer = setTimeout(this.hide.bind(this), time);
		}
	}

	hide() {
		this.showing = false;
		Wheen.stop(this.background);
		new Wheen(this.background).to({ opacity: 0 }, 200).start();

		Wheen.stop(this.label.node);
		new Wheen(this.label.node)
			.to({ opacity: 0 }, 200)
			.callFunc(() => {
				this.node.active = false;
			})
			.start();
	}
}
