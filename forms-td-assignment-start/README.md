 ## Template-Driven Forms
<br>
> 1. Mail address (should not be empty and should be an email address)
> 2. A Dropdown which allows the user to select from three different Subscriptions ("Basic", "Advanced", "Pro") Set "Advanced" as Default
> 3. A Password field (should not be empty)
> 4. A Submit Button
> Display a warning message if the Form is invalid AND was touched.
> Display a warning message below each input if it's invalid.
> Upon submitting the form, you should simply print the Value of the Form to the Console. Optionally, display it in your template.

##### Scaffolding the form

To make use of template-driven forms in angular, we first need to ensure that **FormsModule** is included as an import in app.module. We need to use the directive **ngSubmit**, which will be fired whenever the form is submitted. Additionally, we make use of local references to access our form, which we access using the **@ViewChild** decorator.

``` html
<form (ngSubmit)="onSubmit()" #f="ngForm">
```

``` typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm

  onSubmit() {
    console.log(this.myForm);
  }
}
```

The basic scaffold for the components are laid out as follows. The email input field only accepts email addresses, and the Subscription dropdown defaults to "advanced" via property binding `defaultSubs: string = "advanced";`. The password input is also required, and lastly, the button is of type submit.

``` html
        <div ngModelGroup="formData" #formData="ngModelGroup">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              ngModel
              name="email"
              type="email"
              class="form-control"
              email
              required
            />
          </div>
          <div class="form-group">
            <label for="subscription">Subscription</label>
            <select
              [ngModel]="defaultSubs"
              name="subscription"
              class="form-control"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              ngModel
              name="password"
              type="text"
              class="form-control"
              required
            />
          </div>
          <p *ngIf="!f.valid && f.touched">Form is invalid!</p>
          <button class="btn btn-primary" type="submit">Submit</button>
        </div>
```

##### Displaying a message when a form is invalid and is touched

We first grouped the form controls together using the direcrtive **ngModelGroup** to a parent container. The resulting output object will have the *formData* property that contains all the input.

```html
<div class="form-group" ngModelGroup="formData" #formData="ngModelGroup" >
  ...

```

At this point, if we `console.log` the form, we will find the input fields in the property:
```
formData: {
  email: '',
  password: '',
  subscription: 'advanced'
}
```
The following will be rendered if the whole form is invalid and has been touched
```ttml
<p *ngIf="!f.valid && f.touched">Form is invalid!</p>
```

We can also do the same for individual elements. We can get access to the element control created by Angular by associating a local reference eto the element and binding it to **ngModel** which exposes the information about this control.

```html
            <input
              ngModel
              #email="ngModel"
              name="email"
              type="email"
              class="form-control"
              email
              required
            />
```

We can display a warning message if the email is invalid and has been touched.
```html
<span class="help-block" *ngIf="!email.valid && email.touched"
              >Please enter a valid email!</span
            >
```

To print the form values, I created a *user* property that contains the values email, subscription and password. This property will be set according to the form values, which can be obtained via the *value* property of ngForm. Since we used ngModelGroup to group the inputs into *formData*, we need to access the property from within formData.

```typescript
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
```

We finally render the values
```html
      <div class="row" *ngIf="submitted">
        <p>email: {{ user.email }}</p>
        <p>subscription: {{ user.subscription }}</p>
      </div>
```