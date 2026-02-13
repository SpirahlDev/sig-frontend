
export interface IResponse<T> {
  data: T;
  status_message?: any;
  status_code?:number;
}