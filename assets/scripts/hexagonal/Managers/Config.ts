/**
 * Configuration loader.
 * @author wheatup
 */
import { _decorator, Component, director, JsonAsset } from "cc";
import Events from "../Misc/Events";

const { ccclass, property } = _decorator;

@ccclass
export default class Config extends Component {
	static frequency: any = null;
	static scoreMap: any = null;
	static server: any = null;
	@property({ type: JsonAsset })
	jsonFile = null
	loadConfig() {
		return new Promise((resolve, reject) => {

			resolve(this.jsonFile.json)

		});
	}

	start() {
		director.emit(Events.LOAD_CONFIG);
		let config: any = this.jsonFile.json;
	
		Config.frequency = config.frequency;
		Config.scoreMap = config.scoreMap;
		Config.server = config.server;
		director.emit(Events.LOADED_CONFIG, config);
	}
}
