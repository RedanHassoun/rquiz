import { ScssStyleService } from './../../services/scss-style.service';
import { AppUtil, ROUTE_NAMES } from '../../util';
import { ImageService } from '../../services/image.service';
import { User } from '../../models/user';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Inject, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit  {
  @Input() public user: User;
  @Input() public showImage = true;
  @Input() public userImageStyle = {};
  @Input() public showUserOnClick = true;

  constructor(private imageService: ImageService,
    private router: Router) { }

  ngOnInit(): void {
  }

  getImageUrl(): string {
    return this.imageService.getImageUrlForUser(this.user);
  }

  showUser(user: User) {
    if (this.showUserOnClick === false) {
      return;
    }

    if (!user) {
      AppUtil.handleNullError('User');
    }

    this.router.navigate([ROUTE_NAMES.PEOPLE_LIST, user.id]);
  }
}
