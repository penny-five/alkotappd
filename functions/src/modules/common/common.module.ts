import { Module, Global } from '@nestjs/common';

import { AlkoClient } from '../../clients/alko';
import { DatabaseClient } from '../../clients/database';

@Global()
@Module({
  providers: [AlkoClient, DatabaseClient],
  exports: [AlkoClient, DatabaseClient]
})
export class CommonModule {}
