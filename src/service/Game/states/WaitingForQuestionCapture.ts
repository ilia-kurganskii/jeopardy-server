import { GameSettings, GameState, GameStatePayload } from "../Game.types";
import { BaseGameState } from "./BaseGameState";
import { getNextRoundOrFinishState, roundWillFinish } from "./helper";
import { ACTIONS_STATES } from "./states.const";
import { WaitingForAnswer } from "./WaitingForAnswer";
import { WaitingForCardSelection } from "./WaitingForCardSelection";

export class WaitingForQuestionCapture extends BaseGameState {
  constructor(statePayload: GameStatePayload, gameSettings: GameSettings) {
    super(
      {
        ...statePayload,
        stateName: ACTIONS_STATES.WAITING_FOR_CAPTURE_QUESTION,
      },
      gameSettings
    );
  }

  captureQuestion(payload: { playerId: number; timestamp?: Date }): GameState {
    const { playerId, timestamp = new Date() } = payload;

    if (this.timeIsOver(timestamp)) {
      return this.waitNextCard();
    }
    return new WaitingForAnswer(
      {
        ...this.gameState,
        answeringPlayerId: playerId,
        questionCaptureAt: new Date(),
      },
      this.gameSettings
    );
  }

  tick(payload: { timestamp?: Date }): GameState {
    const { timestamp } = payload;
    if (!this.timeIsOver(timestamp)) {
      return this.waitNextCard();
    }
    return this;
  }

  private waitNextCard(): GameState {
    const { openedQuestionsIds, selectedQuestionId } = this.gameState;
    const newOpenedCardIds = [...openedQuestionsIds, selectedQuestionId];

    const nextGameState = {
      ...this.gameState,
      openedQuestionsIds: newOpenedCardIds,
    };

    if (roundWillFinish(nextGameState, this.gameSettings)) {
      return getNextRoundOrFinishState(nextGameState, this.gameSettings);
    } else {
      return new WaitingForCardSelection(nextGameState, this.gameSettings);
    }
  }

  private timeIsOver(timestamp: Date): boolean {
    const now = timestamp.getTime();
    return (
      this.gameState.cardSelectionAt?.getTime() +
        this.gameSettings.captureTimeoutMs >
      now
    );
  }
}
