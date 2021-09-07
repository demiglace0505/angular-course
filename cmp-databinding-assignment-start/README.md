### Setting up the Components

I first setup the game-control component which consists of the start and end game buttons

```angular
<button class="btn btn-success" (click)="onStartGame()">Start Game</button>
```
The component is as follows. When the button is clicked, the function **onStartGame()** is called, which fires the emitter intervalFired every 1 second. The **Output()** decorator is necessary to make the event emitter listenable from outside the component.
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