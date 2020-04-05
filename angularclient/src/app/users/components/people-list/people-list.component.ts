import { Service } from './../../../shared/factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { User } from './../../../shared/models/user';
import { UserService } from './../../../core/services/user-service.service';
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  users: User[] = [];
  pagingStrategy: PagingDataFetchStrategy;

  constructor(private userService: UserService, private pagingStrategyFactory: PagingStrategyFactory) { }

  async ngOnInit() {
    this.pagingStrategy = await this.pagingStrategyFactory.createStrategyWithParams(
      Service.User, null);
  }

  public peopleListChanged(newUsers: User[]): void {
    if (this.users && this.users.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }

    this.users = _.unionWith(this.users, newUsers, (user, otherUser) => user.username === otherUser.username );
  }

  public async searchQueryChanged(searchQuery: string): Promise<void> {
    this.users = [];
    if (!searchQuery || searchQuery === '') {
      this.pagingStrategy = await this.pagingStrategyFactory.createStrategyWithParams(
        Service.User, null);
      return;
    }

    this.pagingStrategy = await this.pagingStrategyFactory.createSearchPageableStrategy(
      Service.User, User.SEARCHABLE_FIELD_USERNAME, searchQuery);
  }
}
