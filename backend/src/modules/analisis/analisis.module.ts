import { Module } from '@nestjs/common';
import { AnalisisController } from './analisis.controller';
import { AnalisisService } from './analisis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analisis } from './model/analisis.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Analisis])],
  controllers: [AnalisisController],
  providers: [AnalisisService],
  exports: [AnalisisService]
})
export class AnalisisModule {}
