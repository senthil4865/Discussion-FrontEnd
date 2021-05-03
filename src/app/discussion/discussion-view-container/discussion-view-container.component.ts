import { Component} from "@angular/core";
import { SocketService } from "../../socket.service";


@Component({
  selector: "app-discussion-view-container",
  templateUrl: "./discussion-view-container.component.html",
  styleUrls: ["./discussion-view-container.component.css"],
  providers: [SocketService],
})
export class DiscussionViewContainerComponent {
  constructor() {}

  ngOnInit() {}
}
