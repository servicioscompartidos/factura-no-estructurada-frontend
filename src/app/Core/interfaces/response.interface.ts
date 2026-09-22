export interface Response<T = any> {
    statusCode: number;
    title: string;
    message: string;
    success: boolean;
    data: T;
}
