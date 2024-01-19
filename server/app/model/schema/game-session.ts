import { Coordinate } from '@app/model/dto/coordinate.dto';
import { ExistingGame } from '@common/model/game';
import { GuessResult } from '@common/model/guess-result';

export interface PlayerCreationInfo {
    playerId: string;
    username: string;
}

export interface PlayerData {
    username: string;
    differencesFound: number;
    throttleEndTimestamp?: number;
    remainingHints: number;
}

export interface GameSession {
    roomId: string;
    game: ExistingGame;
    differences: Set<string>[];
    startedTime: number;
    players: Map<string, PlayerData>;
    initialTime: number;
    hintPenalty: number;
    differenceFoundBonus: number;

    getWinner: (playerId: string) => string | null;
    isMultiplayer: () => boolean;
    manageClick: (coord: Coordinate, playerId: string) => GuessResult;
    useHintMalus: () => void;
}

export interface TimeLimitedGameSession extends GameSession {
    games: ExistingGame[];
}
