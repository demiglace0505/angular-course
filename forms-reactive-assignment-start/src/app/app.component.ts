import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  signupForm: FormGroup;
  email: "";
  subscription: "";
  password: "";
  submitted = false;

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      subscription: new FormControl("advanced"),
      password: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    console.log(this.signupForm);

    this.email = this.signupForm.value.email;
    console.log("email", this.email);
    this.subscription = this.signupForm.value.subscription;
    this.password = this.signupForm.value.password;

    console.log(this.signupForm.value.email);
    console.log(this.signupForm.value.subscription);
    console.log(this.signupForm.value.password);

    this.submitted = true;
  }
}
