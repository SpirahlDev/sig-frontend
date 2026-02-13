export interface IPagination<T> {
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;

    data: T[];
}