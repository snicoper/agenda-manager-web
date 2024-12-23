export interface StateService<T> {
  refresh(): void;
  get(): T | null;
  clean(): void;
}
