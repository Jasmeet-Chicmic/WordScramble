import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    start() {
        this.node.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
            const pos = e.getUILocation()
            const position = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
            console.log(Math.floor(position.x / 40), "--",
                Math.floor(position.y / 40),);


        })
    }

    update(deltaTime: number) {

    }
}

