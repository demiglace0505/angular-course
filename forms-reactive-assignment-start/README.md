## Reactive Forms

<br>
> 1. Mail address (should not be empty and should be an email address)
> 2. A Dropdown which allows the user to select from three different Subscriptions ("Basic", "Advanced", "Pro") Set "Advanced" as Default
> 3. A Password field (should not be empty)
> 4. A Submit Button
> Display a warning message if the Form is invalid AND was touched.
> Display a warning message below each input if it's invalid.
> Upon submitting the form, you should simply print the Value of the Form to the Console. Optionally, display it in your template.

##### Scaffolding the form

The skeleton for the html template looks like the following:

We first set up our typescript component with a rough outline of the form. We initialize the form by calling a new instance of **FormGroup**. FormGroup receives an object which contains the controls, which we define with **FormControl**. The first argument to this is the default value of the form, in this case, subscription defaults to _advanced_

```typescript
export class AppComponent implements OnInit {
  signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null),
      subscription: new FormControl("advanced"),
      password: new FormControl(null),
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }
}
```

To hook up our form component with the template, the directive **formGroup** has to be added via property binding to our form tag. We first need to import **ReactiveFormsModule** in app.module before doing so. We then use **formControlName** to connect the controls to our html template. For this, we can use either string or property binding. To submit the form, we use the directive **ngSubmit**.

The template of our form now looks like the following:

```html
<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="email">Email</label>
    <input
      formControlName="email"
      type="text"
      id="email"
      class="form-control"
    />
  </div>
  <div class="form-group">
    <label for="subscription">Subscription</label>
    <select [formControlName]="'subscription'" class="form-control">
      <option value="basic">Basic</option>
      <option value="advanced">Advanced</option>
      <option value="pro">Pro</option>
    </select>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input
      formControlName="password"
      type="password"
      id="password"
      class="form-control"
    />
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

##### Validation

To add validation to our forms, we need to pass our validators to the second argument of FormControl.

```typescript
email: new FormControl(null, [Validators.email, Validators.required]),
password: new FormControl(null, Validators.required),
```

In order to render our error messages, we need to get access to our controls via the FormGroup's get() method.

```html
<span
  class="help-block"
  *ngIf="
          !signupForm.get('email').valid && signupForm.get('email').touched
        "
>
  Please enter a valid Email
</span>
<span
  class="help-block"
  *ngIf="
          !signupForm.get('password').valid &&
          signupForm.get('password').touched
        "
>
  This field is required
</span>
```

To render our values when submitted, we can assign them to a property. We can access the form values through the FormGroup object we created, and within it, the _value_ property.

```typescript
export class AppComponent implements OnInit {
  signupForm: FormGroup;
  email: "";
  subscription: "";
  password: "";
  submitted = false;

  onSubmit() {
    console.log(this.signupForm);

    this.email = this.signupForm.value.email;
    this.subscription = this.signupForm.value.subscription;
    this.password = this.signupForm.value.password;

    console.log(this.signupForm.value.email);
    console.log(this.signupForm.value.subscription);
    console.log(this.signupForm.value.password);

    this.submitted = true;
  }
}
```

We finally can render our inputs conditionally

```html
<div class="row" *ngIf="submitted">
  <p>email: {{ email }}</p>
  <p>subscription: {{ subscription }}</p>
</div>
```
