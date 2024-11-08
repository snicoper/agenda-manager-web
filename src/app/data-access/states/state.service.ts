export interface StateService<T> {
  refresh(): void;
  get(): T;
  clean(): void;
}
