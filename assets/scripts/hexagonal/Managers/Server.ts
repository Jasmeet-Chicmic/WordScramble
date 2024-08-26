/**
 * Communicate with server.
 * @author wheatup
 */
import Events from '../Misc/Events';
import Config from './Config';
import Signal from '../Misc/Signal';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Server extends cc.Component {
	static $: Server = null;

	ws: WebSocket = null;
	pid: number = 0;

	onLoad() {
		Server.$ = this;
		director.on(Events.MULTIPLAYER, this.connect, this);

		director.on(Signal.UUID, this.onUUID, this);
		director.on(Signal.JOIN, this.onJoin, this);
		director.on(Signal.MATCH, this.onMatch, this);
		director.on(Signal.LEAVE, this.onLeave, this);
		director.on(Signal.CORRECT, this.onCorrect, this);
		director.on(Signal.WRONG, this.onWrong, this);
		director.on(Signal.RESULT, this.onResult, this);
	}

	onDestroy() {
		director.off(Events.MULTIPLAYER, this.connect, this);
		director.off(Signal.JOIN, this.onJoin, this);
		director.off(Signal.MATCH, this.onMatch, this);
		director.off(Signal.LEAVE, this.onLeave, this);
		director.off(Signal.CORRECT, this.onCorrect, this);
		director.off(Signal.WRONG, this.onWrong, this);
		director.off(Signal.RESULT, this.onResult, this);
	}

	connect() {
		director.emit(Events.TIP, { message: 'Connecting...', time: 0 });
		this.ws = new WebSocket(Config.server);

		this.ws.addEventListener('open', this.onOpen.bind(this));
		this.ws.addEventListener('message', this.onMessage.bind(this));
		this.ws.addEventListener('close', this.onClose.bind(this));
	}

	onOpen() {
		director.emit(Events.TIP);
		cc.log('Connected to the server!');
		this.send(Signal.MATCH, { level: 0 });
	}

	onClose() {
		director.emit(Events.TIP, { message: 'Disconnected from server!' });
		cc.log('Disconnected from the server!');
		this.ws.removeEventListener('open', this.onOpen.bind(this));
		this.ws.removeEventListener('message', this.onMessage.bind(this));
		this.ws.removeEventListener('close', this.onClose.bind(this));
		director.emit(Events.LOST_CONNECTION);
	}

	onMessage({ data }) {
		let pack = JSON.parse(atob(data));
		director.emit(pack.signal, pack.data);
		cc.log('%cRECEIVE:', 'color:#4A3;', pack.signal, pack.data);
	}

	send(signal: string, data?: any) {
		cc.log('%cSENDING:', 'color:#36F;', signal, data);
		this.ws.send(btoa(JSON.stringify({ signal, data })));
	}

	onUUID(uuid: number) {
		this.pid = uuid;
		director.emit(Events.TIP, { message: 'Connected to server!' });
	}

	onJoin(uuid: number) {
		director.emit(Events.TIP, { message: 'Searching for opponents...', time: 0 });
	}

	onMatch({ level, text, time }) {
		director.emit(Events.GAME_START, { online: true, level, text, time });
		director.emit(Events.TIP);
	}

	onLeave(uuid: number) {
		director.emit(Events.TIP, { message: 'Your Opponent has left!' });
	}

	onCorrect({ uuid, ids, word, letters, score }) {
		director.emit(Events.CORRECT, { me: this.pid === uuid, ids, word, letters, score });
	}

	onWrong({ uuid, ids, word }) {
		if (uuid !== this.pid) return;
		director.emit(Events.WRONG, { ids, word });
	}

	onResult({ interrupted, score }) {
		let myScore = 0;
		let theirScore = 0;
		for (let id in score) {
			if (parseInt(id) === this.pid) {
				myScore = score[id].score;
			} else {
				theirScore = score[id].score;
			}
		}
		if (!interrupted) {
			if (myScore > theirScore) {
				director.emit(Events.TIP, { message: 'Winner!' });
			} else if (myScore < theirScore) {
				director.emit(Events.TIP, { message: 'Good effort!' });
			} else {
				director.emit(Events.TIP, { message: 'Draw!' });
			}
		}

		setTimeout(() => {
			director.emit(Events.MAIN_MENU);
		}, 2000);
	}
}
