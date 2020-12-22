import {  IsString, IsNotEmpty, IsArray, ArrayMinSize } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class CriarCategoriaDTO{
    @IsString()
    @IsNotEmpty()
    readonly categoria:string;

    @IsString()
    @IsNotEmpty()
    readonly descricao:string;


    @IsArray()
    @ArrayMinSize(1)
    eventos:Array<Evento>
}