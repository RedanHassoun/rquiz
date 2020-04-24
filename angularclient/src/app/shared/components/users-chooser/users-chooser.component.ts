import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ScssStyleService } from './../../services/scss-style.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Service } from './../../factories/paging-strategy-factory';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { User } from './../../models/user';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, AfterContentInit } from '@angular/core';
import { StartLoadingIndicator } from '../../decorators/spinner-decorators';
import { PagingStrategyFactory } from '../../factories/paging-strategy-factory';
import { AppUtil } from '../../util';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-users-chooser',
  templateUrl: './users-chooser.component.html',
  styleUrls: ['./users-chooser.component.scss']
})
export class UsersChooserComponent implements OnInit, OnDestroy, AfterContentInit {
  @Output() selectedUsersChanged: EventEmitter<User[]> = new EventEmitter();
  @Input() public initialUsersList: User[];
  @Input() public showImage = true;
  @Input() public showChoiceList = true;
  @Input() public scrollContainer = null;
  @Input() public includeCurrentUser = true;

  public users: User[] = [];
  public pagingStrategy: PagingDataFetchStrategy;
  public usersForm = new FormControl();
  public selectedUsers: User[] = [];
  public userImageStyle: any = {};
  private currentUser: User;

  constructor(private pagingStrategyFactory: PagingStrategyFactory,
    private authenticationService: AuthenticationService,
    private scssStyleService: ScssStyleService) { }

  @StartLoadingIndicator
  async ngOnInit() {
    this.pagingStrategy = await this.pagingStrategyFactory.createStrategyWithParams(
      Service.User, null);
    this.userImageStyle = {
      width: '20pt',
      height: '20pt'
    };
  }

  async ngAfterContentInit(): Promise<void> {
    this.currentUser = await this.authenticationService.getCurrentUser();
    if (!AppUtil.hasValue(this.initialUsersList)) {
      return;
    }

    for (const user of this.initialUsersList) {
      this.addToSelectedUsers(user);
    }
  }

  public peopleListChanged(newUsers: User[]): void {
    if (this.users && this.users.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }

    const usersToAdd: User[] = newUsers.filter(user => this.canAddToUsersList(user));
    this.users = _.unionWith(this.users, usersToAdd, (user, otherUser) => user.username === otherUser.username);
  }

  @StartLoadingIndicator
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

  ngOnDestroy(): void {
    AppUtil.triggerLoadingIndicatorStop();
    this.selectedUsersChanged.complete();
  }

  public onUserChoiceChange(checkboxData: MatCheckboxChange, user: User): void {
    if (!!checkboxData.checked) {
      this.addToSelectedUsers(user);
    } else {
      this.removeFromSelectedUsers(user);
    }
    this.selectedUsersChanged.emit(this.selectedUsers);
  }

  public addToSelectedUsers(user: User): void {
    if (!this.canAddToUsersList(user)) {
      return;
    }

    for (const currSelectedUser of this.selectedUsers) {
      if (user.id === currSelectedUser.id) {
        return;
      }
    }
    this.selectedUsers.push(user);
  }

  public removeFromSelectedUsers(user: User): void {
    for (const currSelectedUser of this.selectedUsers) {
      if (user.id === currSelectedUser.id) {
        const indexOfELementToDelete = this.selectedUsers.indexOf(currSelectedUser);
        this.selectedUsers.splice(indexOfELementToDelete, 1);
      }
    }
  }

  public isSelected(user: User): boolean {
    for (const currSelectedUser of this.selectedUsers) {
      if (user.id === currSelectedUser.id) {
        return true;
      }
    }

    return false;
  }

  public hasSelectedUsers(): boolean {
    return this.selectedUsers && this.selectedUsers.length > 0;
  }

  public resetSelectedUsers(): void {
    this.selectedUsers = [];
    this.selectedUsersChanged.emit(this.selectedUsers);
  }

  private canAddToUsersList(user: User): boolean {
    return this.includeCurrentUser === true || user.id !== this.currentUser.id;
  }
}
