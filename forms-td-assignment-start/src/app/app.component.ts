import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild("f") myForm: NgForm;
  defaultSubs: string = "advanced";
  submitted = false;
  user = {
    email: "",
    subscription: "",
    password: "",
  };

  onSubmit() {
    console.log(this.myForm);
    this.user.email = this.myForm.value.formData.email;
    this.user.subscription = this.myForm.value.formData.subscription;
    this.user.password = this.myForm.value.formData.password;
    this.submitted = true;
    console.log(this.user);
  }
}
