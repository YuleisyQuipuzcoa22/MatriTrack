import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlPuerperio } from './model/control_puerperio.entity';
import { CreateControlPuerperioDto } from './dto/create-control-puerperio.dto';
import { ControlPuerperioMapper } from './mapper/controlPuerperio.mapper';

@Injectable()
export class ControlPuerperioService {
  constructor(
    @InjectRepository(ControlPuerperio)
    private repo: Repository<ControlPuerperio>,
  ) {}

  private async generateNextId(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('c')
      .orderBy('c.id_control_puerperio', 'DESC')
      .getOne();
    let next = 1;
    if (last?.id_control_puerperio) {
      const num = parseInt(last.id_control_puerperio.substring(2));
      if (!isNaN(num)) next = num + 1;
    }
    return `CP${next.toString().padStart(4, '0')}`;
  }

  async crearControl(dto: CreateControlPuerperioDto) {
    const id = await this.generateNextId();
    const entity = ControlPuerperioMapper.toEntity(dto, id);
    return await this.repo.save(entity);
  }

  async listarControles() {
    return await this.repo.find();
  }

  async actualizarControl(id: string, changes: Partial<ControlPuerperio>) {
    const found = await this.repo.findOne({ where: { id_control_puerperio: id } });
    if (!found) throw new NotFoundException('Control no encontrado');
    Object.assign(found, changes);
    return await this.repo.save(found);
  }

  async eliminarControl(id: string) {
    const res = await this.repo.delete({ id_control_puerperio: id });
    return res;
  }

  async obtenerPorId(id: string) {
    const r = await this.repo.findOne({ where: { id_control_puerperio: id } });
    if (!r) throw new NotFoundException('Control no encontrado');
    return r;
  }
}
