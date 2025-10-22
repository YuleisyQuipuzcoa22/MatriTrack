import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../enums/RolUsuario';

export const Roles = (...roles: RolUsuario[]) => SetMetadata('roles', roles);