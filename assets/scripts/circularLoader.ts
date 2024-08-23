import { _decorator, Component, Node, Label, Animation, Vec3, Widget, native } from 'cc';
const { ccclass, property } = _decorator;

export enum LoaderType {
  FULL_SCREEN = 'Full_Screen',
  ONLY_MESSAGE = 'ONLY_MESSAGE',
}

/**
 * @title PopUp class
 * @author Harbinger_singh
 * @notice this class manages the popUps.
 */
@ccclass('CircularLoader')
export class CircularLoader extends Component {
  //Properties
  @property(Label) message: Label = null!;

  @property(Node) circle: Node = null!;

  /**
   * @en
   * Use startTimer to start the timer,
   * It will end automatically and calls callback function on time over
   * @param msgString  Message to be displayed on the PopUp
   * @param func  The callback function which will be called on cross buttons callback.
   */
  showLoader(type: LoaderType = LoaderType.FULL_SCREEN, msgString: string = "LOADING....") {
    switch (type) {
      case LoaderType.FULL_SCREEN: {
        this.circle.active = true;
        break;
      }
      case LoaderType.ONLY_MESSAGE: {
        this.circle.active = false;
        break;
      }
    }
    this.node.active = true;
    this.message.string = msgString;
    this.circle.active && this.circle.getComponent(Animation).play();
  }

  stopLoader() {
    this.node.active = false;
    this.circle.getComponent(Animation).stop();
  }


}
