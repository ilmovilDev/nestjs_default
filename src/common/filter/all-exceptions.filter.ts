import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response, Request } from 'express';
import * as fs from 'fs';

interface HttpExceptionResponse {
    status: number;
    message: string;
}

interface CustomExceptionResponse extends HttpExceptionResponse {
    path: string;
    method: string;
    timeStamp: Date
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter{ 
    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        const { status, message } = this.getErrorResponse(exception);

        const errorResponse: CustomExceptionResponse = { status, message, path: request.url, method: request.method, timeStamp: new Date() };

        const errorLog = this.generateErrorLog(errorResponse, request, exception);
        this.writeErrorLogToFile(errorLog);

        try {
            response.status(status).json(errorResponse);
        } catch (error) {
            console.error("Error while sending JSON response:", error);
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    private getErrorResponse(exception: unknown): { status: number, message: string } {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const errorResponse = exception.getResponse();
            const message = (errorResponse as HttpExceptionResponse)?.message || exception.message;
            return { status, message };
        } else {
            return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Critical internal server error occurred!' };
        }
    }

    private generateErrorLog(errorResponse: CustomExceptionResponse, request: Request, exception: unknown): string {
        const { status, message } = errorResponse;
        const { method, url } = request;
        const stackOrMessage = exception instanceof HttpException ? (exception as HttpException).stack : message;
        return `Response Code: ${status}.\nMethod: ${method}.\nURL: ${url}.\nMessage: ${stackOrMessage}.`;
    }

    private writeErrorLogToFile(errorLog: string): void {
        fs.appendFile('error.log', errorLog, 'utf8', (err) => {
            if (err) {
                console.error("Error while writing to error.log:", err);
            }
        });
    }
    
}