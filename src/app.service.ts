import { Injectable } from '@nestjs/common';

const startDate = new Date();

@Injectable()
export class AppService {
  getHello(): string {
    return `App started at ${startDate.toLocaleString()}`;
  }
}
