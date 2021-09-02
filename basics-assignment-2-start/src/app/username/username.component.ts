import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-username",
  templateUrl: "./username.component.html",
  styleUrls: ["./username.component.css"],
})
export class UsernameComponent implements OnInit {
  username: string = "";

  constructor() {}

  isEmptyUsername() {
    return this.username == "" ? true : false;
  }

  clearUsername() {
    this.username = "";
  }

  ngOnInit(): void {}
}
