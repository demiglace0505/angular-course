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

## Angular Basics

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

___

## Components and Databinding

> Reference activity: [cmp-databinding-start](https://github.com/demiglace0505/angular-course/tree/master/cmp-databinding-start)

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

___

## Project: Setting up the RecipeBook project

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

___

## Communicating between components

> Reference activity: [cmp-databinding-start](https://github.com/demiglace0505/angular-course/tree/master/cmp-databinding-start)

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

``` html
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

``` typescript
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

``` html
<input type="text" class="form-control" #serverContentInput />
```

``` typescript
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
``` html
<div class="panel panel-default">
  <div class="panel-heading">{{ element.name }}</div>
  <div class="panel-body">
    <ng-content></ng-content>
  </div>
</div>
```

``` html
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

| Hook                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| ngOnChanges           | Called after a bound input property chagnes                  |
| ngOnInit              | Called once a component is initialized. Runs after the constructor |
| ngDoCheck             | Called during every change detection run                     |
| ngAfterContentInit    | Called after the content projected by ng-content has been projected into view |
| ngAfterContentChecked | Called every time the projected content has been checked     |
| ngAfterViewInit       | Called after the component and child views has been initialized |
| ngAfterViewChecked    | Called every time the view and child views have been checked |
| ngOnDestroy           | Called once the component is about to be destroyed           |

##### Accessing ng-content with @ContentChild

``` html
<p #contentParagraph>
  ...
</p>
```

``` typescript
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

### Project: Adding Navigation with Event Binding and ngIf

We first add click event listeners in our navigation link components

``` html
        <li>
          <a href="#" (click)="onSelect('recipe')">Recipe</a>
        </li>
        <li>
          <a href="#" (click)="onSelect('shopping-list')">Shopping List</a>
        </li>
```

We then create the event emitter in our component. We make use of the @Output decorator in order to make this event listenable from outside the header component, in this case, the parent or the app component.

``` typescript
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>();

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
```

In the parent component, the app component, we will add a listener event that listens for the *featureSelected* event and then executes *onNavigate()*, wherein this time we pass the event data of featureSelected through the reserved $event keyword.

``` html
<app-header (featureSelected)="onNavigate($event)"></app-header>
```

We then proceed to write the function in the app component. The *loadedFeature* property is set to the feature that we receive from the event's argument.

``` typescript
export class AppComponent {
  loadedFeature: string = 'recipe';

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
```

We finally make use of **ngIf** directive to conditionally render which page to load depending on the feature selected

``` html
      <app-recipes *ngIf="loadedFeature === 'recipe'" ></app-recipes>
      <app-shopping-list *ngIf="loadedFeature !== 'recipe'" ></app-shopping-list>
```

### Project: Passing Data with Property Binding

For this section, we built the individual recipe item components. We first create the templates for recipe-list and recipe-item respectively.

``` html
<!-- recipe-list -->
<app-recipe-item *ngFor="let recipe of recipes"></app-recipe-item>
```

``` html
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

``` typescript
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor() {}

  ngOnInit(): void {}
}
```

This allows us to bind the recipe property from outside, which we will be binding from the recipe-list component. At this point, it would be a great time to rename the individual item from the **ngFor** directive. recipeEl is the element which we will pass to the bindable recipe property from the recipe-item component. We can now update the recipe template as such:

``` html
<!-- recipe-list -->
<app-recipe-item *ngFor="let recipeEl of recipes" [recipe]="recipeEl"></app-recipe-item>
```

The recipe property is of type model

``` typescript
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

### Project: Event and Property Binding

The goal of this section is to be able to display a single detailed recipe section when we click an item from our recipe list. The caveat with this approach is that we first pass from recipe-item to recipe-list and finally recipe-detail. A more elegant solution will be discussed in future chapters.

We first set up the click listener of the single recipe-item component. Again the @Output director is necessary to be able to listen to this event from outside the recipe-item component.

``` typescript
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

We then update the template for our recipe-list component to listen to this event. We pass on the current recipe object, which is the *recipeEl*

``` html
    <app-recipe-item
      *ngFor="let recipeEl of recipes"
      [recipe]="recipeEl"
      (recipeSelected)="onRecipeSelected(recipeEl)"
    ></app-recipe-item>
```

We then Emit another event. We pass the recipeEl received from the above to the event emitter. This time around, the parent **recipes** component will be the one listening for this event.

``` typescript
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  ...
  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
```

We can set up recipes template. We set the component's *selectedRecipe* property into the recipe we received from the recipeWasSelected event.

We use the ngIf directive together with ng-template to conditionally render *infoText* if selectedRecipe is null, or in other words, no recipe was selected yet. The *recipe* property of the recipe-detail component is bound to selectedRecipe.

``` html
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

``` html
    <img
      [src]="recipe.imagePath"
      alt="{{ recipe.name }}"
      class="img-responsive"
    />
    ...
    <h1>{{ recipe.name }}</h1>
    ...
    <div class="col-xs-12">{{ recipe.description }}</div>
```

### Project: Allowing Addition of Items to the Shopping List

We begin by adding local references to the input fields #nameInput and #amountInput and adding the click event listener to the Add button.

``` html
<input type="text" id="name" class="form-control" #nameInput />
<input type="number" class="form-control" id="amount" #amountInput />
<button class="btn btn-success" type="submit" (click)="onAddItem()" >Add</button>
```

We make use of the ViewChild() decorator to access these local references from within the typescript code. We now create an event emitter wherein we pass the data to the parent component that manages the array of ingredients, which is the shopping-list component. We pass the Ingredient model for the type definition of the event emitter.

The values received from ViewChild can be accessed using **nativeElement**, which we then pass to our event emitter.

``` typescript
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
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

``` html
    <app-shopping-edit
      (ingredientAdded)="onIngredientAdded($event)"
    ></app-shopping-edit>
```

And then we create the function onIngredientAdded in our shopping-list component, which receives the event data from the ingredientAdded event.

``` typescript
  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
```

___

## Directives Deep Dive

> Reference activity: [directives-start](https://github.com/demiglace0505/angular-course/tree/master/directives-start)

Structural directives are responsible for the HTML layout. These are indicated by the **(\*)** symbol. It is important to note that multiple structural directives cannot be used at the same time on the same element. The two structural directives covered thus far are **ngFor** and **ngIf**

Attribute directives on the other hand, does not change the HTML layout. These are indicated by square brackets and we can use multiple attribute directives on the same element. Some examples of attribute directives are **ngStyle** and **ngClass**

##### Creating our own directive

We could also create our own directives. We create a subdirectory on our project called *basic-highlight* and inside of it we create a file *basic-highlight.directive.ts*. We use the **@Directive** decorator, and we need to pass an object as a parameter. The selector attribute allows us to attach them to an element. We wrap the value in square brackets so that we don't have to do so when we use our directive in our component.

A quicker way of creating directives is by use of the angular cli

```
ng generate directive better-highlight
```

We can access the element into this directive by injection. To do this, we need to pass an ElementRef argument to the constructor. This is a reference to the element wherein the directive is placed on. To be able to use this data anywhere in our class, we can use **private** which will make it a property of ElementRef.

``` typescript
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

``` typescript
@NgModule({
  declarations: [
    AppComponent,
    BasicHighlightDirective
  ],
  ...
```

We can then use the directive in our template

``` html
<p appBasicHighlight>Style me with basic directive!</p>
```

##### Using the Renderer to build a Directive

Accessing elements directly like the previous example is not a good practice. A better way of building directives is by the use of the Renderer. We inject the helper Renderer2 in our constructor in addition to ElementRef. We now then use the setStyle method of the renderer, which takes four arguments: first is the element, second is the property, third is the value of the property and fourth an optional flags

``` typescript
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

``` html
<p appBetterHighlight>Style me with better directive!</p>
```

##### Listening to Host Events

To react to events in the element wherein the directive sits on, we can use the **@HostListener** decorator.

``` typescript
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

An even easier way, without using the renderer, is through the use of **@HostBinding** decorator. We bind this to a property that will be set to important, in this case *backgroundColor*. We pass a property to the decorator to which property of the hosting element we want to bind, which in this case is *style.backgroundColor*.

``` typescript
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
      <p
        appBetterHighlight
        [defaultColor]="'yellow'"
        [highlightColor]="'orange'"
      >
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
      <p
        [appBetterHighlight]="'orange'"
        [defaultColor]="'yellow'"
      >
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


### Project: Implementing dropdown using directives
We created a dropdown.directive.ts file and in it, we make use of the **@HostSelector** decorator to listen for click events and fire the **toggleOpen** method, which sets Open to true or false. Using **@HostBinding**, we bind the class.open property of the element this directive is in to the property isOpen. This means that whenever isOpen changes, the host element is updated and the class **open** is either added or removed.

The directive will not be attached initially, but whenever isOpen switches to true, it will be attached and when it switches to false, it will be removed.

```typescript
@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
```

```html
<li class="dropdown" appDropdown>
```


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

### Project: 