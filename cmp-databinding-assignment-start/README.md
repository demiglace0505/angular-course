### Assignment Objectives

> 1. Create three new components: GameControl, Odd and Even
> 2. The GameControl Component should have buttons to start and stop the game
> 3. When starting the game, an event (holding a incrementing number) should get emitted each second (ref = setInterval())
> 4. The event should be listenable from outside the component
> 5. When stopping the game, no more events should get emitted (clearInterval(ref))
> 6. A new Odd component should get created for every odd number emitted, the same should happen for the Even Component (on even numbers)
> 7. Simply output Odd - NUMBER or Even - NUMBER in the two components
> 8. Style the element (e.g. paragraph) holding your output text differently in both components

### Setting up the Components

I first setup the game-control component which consists of the start and end game buttons. I first add a click listener to the buttons.

```html
<button class="btn btn-success" (click)="onStartGame()">Start Game</button>
<button class="btn btn-danger" (click)="onPauseGame()" >Pause Game</button>
```
The component is as follows. When the button is clicked, the function **onStartGame()** is called, which fires the emitter intervalFired every 1 second. The **Output()** decorator is necessary to make the event emitter listenable from outside the component, in this case, from the app component.
```typescript
export class GameControlComponent implements OnInit {
  @Output() intervalFired = new EventEmitter<number>();
  interval;
  lastNumber = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onStartGame() {
    this.interval = setInterval(() => {
      // function emits every 1 sec
      this.intervalFired.emit(this.lastNumber + 1)
      this.lastNumber++ // keep track of last emitted number
    },1000);
  }
  onPauseGame() {
    clearInterval(this.interval)
  }

}

```

The intervalFired event emitter can now be listened to from outside the component and we can now then include the component in the app template. **onIntevalFired()** will be executed once intervalFired emits an event.
```angular
      <app-game-control
        (intervalFired)="onIntervalFired($event)"
      ></app-game-control>
```
We pass on $event to pass the event data, which is the number in this case. At this point, the console should log incrementing number every second.
```typescript
  export class AppComponent {
  onIntervalFired(firedNumber: number) {
    console.log(firedNumber);
  }
```

We can then start making the *Odd-component* template. We first start by using string interpolation on the *numberPrint* property, which we add using the **Input()** decorator as this would have to be passed from outside the component.

```html
<!-- odd.component.html -->
<p>Odd - {{numberPrint}} </p>
<!-- even.component.html -->
<p>Even - {{numberPrint}} </p>
```

```typescript
//odd.component.ts
export class OddComponent implements OnInit {
  @Input() numberPrint: number;
}
//even.component.ts
export class EvenComponent implements OnInit {
  @Input() numberPrint:number;
}
```

With this, we are now able to pass the data from outside the odd component. We can now start looping through the odd component using the **ngFor** directive. First we start by implementing the logic for determining if a number is odd or even. We do this in the app component.

```typescript
export class AppComponent {
  oddNumbers: number[] = [];
  evenNumbers: number[] = [];

  onIntervalFired(firedNumber: number) {
    console.log(firedNumber);
    if (firedNumber % 2 === 0) {
      this.evenNumbers.push(firedNumber)
    } else {
      this.oddNumbers.push(firedNumber)
    }
  }
}
```

We can now loop through **oddNumbers** and **evenNumbers** in the app template. We bind oddNumber and evenNumber respectively via property binding into *[numberPrint]*.

```html
<app-odd *ngFor="let oddNumber of oddNumbers" [numberPrint]="oddNumber"></app-odd>
<app-even *ngFor="let evenNumber of evenNumbers" [numberPrint]="evenNumber"></app-even>
```

