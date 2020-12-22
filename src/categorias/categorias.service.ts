import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CriarCategoriaDTO } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoreService: JogadoresService
    ) { }
    async criarCategoria(criarCategoriaDTO: CriarCategoriaDTO): Promise<Categoria> {

        const { categoria } = criarCategoriaDTO

        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria })

        if (categoriaEncontrada) throw new BadRequestException(`Categoria ${categoria} já cadastrada.`)

        const categoriaCriada = new this.categoriaModel(criarCategoriaDTO)

        return await categoriaCriada.save();
    }

    async consultarTodasCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find({}).populate('jogadores');
    }
    async consultarCategoriaPeloId(idCategoria: string): Promise<Categoria> {
        const categoriaEncontrada = await this.categoriaModel.findById(idCategoria);
        if (!categoriaEncontrada) throw new NotFoundException(`Categoria não encontrada.`)
        return categoriaEncontrada;
    }

    async atualizarCategoria(idCategoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
        const categoriaEncontrada = await this.categoriaModel.findById(idCategoria);
        if (!categoriaEncontrada) throw new NotFoundException(`Categoria não encontrada.`)

        await this.categoriaModel.findByIdAndUpdate(idCategoria, { $set: { ...atualizarCategoriaDto } })
    }

    async atribuirCategoriaJogador(idCategoria: string, idJogador: string): Promise<void> {
        const categoriaEncontrada = await this.categoriaModel.findById(idCategoria);
        if (!categoriaEncontrada) throw new NotFoundException(`Categoria não encontrada.`);

        const jogadorEncontradoCategoria = await this.categoriaModel.find({ _id: idCategoria })
            .where('jogadores')
            .in([idJogador])

        if (jogadorEncontradoCategoria.length > 0) {
            throw new BadRequestException(`Jogador ${idJogador} já cadastrado na categoria ${idCategoria}.`);
        }

        const jogador = await this.jogadoreService.consultarJogadorPeloId(idJogador)
        categoriaEncontrada.jogadores.push(jogador);

        await this.categoriaModel.findByIdAndUpdate(idCategoria, {
            $set: { ...categoriaEncontrada }
        })
    }

    
}
