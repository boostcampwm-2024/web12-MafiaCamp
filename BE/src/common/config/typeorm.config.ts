import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../user/entity/user.entity';
import { GameUserEntity } from '../../game-user/enitity/game.user.entity';
import { GameHistoryEntity } from '../../game/entity/game.history.entity';

export const typeOrmInfo = (configService: ConfigService): DataSourceOptions =>
  ({
    type: 'mysql' as const,
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [],
    synchronize: false,
    logging: true,
  }) as DataSourceOptions;

<<<<<<< HEAD
export const typeOrmInfo = (configService: ConfigService): DataSourceOptions => ({
  type: 'mysql' as const,
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [UserEntity,GameUserEntity,GameHistoryEntity],
  synchronize: false,
  logging: true,
} as DataSourceOptions);

export const typeORMConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
=======
export const typeORMConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
>>>>>>> 2b40faf9d56d73171d4e0358b0af6385e9db852a
  const ormInfo = typeOrmInfo(configService);
  const dataSource = new DataSource(typeOrmInfo(configService));
  await dataSource.initialize();

  addTransactionalDataSource(dataSource);
  return {
    ...ormInfo,
  } as TypeOrmModuleOptions;
};
