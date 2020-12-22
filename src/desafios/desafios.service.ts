import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Desafio, Partida } from './interface/desafio.interface';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DesafioStatus } from './interface/desafio-status.enum';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dto/atribuir-desafio-partida.dto';

@Injectable()
export class DesafiosService {

    private readonly logger: Logger = new Logger(DesafiosService.name);
    constructor(
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
        private readonly jogadoreService: JogadoresService,
        private readonly categoriaService: CategoriasService,
    ) { }

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        const { solicitante, desafiado, dataHoraDesafio } = criarDesafioDto;

        const jogadorSolicitante = await this.jogadoreService.consultarJogadorPeloId(solicitante);
        const jogadorDesafiado = await this.jogadoreService.consultarJogadorPeloId(desafiado);

        const categorias = await this.categoriaService.consultarTodasCategorias();

        let categoriaSolicitante;
        categorias.map(categoria => {
            const jogadorSolicitanteFilter = categoria.jogadores.filter(jogador => String(jogador._id) === String(jogadorSolicitante._id));
            const jogadorDesafiadoFilter = categoria.jogadores.filter(jogador => String(jogador._id) === String(jogadorDesafiado._id));

            if (jogadorSolicitanteFilter.length === 0) throw new NotFoundException(`Jogador solicitante ${jogadorSolicitante._id} não pertence a nenhuma categoria.`);
            if (jogadorDesafiadoFilter.length === 0) throw new NotFoundException(`Jogador desafiado ${jogadorSolicitante._id} não pertence a nenhuma categoria.`);

            if (jogadorSolicitanteFilter.length > 0) categoriaSolicitante = categoria
        })

        if (!categoriaSolicitante) throw new NotFoundException(`Jogador solicitante ${jogadorSolicitante._id} não pertence a nenhuma categoria.`);

        const newDesafio = new this.desafioModel({
            dataHoraDesafio,
            categoria: categoriaSolicitante,
            status: DesafioStatus.PENDENTE,
            dataHoraSolicitacao: new Date(),
            solicitante: jogadorSolicitante,
            desafiado: jogadorDesafiado,
        });

        await newDesafio.save();

        return newDesafio;
    }

    async consultarTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafioModel.find({})
            .populate('categoria')
            .populate('solicitante')
            .populate('desafiado')
            .populate('partida')
    }

    async consultarDesafioPeloId(id: string): Promise<Desafio> {
        const desafio = await this.desafioModel.findById(id);
        if (!desafio) throw new NotFoundException(`Desafio ${id} não encontrado.`);
        return desafio;
    }

    async consultarDesafiosDeUmJogadorPeloId(id: string) {
        const solicitante = await this.jogadoreService.consultarJogadorPeloId(id);
        return await this.desafioModel.find({ solicitante })
            .populate('categoria')
            .populate('solicitante')
            .populate('desafiado')
    }
    async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
        await this.consultarDesafioPeloId(id);
        await this.desafioModel.findByIdAndUpdate(id, {
            $set: { ...atualizarDesafioDto }
        })
    }

    async atribuirDesafioPartida(idPartida: string, atribuirDesafioPartida: AtribuirDesafioPartidaDto): Promise<void> {
        
        const desafio = await this.consultarDesafioPeloId(idPartida);
        const def = await this.jogadoreService.consultarJogadorPeloId(atribuirDesafioPartida.def)
        const { categoria, solicitante, desafiado, } = desafio
        const partida = new this.partidaModel({
            categoria,
            def,
            jogadores: [solicitante, desafiado],
            resultados: atribuirDesafioPartida.resultados
        })
        await partida.save();

        await this.desafioModel.findByIdAndUpdate({ _id: idPartida }, {
            $set: { partida, status: DesafioStatus.REALIZADO }
        })
    }
}
