import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
})
export class ListComponent implements OnInit {
  showText = false;
  value = 1;
  listArray = [];

  constructor() {
    this.showText = false;
  }

  ngOnInit(): void {}

  onDisplayClick() {
    this.showText = !this.showText;
    console.log(this.showText);
    // this.listArray.push(this.value);
    // this.value = this.value + 1;
    this.listArray.push(new Date());
    console.log(this.listArray);
  }
}
