import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { v4 as uuidv4 } from 'uuid';
import { TOKEN_EXPIRATION } from './constants';

@Injectable()
export class TokenService implements OnModuleInit {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async setToken(value: string): Promise<string> {
    const uuid = uuidv4();
    const token = this.tokenRepository.create({ key: uuid, value });
    await this.tokenRepository.save(token);
    return uuid;
  }

  getToken(key: string) {
    return this.tokenRepository.findOne(key);
  }

  getTokenByValue(value: string) {
    return this.tokenRepository.findOne({ where: { value } });
  }

  deleteToken(key: string) {
    return this.tokenRepository.delete(key);
  }

  cleanTokens() {
    return this.tokenRepository.delete({
      createdDate: LessThan(new Date(Date.now() - TOKEN_EXPIRATION)),
    });
  }

  async onModuleInit() {
    const deletion = await this.cleanTokens();
    console.log(deletion);
  }
}
