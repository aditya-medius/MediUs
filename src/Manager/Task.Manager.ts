import { Mode, PromiseFunction } from "../Services/Helpers";
import { ErrorHandler, ValidationHandler } from "../Handler";

export class TaskManager<T extends Object> {

  callback: PromiseFunction<T>
  validationHandler: ValidationHandler = new ValidationHandler();

  constructor(cb: PromiseFunction<T>) {
    this.callback = cb;
  }

  execute(...args: any[]): Promise<T> {
    const mode = args.slice(-1)[0]
    if (typeof mode === "string" && mode === Mode.RESPONSE) {
      const [req, res, next, message = "Success"] = args.slice(0, -1)
      return this.manageResponse(req, res, message)
    } else {
      const [message] = args
      return this.manageService(message)
    }
  }

  @ErrorHandler.handleException("service")
  async manageService(successMessage = "Success"): Promise<T> {
    return await this.callback()
  }

  @ErrorHandler.handleException("response")
  async manageResponse(req: any, res: any, successMessage = "Success") {
    return await this.callback();
  }
}