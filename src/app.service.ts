import { Injectable } from '@nestjs/common';

const startDate = new Date();

@Injectable()
export class AppService {
  getPing() {
    return {
      'start-date': startDate,
      // version,
    };
  }
}
