import { Module } from '@nestjs/common';

import { LeadModule } from './lead/lead.module';

@Module({
  imports: [LeadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
