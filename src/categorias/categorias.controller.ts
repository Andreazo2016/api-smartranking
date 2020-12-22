import { Controller, Body, Post, UsePipes, ValidationPipe, Get, Param, Put } from '@nestjs/common';
import { CriarCategoriaDTO } from './dto/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(
        private readonly categoriaService: CategoriasService
    ) { }
    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(@Body() criarCategoriaDTO: CriarCategoriaDTO): Promise<Categoria> {
        return this.categoriaService.criarCategoria(criarCategoriaDTO)
    }

    @Get()
    async consultarTodasCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaService.consultarTodasCategorias();
    }

    @Get('/:idCategoria')
    async consultarCategoriaPeloId(@Param('idCategoria') idCategoria: string): Promise<Categoria> {
        return await this.categoriaService.consultarCategoriaPeloId(idCategoria)
     }

     @Put('/:idCategoria')
     @UsePipes(ValidationPipe)
     async atualizarCategoria(@Param('idCategoria') idCategoria:string, @Body() atualizarCategoriaDto:AtualizarCategoriaDto):Promise<void>{
         await this.categoriaService.atualizarCategoria(idCategoria,atualizarCategoriaDto);
     }

     @Post('/:idCategoria/jogadores/:idJogador')
     async atribuirCategoriaJogador(@Param() params:string[]):Promise<void>{
         const idCategoria = params['idCategoria'];
         const idJogador = params['idJogador'];
         return await this.categoriaService.atribuirCategoriaJogador(idCategoria,idJogador);

     }
}
