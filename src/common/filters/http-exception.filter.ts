import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(AllExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();

        const request = ctx.getRequest();
        
        const response = ctx.getResponse();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ? exception.getResponse() : exception;

        this.logger.error(`Http status: ${status} Error Messaage: ${JSON.stringify(message)}`);

        response.status(status).json({
            timestamps: new Date().toISOString(),
            path: request.url,
            error: message
        });
    }
}