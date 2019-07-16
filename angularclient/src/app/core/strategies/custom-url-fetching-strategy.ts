import { Observable } from 'rxjs';
import { ClientDataServiceService } from './../../shared/services/client-data-service.service';
import { PagingDataFetchStrategy } from './paging-data-fetch-strategy';

export class CustomUrlFetchingStrategy implements PagingDataFetchStrategy {

    constructor(private dataService: ClientDataServiceService,
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
