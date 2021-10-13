# [Angular - The Complete Guide 2021 Edition](https://www.udemy.com/course/the-complete-guide-to-angular-2/)

Instructor: Max Schwarzmuller

### Course Structure

> This readme file is a documentation of my learnings, notes and takeaways from the course. It is structured such that each major topic in the course has its own section. Each section may consist of two parts: Lecture and Project.
>
> The lecture parts are outlined in the below list. Each lecture part is also accompanied by a sample application, which resides in its own subdirectory in this repo. The second part, project, is the application of the learnings from the lecture part to the Recipe Book project itself. This part can easily be identified by the **Project:** that precedes the header.

- [Angular Basics](#angular-basics)
- [Components and Databinding](#components-and-databinding)
- [Directives Deep Dive](#directives-deep-dive)
- [Services and Dependency Injection](#services-and-dependency-injection)
- [Routing](#routing)
- [Observables](#observables)
- [Forms](#forms)
- [Pipes](#pipes)
- [Http Requests](#http-requests)
- [Authentication and Route Protection](#authentication-and-route-protection)
- [Dynamic Components](#dynamic-components)
- [Angular Modules](#angular-modules)

## Angular Basics

##### Creating a Component

A component can be created by making use of the **@Component** decorator. This decorator marks a class as an Angular component and provides the configuration metadata to be used at runtime. A good rule of thumb for making components is that each component should have its own subdirectory, and the following naming convention: _subdirectory.component.ts_

```javascript
import { Component } from "@angular/core";

@Component({
  selector: "app-server",
  templateUrl: "./server.component.html",
})
export class ServerComponent {}
```

The selector option is the html tag by which we will be able to use our components. A good naming convention is _app-name_.

A module is a bundle of components, directives and functionalities that are related in such a way taht can be combined with other modules to create the application.

Components can also be created via the cli. This method automatically creates the template, spec, component, and the css and also includes the new component declaration in the app.module.ts.

```
ng generate component servers
```

---

## Components and Databinding

> Reference activity: [cmp-databinding-start](https://github.com/demiglace0505/angular-course/tree/master/cmp-databinding-start)

Databinding is essentially communication between the business logic and the template. It keeps the page up to date based on the application state.

##### String Interpolation

We can simply interpolate a property into a string using double curly braces. We can also call a function like getServerStatus().

```html
<p>Server with ID {{ serverId }} is {{ getServerStatus() }}</p>
```

```javascript
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

```html
<button class="btn btn-primary" [disabled]="!allowNewServer">Add server</button>
<app-server></app-server>
<app-server></app-server>
```

```javascript
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

```html
<button
  class="btn btn-primary"
  [disabled]="!allowNewServer"
  (click)="onCreateServer()"
>
  Add server
</button>
```

There's also the reserved keyword $event

```html
<input type="text" class="form-control" (input)="onUpdateServerName($event)" />
```

```javascript
export class ServersComponent implements OnInit {
  serverName = "";

  onUpdateServerName(event: any) {
    this.serverName = event.target.value;
  }
}
```

We can also make use of two-way binding by combining property and event binding. This can be done by using ngModel directive and combining square brackets and parenthesis. This will trigger on the input event and update the value of serverName automatically. The value of the input event will also be updated if we change serverName somewhere else.

```html
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
  serverStatus: string = "offline";

  constructor() {
    this.serverStatus = Math.random() > 0.5 ? "online" : "offline";
  }

  getServerStatus() {
    return this.serverStatus;
  }

  getColor() {
    return this.serverStatus === "online" ? "green" : "red";
  }
}
```

For ngClass, the format of the object is class: statement. What happens is if the serverStatus property is set to 'online', the class online will be added to the p element.

---

## Project: Setting up the RecipeBook project

Setting up the project can be done by using the ng new command. The _--no-stict_ flag is important.

```
ng new --no-strict RecipeBook
```

I installed bootstrap afterwards.

```
npm install --save bootstrap@3
```

In the _angular.json_ file, bootstrap has to be added in the styles array

```javascript
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

We created a model _recipe.model.ts_ for our recipes. A model is simply a class that outlines what a recipe should look like.

```javascript
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

```javascript
export class Ingredient {
  constructor(public name: string, public amount: number){

  }
}
```

We then declared this model to be used in the recipe-list component _recipe-list.component.ts_

```javascript
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
}
```

##### Outputting using ngFor

The data from our recipes array can be accessed using the ngFor directive and string interpolation. We can also make use of property binding for the src attribute of the img element.

```html
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

---

## Communicating between components

> Reference activity: [cmp-databinding-start](https://github.com/demiglace0505/angular-course/tree/master/cmp-databinding-start)

We can setup communication between our components using Property and Event Binding. Aside from binding to html elements, we can also use them on directives and components and their custom properties and events.

In the below example, the element is bound to serverElement. Normally however, this property is not exposed outside the component itself. This property can be exposed by making use of the **@Input** decorator. This means that any parent component hosting the server-element component can now access the property through the alias _srvElement_.

```html
<app-server-element
  *ngFor="let serverElement of serverElements"
  [srvElement]="serverElement"
></app-server-element>
```

```javascript
//server-element.component.ts

export class ServerElementComponent implements OnInit {
  @Input('srvElement') element: {
    type: string;
    name: string;
    content: string;
  };
```

To pass data to a parent component, in this case from the cockpit component to the app component, we can bind to custom events. The event data is caught in the **$event** argument.

```html
<app-cockpit
  (srvCreated)="onServerAdded($event)"
  (bpCreated)="onBlueprintAdded($event)"
></app-cockpit>
```

We also need to create the corresponding methods _onServerAdded_ and _onBlueprintAdded_ that are fired upon creation of a server and blueprint.

```javascript
export class AppComponent {
  serverElements = [
    { type: "server", name: "Testserver", content: "just a test" },
  ];

  onServerAdded(serverData: { serverName: string, serverContent: string }) {
    this.serverElements.push({
      type: "server",
      name: serverData.serverName,
      content: serverData.serverContent,
    });
  }

  onBlueprintAdded(blueprintData: {
    serverName: string,
    serverContent: string,
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

```javascript
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

We can use the ng-content directive in a place where we want to render content. We then have to nest the content we want to be rendered inside the component's tag, in this case, in between
<br>

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
    <strong *ngIf="serverElement.type === 'server'" style="color: red"
      >{{ serverElement.content }}</strong
    >
    <em *ngIf="serverElement.type === 'blueprint'"
      >{{ serverElement.content }}</em
    >
  </p>
</app-server-element>
```

### Component Lifecycle

If a new component is created in Angular, it is instantiated and added to the DOM.

| Hook                  | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| ngOnChanges           | Called after a bound input property chagnes                                   |
| ngOnInit              | Called once a component is initialized. Runs after the constructor            |
| ngDoCheck             | Called during every change detection run                                      |
| ngAfterContentInit    | Called after the content projected by ng-content has been projected into view |
| ngAfterContentChecked | Called every time the projected content has been checked                      |
| ngAfterViewInit       | Called after the component and child views has been initialized               |
| ngAfterViewChecked    | Called every time the view and child views have been checked                  |
| ngOnDestroy           | Called once the component is about to be destroyed                            |

##### Accessing ng-content with @ContentChild

```html
<p #contentParagraph>...</p>
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

## Project: Adding Navigation with Event Binding and ngIf

We first add click event listeners in our navigation link components

```html
<li>
  <a href="#" (click)="onSelect('recipe')">Recipe</a>
</li>
<li>
  <a href="#" (click)="onSelect('shopping-list')">Shopping List</a>
</li>
```

We then create the event emitter in our component. We make use of the @Output decorator in order to make this event listenable from outside the header component, in this case, the parent or the app component.

```typescript
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>();

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
```

In the parent component, the app component, we will add a listener event that listens for the _featureSelected_ event and then executes _onNavigate()_, wherein this time we pass the event data of featureSelected through the reserved $event keyword.

```html
<app-header (featureSelected)="onNavigate($event)"></app-header>
```

We then proceed to write the function in the app component. The _loadedFeature_ property is set to the feature that we receive from the event's argument.

```typescript
export class AppComponent {
  loadedFeature: string = "recipe";

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
```

We finally make use of **ngIf** directive to conditionally render which page to load depending on the feature selected

```html
<app-recipes *ngIf="loadedFeature === 'recipe'"></app-recipes>
<app-shopping-list *ngIf="loadedFeature !== 'recipe'"></app-shopping-list>
```

## Project: Passing Data with Property Binding

For this section, we built the individual recipe item components. We first create the templates for recipe-list and recipe-item respectively.

```html
<!-- recipe-list -->
<app-recipe-item *ngFor="let recipe of recipes"></app-recipe-item>
```

```html
<!-- recipe-item -->
<a href="#" class="list-group-item clearfix">
  <div class="pull-left">
    <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
    <p class="list-group-item-text">{{ recipe.description }}</p>
  </div>
  <div class="span pull-right">
    <img
      [src]="recipe.imagePath"
      alt="{{ recipe.name }}"
      class="img-responsive"
      style="max-height: 50px"
    />
  </div>
</a>
```

We add a recipe property to recipe-item, which we will be getting from outside the recipe-item component using the @Input decorator.

```typescript
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor() {}

  ngOnInit(): void {}
}
```

This allows us to bind the recipe property from outside, which we will be binding from the recipe-list component. At this point, it would be a great time to rename the individual item from the **ngFor** directive. recipeEl is the element which we will pass to the bindable recipe property from the recipe-item component. We can now update the recipe template as such:

```html
<!-- recipe-list -->
<app-recipe-item
  *ngFor="let recipeEl of recipes"
  [recipe]="recipeEl"
></app-recipe-item>
```

The recipe property is of type model

```typescript
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

## Project: Event and Property Binding

The goal of this section is to be able to display a single detailed recipe section when we click an item from our recipe list. The caveat with this approach is that we first pass from recipe-item to recipe-list and finally recipe-detail. A more elegant solution will be discussed in future chapters.

We first set up the click listener of the single recipe-item component. Again the @Output director is necessary to be able to listen to this event from outside the recipe-item component.

```typescript
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Output() recipeSelected = new EventEmitter<void>();

  constructor() {}
  ngOnInit(): void {}

  onSelected() {
    this.recipeSelected.emit();
  }
}
```

We then update the template for our recipe-list component to listen to this event. We pass on the current recipe object, which is the _recipeEl_

```html
<app-recipe-item
  *ngFor="let recipeEl of recipes"
  [recipe]="recipeEl"
  (recipeSelected)="onRecipeSelected(recipeEl)"
></app-recipe-item>
```

We then Emit another event. We pass the recipeEl received from the above to the event emitter. This time around, the parent **recipes** component will be the one listening for this event.

```typescript
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  ...
  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
```

We can set up recipes template. We set the component's _selectedRecipe_ property into the recipe we received from the recipeWasSelected event.

We use the ngIf directive together with ng-template to conditionally render _infoText_ if selectedRecipe is null, or in other words, no recipe was selected yet. The _recipe_ property of the recipe-detail component is bound to selectedRecipe.

```html
<app-recipe-list
  (recipeWasSelected)="selectedRecipe = $event"
></app-recipe-list>

<app-recipe-detail
  *ngIf="selectedRecipe; else infoText"
  [recipe]="selectedRecipe"
></app-recipe-detail>
<ng-template #infoText>
  <p>Please select a Recipe</p>
</ng-template>
```

We can now render the data in our recipe-detail template

```html
<img [src]="recipe.imagePath" alt="{{ recipe.name }}" class="img-responsive" />
...
<h1>{{ recipe.name }}</h1>
...
<div class="col-xs-12">{{ recipe.description }}</div>
```

## Project: Allowing Addition of Items to the Shopping List

We begin by adding local references to the input fields #nameInput and #amountInput and adding the click event listener to the Add button.

```html
<input type="text" id="name" class="form-control" #nameInput />
<input type="number" class="form-control" id="amount" #amountInput />
<button class="btn btn-success" type="submit" (click)="onAddItem()">Add</button>
```

We make use of the ViewChild() decorator to access these local references from within the typescript code. We now create an event emitter wherein we pass the data to the parent component that manages the array of ingredients, which is the shopping-list component. We pass the Ingredient model for the type definition of the event emitter.

The values received from ViewChild can be accessed using **nativeElement**, which we then pass to our event emitter.

```typescript
export class ShoppingEditComponent implements OnInit {
  @ViewChild("nameInput", { static: false }) nameInputRef: ElementRef;
  @ViewChild("amountInput", { static: false }) amountInputRef: ElementRef;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();

  constructor() {}

  ngOnInit(): void {}

  onAddItem() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = this.amountInputRef.nativeElement.value;
    const newIngredient = new Ingredient(name, amount);
    this.ingredientAdded.emit(newIngredient);
  }
}
```

We can now listen to the ingredientAdded event from our shopping-list template

```html
<app-shopping-edit
  (ingredientAdded)="onIngredientAdded($event)"
></app-shopping-edit>
```

And then we create the function onIngredientAdded in our shopping-list component, which receives the event data from the ingredientAdded event.

```typescript
  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
```

---

## Directives Deep Dive

> Reference activity: [directives-start](https://github.com/demiglace0505/angular-course/tree/master/directives-start)

Structural directives are responsible for the HTML layout. These are indicated by the **(\*)** symbol. It is important to note that multiple structural directives cannot be used at the same time on the same element. The two structural directives covered thus far are **ngFor** and **ngIf**

Attribute directives on the other hand, does not change the HTML layout. These are indicated by square brackets and we can use multiple attribute directives on the same element. Some examples of attribute directives are **ngStyle** and **ngClass**

##### Creating our own directive

We could also create our own directives. We create a subdirectory on our project called _basic-highlight_ and inside of it we create a file _basic-highlight.directive.ts_. We use the **@Directive** decorator, and we need to pass an object as a parameter. The selector attribute allows us to attach them to an element. We wrap the value in square brackets so that we don't have to do so when we use our directive in our component.

A quicker way of creating directives is by use of the angular cli

```
ng generate directive better-highlight
```

We can access the element into this directive by injection. To do this, we need to pass an ElementRef argument to the constructor. This is a reference to the element wherein the directive is placed on. To be able to use this data anywhere in our class, we can use **private** which will make it a property of ElementRef.

```typescript
@Directive({
  selector: "[appBasicHighlight]",
})
export class BasicHighlightDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.backgroundColor = "gray";
  }
}
```

To use the directive, we have to first declare our directive in our app.module.ts file.

```typescript
@NgModule({
  declarations: [
    AppComponent,
    BasicHighlightDirective
  ],
  ...
```

We can then use the directive in our template

```html
<p appBasicHighlight>Style me with basic directive!</p>
```

##### Using the Renderer to build a Directive

Accessing elements directly like the previous example is not a good practice. A better way of building directives is by the use of the Renderer. We inject the helper Renderer2 in our constructor in addition to ElementRef. We now then use the setStyle method of the renderer, which takes four arguments: first is the element, second is the property, third is the value of the property and fourth an optional flags

```typescript
@Directive({
  selector: "[appBetterHighlight]",
})
export class BetterHighlightDirective implements OnInit {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      "background-color",
      "blue"
    );
  }
}
```

We can now use it in our template

```html
<p appBetterHighlight>Style me with better directive!</p>
```

##### Listening to Host Events

To react to events in the element wherein the directive sits on, we can use the **@HostListener** decorator.

```typescript
  @HostListener("mouseenter") mouseover(eventData: Event) {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      "background-color",
      "blue"
    );
  }

  @HostListener("mouseleave") mouseleave(eventData: Event) {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      "background-color",
      "transparent"
    );
  }
```

An even easier way, without using the renderer, is through the use of **@HostBinding** decorator. We bind this to a property that will be set to important, in this case _backgroundColor_. We pass a property to the decorator to which property of the hosting element we want to bind, which in this case is _style.backgroundColor_.

```typescript
  @HostBinding("style.backgroundColor") backgroundColor: string = "transparent";

  @HostListener("mouseenter") mouseover(eventData: Event) {
    this.backgroundColor = "blue";
  }
  @HostListener("mouseleave") mouseleave(eventData: Event) {
    this.backgroundColor = "transparent";
  }
```

We can make of custom property binding to pass on parameters

```typescript
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = "transparent";
  @Input() highlightColor: string = "blue";
  @HostBinding("style.backgroundColor") backgroundColor: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.backgroundColor = this.defaultColor;
  }

  @HostListener("mouseenter") mouseover(eventData: Event) {
    this.backgroundColor = this.highlightColor;
  }
  @HostListener("mouseleave") mouseleave(eventData: Event) {
    this.backgroundColor = this.defaultColor;
  }
}
```

Specifying our colors in the template:

```html
<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'orange'">
  Style me with better directive!
</p>
```

Note that if we set an alias that has the same name as our directive, we need to enclose the directive with a square bracket. In the example below, appBetterHighlight.

```typescript
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = "transparent";
  @Input('appBetterHighlight') highlightColor: string = "blue";
  ...
}
```

```html
<p [appBetterHighlight]="'orange'" [defaultColor]="'yellow'">
  Style me with better directive!
</p>
```

##### Creating a Structural Directive

We created our own structural directive unless.directive.ts, which is the opposite of ngIf. We bind to a property called 'appUnless' which should be the same name as the selector, but whenever this condition changes, a method should be executed that's why it is declared as a **setter**. It receives a boolean condition as its parameter. To access the template and the place in the document where we want to render, we can inject **TemplateRef** and **ViewContainerRef** in the constructor.

```typescript
export class UnlessDirective {
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.vcRef.createEmbeddedView(this.templateRef);
    } else {
      this.vcRef.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef
  ) {}
}
```

We can now use this directive in our template.

```html
<div *appUnless="onlyOdd">
  <li
    class="list-group-item"
    *ngFor="let even of evenNumbers"
    [ngClass]="{ even: even % 2 === 0 }"
    [ngStyle]="{
      backgroundColor: even % 2 === 0 ? 'orangered' : 'transparent'
    }"
  >
    {{ even }}
  </li>
</div>
```

## Project: Implementing dropdown using directives

We created a dropdown.directive.ts file and in it, we make use of the **@HostSelector** decorator to listen for click events and fire the **toggleOpen** method, which sets Open to true or false. Using **@HostBinding**, we bind the class.open property of the element this directive is in to the property isOpen. This means that whenever isOpen changes, the host element is updated and the class **open** is either added or removed.

The directive will not be attached initially, but whenever isOpen switches to true, it will be attached and when it switches to false, it will be removed.

```typescript
@Directive({
  selector: "[appDropdown]",
})
export class DropdownDirective {
  @HostBinding("class.open") isOpen = false;

  @HostListener("click") toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
```

```html
<li class="dropdown" appDropdown></li>
```

---

## Services and Dependency Injection

> Reference activity: [services-start](https://github.com/demiglace0505/angular-course/tree/master/services-start)

A service is a broad category encompassing any value, function or feature that an application needs. It is typically a class with a well-defined purpose and does something specific.

##### Creating a Logging Service

A service is created with a name.service.ts naming convention. It is important to note that we don't need to import decorators in order to define a service.

```typescript
export class LoggingService {
  logStatusChange(status: string) {
    console.log("A server status changed, new status: " + status);
  }
}
```

To use a service, we need to inject it into components using Angular's dependency injector. We pass the LoggingService class into our constructor and add it in the component's **providers** array.

```typescript
@Component({
  ...
  providers: [LoggingService]
})
export class NewAccountComponent {
  ...
  constructor(private loggingService: LoggingService) {

  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountAdded.emit({
      name: accountName,
      status: accountStatus
    });
    this.loggingService.logStatusChange(accountStatus)
  }
}
```

##### Data Service

Another typical use case for services is for storing and managing data.

```typescript
export class AccountsService {
  accounts = [
    {
      name: "Master Account",
      status: "active",
    },
    ...
  ];

  addAccount(name: string, status: string) {
    this.accounts.push({ name, status });
  }

  updateStatus(id: number, status: string) {
    this.accounts[id].status = status;
  }
}
```

And our app component simply becomes:

```typescript
export class AppComponent implements OnInit {
  accounts: { name: string; status: string }[] = [];

  constructor(private accountsService: AccountsService) {}

  ngOnInit() {
    this.accounts = this.accountsService.accounts;
  }
}
```

It is important to note that injection of services follows the Hierarchical Injection, which means that the children of a component will also get injected. In the case of this app, we don't want to provide **AccountService** to the children (new-account and account), because that would give us a different instance of AccountService. We should only provide AccountService into the parent app component. We shouldn't remove it in the constructor though.

```typescript
  //app.component.ts
  providers: [AccountsService],
  //new-account.component.ts
  providers: [LoggingService],
  //account.component.ts
  providers: [LoggingService],
```

##### Injecting Services into Services

To inject a service into a service, we need to provide a service to the highest in the hierarchy, the app module. If we want to inject a service into a service, we need to add the **@Injectable** decorator to the receiving service.

```typescript
@Injectable()
export class AccountsService {
  ...
  constructor(private loggingService: LoggingService) {}
}
```

##### Cross-Component Communication with Services

We can make components communicate with each other using services. We have a triggering component and a listening component. We first add an event emitter in our service.

```typescript
statusUpdated = new EventEmitter<string>();
```

Then access it and emit an event via AccountsService in our account component

```typescript
  onSetTo(status: string) {
    ...
    this.accountsService.statusUpdated.emit(status)
  }
```

And finally subscribe to it from the new-account component

```typescript
constructor(
    private loggingService: LoggingService,
    private accountsService: AccountsService
  ) {
    this.accountsService.statusUpdated.subscribe(
      (status: string) => alert('New status: ' + status)
    )
```

## Project: Adding Services

##### Recipe Service

We first set up the array of recipes in the _recipe.service.ts_ file. Since objects and arrays in JavaScript are reference types, we should call **slice()** with no arguments which will return a new array which is an exact copy of the _recipes_ array.

```typescript
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      ...
    ),
    new Recipe(
      ...
    ),
  ];

  getRecipes() {
    return this.recipes.slice()
  }
}
```

We then add this as a provider to _recipes.component_

```typescript
providers: [RecipeService];
```

And then provide it to _recipe-list_ and initialize recipes with getRecipes()

```typescript
  recipes: Recipe[]

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes()
  }
```

##### Using Services for Cross-Component Communication

Currently, the app makes use of a chain of Inputs and Outputs to communicate between components. We can do better using services. Inside our recipe service, we can add an event emitter that holds a Recipe object.

```typescript
recipeSelected = new EventEmitter<Recipe>();
```

We then inject the recipe service into recipe-item component and add use the recipeSelected event emitter. This will allow us to click a recipe.

```html
<a href="#" class="list-group-item clearfix" (click)="onSelected()">
  <!-- recipe list --></a
>
```

```typescript
  constructor(private recipeService: RecipeService) {}

  onSelected() {
    this.recipeService.recipeSelected.emit(this.recipe);
  }
```

To display the details of the clicked recipe, we create a listener in our recipes component which is subscribed for changes in the selected recipe, wherein we pass a recipe object of type Recipe, which we will be receiving from the event emitter above. This allows a new recipe to be displayed when the selected recipe is changed, in the case of this app, when a different recipe is clicked.

```typescript
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe
    })
  }
```

##### Shopping List Service

We provide the ShoppingListService to app.module since we would be accessing the shopping list from the recipes component later on. We set up the shopping-list service as follows. Important to note here is the **ingredientsChanged** event emitter which receives a copy of the ingredients array in the **addIngredient** method. This is necessary since we need to inform our component for changes when a new ingredient is added.

```typescript
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient("apples", 5),
    new Ingredient("oranges", 2),
  ];
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  getIngredients() {
    return this.ingredients.slice();
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }
}
```

We then need to subscribe to the ingredientsChanged event for changes in the ingredients array which is found in the shopping-list component.

```typescript
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [];

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.slService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    });
  }
}
```

In our shopping-edit component, we can now offload the event emission to the shopping list service.

```typescript
export class ShoppingEditComponent implements OnInit {
  @ViewChild("nameInput", { static: false }) nameInputRef: ElementRef;
  @ViewChild("amountInput", { static: false }) amountInputRef: ElementRef;

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {}

  onAddItem() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = this.amountInputRef.nativeElement.value;
    const newIngredient = new Ingredient(name, amount);
    this.slService.addIngredient(newIngredient);
  }
}
```

##### Passing Ingredients from Recipes to Shopping List

At this point, we can now add ingredients to our recipe model. This will be an array of Ingredient objects.

```typescript
export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(
    name: string,
    description: string,
    imagePath: string,
    ingredients: Ingredient[]
  ) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
```

We start by adding a click event listener to recipe-detail template

```html
<li>
  <a (click)="onAddToShoppingList()" style="cursor: pointer"
    >Add Ingredients to Shopping List</a
  >
</li>
```

We then create an **onAddToShoppingList()** method in our recipe-detail template which then calls the **addIngredientsToShoppingList()** from recipeService, wherein we pass recipe.ingredients.

```typescript
  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }
```

We need to inject the shopping-list service into our recipe service using the **@Injectable** decorator afterwards.

```typescript
@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      ...
    ),
    new Recipe(
      ...
    ),
  ];

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addMultipleIngredients(ingredients)
  }

  ...
}
```

In our shopping-list service, we need to implement a new method for adding multiple ingredients. We could make use of a for loop, iterate through each ingredient then individually add them, but it will be inefficient since we will be making multiple event emissions. A more efficient method would be to add all ingredients at once, then emit the event. We can do this using spread operator.

```typescript
  addMultipleIngredients(ingredients: Ingredient[]) {
    // INEFFICIENT:
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient)
    // }

    this.ingredients.push(...ingredients)
    this.ingredientsChanged.emit(this.ingredients.slice())
  }
}
```

---

## Routing

> Reference activity: [routing-start](https://github.com/demiglace0505/angular-course/tree/master/routing-start)

We register our routing in the app.module file. The path property defines the path for the url, while the component property tells angular what should be loaded in that route. We also need to import **RouterModule** to our app.module. The RouterModule's special method forRoot() allows us to register routes.

```typescript
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'servers',
    component: ServersComponent
  },
]

@NgModule({
  ...
  imports: [
    ...
    RouterModule.forRoot(appRoutes)
  ],
```

We can now add the **router-outlet** directive into our template. This marks the place in our document where we want angular router to load the component of the currently selected route.

```html
<div class="row">
  <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
    <router-outlet></router-outlet>
  </div>
</div>
```

Navigating through links can be done using the directive **routerLink** that angular provides. We can also make use of property binding for routerLink wherein we pass an array of individual path elements as illustrated below.

```html
<li role="presentation" class="active"><a routerLink="/">Home</a></li>
<li role="presentation"><a routerLink="/servers">Servers</a></li>
<li role="presentation"><a [routerLink]="['/users']">Users</a></li>
```

##### Styling Active Router Links

Angular gives us the directive **routerLinkActive** to dynamically style an element. In the example below, active is the class used by bootstrap to define an active nav tab. We however need to make use of **routerLinkActiveOptions** as a property binding since without it, the path `/` will be active for every path, because the behavior of routerLinkActive is that it sets the link to active if the URL **contains** the beginning of the path, in this case, `/` will be active for all paths.

We pass the javascript object `exact: true` to routerLinkActiveOptions to tell angular that the link will be active if and only if its address is /.

```html
<li
  role="presentation"
  routerLinkActive="active"
  [routerLinkActiveOptions]="{exact: true}"
>
  <a routerLink="/">Home</a>
</li>
<li role="presentation" routerLinkActive="active">
  <a routerLink="/servers">Servers</a>
</li>
<li role="presentation" routerLinkActive="active">
  <a [routerLink]="['/users']">Users</a>
</li>
```

##### Navigating Programmatically

We can navigate programatically by injecting **Router** to a component. A route is defined by an array of the single or different elements of a new path.

```typescript
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  onLoadServers() {
    this.router.navigate(["/servers"]);
  }
}
```

Unlike routerLink which always knows the current loaded route, Router does not. If we want to tell navigate where we currently are, we can to pass a second argument. We need to inject the current active route via **ActivatedRoute**. For the below example, if we call onReload while we are on `/servers`, we will end up in `/servers/servers`

```typescript
export class ServersComponent implements OnInit {
  ...
  constructor(private router: Router, private route: ActivatedRoute) { }

  onReload() {
    this.router.navigate(['servers'], {relativeTo: this.route})
  }
}
```

##### Passing Parameters to Routes

We can add dynamic segments to our paths using `:`.

```
const appRoutes: Routes = [
  {
    path: 'users/:id/:name',
    component: UserComponent
  },
]
```

If we want to access the parameters that are encoded in the url, we can inject **ActivatedRoute**, and then retrieve the parameters from the snapshot.params object.

```typescript
export class UserComponent implements OnInit {
  user: { id: number; name: string };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = {
      id: this.route.snapshot.params["id"],
      name: this.route.snapshot.params["name"],
    };
  }
}
```

We can now access the parameters in our template.

```html
<p>User with ID {{user.id}} loaded.</p>
<p>User name is {{user.name}}</p>
```

The following URL `http://localhost:4200/users/05/doge` will output the following:

```
User with ID 05 loaded.
User name is doge
```

The above implementation however is flawed, because if we reaccess the same endpoint `/id/name` from within this endpoint, the returned values will stay the same. This is because of **snapshot**. Instead, we can set up a subscription using **params** which is an observable.

An observable is a feature added by some third-party package which allows us to work with asynchronous tasks. In other words, it is a way to subscribe to some future event and then execute some command when it happens.

```typescript
export class UserComponent implements OnInit, OnDestroy {
  user: {id: number, name: string};
  paramsSubscription: Subscription

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    ...
    this.paramsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.user.id= params['id']
        this.user.name = params['name']
      }
    )
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe()
  }
}
```

**params.subscribe** takes in a function that will be fired whenever new data is sent through and the parameters have changed. We implement **onDestroy** because we need to unsubscribe to the subscription once the component is destroyed to avoid memory leaks. This is optional for this component since angular does this behind the scenes, but if we were to write our own observables, this should be considered.

##### Nested Routing

Child routes can be setup using the **children** property of Routes.

```typescript
{
    path: "servers",
    component: ServersComponent,
    children: [
      {
        path: ":id/edit",
        component: EditServerComponent,
      },
      {
        path: ":id",
        component: ServerComponent,
      },
    ],
  },
```

These child routes will need an outlet where it will be loaded. In our servers.component template, we add the router-outlet. This will add a new hook that will be used on all child routes of the route being loaded on `/servers`

```html
<router-outlet></router-outlet>
```

##### Query Parameters and Fragments

We can add query parameters by making use of the **queryParams** property. It is important to note that **queryParams** is not a directive, it is a bindable property of the routerLink directive. We also have the property fragment which adds a # anchor.

```html
<a
  [routerLink]="['/servers', 5, 'edit']"
  [queryParams]="{allowEdit: '1'}"
  fragment="loading"
  href="#"
  class="list-group-item"
  *ngFor="let server of servers"
></a>
```

Clicking the above link will bring us to `/servers/5/edit?allowEdit=1#loading`

We can also do this programatically. Take for instance the following template wherein we pass a number to the onLoadServers method:

```html
<button class="btn btn-primary" (click)="onLoadServers(1)">Load Servers</button>
```

```typescript
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onLoadServers(id: number) {
    this.router.navigate(["/servers", id, "edit"], {
      queryParams: { allowEdit: "1" },
      fragment: "testing",
    });
  }
}
```

Clicking on the button will bring us to `http://localhost:4200/servers/1/edit?allowEdit=1#testing`

To retrieve query parameters and fragments, we need to inject **ActivatedRoute**. Similar to passing parameters to routes as above, we can use **snapshot** but it brings the same disadvantages.

```typescript
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.queryParams)
    console.log(this.route.snapshot.fragment)
  }
```

##### Handling of Query Parameters

In the example below, we only allow the user to edit the server with an id of 3.

```html
<a
  [routerLink]="['/servers', server.id]"
  [queryParams]="{allowEdit: server.id === 3 ? '1' : '0'}"
  fragment="loading"
  href="#"
  class="list-group-item"
  *ngFor="let server of servers"
></a>
```

Inside the edit-server component, we need to add a new property allowEdit and setup a subscription to it. The following code simply sets allowEdit property to true if the **allowEdit link parameter** is set to 1.

```typescript
export class EditServerComponent implements OnInit {
  allowEdit = false
  ...
  ngOnInit() {
    ...
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.allowEdit = queryParams['allowEdit'] === '1' ? true : false
      }
    )
  }
```

The problem is, once we navigate away from the page, ie, when clicking the edit button, we will lose our query parameters.

To preserve the query parameters once we navigate further into our component, we can use the **queryParamsHandling** property of Router's navigate method. The following is to be added in server component.

```html
<button class="btn btn-primary" (click)="onEdit()">Edit Server</button>
```

```typescript
  onEdit() {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve'
    })
  }
```

##### Redirecting and Wildcards

We can rediret the user using the **redirectTo** property of Routes. The double asterisk path means to catch all paths that are not included in the app. This route should be the last to be declared.

```typescript
  ...
  {
    path: "not-found",
    component: PageNotFoundComponent,
  },
  {
    path: "**",
    redirectTo: "/not-found",
  },
```

##### Outsourcing Routing to its own Module

We created a new file _app-routing.module.ts_. We need to pass the RouterModule to the export property of NgModule, so that it will be accessible in the destination module.

```typescript
const appRoutes: Routes = [
  ...
  ]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
```

We can now then import it to app.module

```typescript
  imports: [
    ...
    AppRoutingModule
  ],
```

##### Route Guards

A Route Guard is a functionality that is executed before a route is loaded or once we want to leave a route.

We first created a fake authentication service _auth.service.ts_

```typescript
export class AuthService {
  loggedIn = false;

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.loggedIn);
      }, 800);
    });
    return promise;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}
```

We then create the service _auth-guard.service.ts_ which implements **canActivate**. Our canActivate method takes 2 arguments: AcitvatedRouteSnapshot and RouterStateSnapshot.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().then((authenticated: boolean) => {
      if (authenticated) {
        return true;
      } else {
        this.router.navigate(["/"]);
      }
    });
  }
}
```

We inject Router and our AuthService into this service. The canActivate method returns a promise in this case. To use the guard, we should define in our app-routing module which routes should be protected by the guard. With the below change, the routes for /servers will be guarded. This means that servers and its child routes if AuthGuard's **canActivate** method returns true

```typescript
    path: "servers",
    canActivate: [AuthGuard],
    component: ServersComponent,
    children: [
      {
        path: ":id/edit",
        component: EditServerComponent,
      },
      {
        path: ":id",
        component: ServerComponent,
      },
    ],
  },
```

We will then need to provide them in the app module

```typescript
providers: [ServersService, AuthService, AuthGuard],
```

We can also protect child routes with **canActivateChild**. Since this example will use the same logic as canActivate, we just simply returned canActivate.

```typescript
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
```

Using it is the same as above, we just need to set the canActivateChild property of Route.

```typescript
    path: "servers",
    canActivateChild: [AuthGuard],
    component: ServersComponent,
    children: [
      {
        path: ":id/edit",
        component: EditServerComponent,
      },
      {
        path: ":id",
        component: ServerComponent,
      },
    ],
  },
```

This now allows us to access `/servers`, but when we navigate to a child component, we get redirected back to home in 800ms.

To test out the route guards, we created a fake authentication service in the home component.

```html
<button class="btn btn-default" (click)="onLogin()">Login</button>
<button class="btn btn-default" (click)="onLogout()">Logout</button>
```

```typescript
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ...
  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
  }
}
```

##### Controlling Navigation with canDeactivate

With canDeactivate, we can control whether a user is allowed to leave a route. We start by adding a new property to edit-server which we set to true once a server instance is updated. With this, we redirect the user afterwards using Router. In this case, the user is redirected one level above relative to the current route.

```typescript
  constructor(
    private serversService: ServersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  changesSaved = false;

  onUpdateServer() {
    ...
    this.changesSaved = true;
    this.router.navigate(["../"], { relativeTo: this.route });
  }
```

To prevent users from accidentally navigating away, we can make use of canDeactivate method. We first create a new service under edit-server directory called _can-deactivate-guard_. In it, we create an interface **CanComponentDeactivate** has a method canDeactivate() that takes no arguments and returns either an Observable that resolves to a boolean, a promise that resolves to a boolean or a boolean.

The class CanDeactivateGuard is then created which implements the generic type **CanDeactivate** from angular router which wraps our CanComponentDeactivate interface. The canDeactivate() method of this class will be called by angular router once we try to leave a route.

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
```

We then add the guard service to our app-routing module

```typescript
      {
        path: ":id/edit",
        component: EditServerComponent,
        canDeactivate: [CanDeactivateGuard]
      },
```

and provide it to our app module

```typescript
providers: [ServersService, AuthService, AuthGuard, CanDeactivateGuard],
```

We now implement the interface CanComponentDeactivate to our edit-server component. Here is where we implement the actual logic for checking if we are allowed to leave a route.

```typescript
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }
    if (
      (this.serverName !== this.server.name ||
        this.serverStatus !== this.server.status) &&
      !this.changesSaved
    ) {
      return confirm("Do you want to discard changes?");
    } else {
      true;
    }
  }
}
```

##### Passing Data to a Route

We can pass static data to a route using the _data_ property of Route.

```typescript
  {
    path: "not-found",
    component: ErrorPageComponent,
    data: {
      message: "Page not found!",
    },
  },
```

We can then use it in our error-page component. We can either assign it directly into a property, or make use of subscribe which is useful in case the data is expected to change.

```typescript
export class ErrorPageComponent implements OnInit {
  errorMessage: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.errorMessage = this.route.snapshot.data["message"];
    this.route.data.subscribe((data: Data) => {
      this.errorMessage = data["message"];
    });
  }
}
```

Aside from static data, we can also fetch dynamic data. First we set up a resolver server-resolver.service.ts that will be run before a route is rendered. The difference of this with canActivate is that the resolver will always render the component in the end.

The resolver will implement **Resolve** which resolves into a server object with an id, name, and status. The method resolve will take in 2 arguments: AcitvatedRouteSnapshot and RouterStateSnapshot. We can make use of our ServersService getServer() method that returns a server object,

```typescript
interface Server {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ServerResolver implements Resolve<Server> {
  constructor(private serversService: ServersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Server> | Promise<Server> | Server {
    return this.serversService.getServer(+route.params["id"]);
  }
}
```

After providing ServerResolver in our app module, we can now add it into the routing module. We assign a key value pair of server and ServerResolver, which returns a Server object that will be stored into the **myServer** property that will be available in the component.

```typescript
{
    path: "servers",
    // canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: ServersComponent,
    children: [
      ...
      {
        path: ":id",
        component: ServerComponent,
        resolve: {
          myServer: ServerResolver
        }
      },
    ],
  },
```

Basically, the method **resolve()** will be called by Angular when the router is loaded. With this, the code from ngOnInit() of our server-component is now redundant and we can remove it. The object returned by the resolver will go into a **data** property.

```typescript
  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.server = data["myServer"];
    });

    // const id = +this.route.snapshot.params['id']
    // this.server = this.serversService.getServer(id);
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.server = this.serversService.getServer(+params['id'])
    //   }
    // )
  }
```

## Project: Routing

##### Setting up Routes

We set up the routes in a new file app-routing.module.ts. We need to use `pathMatch: 'full'` because if we set it to the default value of prefix, we will always be redirected from any path.

```typescript
const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "/recipes",
    pathMatch: "full",
  },
  {
    path: "recipes",
    component: RecipesComponent,
  },
  {
    path: "shoping-list",
    component: ShoppingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

Afterwards, we also add it into the imports of the app module.

```typescript
  imports: [BrowserModule, FormsModule, AppRoutingModule],
```

Finally we used `router-outlet` to render to the page

```html
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
```

With routing, we no longer need to use click event listeners and emitters in our header component for navigation. Using the routerLinkActive directive wherein we define the class we want to attach to the element when the current route of the nested element (in this case, a) is active.

```html
<ul class="nav navbar-nav">
  <li routerLinkActive="active">
    <a routerLink="/recipes">Recipe</a>
  </li>
  <li routerLinkActive="active">
    <a routerLink="/shopping-list">Shopping List</a>
  </li>
</ul>
```

##### Child Routing

We add a child route to our app-routing module. There is a child route with a dynamic segment for `id`

```typescript
  {
    path: 'recipes',
    component: RecipesComponent,
    children: [
      {
        path: '',
        component: RecipeStartComponent,
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
      },
    ],
  },
```

To load a specific recipe by the id, we can configure route parameters. First we need to create a new method in our recipe service for getting a recipe by its id.

```typescript
  getRecipeById(id:number) {
    return this.recipes[id]
  }
```

We then need to get access to ActivatedRoute by injecting it into our recipe-detail component. Since this component's value will possibly change after being rendered, we need to subscribe to it. We do so by subscribing to the **params** observable of Route. We make sure to cast params['id'] into a number.

```typescript
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // const id = this.route.snapshot.params['id']
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipeById(this.id);
    });
  }
```

We can setup the links by passing dynamic parameters to these links with routerLink. We need to be able to send the recipe id to the recipe-item component. We can do so by property binding from the recipe-list template

```html
<app-recipe-item
  *ngFor="let recipeEl of recipes; let i = index"
  [recipe]="recipeEl"
  [id]="i"
  (recipeSelected)="onRecipeSelected(recipeEl)"
></app-recipe-item>
```

We make sure to include this bound property using Input() decorator to the recipe-item component

```typescript
export class RecipeItemComponent implements OnInit {
  @Input() id: number;
  ...
}
```

And finally apply it to the recipe-item template

```html
<a
  [routerLink]="[id]"
  style="cursor: pointer"
  class="list-group-item clearfix"
></a>
```

To implement the page for editing recipes, we start by creating the recipe-edit component and adding it into the app-routing module. It is important to note that the hardcoded `new` path should be declared before the dynamic paths.

```typescript
{
        path: 'new',
        component: RecipeEditComponent,
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
      },
```

We can retrieve the recipe id from the route parameters by first injecting ActivatedRoute into the recipe-edit component. At the same time, we also check if the route being passed has an id, if it does not, **params['id']** will return null, thereby editMode will be set to false which means we are in new recipe mode.

```typescript
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null;
      console.log(this.editMode);
    });
  }
}
```

To add the navigation to `/new`, we just add a click event listener and its corresponding method. We can inject Router and use its navigate() method, together with ActivatedRoute to get the current route which will be passed to **relativeTo**.

```html
<button class="btn btn-success" (click)="onNewRecipe()">New Recipe</button>
```

```typescript
  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
```

## Observables

> Reference activity: [obs-01-start](https://github.com/demiglace0505/angular-course/tree/master/obs-01-start)

An observable are constructs to which we subscribe to be informed of changes in data. An observable can also be thought of as a data source. Between the observable and the observer, there is a stream wherein we can have multiple events emitted by the observable. Data sources may come from user input, HTTP requests or can be triggered in code. The observer has 3 hooks for handling data packages: normal data, errors or completion of the observable. Using code, we can define what should happen if we receive a new data package.

```typescript
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
    });
  }
```

In the example above, _params_ is an observable, and it is a stream of route parameters, which gives us a new _route_ parameter whenever we go to a new page (change in url). We then get the new params in the function we pass to subscribe, and get the id param from that.

##### Building own Observable

We create our own simple observable using the **interval()** method from rxjs library. This method will emit an event every interval that gets passed into it. We then subscribe to the observable and pass an anonymous function which gets the value that is emitted to the **count** argument.

The subscribe method returns a **Subscription**, wherein we can store the subscription data. We call **unsubscribe** method on the ngOnDestroy() lifecycle to unsubscribe to the subscription.

This will print out an incrementing value every second. And will stop once you navigate outisde the home.component.

```typescript
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.firstObsSubscription = interval(1000).subscribe((count) => {
      console.log(count);
    });
  }

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
}
```

We can build the above observable from the ground up too. We use the **Observable.create()** method which takes in an anonymous function and takes in an observer as an argument. The observer has the **next()** method which is used to emit a new value. We pass the _count_ variable into next to let the observer know that the count variable has new data. We then subscribe to our custom observable using the **subscribe()** method as before.

```typescript
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe((count) => {
    //   console.log(count);
    // });
    const customIntervalObservable = Observable.create((observer) => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        if (count == 2) {
          observer.complete();
        }

        if (count > 3) {
          observer.error(new Error("Count is greater than 3"));
        }
        count++;
      }, 1000);
    });

    this.firstObsSubscription = customIntervalObservable.subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        console.log("Complete!");
      }
    );
  }

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
}
```

We can also handle errors by passing a second argument to the subscribe() method. This argument is a function that will get executed when an error occurs.

To react to a completion, we can add a third argument to the subscribe() method. It is a function that takes no arguments since completing doesn't pass any arguments. If the observable completes, we don't need to call unsubscribe.

##### Operators

Sometimes we might not need the raw data that we get from a subscription. At times, we might transform the data. We can make use of Operators instead of transforming the data from within the function/subscription. We can do this by calling an observable's **pipe()** method, which every observable has. In the example below, we make use of the **map** operator.

```typescript
    const myOperator = customIntervalObservable.pipe(
      map((data: number) => {
        return "Round: " + (data + 1);
      })
    );

    this.firstObsSubscription = myOperator.subscribe(
      ...
```

##### Subject

A subject is a special kind of observable. It is an object to which we can subscribe to, but we can actively call the method **next()** from outside.

The example below shows a traditional way of conditionally rendering a component using click event emitters and ngIf. We create a new service user.service and add an event emitter that resolves to a boolean to it

```typescript
@Injectable({ providedIn: "root" })
export class UserService {
  activatedEmitter = new EventEmitter<boolean>();
}
```

We then inject this service to our user.component and listen to the click event onActivate()

```typescript
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  onActivate() {
    this.userService.activatedEmitter.emit(true);
  }
```

We then set up a listener in our app.component

```typescript
export class AppComponent implements OnInit {
  userActivated = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.activatedEmitter.subscribe((didActivate) => {
      this.userActivated = didActivate;
    });
  }
}
```

Then we include a conditional ngIf in our template

```html
<p *ngIf="userActivated">Activated!</p>
```

We can recreate the above functionality using Subjects. We start by writing the service. The Subject in this case emits a boolean data.

```typescript
export class UserService {
  activatedEmitter = new Subject<boolean>();
}
```

Then, we can use the Subject's next method from the click listener

```typescript
  onActivate() {
    this.userService.activatedEmitter.next(true);
  }
```

We still need to call **subscribe()** on the subject, since it is still an observable

```typescript
export class AppComponent implements OnInit, OnDestroy {
  userActivated = false;
  private activatedSub: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activatedSub = this.userService.activatedEmitter.subscribe(
      (didActivate) => {
        this.userActivated = didActivate;
      }
    );
  }

  ngOnDestroy() {
    this.activatedSub.unsubscribe();
  }
}
```

## Project: Observables

We updated our shopping-list.service to make use of Subjects instead of Event Emitters

```typescript
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient("apples", 5),
    new Ingredient("oranges", 2),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addMultipleIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
```

We then go to our shopping-list.component and store our subscription to the property igChangeSub and unsubscribe from it on destroy.

```typescript
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private igChangeSub: Subscription;

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy() {
    this.igChangeSub.unsubscribe();
  }
}
```

## Forms

There are two approaches to handling forms in Angular: Template-Driven and Reactive. In Template-Driven, Angular automatically infers which controls our form has from the DOM. In the Reactive approach, the form is created programatically wherein we define its structure in the code, setup the HTML and manually connect it. The Reactive approach offers greater control and flexibility.

##### Template-Driven Forms

> Reference activity: [forms-td-start](https://github.com/demiglace0505/angular-course/tree/master/forms-td-start)

We need to make sure that **FormsModule** is incldued as an import in our app.module. With this, Angular automatically generates the javascript representation from our form tags. To add an input as a control, we need to add the directive **ngModel** as a property, and also a _name_ property.

To submit a form, we use the directive **ngSubmit**. This directive will be fired whenever the form is submitted. To access the form elements, we can use local references, in this case, _#f_ and pass it into the onSubmit() method.

```html
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
  ...
  <button class="btn btn-primary" type="submit">Submit</button>
</form
```

```typescript
  onSubmit(f: NgForm) {
    console.log(f);
  }
```

We can also access an element using the **@ViewChild** decorator

```typescript
  @ViewChild("f") signupForm: NgForm;

  onSubmit() {
    console.log(this.signupForm);
  }
```

For form validation, we can make use of property binding and bind it to the previous local reference to _f_. We could also select css classes, in this case we select input elements with the classes ng-invalid and ng-touched. These will have a red border. The ng-touched class will only activate once the input element has been touched.

```html
<button class="btn btn-primary" type="submit" [disabled]="!f.valid"></button>
```

```css
input.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

An easy way to get access to the control created by Angular is to associate a local reference to the element and binding it to **ngModel** which exposes the information about this control.

```html
<input ... #email="ngModel" />
<span class="help-block" *ngIf="!email.valid && email.touched"
  >Please enter a valid email!</span
>
```

Using ngModel property binding, we can also select a default value for select tags. We can also use two-way binding to instantly display a value for instance as shown below in the _textarea_ element

```html
  <select
    [ngModel]="defaultQuestion"
    name="secret"
    id="secret"
    class="form-control"
  >
    <option value="pet">Your first Pet?</option>
    <option value="teacher">Your first teacher?</option>
  </select>
</div>
<div class="form-group">
  <textarea
    class="form-control"
    name="questionAnser"
    rows="3"
    [(ngModel)]="answer"
  ></textarea>
</div>
<p>Your reply: {{ answer }}</p>
```

We can group form controls together by adding the directive **ngModelGroup** to a parent container. In this example, the output will have a _userData_ property inside _value_ that contains the email and username input. Aside from this, we can access the javascript representation of the control by using a local reference, in this case, #userData.

```html
<div id="user-data" ngModelGroup="userData" #userData="ngModelGroup"></div>
```

We can also patch values into a group of inputs using the **patchValue()** method available to forms wrapped by ngForm.

```typescript
this.signupForm.form.patchValue({
  userData: {
    username: suggestedName,
  },
});
```

##### Reactive Forms

> Reference activity: [forms-reactive-start](https://github.com/demiglace0505/angular-course/tree/master/forms-reactive-start)

In Reactive forms, the forms are created programmatically in TypeScript. We first initialize the form by calling a new instance of **FormGroup**. Inside, we add controls to the form using **FormControl**. The first argument for FormControl is the initial state, the second is a validator or array of validators to be applied to this form and the third is for async validators.

```typescript
  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null),
      gender: new FormControl("male"),
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }
```

To synchronize our forms with the html inputs, we first need to add the directive **formGroup** via property binding to our form tag. We need to import ReactiveFormsModule in our app.module to do so. To connect the controls from our html template, we use the directive **formControlName** which we can use using either string or by property binding to the property we initialized earlier. Submitting the form is identical with template-driven forms, wherein we use the **ngSubmit** directive, but this time, we don't need to get the form using local reference anymore.

```html
<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="username">Username</label>
    <input
      formControlName="username"
      type="text"
      id="username"
      class="form-control"
    />
  </div>
  <div class="form-group">
    <label for="email">email</label>
    <input
      [formControlName]="'email'"
      type="text"
      id="email"
      class="form-control"
    />
  </div>
  <div class="radio" *ngFor="let gender of genders">
    <label>
      <input formControlName="gender" type="radio" [value]="gender" />{{ gender
      }}
    </label>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

In the reactive approach, we can add validation using the second argument for FormControl.

```typescript
this.signupForm = new FormGroup({
  username: new FormControl(null, Validators.required),
  email: new FormControl(null, [Validators.required, Validators.email]),
  gender: new FormControl("male"),
});
```

To get access to our controls, we can use the FormGroup's **get** method. We pass into the get method the path to the element.

```html
<span
  class="help-block"
  *ngIf="
    !signupForm.get('username').valid && signupForm.get('username').touched
  "
  >Please enter a valid username</span
>
```

We can also group form controls using the **formGroupName** directive. With this, we need to update the structure of the form in the app.component typescript.

```html
<div formGroupName="userData">
  <div class="form-group">...</div>
</div>
```

```typescript
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      }),
      gender: new FormControl("male"),
    });
  }
```

For array controls, we can make use of **FormArray**. We then use the FormGroup's get method to extract the hobbies FormArray, which we explicitly cast to FormArray. We can add a new control to the form using the array.push method.

```typescript
  ngOnInit() {
    this.signupForm = new FormGroup({
      ...
      hobbies: new FormArray([]),
    });

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get("hobbies")).push(control);
  }

  getControls() {
    return (<FormArray>this.signupForm.get("hobbies")).controls;
  }
```

We then synchronize this to our html template. We can do so using **formArrayName** directive. We then have to make use of property binding to bind **formControlName** to the index.

```html
<div formArrayName="hobbies">
  <h4>Your hobbies</h4>
  <button class="btn btn-default" type="button" (click)="onAddHobby()">
    Add Hobby
  </button>
  <div
    class="form-group"
    *ngFor="let hobbyControl of getControls(); let i = index"
  >
    <input type="text" class="form-control" [formControlName]="i" />
  </div>
</div>
```

At this point, we can now find the properties for the hobbies array in:

```
value: {
  ...
  hobbies: [
    ...
  ]
}
```

With reactive forms, we can easily build our own custom validators. A validator is a function that angular executes automatically when it checks the validity of the form control. The validator needs to take an argument of FormControl and returns an object with a string key and boolean value. The following example checks if the value being input is included in an array of forbidden values. In this case, the function returns the key _nameIsForbidden_ with value true. Otherwise, the function should return null.

```typescript
  // including the validator
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this),
        ]),
  ...

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1)  {
      return {'nameIsForbidden': true}
    }
    return null
  }
```

The _nameIsForbidden_ is our error code. We can make use of the error message in our template.

```html
<span *ngIf="signupForm.get('userData.username').errors['nameIsForbidden']"
  >This username is forbidden</span
>
<span *ngIf="signupForm.get('userData.username').errors['required']"
  >This field is required</span
>
```

Asynchronous validators can also be used. This time, it returns a promise which resolves to a key value pair of the error message and boolean. Asynchronous validators are used as the third argument to our FormControl.

```typescript
  email: new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),

  //...

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true})
        } else {
          resolve(null)
        }
      },1500)
    })
    return promise
  }
```

With reactive forms, we can also subscribe and react to changes in status and value. These are hooks (observables) that we can listen into for changes.

```typescript
this.signupForm.valueChanges.subscribe((value) => {
  console.log(value);
});

this.signupForm.statusChanges.subscribe((status) => {
  console.log(status);
});
```

Aside from listening for changes, we can also update the forms. We can use either **setValue** or **patchValue**

```typescript
this.signupForm.setValue({
  userData: {
    username: "Max",
    email: "Max@max.com",
  },
  gender: "male",
  hobbies: [],
});

this.signupForm.patchValue({
  userData: {
    username: "Anna",
  },
});
```

### Project: Forms

##### Shopping-List edit: Template-driven approach

We will be making use of template-driven forms in this project. We make use of (ngSubmit) for form submission, and we will use a local reference on the form element to obtain access to the form javascript that angular creates. The form object passed into onAddItem is of type NgForm. We then add the **ngModel** directives and name property to our inputs. We also added validators to the form inputs. Other than required, we used the **[pattern]** built in validator, which will check user input against a regular expression. In this case, we only want positive integers.

```html
<form (ngSubmit)="onAddItem(f)" #f="ngForm">
  <input
    type="number"
    class="form-control"
    id="amount"
    ngModel
    name="amount"
    required
    [pattern]="'^[1-9]+[0-9]*$'"
  />
</form>
```

```typescript
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.slService.addIngredient(newIngredient);
  }
```

For editting a shopping list item, we first added a new subject startedEditing to the shopping-list.service which will hold a number in the end.

```typescript
startedEditing = new Subject<number>();
```

We then make use of the shopping-list.service to then send the _index_ to our subject from the shopping-list component.

```typescript
  onEditItem(index: number) {
    this.slService.startedEditing.next(index)
  }
```

This will allow us to listen to this subject from other place, in this case, the init component of shopping-edit. In here, we set editedItem into our ingredient using the getIngredient method from our shopping-list.service. We make use of **@ViewChild** decorator in order to access our form, with the reference _f_.

```typescript
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
```

We also added functionality for editing an ingredient and deleting an ingredient. We add the following method to the shopping-list.service

```typescript
  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
```

We then have to call the updateIngredient() method from shopping-edit.component if we are on edit mode. Otherwise, addIngredient will be fired.

```typescript
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
  }
```

##### Recipe edit: Reactive approach

We started out by creating a bare template for the form. At this point, it is important to know whether we are on edit mode or in new mode, because we might need to prepopulate fields. We start by creating a private method initForm() in our recipe-edit.component. IIn this private method, we initialize our **FormGroup** which takes a javascript object containning key value pairs for the controls we want to register. We call our initForm() method in our init, right after a change in route parameters.

```typescript
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      // console.log(this.editMode);
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';

    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName),
      imagePath: new FormControl(recipeImagePath),
      description: new FormControl(recipeDescription),
    });
  }
```

We now have to sync the html template with our form. We begin by adding **ReactiveFormsModule** to our app module. We use the **formGroup** directive with property binding because we need to pass our recipeForm property into it. We then proceed to assign our controls to the inputs using **formControlName** directive

```html
<form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
  <input type="text" id="name" class="form-control" formControlName="name" />
  <input
    type="text"
    id="imagePath"
    class="form-control"
    formControlName="imagePath"
  />
  <textarea
    type="text"
    id="description"
    class="form-control"
    rows="6"
    formControlName="description"
  ></textarea>
</form>
```

To add the control for adding multiple ingredients, we need to instantiate a new **FormArray**. For each ingredient in the ingredients array of recipe, we will create a new **FormGroup** which will contain two form controls: one for the name and one for amount.

```typescript
let recipeIngredients = new FormArray([]);
if (recipe["ingredients"]) {
  for (let ingredient of recipe.ingredients) {
    recipeIngredients.push(
      new FormGroup({
        name: new FormControl(ingredient.name),
        amount: new FormControl(ingredient.amount),
      })
    );
  }
}

this.recipeForm = new FormGroup({
  ...
  ingredients: recipeIngredients,
});
```

We then need to synchronize our html template once again. We use **formArrayName** directive, which is bound to the ingredients property of the FormGroup above. Inside this formArrayName, we have a container div for the form group. To obtain the control, we used a helper getter **get controls()** which we then loop through for each control. We use property binding to bind **formGroupName** to the index of control in the for loop. We finally make use of the **formControlName** directive for the two inputs, one for the name and another for amount.

```typescript
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls
  }
```

```html
<div class="col-xs-12" formArrayName="ingredients">
  <div
    class="row"
    *ngFor="let ingredientControl of controls; let i = index"
    [formGroupName]="i"
  >
    <div class="col-xs-8">
      <input type="text" class="form-control" formControlName="name" />
    </div>
    <div class="col-xs-2">
      <input type="number" class="form-control" formControlName="amount" />
    </div>
    <div class="col-xs-2">
      <button class="btn btn-danger">X</button>
    </div>
  </div>
</div>
```

We also added a button for adding additional forms for more ingredients. In the method onAddIngredient(), we add a new FormGroup containing two FormControls with blank default values by pushing into our recipeForm's _ingredients_ array. We need to cast this into `<FormArray>` before doing so.

```typescript
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(),
        amount: new FormControl(),
      })
    );
  }
```

To delete ingredient forms, we need to create the onDeleteIngredient method. We use the FormGroup's **removeAt()** method to delete a form based on its index.

```typescript
  onDeleteIngredient(index:number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
  }
```

##### Validating

For validators, we used the built in required validators, and we also created our own validator via regex that only takes positive integers using **Validators.pattern()**

```typescript
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }
});
```

We then add this to the html template by binding disabled to recipeForm.valid

```html
<button class="btn btn-success" type="submit" [disabled]="!recipeForm.valid">
  Save
</button>
```

And for styling:

```css
input.ng-invalid.ng-touched,
textarea.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

To submit changes, whether by adding a new recipe or updating an old recipe, we need to add new methods to our recipe.service.

```typescript
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
  }
```

We then create our onSubmit() method:

```typescript
  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe)
    }
  }
```

But since the values from the form has exactly the same format as our recipe model and the same names, we can use a shorthand:

```typescript
if (this.editMode) {
  this.recipeService.updateRecipe(this.id, this.recipeForm.value);
} else {
  this.recipeService.addRecipe(this.recipeForm.value);
}
```

And finally, to refresh our recipes list when a new one gets added or something gets changed, we set up a Subject, wherein we pass an array of Recipe objects. The following is added in our recipe.service, and for recipe-list.component, we set up a subscription to the subject.

```typescript
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
}
```

```typescript
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
```

### Pipes

> Reference Activity: pipes-start

Pipes allows us to transform output in our template. There are multiple built-in pipes in [Angular](https://angular.io/api?query=pipe) . We can configure pipes to suit our needs by parameterizing them using the `:` symbol. The _date_ pipe expects a string for its parameter.

```html
{{ server.started | date: "fullDate" | uppercase }}
```

The following results to

```
MONDAY, AUGUST 9, 1920
```

We can also create our own custom pipes. We create our _name.pipe.ts_ file and implement the transform method. We receive the value to be transformed that is of type any, and then the list of arguments. The **Pipe** decorator is needed when declaring a pipe.

```typescript
@Pipe({
  name: "shorten",
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, limit: number) {
    if (value.length > limit) {
      return value.substr(0, limit) + " ...";
    }
    return value;
  }
}
```

To use a custom pipe, we need to add it to app.module declaration, and then use it like we would a built in pipe.

```html
{{ server.name | shorten }}
```

We also created our own filter pipe. This filter takes a second argument for filterString, which in this case is a two-way-bound property _filteredStatus_ from our input element. The third argument propName, is hardcoded to the server property _status_.

```typescript
  servers = [
    {
      ...
      status: "stable",
    },
    ...
  ];
  filteredStatus = "";
```

```typescript
@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propName: string): any {
    const resultArr = [];
    if (value.length === 0 || filterString === "") {
      return value;
    }

    for (const item of value) {
      if (item[propName] === filterString) {
        resultArr.push(item);
      }
    }
    return resultArr;
  }
}
```

To use the filter, we just chain colons to for our parameters. filteredStatus will get passed into the filterString argument, and status into propName argument. The servers array will thus then get filtered with status according to what we pass into the input field.

```html
<input type="text" [(ngModel)]="filteredStatus" />
<li *ngFor="let server of servers | filter: filteredStatus:'status'"></li>
```

It is important to note that updating arrays or objects doesn't retrigger a pipe. To force a pipe update, we can add the **pure** property in our Pipe decorator and set it to false.

For handling asynchronous data, we can use the built in **async** pipe. This pipe will be useful in http requests.

```html
<h2>App Status: {{ appStatus | async }}</h2>
```

```typescript
appStatus = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("stable");
  }, 2000);
});
```

### Http Requests

Angular doesn't connect to a database directly, because this is insecure. Instead, we send and receive HTTP requests to and from a server. The server is defined as an API, it can either be REST or GraphQL.

For this course, we used Firebase for the backend solution. We created a Realtime Database from the Firebase console, which we initialize in test mode. We need to import the HttpClientModule from the package @angular/common/http to our app.module. We then inject the HttpClient to our constructor.

```typescript
  constructor(private http: HttpClient) {}
```

To send an http POST request to firebase, we can make use of the HttpClient **post()** method. This takes the API url as its first argument witht he second argument being the request body. The Angular HttpClient automatically parses our javascript object into JSON format. Http requests are managed by observables. In this case, we need to subscribe to the observable that wraps our http request. Angular will then automatically extract and give us the response.

```typescript
  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content}
    this.http
    .post<{ name: string }>(
      "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
      postData
    )
    .subscribe((responseData) => {
      console.log(responseData);
    });
  }
```

The following returns an object with a cryptic name, and inside are the properties we passed in postData.

```
-Mkliu8WR5rx2yY4-WaY: {content: '123', title: 'test'}
```

For fetching data, we can make use of the **get()** method. Since we will be receiving a javasciprt object from the get request, we need to use RxJS Operators to transform the response data into a suitable form, in this case an array of Post. The example service below makes use of the **map** operator which gets some data and returns new data that is automatically re-wrapped into an observable. The following code maps the javascript object we received from above into an array, and takes the key (the cryptic value) into an id property. In the angled brackets, we define the response body type to be received. It is important to note that the whole observable gets returned, which we subscribe to in our component.

```typescript
  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }
```

Managing the loading status and data can be left in the app component, while the logic itself is outsourced to the service, wherein we return an observable and subscribe to it from within the component.

##### Error handling

There are two ways of handling errors. First is by using the second argument for the subscribe() method.

```typescript
this.postsService.fetchPosts().subscribe(
  (posts) => {
    ...
  },
  (error) => {
    this.error = error.message;
    console.log(error);
  }
);
```

Another way is by using Subjects. We start by defining the subject, and then passing it into the second argument of our subscribe method and calling **next()**.

```typescript
  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        postData
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
```

From there, we could use subscriptions in places that we are interested in seeing the error message.

```typescript
  error = null;
  private errorSub: Subscription;
  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe((errMessage) => {
      this.error = errMessage;
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
```

There's also the special op'erator **catchError** from rxjs used together with **throwError** that yields a new observable from the errror.

```typescript
  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
      )
      .pipe(
        map(...),
        catchError(errorRes => {
          //
          console.log(errorRes)
          return throwError(errorRes)
        })
      );
  }
```

##### Configuring Requests

To configure our requests, such as setting up headers, we pass it as an object to the next argument of our method. Here, we pass on custom-header into our request headers, and print=pretty will be included in our URL parameters `https://....firebasedatabase.app/posts.json?print=pretty`

```typescript
  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        {
          headers: new HttpHeaders({
            "custom-header": "hello",
          }),
          params: new HttpParams().set("print", "pretty"),
        }
      )
```

For multiple params, we can make use of append() method

```
    let searchParams= new HttpParams()
    searchParams = searchParams.append('print', 'pretty')
    searchParams = searchParams.append('custom', 'key')
    ...
    params: searchParams
```

To be able to access to the other properties of the http response object, we can use the **observe** property. This will allow us access to the headers, status code, body etc.

The **tap()** method allows us to execute code without altering the response

```typescript
    createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        postData,
        {
          observe: "response",
        }
      )

  deletePosts() {
    return this.http
      .delete(
        "https://demiglace-angular-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        {
          observe: "events",
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);

        })
      );
  }
}
```

Angular HTTPClient also supports interceptors. We create a new service for this called auth-interceptor.service.ts and in it, we implement the **intercept()** method. This gets two arguments, first is of a request object of type HttpRequest and the second is the next function of type HttpHandler which will forward the request after the interceptor has run its code on the request object. We pass into next.handle the new request object, in this case, all new request headers will have an additional header of `Auth: xyz`.

```typescript
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = req.clone({
      headers: req.headers.append("Auth", "xyz"),
    });
    return next.handle(modifiedRequest);
  }
}
```

We can also use multiple interceptors, this time we add another interceptor for logging. Here we intercept the response using the pipe and tap methods. The order in which we provide them matters because that is the order in which they will fire. The services have to be provided in our app.module. Each object has 3 keys. The first is HTTP_INTERCEPTORS then the second is the class we want to add as an interceptor, in this case the auth-interceptor.service and the last key is for enabling multiple interceptors.

```typescript
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true,
    },
  ],
```

### Project: HTTP

For the RecipeBook project, we also used Firebase's Realtime database in test mode. Authentication will be added in the later section. I first added **HttpClientModule** to the app.module imports. We then created a new service data-storage.service. We also inject our recipe service into this service.

```typescript
@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService
  ) {}
}
```

Firebase provides the **put()** method to overwrite all data in the node. We write the following for saving the recipes array into our back end.

```typescript
storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(
        'https://demiglace-ng-recipe-book-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
```

To fetch our data, we make use of the **get()** method. We are interested in subscribing to this observable's response, wherein we subscribe from data-storage.service. We create a method setRecipes() for overwriting the recipes in our recipe.service.

```typescript
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice())
  }
```

```typescript
  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://demiglace-ng-recipe-book-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipesService.setRecipes(recipes);
        })
      );
  }
```

We also made use of pipe() and map() to transform our response data. This is done so that if ever we receive a recipe with no ingredients added to it, we can add an empty array instead. In here, we return the HttpClient observable, and we subscribe from the header component instead.

To resolve issues with data being accessed before being loaded, we can use a resolver which is code that is run before a route has loaded. We create a new service for this recipes-resolver.service which implements Resolve. We inject our data-storage.service in here because it will be the service that will make the http request.

```typescript
@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipesService.getRecipes();
    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
```

And in our app-routing.module, we add these resolver to the following routes

```typescript
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
```

What happens essentially is that we run our resolver function which fetches the recipes everytime we visit the route id of a specific recipe.

### Authentication and Route Protection

When a user enters his credentials, the authentication data is sent and validated in the server. In traditional web pages, where the server renders pages for different URLs, uses sessions. In single page applications we decouple the frontend from the backend. In our case, the pages we visit are handled by angular and its router. Hence we don't need a session because the backend RESTful API is stateless.

In this course, we will be taking a different approach. The server will validate the user email and password and if all data is valid, the server will send the client a JSON web token, which is an encoded string (not encrypted) which can be unpacked by the client. The client then stores the token, and attaches it to any request sent to the server which is then authenticated.

We started by creating our authentication page auth.component.html, which is visible to the public. We then register this new path to our app-routing.module.

```typescript
  {
    path: 'auth',
    component: AuthComponent,
  },
```

For this project, we will be using firebase backend for authentication. We set up the rules to our firebase realtime database. Aside from this, we enable e-mail sign in method.

```
{
  "rules": {
    ".read": "auth !=null",
    ".write": "auth !=null",
  }
}
```

##### Signup and Signin

For signing and signing in of users, we use the [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth#section-create-email-password). For this we create the service auth.service. Here we inject the angular HttpClient. We then send a POST request ot the URL provided by the Firebase Auth REST API documentation. The required payloads for the request body are email, password, and returnSecureToken. We consolidate our authentication response to an interface object, which expects the following properties: idToken, email, refreshToken, expiresIn, localId.

```typescript
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.'
        break;
    }
    return throwError(errorMessage);
  }
```

We can send the signup request through our auth.component. We subscribe to the observable that will be returned by the above signup method. For error handling, the logic for error handling is contained in the auth.service and we make use of the **catchError** rxjs operator alongside with the **throwError** function, which will create a new observable that wraps the error.

```typescript
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObservable: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
      },
      (errorResponse) => {
        this.error = errorResponse;
        this.isLoading = false;
      }
    );

    form.reset();
  }
```

##### Creating and Storing User Data

We first created a user.model. We then create a user property which is an rxjs subject in our auth.service. In our signup and login methods, We tap into the observable to perform some action without changing the response, in this case we set _user_ into a new User object using the prioperties received from pipe. We call the subject **next()** method on our _user_ property.

```typescript
export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
```

```typescript
export class AuthService {
  constructor(private http: HttpClient) {}
  user = new Subject<User>();

  signup(email: string, password: string) {
    //...
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn)
        })
      );
  }

  private handleAuthentication(email: string, userId:string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user)
  }
```

We then need to get the authentication status of a user to our header component. This is done by checking if a user has a valid token. Since we use a subject in our auth.service to manage our user, this will inform all places in our application whenever there are changes to our user. We subscribe our header component to our user through ngOnInit().

```typescript
  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
    });

      ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  }
```

##### Adding Tokens to Outgoing Requests

For on-demand fetching of user data, we make use of rxjs **BehaviorSubject**. The difference of this compared to Subject is that BehaviorSubject gives subscribers immediate access to the previously emitted values. This is initialized as null.

```typescript
user = new BehaviorSubject<User>(null);
```

We then fetch this data from data-storage.service. For this we make use of rxjs operator **take**. In this case, we only take one value from the observable, and then unsubscribe after. We make use of **exhaustMap**, which waits for the first observable to complete, in this case, the user observable, then afterwards, the data is extracted from the previous observable in which we return a new observable that will replace the previous observable in the chain.

```typescript
  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        console.log(user);
        return this.http.get<Recipe[]>(
          'https://demiglace-ng-recipe-book-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
          {
            params: new HttpParams().set('auth', user.token),
          }
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipesService.setRecipes(recipes);
      })
    );
  }
```

We can add the tokens in the Firebase realtime database API through query parameters, as shown above, or using interceptors as shown below.

```typescript
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authservice: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.authservice.user.subscribe();

    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const modifiedReq = req.clone({
          params: new HttpParams().set("auth", user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
```

The fetchRecipes() method can then be simplified

```typescript
  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://demiglace-ng-recipe-book-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipesService.setRecipes(recipes);
        })
      );
  }
```

We add the interceptors to our app.module

```typescript
  providers: [
    ShoppingListService,
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
```

To enable auto-login, we must store the token in a persistent storage. We can store the token in the localStorage.

```typescript
localStorage.setItem("userData", JSON.stringify(user));
```

To retrieve the stored token, we create a new method autoLogin()

```typescript
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    // check if valid token
    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }
```

We also need to implement the auto-logout since our tokens will expire eventually.

```typescript
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }
```

Thus, we need to update our handleAuthentication method accordingly to call autoLogout

```typescript
  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
```

And also to our autoLogin method

```typescript
  autoLogin() {
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
    this.autoLogout(expirationDuration)
  }
```

##### Auth Guard

Route guards allows us to run logic right before a route is loaded. Using route guards, we can prevent unauthenticated users from accessing protected routes. We create a new file auth.guard and export a class that implements the interface **CanActivate()**

```typescript
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        // const isAuth = !!user
        const isAuth = user ? true : false;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(["/auth"]);
      })
    );
  }
}
```

We then add **canActivate** to our app-routing, specifically for the /recipes route. We can redirect the user by returning a UrlTree to /auth in our canActivate() method.

```typescript
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    //...
  }
```

### Dynamic Components

Dynamic Components are components that are created dynamically during runtime. These are loaded programatically. There are two ways of creating components dynamically, first is with ngIf and the other is by using Dynamic Component Loader. wherein we imperatively create and add a component to the DOM via code.

#### Using ngIf

We created an alert modal component alert.component for this purposes. The template for this alert is as follows:

```html
<div class="backdrop"></div>
<div class="alert-box">
  <p>{{ message }}</p>
  <div class="alert-box-actions">
    <button class="btn btn-primary">Close</button>
  </div>
</div>
```

We use the Input decorator to allow the parent component to update the message property of the alert.component.

```typescript
export class AlertComponent {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
```

To use this, in our auth.component template, we use property binding to bind the message property into error. We also conditionally render this modal only when error exists.

```html
<app-alert
  [message]="error"
  *ngIf="error"
  (close)="onHandleError()"
></app-alert>
```

The modal can be closed by emitting an event from alert.component when the close button or outside is clicked. The onHandleError() of the auth.component will simply set error into null, hence making the modal disappear.

#### Programatic way

In auth.component, we create a new private method **showErrorAlert()**. We need to manually instantiate a component from within this method using the Angular component factory. We do so by importing the alert component and injecting the **ComponentFactoryResolver**. We pass into this resolver the type of object that we need, in this case, the AlertComponent. This method will return a component factory.

```typescript
  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
  }
```

We then need a place to attach this component in our DOM. We need a view container ref for this. For this, we create a helper directive _placeholder.directive.ts_. This directive injects the view container ref, which allows us to get information about the place where we use this directive.

```typescript
export class PlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
```

We can now add the modal to our template. The ng-template structural directive is perfect for the placeholder since it will not be rendered into the DOM.

```html
<ng-template appPlaceholder></ng-template>
```

We store the directive that we used in the template into ViewChild alertHost

```typescript
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
```

Now we get an access to the view container reference of the host, which we store in the variable hostViewContainerRef. We then call the **createComponent()** method and pass the factory into it.

```typescript
  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    // console.log(hostViewContainerRef);
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear()
    });
  }
```

To be able to pass data into the component, in this case, to display the error message and to be able to close the modal, we store the component reference into a variable and then use the **instance** property to access the component instance that was created. This instance should have the *message* and *close* properties from alert.component.


### Angular Modules

> Reference activity: 

Modules are ways of bundling angular building blocks such as components, directives, services, pipes etc. together. An app requires at least one module, the AppModule, but may be split into multiple modules.

In our app, we have three main feature areas: recipes, shopping list, and auth.

We create a new *recipe.modules.ts* file, wherein we transfer the declarations from app.module. We also use the same declarations in the exports array, in order to use them in any module that imports RecipeModule.

```typescript
@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  exports: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
})
export class RecipesModule {}
```

It is important to note that we still need to import RouterModule, CommonModule and ReactiveFormsModule. We then import this into outo our app.module.

```typescript
  imports: [
    ...
    RecipesModule
  ],
```

We can also outsource the recipes routing configuration away from the app-routing module into the recipes module. To do so, we use **forChild()**. We first create a new app-routing.module, which will contain the route setup.

```typescript
const routes: Routes = [
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RecipeStartComponent,
      },
      {
        path: 'new',
        component: RecipeEditComponent,
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
```

Likewise, we can bundle up our shopping-list related components into a new shopping-list.module.

```typescript
@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'shopping-list',
        component: ShoppingListComponent,
      },
    ]),
  ],
})
```