import { Controller, Body, Post, UsePipes, ValidationPipe, Get, Param, Put } from '@nestjs/common';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { DesafiosService } from './desafios.service';
import { Desafio } from './interface/desafio.interface';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dto/atribuir-desafio-partida.dto';

@Controller('/api/v1/desafios')
export class DesafiosController {

    constructor(
        private readonly desafioService: DesafiosService
    ) { }
    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        return this.desafioService.criarDesafio(criarDesafioDto)
    }

    @Get()
    async consultarTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafioService.consultarTodosDesafios();
    }

    @Get('/:id')
    async consultarDesafiosDeUmJogadorPeloId(@Param('id') id: string) {
        return await this.desafioService.consultarDesafiosDeUmJogadorPeloId(id);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async atualizarDesafio(@Param('id') id: string, @Body() atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
        await this.desafioService.atualizarDesafio(id, atualizarDesafioDto);
    }

    @Post('/:id/partida')
    @UsePipes(ValidationPipe)
    async atribuirDesafioPartida(@Param('id') id: string, @Body() atribuirDesafioPartida: AtribuirDesafioPartidaDto): Promise<void> {
        await this.desafioService.atribuirDesafioPartida(id, atribuirDesafioPartida);
    }
}
