export class LoggerService {

  info(message: string) {
    console.log(
      `[INFO] ${new Date().toLocaleString()} - ${message}`
    );
  }

  success(message: string) {
    console.log(
      `[SUCCESS] ${new Date().toLocaleString()} - ${message}`
    );
  }

  error(message: string) {
    console.error(
      `[ERROR] ${new Date().toLocaleString()} - ${message}`
    );
  }

}