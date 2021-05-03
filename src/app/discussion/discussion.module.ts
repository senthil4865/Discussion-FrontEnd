import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { DiscussionRoutingModule } from "./discussion-routing.module";
import { DiscussionViewContainerComponent } from "./discussion-view-container/discussion-view-container.component";
import { DiscussionViewComponent } from "./discussion-view/discussion-view.component";
import { ToastrModule } from "ngx-toastr";
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatDialogModule,
  MatTabsModule,
  MatCardModule,
  MatPaginatorModule,
} from "@angular/material";

import { DiscussionDescriptionComponent } from "./discussion-description/discussion-description.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
    }),

    DiscussionRoutingModule,
  ],

  entryComponents: [],
  declarations: [
    DiscussionViewContainerComponent,
    DiscussionViewComponent,
    DiscussionDescriptionComponent,
  ],
})
export class DiscussionModule {}
