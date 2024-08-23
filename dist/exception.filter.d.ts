import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class TravelExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
