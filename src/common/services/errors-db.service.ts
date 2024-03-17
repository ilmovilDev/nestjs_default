import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class DatabaseErrorService {

    private formatErrorMessage = (message: string): string => {
        return `${message}`;
    }
      
    public handleDatabaseExceptions = (error: any): never => {
        console.log("DatabaseErrorService ~ handleDatabaseExceptions ~ error:", error);
        const errorCode = error.code || error.status;

        switch (errorCode) {
            case 23505:
                throw new BadRequestException(this.formatErrorMessage(error.detail));
            default:
                throw new InternalServerErrorException(`An internal error occurred: ${error.message}`);
        }
    }
}
