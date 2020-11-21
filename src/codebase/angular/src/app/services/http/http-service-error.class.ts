import { HttpErrorResponse } from '@angular/common/http';

export interface IErrorDescription {
  message: string;
  key: string;
}

export class HttpServiceError extends HttpErrorResponse {
  constructor(e: HttpErrorResponse) {
    super(e);
  }

  private get isFormError(): boolean {
    return Boolean(this.error.fields || this.error.errors);
  }

  get descriptions(): IErrorDescription[] {
    return this.isFormError ? this.getFormFieldsErrorDescriptions(this) : [this.getSimpleErrorMessage()];
  }

  private getSimpleErrorMessage(): IErrorDescription {
    let message: string = `${this.status}: ${this.statusText}`;
    let key: string;

    if (this.error) {
      if (this.error.error_description) {
        message = this.error.error_description;
      }

      if (this.error.error_message) {
        message = this.error.error_message;
      }

      if (this.error.message) {
        message = this.error.message;
      }

      key = this.error.error;
    }

    return { key: key ?? message.replace(/\s/gm, '_').replace(/\W/gm, ''), message };
  }

  private getFormFieldsErrorDescriptions(error: HttpErrorResponse): IErrorDescription[] {
    const { fields }: { fields: { errors: { error: string; description: string } } } = error.error;
    const { errors: mainErrors }: { errors: { error: string; description: string }[] } = error.error;
    const result: IErrorDescription[] = [];

    if (fields) {
      Object.keys(fields).forEach((fieldName: string): void => {
        const { errors }: { errors: { error: string; description: string }[] } = fields[fieldName];
        const descriptions: IErrorDescription[] = this.getFormFieldsErrorDescriptions({
          error: fields[fieldName]
        } as HttpErrorResponse);

        if (!errors) {
          result.push(...descriptions);
        }

        (errors ?? []).map(({ error: key, description: message }: { error: string; description: string }): void => {
          result.push({ key, message });
        });
      });
    }

    if (mainErrors) {
      mainErrors.forEach((obtainedError: { error: string; description: string }): void => {
        result.push({ key: obtainedError.error, message: obtainedError.description });
      });
    }

    return result;
  }
}
