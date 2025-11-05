import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramaPuerperio } from './model/programa_puerperio.entity';
import { CreateProgramaPuerperioDto } from './dto/create-programa-puerperio.dto';
import { ProgramaPuerperioMapper } from './mapper/programaPuerperio.mapper';

@Injectable()
export class ProgramaPuerperioService {
  constructor(
    @InjectRepository(ProgramaPuerperio)
    private repo: Repository<ProgramaPuerperio>,
  ) {}

  private async generateNextId(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('p')
      .orderBy('p.id_programapuerperio', 'DESC')
      .getOne();
    let next = 1;
    if (last?.id_programapuerperio) {
      const num = parseInt(last.id_programapuerperio.substring(2));
      if (!isNaN(num)) next = num + 1;
    }
    return `PP${next.toString().padStart(4, '0')}`;
  }

  async crearPrograma(dto: CreateProgramaPuerperioDto) {
    const id = await this.generateNextId();
    const entity = ProgramaPuerperioMapper.toEntity(dto, id);
    return await this.repo.save(entity);
  }

  async listarProgramas() {
    return await this.repo.find();
  }

  async obtenerPorId(id: string) {
    const r = await this.repo.findOne({ where: { id_programapuerperio: id } });
    if (!r) throw new NotFoundException('Programa no encontrado');
    return r;
  }

  async actualizarPrograma(id: string, changes: Partial<ProgramaPuerperio>) {
    const found = await this.repo.findOne({ where: { id_programapuerperio: id } });
    if (!found) throw new NotFoundException('Programa no encontrado');
    Object.assign(found, changes);
    return await this.repo.save(found);
  }

  async eliminarPrograma(id: string) {
    const res = await this.repo.delete({ id_programapuerperio: id });
    return res;
  }
}
