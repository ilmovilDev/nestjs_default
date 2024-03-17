import { DynamicModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Environment } from "src/common/enum/environment.enum";
import { ConnectOptions } from "typeorm";

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
        const isDevelopmentEnv = config.get("NODE_ENV") !== Environment.Production;

        const dbConfig = {
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: Number( config.get<number>('DB_PORT') ),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_DATABASE'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: isDevelopmentEnv,
        } as ConnectOptions;

        return dbConfig;
    }
})