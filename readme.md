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

I learned of the general folder structure of an angular project, and I boostrapped my first app.

TypeScript is a superset of JavaScript and offers features such as strong typing, classes, interface.

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
```html
<p *ngIf="serverCreated; else noServer">
  server was created, server name is {{ serverName }}
</p>
<ng-template #noServer><p>No server was created</p> </ng-template>
```
```javascript
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

```html
<p
  [ngStyle]="{ backgroundColor: getColor() }"
  [ngClass]="{
    online: serverStatus === 'online'
  }"
>
  Server with ID {{ serverId }} is {{ getServerStatus() }}
</p>

```

```javascript
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

With the ngFor directive, we can add items to a list