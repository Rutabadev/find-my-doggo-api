import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Connection } from 'typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
      url:
        process.env.DATABASE_URL ?? 'postgres://user:pass@localhost:5432/apidb',
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    RolesModule,
    UsersModule,
    ScheduleModule.forRoot(),
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {
    connection.createQueryRunner().dropTable('change_password'); // TODO : remove next commit
  }
}
