import { Service } from './../factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { PagingDataFetchStrategy } from './../../core/strategies/paging-data-fetch-strategy';
import { ClientDataService } from './client-data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private pagingStrategyFactory: PagingStrategyFactory) {
  }

  public async createSearchPageableStrategy(service: Service,
    searchField: string, searchQuery: string): Promise<PagingDataFetchStrategy> {
      const searchQueryValue = `${searchField}:${searchQuery}`;
      const params = new Map<string, string>([['search', searchQueryValue]]);
      return await this.pagingStrategyFactory.createStrategyWithParams(service, params);
  }
}
