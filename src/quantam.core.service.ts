import { Injectable } from '@nestjs/common';

@Injectable()
export class QuantamCoreService {
    getQuantamCoreStatus(): Record<string, string> {
        return {
            status: "OK",
            message: 'Quantam Core is up!'
        };
    }
}
