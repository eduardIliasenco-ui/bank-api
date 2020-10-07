import { ValueTransformer } from "typeorm";
import * as crypto from 'crypto';

export class PasswordTransformer implements ValueTransformer {
    from(value: string): string {
        return value;
    }

    to(value: string): string {
        return crypto.createHmac('sha256', value).digest('hex');
    }
}