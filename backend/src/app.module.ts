// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { HistorialMedicoModule } from './modules/historial-medico/historial-medico.module';
import { Paciente } from './modules/paciente/model/paciente.entity';
import { HistorialMedico } from './modules/historial-medico/model/historial_medico.entity';
import { Usuario } from './modules/usuario/model/usuario.entity';
import { ProgramaDiagnostico } from './modules/programa-diagnostico/model/programa_diagnostico.entity';
import { ProgramaPuerperio } from './modules/programa-puerperio/model/programa_puerperio.entity';
import { ControlDiagnostico } from './modules/control-diagnostico/model/control_diagnostico.entity';
import { ControlPuerperio } from './modules/control-puerperio/model/control_puerperio.entity';
import { Analisis } from './modules/analisis/model/analisis.entity';
import { ResultadoAnalisis } from './modules/resultado-analisis/model/resultado-analisis.entity';
import { ProgramaDiagnosticoModule } from './modules/programa-diagnostico/programa-diagnostico.module';
import { ControlDiagnosticoModule } from './modules/control-diagnostico/control-diagnostico.module';
@Module({
  imports: [
    // 1. PRIMERO: Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. SEGUNDO: Usar las variables con ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
            Paciente,
            HistorialMedico,
            Usuario,
            ProgramaDiagnostico,
            ProgramaPuerperio,
            ControlDiagnostico,
            ControlPuerperio,
            Analisis,
            ResultadoAnalisis
            // Agrega cualquier otra entidad aquí, por ejemplo: Usuario
        ],
        synchronize: true,
        logging: false,
        timezone: '-05:00', 
      }),
      inject: [ConfigService],
    }),

    //AQUI SE DEBEN REGISTRAR LOS MODULOS

    AuthModule,
    UsuarioModule,
    PacienteModule,
    HistorialMedicoModule,
    ProgramaDiagnosticoModule,
    ControlDiagnosticoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
