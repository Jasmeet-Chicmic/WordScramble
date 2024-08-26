import { _decorator, Component, director, instantiate, Node, Prefab, ScrollView, ScrollViewComponent } from 'cc';
import Events from '../Misc/Events';
import { CorrectName } from './CorrectName';
const { ccclass, property } = _decorator;

@ccclass('SearchWords')
export class SearchWords extends Component {
    @property({ type: Node })
    content = null;
    @property({ type: Node })
    scrollview = null;

    @property({ type: Prefab })
    correctWord: Prefab = null;
    protected onLoad(): void {
        director.on(Events.CORRECT, this.onCorrect, this);
    }
    protected onDestroy(): void {
        director.on(Events.CORRECT, this.onCorrect, this);
    }
    onCorrect({ me, word }) {
        const wordNode = instantiate(this.correctWord);

        wordNode.getComponent(CorrectName).setWord(word);
        this.content.addChild(wordNode);
        this.scrollview.getComponent(ScrollView).scrollToBottom(1)
    }
    update(deltaTime: number) {

    }
}

