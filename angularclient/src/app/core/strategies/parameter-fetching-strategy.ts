import { Observable } from 'rxjs';
import { ClientDataService } from '../../shared/services/client-data.service';
import { PagingDataFetchStrategy } from './paging-data-fetch-strategy';

export class ParameterFetchingStrategy implements PagingDataFetchStrategy {

    constructor(private dataService: ClientDataService,
        private paramMap: Map<string, string>,
        private pageSize: number) {
    }

    dataObservable(page: number): Observable<any> {
        return this.dataService.getAllByParameter(this.paramMap, page, this.pageSize);
    }

    getPageSize(): number {
        return this.pageSize;
    }
}
