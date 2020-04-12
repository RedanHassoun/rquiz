import { AppUtil, ROUTE_NAMES } from './../../../shared/util';
import { ImageService } from './../../../shared/services/image.service';
import { User } from './../../../shared/models/user';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {
  @Input() public user: User;

  constructor(private imageService: ImageService,
    private router: Router) { }

  ngOnInit() {
  }

  getImageUrl(): string {
    return this.imageService.getImageUrlForUser(this.user);
  }

  showUser(user: User) {
    if (!user) {
      AppUtil.handleNullError('User');
    }

    this.router.navigate([ROUTE_NAMES.PEOPLE_LIST, user.id]);
  }
}
