import { DeepPartial } from "typeorm";
import { GameEntity } from "../entity/Game";
import { GameStateEntry } from "../entity/GameState";
import { PlayerEntry } from "../entity/Player";
import { QuizEntity } from "../entity/Quiz";
import {
  DEFAULT_SETTINGS,
  GameSettings,
  GameStatePayload,
} from "../service/Game";

export function serviceGameStateToEntryGameState(
  serviceState: GameStatePayload
): DeepPartial<GameStateEntry> {
  return {
    answeredPlayerIds: serviceState.answeredPlayerIds,
    answeringPlayerId: serviceState.answeringPlayerId,
    cardSelectionAt: serviceState.cardSelectionAt,
    currentPlayerId: serviceState.currentPlayerId,
    currentRoundId: serviceState.currentRoundId,
    openedQuestionsIds: serviceState.openedQuestionsIds,
    questionCaptureAt: serviceState.questionCaptureAt,
    selectedQuestionId: serviceState.selectedQuestionId,
    stateName: serviceState.stateName,
  };
}

export function toServiceGameState(payload: {
  entryGameState: GameStateEntry;
  players: PlayerEntry[];
}): GameStatePayload {
  const { entryGameState, players } = payload;
  return {
    answeredPlayerIds: entryGameState.answeredPlayerIds,
    answeringPlayerId: entryGameState.answeringPlayerId,
    cardSelectionAt: entryGameState.cardSelectionAt
      ? new Date(entryGameState.cardSelectionAt)
      : null,
    currentPlayerId: entryGameState.currentPlayerId,
    currentRoundId: entryGameState.currentRoundId,
    openedQuestionsIds: entryGameState.openedQuestionsIds,
    questionCaptureAt: entryGameState.questionCaptureAt
      ? new Date(entryGameState.questionCaptureAt)
      : null,
    selectedQuestionId: entryGameState.selectedQuestionId,
    stateName: entryGameState.stateName,
    playerScores: players.map((player) => ({
      score: player.score,
      playerId: player.userId,
    })),
  };
}

export function toGameSettings(payload: {
  game: GameEntity;
  quiz: QuizEntity;
  players: PlayerEntry[];
}): GameSettings {
  const { game, players, quiz } = payload;
  return {
    rounds: quiz.rounds,
    playerIds: players.map(({ userId }) => userId),
    creatorPlayerId: game.creatorUserId,
    captureTimeoutMs: DEFAULT_SETTINGS.ANSWER_TIMEOUT,
  };
}
