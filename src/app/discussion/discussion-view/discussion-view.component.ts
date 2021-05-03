import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { MatDialog, PageEvent } from "@angular/material";
import { SocketService } from "./../../socket.service";

@Component({
  selector: "app-discussion-view",
  templateUrl: "./discussion-view.component.html",
  styleUrls: ["./discussion-view.component.css"],
})
export class DiscussionViewComponent {
  events: string[] = [];
  opened: boolean;
  currentView: string = "discussion-view";
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public length: number;
  public topicName: string;
  public currentTopicIdForDiscussion: any;
  public currentTopicId: any;
  public upatetopicName: any;
  public allTopics: any = [];
  public upateDiscussionName: any;
  public subDiscussionName;
  public descriptionUrl;
  public discussionNameEntered: any;
  public Topic: any[] = [];
  public completedCount: any = 0;
  toDoTopic: any[] = [];
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public friendTopicId: any = "";
  pageIndex: number = 0;
  progressSpinner: boolean = false;
  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public dialog: MatDialog,
    public socketService: SocketService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentView = event.url.split("/")[2];
      }
    });
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.getAllTopicByUser(this.userId); //Initially get all the topics by current user
    this.getAllDiscussion(this.pageSize, this.pageIndex);
    this.getUpdatesFromUser();
    this.verifyUserConfirmation();
  }

  //Topicening to page change event and get data according to it
  public getServerData(event?: PageEvent) {
    this.getAllDiscussion(event.pageSize, event.pageIndex);

    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  //FFunction to create a Topic and send notification
  createTopic() {
    if (this.topicName) {
      this.progressSpinner = true;
      const data = {
        topicName: this.topicName,
        topicCreatedBy: this.userId,
        topicModifiedBy: this.userId,
        authToken: Cookie.get("authToken"),
      };
      this.topicName = "";
      if (this.userId != null && this.authToken != null) {
        this.appService.addTopic(data).subscribe(
          (apiResponse) => {
            if (apiResponse.status == 200) {
              this.toastr.success("Topic Created", "Success");
              this.getAllTopicByUser(this.userId);
              this.getAllDiscussion(this.pageSize, this.pageIndex);
            } else {
              this.toastr.info(apiResponse.message, "Update!");
              this.progressSpinner = false;
            }
          },
          (error) => {
            this.progressSpinner = false;
            if (error.status == 400) {
              this.toastr.warning(
                "Topics Failed to Update",
                "Either user or Topic not found"
              );
            } else {
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(["/serverError"]);
            }
          }
        );
      } else {
        this.toastr.info("Missing Authorization Key", "Please login again");
        this.router.navigate(["/user/login"]);
      }
    }
  }

  getAllTopicByUser(userId) {
    if (userId) {
      this.progressSpinner = true;
      this.appService.getAllTopic().subscribe((apiResponse) => {
        console.log(apiResponse, "get all topic");
        if (apiResponse.message == "Invalid Or Expired AuthorizationKey") {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(["/user/login"]);
          this.progressSpinner = false;
        }
        if (apiResponse.status == 200) {
          this.Topic = [];
          apiResponse = apiResponse.data;
          apiResponse.forEach((topic) => {
            this.Topic.push(topic);
          });
          this.progressSpinner = false;
        } else {
          this.Topic = [];
          this.toastr.info("No Topic Found", "Info");
          this.progressSpinner = false;
        }
      });
    }
  }

  addDiscussionUnderTopic(id, TopicId) {
    this.currentTopicIdForDiscussion = id;
    this.currentTopicId = TopicId;
    this.getAllDiscussion(this.pageSize, this.pageIndex);
  }

  addDiscussionContent(value) {
    this.discussionNameEntered = "";
    if (value && this.currentTopicIdForDiscussion) {
      this.progressSpinner = true;
      const data = {
        ownerTopic: this.currentTopicIdForDiscussion,
        discussionName: value,
        discussionDescription: value,
        discussionCreatedBy: this.userId,
        discussionModifiedBy: this.userId,
      };
      if (this.userId != null && this.authToken != null) {
        this.appService.addDiscussion(data).subscribe(
          (apiResponse) => {
            if (apiResponse.status == 200) {
              this.toastr.success("Discussion Added", "Success");
              //For undo action
              let undoAction: any = {
                topicId: this.currentTopicIdForDiscussion,
                discussionId: apiResponse.data.discussionId,
                action: "Discussion Add",
                authToken: this.authToken,
              };

              this.getAllDiscussion(this.pageSize, this.pageIndex);

              this.descriptionUrl = apiResponse.data.discussionId;
            } else {
              this.toastr.info(apiResponse.message, "Update!");
              this.allTopics.length = 0;
              this.progressSpinner = false;
            }
          },
          (error) => {
            this.progressSpinner = false;
            if (error.status == 400) {
              this.toastr.warning(
                "Failed to Add Discussion",
                "Either user or Topic not found"
              );
              this.allTopics.length = 0;
            } else {
              this.progressSpinner = false;
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(["/serverError"]);
            }
          }
        );
      } else {
        this.progressSpinner = false;
        this.toastr.info("Missing Authorization Key", "Please login again");
        this.router.navigate(["/user/login"]);
      }
    }
  }

  getAllDiscussion(pageSize, pageIndex) {
    if (this.currentTopicIdForDiscussion) {
      this.progressSpinner = true;
      this.appService
        .getAllDiscussions(
          pageSize,
          pageIndex,
          this.currentTopicIdForDiscussion
        )
        .subscribe((apiResponse) => {
          if (apiResponse.message == "Invalid Or Expired AuthorizationKey") {
            this.toastr.info("Missing Authorization Key", "Please login again");
            this.router.navigate(["/user/login"]);
            this.progressSpinner = false;
          }

          if ((apiResponse.status = 200)) {
            this.toDoTopic = [];
            this.length = apiResponse["count"];
            this.completedCount = 0;
            if (apiResponse["data"])
              apiResponse["data"].forEach((discussion) => {
                //Add to discussion array
                this.toDoTopic.push(discussion);
              });

            this.progressSpinner = false;
          } else {
            this.toastr.info(apiResponse.message, "Update!");
            this.progressSpinner = false;
          }
        });
    }
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      () => {
        this.socketService.setUser(this.authToken); //in reply to verify user emitting set-user event with authToken as parameter.
      },
      (err) => {
        this.toastr.error(err, "Some error occured");
      }
    ); //end subscribe
  };

  public getUpdatesFromUser = () => {
    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {});
  };

}
