import {Document} from 'mongoose';
import { DesafioStatus } from './desafio-status.enum';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

export interface Desafio extends Document{
    dataHoraDesafio:Date;
    status:DesafioStatus;
    dataHoraSolicitacao:Date;
    dataHoraResposta:Date;
    solicitante:Jogador;
    desafiado:Jogador;
    categoria:Categoria;
    partida:Partida;

}

export interface Partida extends Document{
    categoria:Categoria;
    jogadores:Array<Jogador>;
    def:Jogador;
    resultados:Array<Resultado>;
}

export interface Resultado{
    set:String;
}