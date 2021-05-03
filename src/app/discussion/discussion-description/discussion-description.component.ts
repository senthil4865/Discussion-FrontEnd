import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import * as io from "socket.io-client";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";

import { SocketService } from "../../socket.service";
import { PageEvent } from "@angular/material";
import { Location } from "@angular/common";

@Component({
  selector: "app-discussion-description",
  templateUrl: "./discussion-description.component.html",
  styleUrls: ["./discussion-description.component.css"],
  providers: [SocketService],
})
export class DiscussionDescriptionComponent {
  /* User Details */
  socket;
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public allTopics: any = [];
  public idofDiscussion: string;
  public discussionforDescription: any;
  public descriptionEmpty: boolean = false;
  comments: any[] = [];

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService,
    private location: Location
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.idofDiscussion = event.url.split("/")[3];
        if (this.idofDiscussion) {
          this.getDiscussionDescription(this.idofDiscussion);
          this.descriptionEmpty = false;
        } else if (this.idofDiscussion === "undefined") {
          this.descriptionEmpty = true;
        } else if (this.idofDiscussion == "") {
          this.descriptionEmpty = true;
        }
      }
    });
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.appService
      .getDiscussionDetail(this.idofDiscussion)
      .subscribe((apiResponse: any) => {
        console.log(apiResponse, "final");
        if (apiResponse) {
          this.comments = [];
          console.log(apiResponse, "final");

          apiResponse.forEach((data) => {
            data.comments.forEach((commentData) => {
              this.comments.push(commentData);
            });
          });
        }
      });
  }

  getDiscussionDescription(id) {
    this.appService.getDiscussionDetail(id).subscribe((data) => {
      this.discussionforDescription = data[0];
    });
  }

  public goBack() {
    this.location.back();
  }

  addComment() {
    var text: any = document.getElementById("preContent").innerText;
    console.log(text);
    text = text.replace(/^\s+/, "").replace(/\s+$/, "");
    if (text != " " && this.idofDiscussion) {
      const obj = {
        id: this.idofDiscussion,
        commentedBy: this.userName,
        comment: text,
      };

      this.appService.addComment(obj).subscribe((apiResponse) => {
        console.log(apiResponse, "response");
        if (apiResponse.status == 200) {
          this.appService
            .getDiscussionDetail(this.idofDiscussion)
            .subscribe((apiResponse) => {
              if (apiResponse) {
                this.comments = [];
                apiResponse.forEach((data) => {
                  data.comments.forEach((commentData) => {
                    this.comments.push(commentData);
                  });
                });
              }
            });
        }
      });
    }
  }
}
