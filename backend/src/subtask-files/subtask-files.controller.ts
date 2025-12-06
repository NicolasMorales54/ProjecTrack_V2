import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { SubtaskFilesService } from './subtask-files.service';

// Configuración de multer para almacenamiento de archivos de subtareas
const storage = diskStorage({
  destination: (req, file, cb) => {
    const subtaskId = req.params.subtaskId;
    const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'subtasks',
      subtaskId,
    );

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new HttpException(
        'Tipo de archivo no permitido. Solo se aceptan: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};

@Controller('subtask-files')
export class SubtaskFilesController {
  constructor(private readonly subtaskFilesService: SubtaskFilesService) {}

  @Post('upload/:subtaskId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
    }),
  )
  async uploadFile(
    @Param('subtaskId') subtaskId: string,
    @UploadedFile() file: any,
    @Request() req,
  ) {
    if (!file) {
      throw new HttpException(
        'No se proporcionó ningún archivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Obtener tipo de archivo
    const ext = path.extname(file.originalname).toLowerCase();
    let tipo = 'documento';
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      tipo = 'imagen';
    } else if (ext === '.pdf') {
      tipo = 'pdf';
    }

    // Crear registro en BD
    const relativePath = path.join(
      'uploads',
      'subtasks',
      subtaskId,
      file.filename,
    );

    const subtaskFile = await this.subtaskFilesService.create({
      subtaskId: parseInt(subtaskId),
      nombre: file.originalname,
      ruta: relativePath,
      tipo,
      tamano: file.size,
      uploadedById: req.user?.userId || null,
    });

    return {
      message: 'Archivo subido exitosamente',
      file: subtaskFile,
    };
  }

  @Get('subtask/:subtaskId')
  async findBySubtaskId(@Param('subtaskId') subtaskId: string) {
    return await this.subtaskFilesService.findBySubtaskId(
      parseInt(subtaskId),
    );
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.subtaskFilesService.findOne(parseInt(id));
    const filePath = await this.subtaskFilesService.getFilePath(parseInt(id));

    if (!fs.existsSync(filePath)) {
      throw new HttpException(
        'Archivo no encontrado en el servidor',
        HttpStatus.NOT_FOUND,
      );
    }

    res.download(filePath, file.nombre);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.subtaskFilesService.remove(parseInt(id));
    return { message: 'Archivo eliminado exitosamente' };
  }
}
