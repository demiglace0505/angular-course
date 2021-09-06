# Angular - The Complete Guide 2021 Edition

Instructor: Max Schwarzmuller

### Course Structure

Basics
Components & Databinding
Directives
Services & Dependency Injection
Routing
Observables
Forms
Pipes
Http
Authentication
Optimizations & NgModules
Deployment
Animations & Testing

### Getting Started

To get started with working on Angular projects, we need first to instlal the Angular CLI. Aside from the Angular CLI, Nodejs is also needed.

```
npm install -g @angular/cli
```

TypeScript is the primary language for development of Angular applications. It is a superset of JavaScript and offers features such as strong typing, classes, interface.

I learned the basics of TypeScript such as the base types, primitives, arrays, and objects. Aside from the types, I also learned of assigning them to type aliases. Writing Generics was also covered, which allows us to write type-safe yet flexible functions. Most importantly, classes and interfaces in typescript was also covered.

### Angular Basics

##### Creating a Component

A component can be created by making use of the **@Component** decorator. This decorator marks a class as an Angular component and provides the configuration metadata to be used at runtime. A good rule of thumb for making components is that each component should have its own subdirectory, and the following naming convention: *subdirectory.component.ts*

``` javascript
import { Component } from "@angular/core";

@Component({
  selector: "app-server",
  templateUrl: "./server.component.html",
})
export class ServerComponent {}
```

The selector option is the html tag by which we will be able to use our components. A good naming convention is *app-name*.

A module is a bundle of components, directives and functionalities that are related in such a way taht can be combined with other modules to create the application.

Components can also be created via the cli. This method automatically creates the template, spec, component, and the css and also includes the new component declaration in the app.module.ts.

```
ng generate component servers
```

### Databinding

Databinding is essentially communication between the business logic and the template. It keeps the page up to date based on the application state.

##### String Interpolation

We can simply interpolate a property into a string using double curly braces. We can also call a function like getServerStatus().

``` html
<p>Server with ID {{ serverId }} is {{ getServerStatus() }}</p>
```

``` javascript
export class ServerComponent {
  serverId: number = 10;
  serverStatus: string = "offline";

  getServerStatus() {
    return this.serverStatus;
  }
}
```

##### Property Binding

To bind a property dynamically in Angular, we make use of square brackets. In the example below, the button is initially disabled, but becomes enabled after 5 seconds.

``` html
<button class="btn btn-primary" [disabled]="!allowNewServer">Add server</button>
<app-server></app-server>
<app-server></app-server>
```

``` javascript
export class ServersComponent implements OnInit {
  allowNewServer = false;

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 5000);
  }

  ngOnInit(): void {}
}
```

##### Event Binding

Parenthesis signifies an event binding in Angular. To bind a click event, we make use of **(click)**.

``` html
<button
  class="btn btn-primary"
  [disabled]="!allowNewServer"
  (click)="onCreateServer()"
>
  Add server
</button>
```

There's also the reserved keyword $event

``` html
<input type="text" class="form-control" (input)="onUpdateServerName($event)" />
```

``` javascript
export class ServersComponent implements OnInit {
  serverName = "";

  onUpdateServerName(event: any) {
    this.serverName = event.target.value;
  }
}
```

We can also make use of two-way binding by combining property and event binding. This can be done by using ngModel directive and combining square brackets and parenthesis. This will trigger on the input event and update the value of serverName automatically. The value of the input event will also be updated if we change serverName somewhere else.

``` html
<input type="text" class="form-control" [(ngModel)]="serverName" />
```

### Directives

Directives are instructions in the DOM. These add additional behavior to elements in the Angular app. To use the **ngIf** directive, we need to use a star, because it is a so called structural directive, which means that it removes or adds elements.

``` html
<p *ngIf="serverCreated; else noServer">
  server was created, server name is {{ serverName }}
</p>
<ng-template #noServer><p>No server was created</p> </ng-template>
```

``` javascript
  serverCreationStatus = 'No server was created';
  serverName = '';
  serverCreated = false;

    onCreateServer() {
    this.serverCreationStatus =
      'Server was created! Name is ' + this.serverName;
    this.serverCreated = true;
  }

  onUpdateServerName(event: any) {
    this.serverName = event.target.value;
  }
```

The other type of directives are attribute directives. These does not add or remove elements, and only change the element that they were placed on. There are two primary examples: ngStyle and ngClass. For both of them, we need to use property binding.

``` html
<p
  [ngStyle]="{ backgroundColor: getColor() }"
  [ngClass]="{
    online: serverStatus === 'online'
  }"
>
  Server with ID {{ serverId }} is {{ getServerStatus() }}
</p>
```

``` javascript
export class ServerComponent {
  serverId: number = 10;
  serverStatus: string = 'offline';

  constructor() {
    this.serverStatus = Math.random() > 0.5 ? 'online' : 'offline';
  }

  getServerStatus() {
    return this.serverStatus;
  }

  getColor() {
    return this.serverStatus === 'online' ? 'green' : 'red';
  }
}
```

For ngClass, the format of the object is class: statement. What happens is if the serverStatus property is set to 'online', the class online will be added to the p element.

<br>
<br>
### Setting up the RecipeBook project

Setting up the project can be done by using the ng new command. The *--no-stict* flag is important.

```
ng new --no-strict RecipeBook
```

I installed bootstrap afterwards.

```
npm install --save bootstrap@3
```

In the *angular.json* file, bootstrap has to be added in the styles array

``` javascript
 "styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
],
```

##### Setting up the components

New components can be created by the command ng generate component, or by its shorthand

```
ng g c directory/componentName
```

The structure of the components are as follows. The shared directory is the directory for features or elements that are shared across different features of our app, such as the model for our ingredients.

```
app
header
recipes
|_recipe-detail
|_recipe-list
  |_recipe-item
shared
shopping-list
|_shopping-edit
```

##### Creating a Model for Recipes

We created a model *recipe.model.ts* for our recipes. A model is simply a class that outlines what a recipe should look like.

``` javascript
export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;

  constructor(name: string, description: string, imagePath: string) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
  }
}
```

There is also a shorthand method of writing the above in a constructor:

``` javascript
export class Ingredient {
  constructor(public name: string, public amount: number){

  }
}
```

We then declared this model to be used in the recipe-list component *recipe-list.component.ts*

``` javascript
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
}
```

##### Outputting using ngFor

The data from our recipes array can be accessed using the ngFor directive and string interpolation. We can also make use of property binding for the src attribute of the img element.

``` html
    <a href="#" class="list-group-item clearfix" *ngFor="let recipe of recipes">
      <div class="pull-left">
        <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
        <p class="list-group-item-text">{{ recipe.description }}</p>
      </div>
      <div class="span pull-right">
        <img
          [src]="recipe.imagePath"
          alt="{{recipe.name}}"
          class="img-responsive"
          style="max-height: 50px"
        />
      </div>
    </a>
```

### Communicating between components

We can setup communication between our components using Property and Event Binding. Aside from binding to html elements, we can also use them on directives and components and their custom properties and events.

In the below example, the element is bound to serverElement. Normally however, this property is not exposed outside the component itself. This property can be exposed by making use of the **@Input** decorator. This means that any parent component hosting the server-element component can now access the property through the alias *srvElement*.

``` html
      <app-server-element
        *ngFor="let serverElement of serverElements"
        [srvElement]="serverElement"
      ></app-server-element>
```

``` javascript
//server-element.component.ts

export class ServerElementComponent implements OnInit {
  @Input('srvElement') element: {
    type: string;
    name: string;
    content: string;
  };
```

To pass data to a parent component, in this case from the cockpit component to the app component, we can bind to custom events. The event data is caught in the **$event** argument.

``` html
  <app-cockpit
    (srvCreated)="onServerAdded($event)"
    (bpCreated)="onBlueprintAdded($event)"
  ></app-cockpit>
```

We also need to create the corresponding methods *onServerAdded* and *onBlueprintAdded* that are fired upon creation of a server and blueprint.

``` javascript
export class AppComponent {
  serverElements = [
    { type: "server", name: "Testserver", content: "just a test" },
  ];

  onServerAdded(serverData: { serverName: string; serverContent: string }) {
    this.serverElements.push({
      type: "server",
      name: serverData.serverName,
      content: serverData.serverContent,
    });
  }

  onBlueprintAdded(blueprintData: {
    serverName: string;
    serverContent: string;
  }) {
    this.serverElements.push({
      type: "blueprint",
      name: blueprintData.serverName,
      content: blueprintData.serverContent,
    });
  }
}
```

To emit events, 2 new properties has to be added to the cockpit component. These are instantiated from the **EventEmitter** class. We also need the **@Output** decorator to make the methods listenable from outside.

``` javascript
export class CockpitComponent implements OnInit {
  @Output("srvCreated") serverCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  @Output("bpCreated") blueprintCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  newServerName = "";
  newServerContent = "";

  constructor() {}

  ngOnInit(): void {}
  onAddServer() {
    this.serverCreated.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent,
    });
  }

  onAddBlueprint() {
    this.blueprintCreated.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent,
    });
  }
}
```

##### Using Local References
A local reference can be placed on any HTML element. A reference will hold the reference to the specific element. This reference can then be passed around in the html template, not in the typescript component. The following example shows the difference between using two-way binding and using reference.

```html
    <!-- using reference -->
    <label>Server Name</label>
    <input type="text" class="form-control" #serverNameInput />

    <!-- using two way data binding -->
    <label>Server Content</label>
    <input type="text" class="form-control" [(ngModel)]="newServerContent" />
    <br />
    <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">
      Add Server
    </button>
    <button class="btn btn-primary" (click)="onAddBlueprint(serverNameInput)">
      Add Server Blueprint
    </button>
```

```typescript
  onAddServer(nameInput: HTMLInputElement) {
    console.log(nameInput.value);
    this.serverCreated.emit({
      serverName: nameInput.value,
      serverContent: this.newServerContent,
    });
  }

  onAddBlueprint(nameInput: HTMLInputElement) {
    this.blueprintCreated.emit({
      serverName: nameInput.value,
      serverContent: this.newServerContent,
    });
  }
```

##### Accessing the Template & DOM using @ViewChild
Another way to access a local reference or any element directly from within our typescript code is by using **@ViewChild** Decorator. We just need to pass the local reference as a string argument to the ViewChild decorator and then the element could then be accessed using the **nativeElement** property. In the example below, the local reference #serverContentInput is accessed.
```html
<input type="text" class="form-control" #serverContentInput />
```
```typescript
  @ViewChild("serverContentInput", { static: true }) serverContentInput: ElementRef;
  
  onAddServer(nameInput: HTMLInputElement) {
    console.log(this.serverContentInput);
    this.serverCreated.emit({
      serverName: nameInput.value,
      serverContent: this.serverContentInput.nativeElement.value,
    });
  }

  onAddBlueprint(nameInput: HTMLInputElement) {
    this.blueprintCreated.emit({
      serverName: nameInput.value,
      serverContent: this.serverContentInput.nativeElement.value,
    });
  }
```
##### Projecting Content into Components with ng-content
We can use the ng-content directive in a place where we want to render content. We then have to nest the content we want to be rendered inside the component's tag, in this case, in between <app-server-element>

```html
<div class="panel panel-default">
  <div class="panel-heading">{{ element.name }}</div>
  <div class="panel-body">
    <ng-content></ng-content>
  </div>
</div>
```

```html
<app-server-element
        *ngFor="let serverElement of serverElements"
        [srvElement]="serverElement"
      >
        <p>
          <strong *ngIf="serverElement.type === 'server'" style="color: red">{{
            serverElement.content
          }}</strong>
          <em *ngIf="serverElement.type === 'blueprint'">{{
            serverElement.content
          }}</em>
        </p>
      </app-server-element>
```

### Component Lifecycle

If a new component is created in Angular, it is instantiated and added to the DOM. 


| Hook | Description |
| --- | --- |
| ngOnChanges | Called after a bound input property chagnes |
| ngOnInit | Called once a component is initialized. Runs after the constructor |
| ngDoCheck | Called during every change detection run |
| ngAfterContentInit | Called after the content projected by ng-content has been projected into view |
| ngAfterContentChecked | Called every time the projected content has been checked |
| ngAfterViewInit | Called after the component and child views has been initialized |
| ngAfterViewChecked | Called every time the view and child views have been checked |
| ngOnDestroy | Called once the component is about to be destroyed |

##### Accessing ng-content with @ContentChild
```html
<p #contentParagraph>
  ...
</p>
```
```typescript
  @ContentChild('contentParagraph', {static: true}) paragraph: ElementRef;
  
    ngOnInit(): void {
    console.log("ngonInit called");
    console.log(
      "Text Content of paragraph",
      this.paragraph.nativeElement.textContent
    );
  }
  
    ngAfterContentInit() {
    console.log("ngAfterContentInit called");
    console.log(
      "Text Content of paragraph",
      this.paragraph.nativeElement.textContent
    );
  }
```