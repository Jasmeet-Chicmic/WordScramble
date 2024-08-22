import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { WordName } from './WordName';
const { ccclass, property } = _decorator;

@ccclass('WordsList')
export class WordsList extends Component {
    @property({ type: Prefab })
    wordName: Prefab = null;

    @property({ type: Node })
    mainNode: Node = null;

    /**
     * 
     * @param words array of words 
     * @description Add list of words to words list
     */
    addWords(words: string[]) {
        words.forEach((word, index) => {
            const wordNode = instantiate(this.wordName);
            wordNode.getComponent(WordName).setData(word, index)
            this.mainNode.addChild(wordNode);
        })
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

