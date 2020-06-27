export interface IPagedResult {
    currentPage: number;
    totalRecords: number;
    data: any[];
    resultPerPage: number;
}

export interface IPagedQuery {
    page: number;
    itemsPerPage: number;
    search: string;
}

export interface ISortable {
    field: string;
    order: number;
}
  