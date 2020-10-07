import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  secret: 'secret',
  expirationTime: 1000 * 60 * 60,
}));
