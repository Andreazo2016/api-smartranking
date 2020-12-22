import { IsNotEmpty } from "class-validator";
import { Resultado } from "../interface/desafio.interface";

export class AtribuirDesafioPartidaDto{
    @IsNotEmpty()
    def:string;

    @IsNotEmpty()
    resultados:Array<Resultado>
}