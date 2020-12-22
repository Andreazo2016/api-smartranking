import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {


    constructor(
        @InjectModel('Jogador') private readonly JogadorModel: Model<Jogador>) { }

    //private readonly logger = new Logger(JogadoresService.name);

    async consultarJogadores(): Promise<Jogador[]> {
        return await this.JogadorModel.find({})
    }
    async consultarJogadorPorEmail(email: string): Promise<Jogador> {
        const jogador = await this.JogadorModel.findOne({ email });
        if (!jogador) throw new NotFoundException(`Jogador com e-mail ${email} não encontrado.`)
        return jogador;
    }

    async consultarJogadorPeloId(id: string): Promise<Jogador> {
        const jogador = await this.JogadorModel.findById(id)
        if (!jogador) throw new NotFoundException(`Jogador com id ${id} não encontrado.`)
        return jogador;
    }

    async criarJogador(criarAtualizarJogador: CriarJogadorDto): Promise<Jogador> {
        const { email } = criarAtualizarJogador;
        const jogadorEncontrado = await this.JogadorModel.findOne({ email });
        if (jogadorEncontrado) throw new BadRequestException(`User already exists`);
        return this.criar(criarAtualizarJogador);
    }

    async atualizarJogador(id: string, atualizarJogador: AtualizarJogadorDto): Promise<Jogador> {
        const jogadorEncontrado = await this.JogadorModel.findOne({ _id: id });
        if (!jogadorEncontrado) throw new NotFoundException(`Jogador com id ${id} não encontrado.`)
        return this.atualizar(id, atualizarJogador);

    }

    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.JogadorModel(criarJogadorDto);
        return await jogadorCriado.save()
    }

    private async atualizar(id: string, atualizarJogador: AtualizarJogadorDto): Promise<Jogador> {
        return await this.JogadorModel.findOneAndUpdate({
            _id: id
        }, {
            $set: { ...atualizarJogador }
        }, {
            new: true
        })
    }

    async deletarJogador(email: string): Promise<void> {
        await this.JogadorModel.findOneAndDelete({ email })
    }
}
