import { Module } from '@nestjs/common';
import { DatabaseErrorService } from './services/errors-db.service';

@Module({
    providers: [
        DatabaseErrorService
    ],
    exports: [
        DatabaseErrorService
    ]
})
export class CommonModule {}
