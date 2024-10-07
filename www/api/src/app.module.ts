import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { ConfigModule } from '@nestjs/config';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        CacheModule.registerAsync({
            useFactory: async () => ({
                store: await redisStore({
                    ttl: 604800 * 1000, // 1 semana
                    socket: { host: 'ccr-redis', port: 6379 },
                }),
            }),
            isGlobal: true,
        }),

        GithubModule,
        ChatgptModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
