export interface GlobalApiResponse{
    message:string;
    success:boolean
}
export interface Sort {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
}
export interface Pageable {
    pageNumber: number,
    pageSize: number,
    sort:Sort,
    offset: number,
    paged: boolean,
    unpaged: boolean
}
export interface IPaginatorGlobal {
    content: any,
    pageable:Pageable,
    last: true,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort:Sort,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}