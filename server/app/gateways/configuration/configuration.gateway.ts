import { SocketAuthGuard } from '@app/authentication/ws-jwt-auth.guard';
import { defaultDuelHighScores, defaultSoloHighScores } from '@app/constants/configuration.constants';
import { GATEWAY_CONFIGURATION_OBJECT } from '@app/gateways/gateway.constants';
import { GameService } from '@app/services/game/game.service';
import { WSValidationPipe } from '@app/validation-pipes/web-socket/web-socket.validation-pipe';
import { ConfigurationEvent } from '@common/configuration.events';
import { ModifyGameDto } from '@common/model/dto/modify-game-dto';
import { Injectable, UseGuards, UsePipes } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(GATEWAY_CONFIGURATION_OBJECT)
@Injectable()
@UsePipes(new WSValidationPipe({ transform: true }))
export class ConfigurationGateway {
    @WebSocketServer()
    private server!: Server;
    constructor(private gameService: GameService) {}

    @UseGuards(SocketAuthGuard)
    @SubscribeMessage(ConfigurationEvent.ReinitializeScores)
    async reinitializeScore(@MessageBody() modifyGameDto: ModifyGameDto): Promise<void> {
        await this.gameService.updateGame(modifyGameDto.gameId, false, defaultSoloHighScores);
        await this.gameService.updateGame(modifyGameDto.gameId, true, defaultDuelHighScores);

        this.server.emit(ConfigurationEvent.ReinitializeWasDone);
    }

    @UseGuards(SocketAuthGuard)
    @SubscribeMessage(ConfigurationEvent.ReinitializeAllScores)
    async reinitializeAllScore(): Promise<void> {
        for (const game of await this.gameService.getGames()) {
            await this.gameService.updateGame(game._id, false, defaultSoloHighScores);
            await this.gameService.updateGame(game._id, true, defaultDuelHighScores);
        }

        this.server.emit(ConfigurationEvent.ReinitializeWasDone);
    }
}
