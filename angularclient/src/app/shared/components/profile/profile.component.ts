import { WebSocketService } from './../../services/web-socket.service';
import { AppNotificationMessage } from './../../models/app-notification-message';
import { ImageService } from './../../services/image.service';
import { SocketTopics } from '../../util';
import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { NavigationHelperService } from './../../services/navigation-helper.service';
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon';
import { NotFoundError } from './../../app-errors/not-found-error';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user-service.service';
import { AppUtil } from '../../util/app-util';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public isCurrUser: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
    private usersService: UserService,
    private authService: AuthenticationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private navigationService: NavigationHelperService,
    private imageService: ImageService,
    private webSocketService: WebSocketService) {
    this.iconRegistry.addSvgIcon( // TODO: make more general
      'edit',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/edit-24px.svg'));
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe(paramsMap => {
        const userId = paramsMap.get('id');
        if (!userId) {
          AppUtil.handleNullError('User id');
          return;
        }

        this.fetchUser(userId);
      })
    );

    this.subscriptions.push(
      this.webSocketService.onMessage(SocketTopics.TOPIC_USER_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          if (message && message.content) {
            const userId = message.content;
            if (this.user && userId === this.user.id) {
              this.fetchUser(message.content);
            }
          }
        })
    );
  }

  public getUserImageUrl(): string {
    return this.imageService.getImageUrlForUser(this.user);
  }

  private fetchUser(userId: string): void {
    this.subscriptions.push(
      this.usersService.get(userId)
        .subscribe((user: User) => {
          this.recognizeUser(user);
          this.user = user;
        }, (err: Error) => {
          if (err instanceof NotFoundError) {
            AppUtil.showWarningMessage('An error occurred, please login again.');
            this.authService.logout();
            return;
          }
          AppUtil.showWarningMessage('An error occurred');
        })
    );
  }

  async recognizeUser(user: User): Promise<void> {
    const currentUser: User = await this.authService.getCurrentUser();

    if (user.username === currentUser.username) {
      this.isCurrUser = true;
    } else {
      this.isCurrUser = false;
    }
  }

  editDetails(): void {
    this.subscriptions.push(
      this.navigationService.openDialog(EditProfileComponent, null, this.user).subscribe()
    );
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
