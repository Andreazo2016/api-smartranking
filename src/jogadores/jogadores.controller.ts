import { Controller, Post, Body, Get, Param, Query, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { JogadorValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(
        private readonly jogadoresService: JogadoresService
    ) { }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        const jogadores = await this.jogadoresService.consultarJogadores();
        return jogadores;
    }

    @Get('/by-email')
    async consultarJogadorPorEmail(@Query('email', JogadorValidacaoParametrosPipe) email: string) {
        try {
            return this.jogadoresService.consultarJogadorPorEmail(email);
        } catch (error) {
            return error;
        }
    }

    @Get('/:id')
    async consultarJogadorPeloId(@Param('id') id: string) {
        return this.jogadoresService.consultarJogadorPeloId(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadoresService.criarJogador(criarJogadorDto);
    }

    @Put('/:id')
    async atualizarJogador(@Param('id') id: string, @Body() atualizarJogadorDto: AtualizarJogadorDto): Promise<Jogador> {
        return await this.jogadoresService.atualizarJogador(id, atualizarJogadorDto);
    }


    @Delete()
    async deletarJogador(@Query('email', JogadorValidacaoParametrosPipe) email: string) {
        this.jogadoresService.deletarJogador(email);
    }
}
