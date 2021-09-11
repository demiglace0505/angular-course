# Assignment - Services

First I created a users.service.ts service wherein I placed most of the logic and array from the app component
```typescript
export class UserService {
  activeUsers = ["Max", "Anna"];
  inactiveUsers = ["Chris", "Manu"];

  setToActive(id: number) {
    console.log("set to active");
    this.activeUsers.push(this.inactiveUsers[id]);
    this.inactiveUsers.splice(id, 1);
  }

  setToInactive(id: number) {
    console.log("set to inactive");
    this.inactiveUsers.push(this.activeUsers[id]);
    this.activeUsers.splice(id, 1);
  }
}
```

Doing so will allow us to clean up the app template, since we no longer need to call a directive and click event listeners as the component will be accessing services directly.
```html
      <app-active-users</app-active-users>
      <app-inactive-users></app-inactive-users>
```

The service is injected into the app component, not in the individual active and inactive users component because doing so will give 2 different instances of the UserService, including the arrays, which we don't want. Injecting it into the app component will yield the desired outcome wherein active and inactive share the same instance of the UserService.

We then proceed on importing our services to the inactive-users component and active-users component
```typescript

export class InactiveUsersComponent implements OnInit {
  users: string[];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.inactiveUsers;
  }
  
  setToActive(id: number) {
    this.userService.setToActive(id);
  }
}

```

At this point, switching between active and inactive are now working. For the next part, I created a counter.service.ts file.

```typescript
export class CounterService {
  activeToInactiveCounter = 0;
  inactiveToActiveCounter = 0;

  incrementActiveToInactive() {
    this.activeToInactiveCounter++;
    console.log("active to inactive: " + this.activeToInactiveCounter);
  }

  incrementInactiveToActive() {
    this.inactiveToActiveCounter++;
    console.log("inactive to active: " + this.inactiveToActiveCounter);
  }
}
```

I injected this into my UserService service. I first added it as a provider for the app module so that it is available application-wide.

```typescript
  providers: [CounterService],
```

I then add the **@Injectable** decorator to the UserService and set up the constructor
```typescript
@Injectable()
export class UserService {
  activeUsers = ["Max", "Anna"];
  inactiveUsers = ["Chris", "Manu"];

  constructor(private counterService: CounterService) {}

  setToActive(id: number) {
    console.log("set to active!");
    this.activeUsers.push(this.inactiveUsers[id]);
    this.inactiveUsers.splice(id, 1);
    this.counterService.incrementInactiveToActive();
  }

  setToInactive(id: number) {
    console.log("set to inactive");
    this.inactiveUsers.push(this.activeUsers[id]);
    this.activeUsers.splice(id, 1);
    this.counterService.incrementActiveToInactive();
  }
}

```