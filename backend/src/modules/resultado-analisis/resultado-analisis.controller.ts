import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseEnumPipe,
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { diskStorage } from 'multer'; 
import { ResultadoAnalisisService } from './service/resultado-analisis.service';
import { CreateResultadoAnalisisDto } from './dto/create-resultado-analisis.dto';
import { UpdateResultadoAnalisisDto } from './dto/update-resultado-analisis.dto';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const idResultado = req.params.id; 
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split('.').pop();
      cb(null, `${idResultado}-${uniqueSuffix}.${extension}`);
    },
  }),
};


@Controller('resultados-analisis')
export class ResultadoAnalisisController {
  constructor(private readonly service: ResultadoAnalisisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CreateResultadoAnalisisDto) {
    const creado = await this.service.crearResultado(dto);
    return { message: 'Resultado de análisis creado', data: creado };
  }

  // --- NUEVO ENDPOINT PARA SUBIR PDF ---
  @Post(':id/upload-pdf')
  @UseInterceptors(FileInterceptor('file', multerOptions)) 
  @HttpCode(HttpStatus.OK)
  async uploadPdf(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {

    const updated = await this.service.guardarRutaPdf(id, file.filename);
    return {
      message: 'PDF subido y enlazado correctamente',
      data: updated,
    };
  }


  @Get('control/:idControl')
  @HttpCode(HttpStatus.OK)
  async listarPorControl(
    @Param('idControl') idControl: string,
    @Query('tipo', new ParseEnumPipe(['diagnostico', 'puerperio']))
    tipo: 'diagnostico' | 'puerperio',
  ) {
    const data = await this.service.listarPorControl(idControl, tipo);
    return { message: 'Resultados obtenidos', data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtener(@Param('id') id: string) {
    const data = await this.service.obtenerPorId(id);
    return { message: 'Resultado obtenido', data };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async actualizar(
    @Param('id') id: string,
    @Body() dto: UpdateResultadoAnalisisDto,
  ) {
    const updated = await this.service.actualizarResultado(id, dto);
    return { message: 'Resultado actualizado', data: updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    await this.service.eliminarResultado(id);
    return { message: 'Resultado de análisis eliminado' };
  }

  @Get('programa/:idPrograma') 
  @HttpCode(HttpStatus.OK)
  async listarPorPrograma(
    @Param('idPrograma') idPrograma: string,
    @Query('tipo', new ParseEnumPipe(['diagnostico', 'puerperio']))
    tipo: 'diagnostico' | 'puerperio',
  ) {
    const data = await this.service.listarPorPrograma(idPrograma, tipo);
    return { message: 'Resultados por programa obtenidos', data };
  }
}