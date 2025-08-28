import { Controller, Get, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('error/500')
  throwInternalError() {
    throw new Error('This is a test internal server error');
  }

  @Get('error/400')
  throwBadRequest() {
    throw new BadRequestException('Invalid request parameters for testing');
  }

  @Get('error/404')
  throwNotFound() {
    throw new HttpException('Test resource not found', HttpStatus.NOT_FOUND);
  }

  @Get('error/custom')
  throwCustomError() {
    throw new HttpException(
      {
        message: 'Custom error with details',
        code: 'CUSTOM_ERROR',
        field: 'testField',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
