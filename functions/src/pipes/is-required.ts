import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class IsRequiredPipe implements PipeTransform {
  private allowEmpty: boolean;

  constructor(params?: { allowEmpty: boolean }) {
    this.allowEmpty = params?.allowEmpty ?? false;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (this.isValid(value)) {
      return value;
    }

    throw new BadRequestException(null, IsRequiredPipe.buildErrorMessage(metadata));
  }

  private isValid(value: any) {
    if (value === null) return false;
    if (typeof value === 'string') return this.allowEmpty || value.length > 0;
    if (typeof value === 'object') return this.allowEmpty || Object.keys(value).length > 0;
    return true;
  }

  private static buildErrorMessage(metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      return `Query parameter "${metadata.data}" is required`;
    }

    throw new Error(`Type not supported: ${metadata.type}`);
  }
}
