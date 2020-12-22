import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema({
    telefoneCelular: { type: String },
    email: { type: String, unique: true },
    name:String,
    ranking:String,
    posicaoRanking:Number,
    urlFotoJogador:String,
},{
    timestamps:true,
    collection:'jogadores'
})