export interface UnAssignBody {
  selectedDate: Date;
  hotelGuid: string;
  pageNumber: number;
  pageSize: number;
}
export interface PaginationHeaders{
  pageSize: number,
  TotalCount: number,
  CurrentPage: number,
  TotalPages: number,
  HasNext: boolean,
  HasPrevious: boolean
}