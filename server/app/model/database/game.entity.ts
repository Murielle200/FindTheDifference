import { TemporaryGame } from '@app/model/schema/temporary-game';
import { Game as GameInterface } from '@common/model/game';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DuelHighScore } from './duel-highscore.entity';
import { SoloHighScore } from './solo-highscore.entity';


export type ExistingGame = Game & { _id: string };

@Entity()
export class Game extends TemporaryGame implements GameInterface {
    @PrimaryGeneratedColumn('uuid')
    _id!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    originalImageFilename!: string;

    @ApiHideProperty()
    @Column({ nullable: false })
    @Expose({ groups: ['game-session'] })
    modifiedImageFilename!: string;

    @ApiHideProperty()
    @Column({ nullable: false })
    @Exclude()
    differencesFilename!: string;

    @Column({ nullable: false })
    differencesCount!: number;

    @OneToMany((type) => SoloHighScore, (highScore) => highScore.game)
    soloHighScores!: SoloHighScore[];

    @OneToMany((type) => DuelHighScore, (highScore) => highScore.game)
    duelHighScores!: DuelHighScore[];
}
