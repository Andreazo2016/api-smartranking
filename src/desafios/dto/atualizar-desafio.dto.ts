import { IsDateString, IsNotEmpty, IsEnum } from "class-validator";
import { DesafioStatus } from "../interface/desafio-status.enum";

export class AtualizarDesafioDto{
    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio:Date;

    @IsEnum(DesafioStatus)
    status:DesafioStatus;
}