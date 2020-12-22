import { IsNotEmpty, IsDateString } from "class-validator";

export class CriarDesafioDto {

    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio:Date;

    @IsNotEmpty()
    solicitante:string;

    @IsNotEmpty()
    desafiado:string;

}