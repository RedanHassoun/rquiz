import { Observable } from 'rxjs';

export interface PagingDataFetchStrategy {
    dataObservable(page: number): Observable<any>;
    getPageSize(): number;
}
