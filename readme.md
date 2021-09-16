# [Angular - The Complete Guide 2021 Edition](https://www.udemy.com/course/the-complete-guide-to-angular-2/)

Instructor: Max Schwarzmuller

### Course Structure

> This readme file is a documentation of my learnings, notes and takeaways from the course. It is structured such that each major topic in the course has its own section. Each section may consist of two parts: Lecture and Project.
> 
> The lecture parts are outlined in the below list. Each lecture part is also accompanied by a sample application, which resides in its own subdirectory in this repo. The second part, project, is the application of the learnings from the lecture part to the Recipe Book project itself. This part can easily be identified by the **Project:** that precedes the header.

* [Angular Basics](#angular-basics)
* [Components and Databinding](#components-and-databinding)
* [Directives Deep Dive](#directives-deep-dive)
* [Services and Dependency Injection](#services-and-dependency-injection)

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

- - -

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

- - -

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

- - -

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

| Hook | Description |
| ---- | ----------- |
| ngOnChanges | Called after a bound input property chagnes |
| ngOnInit | Called once a component is initialized. Runs after the constructor |
| ngDoCheck | Called during every change detection run |
| ngAfterContentInit | Called after the content projected by ng-content has been projected into view |
| ngAfterContentChecked | Called every time the projected content has been checked |
| ngAfterViewInit | Called after the component and child views has been initialized |
| ngAfterViewChecked | Called every time the view and child views have been checked |
| ngOnDestroy | Called once the component is about to be destroyed |

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

- - -

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

``` typescript
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

``` html
      <p
        appBetterHighlight
        [defaultColor]="'yellow'"
        [highlightColor]="'orange'"
      >
        Style me with better directive!
      </p>
```

Note that if we set an alias that has the same name as our directive, we need to enclose the directive with a square bracket. In the example below, appBetterHighlight.

``` typescript
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = "transparent";
  @Input('appBetterHighlight') highlightColor: string = "blue";
  ...
}
```

``` html
      <p
        [appBetterHighlight]="'orange'"
        [defaultColor]="'yellow'"
      >
        Style me with better directive!
      </p>
```

##### Creating a Structural Directive

We created our own structural directive unless.directive.ts, which is the opposite of ngIf. We bind to a property called 'appUnless' which should be the same name as the selector, but whenever this condition changes, a method should be executed that's why it is declared as a **setter**. It receives a boolean condition as its parameter. To access the template and the place in the document where we want to render, we can inject **TemplateRef** and **ViewContainerRef** in the constructor.

``` typescript
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

``` html
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

``` typescript
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

``` html
<li class="dropdown" appDropdown>
```

- - -

## Services and Dependency Injection

> Reference activity: [services-start](https://github.com/demiglace0505/angular-course/tree/master/services-start)

A service is a broad category encompassing any value, function or feature that an application needs. It is typically a class with a well-defined purpose and does something specific.

##### Creating a Logging Service

A service is created with a name.service.ts naming convention. It is important to note that we don't need to import decorators in order to define a service.

``` typescript
export class LoggingService {
  logStatusChange(status: string) {
    console.log("A server status changed, new status: " + status);
  }
}
```

To use a service, we need to inject it into components using Angular's dependency injector. We pass the LoggingService class into our constructor and add it in the component's **providers** array.

``` typescript
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

``` typescript
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

``` typescript
export class AppComponent implements OnInit {
  accounts: { name: string; status: string }[] = [];

  constructor(private accountsService: AccountsService) {}

  ngOnInit() {
    this.accounts = this.accountsService.accounts;
  }
}
```

It is important to note that injection of services follows the Hierarchical Injection, which means that the children of a component will also get injected. In the case of this app, we don't want to provide **AccountService** to the children (new-account and account), because that would give us a different instance of AccountService. We should only provide AccountService into the parent app component. We shouldn't remove it in the constructor though.

``` typescript
  //app.component.ts
  providers: [AccountsService],
  //new-account.component.ts
  providers: [LoggingService],
  //account.component.ts
  providers: [LoggingService],
```

##### Injecting Services into Services

To inject a service into a service, we need to provide a service to the highest in the hierarchy, the app module. If we want to inject a service into a service, we need to add the **@Injectable** decorator to the receiving service.

``` typescript
@Injectable()
export class AccountsService {
  ...
  constructor(private loggingService: LoggingService) {}
}
```

##### Cross-Component Communication with Services

We can make components communicate with each other using services. We have a triggering component and a listening component. We first add an event emitter in our service.

``` typescript
statusUpdated = new EventEmitter<string>();
```

Then access it and emit an event via AccountsService in our account component

``` typescript
  onSetTo(status: string) {
    ...
    this.accountsService.statusUpdated.emit(status)
  }
```

And finally subscribe to it from the new-account component

``` typescript
constructor(
    private loggingService: LoggingService,
    private accountsService: AccountsService
  ) {
    this.accountsService.statusUpdated.subscribe(
      (status: string) => alert('New status: ' + status)
    )
```

### Project: Adding Services

##### Recipe Service

We first set up the array of recipes in the *recipe.service.ts* file. Since objects and arrays in JavaScript are reference types, we should call **slice()** with no arguments which will return a new array which is an exact copy of the *recipes* array.

``` typescript
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

We then add this as a provider to *recipes.component*

``` typescript
  providers: [RecipeService]
```

And then provide it to *recipe-list* and initialize recipes with getRecipes()

``` typescript
  recipes: Recipe[]

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes()
  }
```

##### Using Services for Cross-Component Communication

Currently, the app makes use of a chain of Inputs and Outputs to communicate between components. We can do better using services. Inside our recipe service, we can add an event emitter that holds a Recipe object.

``` typescript
recipeSelected = new EventEmitter<Recipe>();
```

We then inject the recipe service into recipe-item component and add use the recipeSelected event emitter. This will allow us to click a recipe.

``` html
<a href="#" class="list-group-item clearfix" (click)="onSelected()">
    <!-- recipe list -->
```

``` typescript
  constructor(private recipeService: RecipeService) {}

  onSelected() {
    this.recipeService.recipeSelected.emit(this.recipe);
  }
```

To display the details of the clicked recipe, we create a listener in our recipes component which is subscribed for changes in the selected recipe, wherein we pass a recipe object of type Recipe, which we will be receiving from the event emitter above. This allows a new recipe to be displayed when the selected recipe is changed, in the case of this app, when a different recipe is clicked.

``` typescript
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe
    })
  }
```

##### Shopping List Service

We provide the ShoppingListService to app.module since we would be accessing the shopping list from the recipes component later on. We set up the shopping-list service as follows. Important to note here is the **ingredientsChanged** event emitter which receives a copy of the ingredients array in the **addIngredient** method. This is necessary since we need to inform our component for changes when a new ingredient is added.

``` typescript
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('oranges', 2),
  ]
  ingredientsChanged = new EventEmitter<Ingredient[]>()

  getIngredients() {
    return this.ingredients.slice()
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
    this.ingredientsChanged.emit(this.ingredients.slice())
  }
}
```

We then need to subscribe to the ingredientsChanged event for changes in the ingredients array which is found in the shopping-list component.

``` typescript
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [];

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients()
    this.slService.ingredientsChanged.subscribe((ingredients: Ingredient[])=> {
      this.ingredients = ingredients
    })
  }
}
```

In our shopping-edit component, we can now offload the event emission to the shopping list service.

``` typescript
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {}

  onAddItem() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = this.amountInputRef.nativeElement.value;
    const newIngredient = new Ingredient(name, amount);
    this.slService.addIngredient(newIngredient)
  }
}
```

##### Passing Ingredients from Recipes to Shopping List

At this point, we can now add ingredients to our recipe model. This will be an array of Ingredient objects.

``` typescript
export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[]

  constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients
  }
}
```

We start by adding a click event listener to recipe-detail template

``` html
<li><a (click)="onAddToShoppingList()" style="cursor: pointer" >Add Ingredients to Shopping List</a></li>
```

We then create an **onAddToShoppingList()** method in our recipe-detail template which then calls the **addIngredientsToShoppingList()** from recipeService, wherein we pass recipe.ingredients.

``` typescript
  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }
```

We need to inject the shopping-list service into our recipe service using the **@Injectable** decorator afterwards.

``` typescript
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

``` typescript
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

- - -

## Routing

> Reference activity:

We register our routing in the app.module file. The path property defines the path for the url, while the component property tells angular what should be loaded in that route. We also need to import **RouterModule** to our app.module. The RouterModule's special method forRoot() allows us to register routes.

``` typescript
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

``` html
<div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <router-outlet></router-outlet>
    </div>
  </div>
```

Navigating through links can be done using the directive **routerLink** that angular provides. We can also make use of property binding for routerLink wherein we pass an array of individual path elements as illustrated below.

``` html
<li role="presentation" class="active"><a routerLink="/">Home</a></li>
<li role="presentation"><a routerLink="/servers">Servers</a></li>
<li role="presentation"><a [routerLink]="['/users']">Users</a></li>
```

##### Styling Active Router Links

Angular gives us the directive **routerLinkActive** to dynamically style an element. In the example below, active is the class used by bootstrap to define an active nav tab. We however need to make use of **routerLinkActiveOptions** as a property binding since without it, the path `/` will be active for every path, because the behavior of routerLinkActive is that it sets the link to active if the URL **contains** the beginning of the path, in this case, `/` will be active for all paths.

We pass the javascript object `exact: true` to routerLinkActiveOptions to tell angular that the link will be active if and only if its address is /.

``` html
<li role="presentation" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" ><a routerLink="/">Home</a></li>
<li role="presentation" routerLinkActive="active"><a routerLink="/servers">Servers</a></li>
<li role="presentation" routerLinkActive="active"><a [routerLink]="['/users']">Users</a></li>
```

##### Navigating Programmatically

We can navigate programatically by injecting **Router** to a component. A route is defined by an array of the single or different elements of a new path.

``` typescript
export class HomeComponent implements OnInit {
  constructor(private router: Router) { }

  onLoadServers() {
    this.router.navigate(['/servers'])
  }
}
```

Unlike routerLink which always knows the current loaded route, Router does not. If we want to tell navigate where we currently are, we can to pass a second argument. We need to inject the current active route via **ActivatedRoute**. For the below example, if we call onReload while we are on `/servers`, we will end up in `/servers/servers`

``` typescript
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

``` typescript
export class UserComponent implements OnInit {
  user: {id: number, name: string};

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    }
  }
}
```

We can now access the parameters in our template.

``` html
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

``` typescript
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

``` typescript
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

``` html
<router-outlet></router-outlet>
```

##### Query Parameters and Fragments

We can add query parameters by making use of the **queryParams** property. It is important to note that **queryParams** is not a directive, it is a bindable property of the routerLink directive. We also have the property fragment which adds a # anchor.

``` html
<a
  [routerLink]="['/servers', 5, 'edit']"
  [queryParams]="{allowEdit: '1'}"
  fragment="loading"
  href="#"
  class="list-group-item"
  *ngFor="let server of servers"
>
```

Clicking the above link will bring us to `/servers/5/edit?allowEdit=1#loading`

We can also do this programatically. Take for instance the following template wherein we pass a number to the onLoadServers method:

``` html
<button class="btn btn-primary" (click)="onLoadServers(1)">Load Servers</button>
```

``` typescript
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

``` typescript
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.queryParams)
    console.log(this.route.snapshot.fragment)
  }
```

##### Handling of Query Parameters

In the example below, we only allow the user to edit the server with an id of 3.

``` html
      <a
        [routerLink]="['/servers', server.id]"
        [queryParams]="{allowEdit: server.id === 3 ? '1' : '0'}"
        fragment="loading"
        href="#"
        class="list-group-item"
        *ngFor="let server of servers"
      >
```

Inside the edit-server component, we need to add a new property allowEdit and setup a subscription to it. The following code simply sets allowEdit property to true if the **allowEdit link parameter** is set to 1.

``` typescript
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

``` html
<button class="btn btn-primary" (click)="onEdit()" >Edit Server</button>
```

``` typescript
  onEdit() {
    this.router.navigate(['edit'], {
      relativeTo: this.route, 
      queryParamsHandling: 'preserve'
    })
  }
```

##### Redirecting and Wildcards

We can rediret the user using the **redirectTo** property of Routes. The double asterisk path means to catch all paths that are not included in the app. This route should be the last to be declared.

``` typescript
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

We created a new file *app-routing.module.ts*. We need to pass the RouterModule to the export property of NgModule, so that it will be accessible in the destination module.

``` typescript
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

``` typescript
  imports: [
    ...
    AppRoutingModule
  ],
```

##### Route Guards

A Route Guard is a functionality that is executed before a route is loaded or once we want to leave a route.

We first created a fake authentication service *auth.service.ts*

``` typescript
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

We then create the service *auth-guard.service.ts* which implements **canActivate**. Our canActivate method takes 2 arguments: AcitvatedRouteSnapshot and RouterStateSnapshot.

``` typescript
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

``` typescript
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

``` typescript
providers: [ServersService, AuthService, AuthGuard],
```

We can also protect child routes with **canActivateChild**. Since this example will use the same logic as canActivate, we just simply returned canActivate.

``` typescript
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
```

Using it is the same as above, we just need to set the canActivateChild property of Route.

``` typescript
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

``` html
<button class="btn btn-default" (click)="onLogin()">Login</button>
<button class="btn btn-default" (click)="onLogout()">Logout</button>
```

``` typescript
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

``` typescript
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

To prevent users from accidentally navigating away, we can make use of canDeactivate method. We first create a new service under edit-server directory called *can-deactivate-guard*. In it, we create an interface **CanComponentDeactivate** has a method canDeactivate() that takes no arguments and returns either an Observable that resolves to a boolean, a promise that resolves to a boolean or a boolean.

The class CanDeactivateGuard is then created which implements the generic type **CanDeactivate** from angular router which wraps our CanComponentDeactivate interface. The canDeactivate() method of this class will be called by angular router once we try to leave a route.

``` typescript
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

``` typescript
      {
        path: ":id/edit",
        component: EditServerComponent,
        canDeactivate: [CanDeactivateGuard]
      },
```

and provide it to our app module

``` typescript
providers: [ServersService, AuthService, AuthGuard, CanDeactivateGuard],
```

We now implement the interface CanComponentDeactivate to our edit-server component. Here is where we implement the actual logic for checking if we are allowed to leave a route.

``` typescript
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

We can pass static data to a route using the *data* property of Route.

``` typescript
  {
    path: "not-found",
    component: ErrorPageComponent,
    data: {
      message: "Page not found!",
    },
  },
```

We can then use it in our error-page component. We can either assign it directly into a property, or make use of subscribe which is useful in case the data is expected to change.

``` typescript
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

``` typescript
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
    return this.serversService.getServer(+route.params['id'])
  }
}
```

After providing ServerResolver in our app module, we can now add it into the routing module. We assign a key value pair of server and ServerResolver, which returns a Server object that will be stored into the **myServer** property that will be available in the component.

``` typescript
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

``` typescript
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

``` typescript
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full',
  },
  {
    path: 'recipes',
    component: RecipesComponent,
  },
  {
    path: 'shoping-list',
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

``` typescript
  imports: [BrowserModule, FormsModule, AppRoutingModule],
```

Finally we used `router-outlet` to render to the page

``` html
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
```

With routing, we no longer need to use click event listeners and emitters in our header component for navigation. Using the routerLinkActive directive wherein we define the class we want to attach to the element when the current route of the nested element (in this case, a) is active.

``` html
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

``` typescript
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

``` typescript
  getRecipeById(id:number) {
    return this.recipes[id]
  }
```

We then need to get access to ActivatedRoute by injecting it into our recipe-detail component. Since this component's value will possibly change after being rendered, we need to subscribe to it. We do so by subscribing to the **params** observable of Route. We make sure to cast params['id'] into a number.

``` typescript
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

``` html
    <app-recipe-item
      *ngFor="let recipeEl of recipes; let i = index"
      [recipe]="recipeEl"
      [id]="i"
      (recipeSelected)="onRecipeSelected(recipeEl)"
    ></app-recipe-item>
```

We make sure to include this bound property using Input() decorator to the recipe-item component

``` typescript
export class RecipeItemComponent implements OnInit {
  @Input() id: number;
  ...
}
```

And finally apply it to the recipe-item template

``` html
<a 
  [routerLink]="[id]"
style="cursor: pointer" class="list-group-item clearfix">
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
  editMode:boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id']
        this.editMode = params['id'] != null
        console.log(this.editMode)
      }
    )
  }

}

```

To add the navigation to `/new`, we just add a click event listener and its corresponding method. We can inject Router and use its navigate() method, together with ActivatedRoute to get the current route which will be passed to **relativeTo**.

```html
<button class="btn btn-success" (click)="onNewRecipe()"  >New Recipe</button>
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

