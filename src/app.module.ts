import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nestUser:nestpassword@cluster0.ndiry.mongodb.net/smartranking?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    }),
    JogadoresModule,
    CategoriasModule,
    DesafiosModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
