import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager {
    private static _instance: GameManager | null = null;

    public static get Instance() {
      if (!GameManager._instance) {
        GameManager._instance = new GameManager();
      }
      return GameManager._instance;
    }

    
}

