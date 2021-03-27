export interface ScheduledTaskResult<T> {
  duration: number;
  result: T;
}

export abstract class ScheduledTask<T> {
  async execute(): Promise<ScheduledTaskResult<T>> {
    const start = new Date();

    const result = await this.onExecute();

    const duration = new Date().getTime() - start.getTime();

    return {
      duration,
      result
    };
  }

  abstract onExecute(): Promise<T>;
}
