import { HttpErrorResponse } from '@angular/common/http';

export interface IErrorDescription {
  message: string;
  key: string;
}

export class HttpServiceError extends HttpErrorResponse {
  get descriptions(): IErrorDescription[] {
    return this._isFormError ? this._getFormFieldsErrorDescriptions(this) : [this._getSimpleErrorMessage()];
  }

  private get _isFormError(): boolean {
    return Boolean(this.error.violations);
  }

  constructor(e: HttpErrorResponse) {
    super(e);
  }

  private _getSimpleErrorMessage(): IErrorDescription {
    let message: string = `${this.status}: ${this.statusText}`;
    let key: string;

    if (this.error) {
      if (this.error.message) {
        message = this.error.message;
      }

      if (this.error.detail) {
        message = this.error.detail;
      }

      key = this.error.error;
    }

    return { key: key ?? message.replace(/\s/gm, '_').replace(/\W/gm, ''), message };
  }

  private _getFormFieldsErrorDescriptions(error: HttpErrorResponse): IErrorDescription[] {
    const { violations: mainErrors }: { violations: { code: string; message: string }[] } = error.error;
    const result: IErrorDescription[] = [];

    if (mainErrors) {
      mainErrors.forEach((obtainedError: { code: string; message: string }): void => {
        result.push({ key: obtainedError.code, message: obtainedError.message });
      });
    }

    return result;
  }
}
