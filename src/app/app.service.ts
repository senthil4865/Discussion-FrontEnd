import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies/ng2-cookies";

@Injectable({
  providedIn: "root"
})
export class AppService {
  public baseUrl = "http://localhost:3000/api/v1";

  public userFriends: any = [];

  constructor(private _http: HttpClient) {
   
  }

  public signUp(data): Observable<any> {
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("mobileNumber", data.mobileNumber)
      .set("email", data.email)
      .set("password", data.password)
      .set("countryName", data.countryName)
     
    return this._http.post(`${this.baseUrl}/users/signup`, params);
  } //end signUp

  public signIn(data): Observable<any> {
    const params = new HttpParams()
      .set("email", data.email)
      .set("password", data.password);

    return this._http.post(`${this.baseUrl}/users/login`, params);
  } //end signIn

  public getCountryNames(): Observable<any> {
    return this._http.get("./../assets/countryNames.json");
  } //end getCountryNames

  public getCountryNumbers(): Observable<any> {
    return this._http.get("./../assets/countryPhoneCodes.json");
  } //end getCountryNumbers

  public setUserInfoInLocalStorage = data => {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }; //end of setlocalstorage Function

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
  }; //end getlocalstorage function

  public verifyEmail(userId): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this._http.put(`${this.baseUrl}/users/verifyEmail`, params);
  } //end verifyEmail

  public logout(userId, authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);

    return this._http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  }

  public addComment(data): Observable<any> {
    const params = new HttpParams()
       .set("id", data.id)
      .set("commentedBy", data.commentedBy)
      .set("comment", data.comment)
    return this._http.post(`${this.baseUrl}/discussion/addComment`, params);
  }

  public addDiscussion(data): Observable<any> {
    const params = new HttpParams()
      .set("ownerTopic", data.ownerTopic)
      .set("discussionName", data.discussionName)
      .set("discussionDescription", data.discussionDescription)
      .set("discussionCreatedBy", data.discussionCreatedBy)
      .set("discussionModifiedBy", data.discussionModifiedBy)
    return this._http.post(`${this.baseUrl}/discussion/addDiscussion`, params);
  }





  public addSubDiscussion(data): Observable<any> {
    const params = new HttpParams()
      .set("ownerDiscussion", data.ownerDiscussion)
      .set("subDiscussionName", data.subDiscussionName)
      .set("subDiscussionCreatedBy", data.subdiscussionCreatedBy)
      .set("subDiscussionModifiedBy", data.subdiscussionModifiedBy);

    return this._http.post(
      `${this.baseUrl}/discussion/${data.ownerDiscussion}/addSubDiscussion`,
      params
    );
  }

  public getAllDiscussions(pageSize, pageIndex, id): any {
    return this._http.get(
      `${
        this.baseUrl
      }/discussion/${id}/getAllDiscussions?pageSize=${pageSize}&pageIndex=${pageIndex}&authToken=${Cookie.get(
        "authToken"
      )}`
    );
  }

  public getAllUsers(authToken): any {
    return this._http.get(
      `${this.baseUrl}/users/view/all?authToken=${authToken}`
    );
  }
  public getAllDiscussionsByTopicId(dataforSubDiscussionDelete): any {
    return this._http.get(
      `${this.baseUrl}/discussion/${
        dataforSubDiscussionDelete.TopicId
      }/getTopicById?authToken=${Cookie.get("authToken")}`
    );
  }

  public sendFriendRequest(friendRequest): any {
    const params = new HttpParams()
      .set("senderId", friendRequest.senderId)
      .set("senderName", friendRequest.senderName)
      .set("receiverId", friendRequest.receiverId)
      .set("receiverName", friendRequest.receiverName)
      .set("authToken", friendRequest.authToken);
    return this._http.post(
      `${this.baseUrl}/friends/send/friend/request`,
      params
    );
  }
  
  public rejectFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('receiverId',data.receiverId)
      .set('receiverName',data.receiverName)
      .set('authToken',data.authToken)
    
    return this._http.post(`${this.baseUrl}/friends/reject/friend/request`, params);
  }

  public getRequestsReceived(userId, authToken): any {
    return this._http.get(
      `${this.baseUrl}/friends/view/friend/request/received/${userId}?authToken=${authToken}`
    );
  }

  public getRequestsSent(userId, authToken): any {
    return this._http.get(
      `${this.baseUrl}/friends/view/friend/request/sent/${userId}?authToken=${authToken}`
    );
  }

  public cancelRequest(data): any {
    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("receiverId", data.receiverId)
      .set("receiverName", data.receiverName)
      .set("authToken", data.authToken);

    return this._http.post(
      `${this.baseUrl}/friends/cancel/friend/request`,
      params
    );
  }

  public acceptRequest(data): any {
    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("receiverId", data.receiverId)
      .set("receiverName", data.receiverName)
      .set("authToken", data.authToken);

    return this._http.post(
      `${this.baseUrl}/friends/accept/friend/request`,
      params
    );
  }

  public getUserDetails(userId, authToken): Observable<any> {
    return this._http.get(
      `${this.baseUrl}/users/${userId}/details?authToken=${authToken}`
    );
  }

  public unFriendRequest(data): any {
    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("receiverId", data.receiverId)
      .set("receiverName", data.receiverName)
      .set("authToken", data.authToken);

    return this._http.post(`${this.baseUrl}/friends/unfriend/user`, params);
  }

  public getAllFriendsTopic(userId): any {
    return this._http.get(
      `${this.baseUrl}/topics/${userId}?authToken=${Cookie.get("authToken")}`
    );
  }

  public changeCompleteState(checkedState, discussionId): any {
    const params = new HttpParams()
      .set("discussionId", discussionId)
      .set("checkedState", checkedState);

    return this._http.post(`${this.baseUrl}/discussion/changeCompleteState`, params);
  }
  //changeCompleteStateSubDiscussion

  public changeCompleteStateSubDiscussion(checkedState, subDiscussionId): any {
    const params = new HttpParams()
      .set("subDiscussionId", subDiscussionId)
      .set("checkedState", checkedState);
    return this._http.post(
      `${this.baseUrl}/discussion/changeCompleteStateSubDiscussion`,
      params
    );
  }

  public getUserNotification(id) {
    return this._http.get(
      `${this.baseUrl}/notification/${id}/notification?authToken=${Cookie.get(
        "authToken"
      )}`
    );
  }

  public saveUserNotification(data): any {
    const params = new HttpParams()
      .set("senderName", data.senderName)
      .set("senderId", data.senderId)
      .set("receiverName", data.receiverName)
      .set("receiverId", data.receiverId)
      .set("redirectId", data.redirectId)
      .set("message", data.message)
      .set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/notification/saveNotification`,
      params
    );
  }

  public getDiscussionDetail(id): Observable<any> {
    return this._http.get(
      `${this.baseUrl}/discussion/${id}/discussionDetails?authToken=${Cookie.get(
        "authToken"
      )}`
    );
  }

  public addTopic(topic): any {
    console.log(topic,'client');
    const params = new HttpParams()
      .set("authToken", topic.authToken)
      .set("topicName", topic.topicName)
      .set("topicCreatedBy", topic.topicCreatedBy)
      .set("topicModifiedBy", topic.topicModifiedBy);
    return this._http.post(`${this.baseUrl}/topics/addTopic`, params);
  }

  public getAllTopic(): any {
    return this._http.get(
      `${this.baseUrl}/topics/getAll?authToken=${Cookie.get("authToken")}`
    );
  }

  public updateTopic(data): any {
    const params = new HttpParams()
      .set("authToken", data.authToken)
      .set("TopicName", data.TopicName)
      .set("TopicModifiedBy", data.TopicModifiedBy);

    return this._http.post(
      `${this.baseUrl}/topics/${data.TopicId}/updateTopic`,
      params
    );
  }

  public updateDiscussion(data): any {
    const params = new HttpParams()
      .set("authToken", data.authToken)
      .set("DiscussionName", data.DiscussionName)
      .set("DiscussionModifiedBy", data.DiscussionModifiedBy);

    return this._http.post(
      `${this.baseUrl}/discussion/${data.discussionId}/updateDiscussion`,
      params
    );
  }

  public updatesubDiscussion(data): any {
    const params = new HttpParams()
      .set("authToken", data.authToken)
      .set("subDiscussionName", data.subDiscussionName)
      .set("subDiscussionModifiedBy", data.subDiscussionModifiedBy);

    return this._http.post(
      `${this.baseUrl}/discussion/${data.subDiscussionId}/updatesubDiscussion`,
      params
    );
  }

  public deleteTopic(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/topics/${data.TopicId}/deleteTopic`,
      params
    );
  }

  //For recursive delete of discussion and sub discussion
  public deleteAllSubDiscussionsById(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/discussion/${data.id}/deleteSubDiscussion`,
      params
    );
  }

  public deleteAllDiscussionsById(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/discussion/${data.discussionId}/deleteDiscussion`,
      params
    );
  }

  //For deleting single sub discussion
  public deletesubDiscussion(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/discussion/${data.subDiscussionId}/deletesubDiscussion`,
      params
    );
  }

  //For deleting Undo
  public deleteUndo(data): any {
    const params = new HttpParams()
      .set("undoId", data.undoId)
      .set("authToken", data.authToken);
    return this._http.post(`${this.baseUrl}/undo/deleteUndo`, params);
  }

  public resetPassword(data): Observable<any> {
    const params = new HttpParams().set("email", data.email);

    return this._http.post(`${this.baseUrl}/users/resetPassword`, params);
  }

  public updatePassword(data): Observable<any> {
    const params = new HttpParams()
      .set("validationToken", data.validationToken)
      .set("password", data.password);

    return this._http.put(`${this.baseUrl}/users/updatePassword`, params);
  } //end updatePassword

  public getUndo(data): any {
    const params = new HttpParams()
      .set("topicId", data.topicId)
      .set("authToken", data.authToken);

    return this._http.post(`${this.baseUrl}/undo/deleteUndo`, params);
  }

  public addUndoDetails(data): any {
    const params = new HttpParams()
      .set("topicId", data.topicId)
      .set("action", data.action)
      .set("discussionId", data.discussionId)
      .set("subDiscussionId", data.subDiscussionId)
      .set("authToken", data.authToken);
    return this._http.post(`${this.baseUrl}/undo/addUndo`, params);
  }

  public updateDiscussionTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerTopic", data.ownerTopic)
      .set("discussionCreatedBy", data.discussionCreatedBy)
      .set("discussionModifiedBy", data.discussionModifiedBy)
      .set("completed", data.completed)
      .set("discussionModifiedDate", data.discussionModifiedDate)
      .set("discussionCreatedDate", data.discussionCreatedDate)
      .set("discussionDescription", data.discussionDescription)
      .set("discussionName", data.discussionName)
      .set("discussionId", data.discussionId);
    return this._http.post(`${this.baseUrl}/undo/updateDiscussionUndo`, params);
  }

  public updatesubDiscussionTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerDiscussion", data.ownerDiscussion)
      .set("subDiscussionCreatedBy", data.subDiscussionCreatedBy)
      .set("subDiscussionModifiedBy", data.subDiscussionModifiedBy)
      .set("completed", data.completed)
      .set("subDiscussionModifiedDate", data.subDiscussionModifiedDate)
      .set("subDiscussionCreatedDate", data.subDiscussionCreatedDate)
      .set("subDiscussionDescription", data.subDiscussionDescription)
      .set("subDiscussionName", data.subDiscussionName)
      .set("subDiscussionId", data.subDiscussionId);
    return this._http.post(`${this.baseUrl}/undo/updatesubDiscussionUndo`, params);
  }

  public addDiscussionTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerTopic", data.ownerTopic)
      .set("discussionCreatedBy", data.discussionCreatedBy)
      .set("discussionModifiedBy", data.discussionModifiedBy)
      .set("subdiscussion", data.subdiscussion)
      .set("completed", data.completed)
      .set("discussionModifiedDate", data.discussionModifiedDate)
      .set("discussionCreatedDate", data.discussionCreatedDate)
      .set("discussionDescription", data.discussionDescription)
      .set("discussionName", data.discussionName)
      .set("discussionId", data.discussionId);
    return this._http.post(`${this.baseUrl}/undo/addDiscussionUndo`, params);
  }

  public addsubDiscussionTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerDiscussion", data.ownerDiscussion)
      .set("subDiscussionCreatedBy", data.subDiscussionCreatedBy)
      .set("subDiscussionModifiedBy", data.subDiscussionModifiedBy)
      .set("completed", data.completed)
      .set("subDiscussionModifiedDate", data.subDiscussionModifiedDate)
      .set("subDiscussionCreatedDate", data.subDiscussionCreatedDate)
      .set("subDiscussionDescription", data.subDiscussionDescription)
      .set("subDiscussionName", data.subDiscussionName)
      .set("subDiscussionId", data.subDiscussionId);
    return this._http.post(`${this.baseUrl}/undo/addsubDiscussionUndo`, params);
  }
}
