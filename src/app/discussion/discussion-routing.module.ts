import { NgModule } from "@angular/core";

import { Routes, RouterModule } from "@angular/router";
import { DiscussionViewContainerComponent } from "./discussion-view-container/discussion-view-container.component";
import { DiscussionDescriptionComponent } from "./discussion-description/discussion-description.component";

const routes: Routes = [
  { path: "discussion-view", component: DiscussionViewContainerComponent },
  {
    path: "discussion-description/:id",
    component: DiscussionDescriptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscussionRoutingModule {}
