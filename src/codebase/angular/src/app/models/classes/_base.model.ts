import { Exclude, Expose, Transform, TransformFnParams } from 'class-transformer';

@Exclude()
export abstract class BaseModel {
  @Expose({ name: '@id' })
  iri: string;
  @Expose()
  id: string;
  @Expose()
  @Transform(({ value }: TransformFnParams): Date => (value ? new Date(value) : null))
  createdAt: Date;
  @Expose()
  @Transform(({ value }: TransformFnParams): Date => (value ? new Date(value) : null))
  date: Date;

  [Symbol.toPrimitive](hint: 'number' | 'string' | 'default') {
    switch (hint) {
      case 'string':
        return this.iri;
      case 'number':
      case 'default':
      default:
        return null;
    }
  }
}
