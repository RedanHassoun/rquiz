import { Observable } from 'rxjs';
import { ClientDataService } from '../../shared/services/client-data.service';
import { PagingDataFetchStrategy } from './paging-data-fetch-strategy';

export class CustomUrlFetchingStrategy implements PagingDataFetchStrategy {

    constructor(private dataService: ClientDataService,
                private url: string,
                private pageSize: number) {
    }

    dataObservable(page: number): Observable<any> {
        return this.dataService.getAllByCustomUrl(this.url, page, this.pageSize);
    }

    getPageSize(): number {
        return this.pageSize;
    }
}
