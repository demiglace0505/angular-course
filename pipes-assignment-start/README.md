## Pipes

> Build a pipe for reversing a string
> Build a pipe for sorting server instances alphabetically

##### Setting up

To createt our own custom pipe, we can use the cli.

```
ng g p <name>
```

It would be nice to set up a model for our Server objects. We created a file server.model.ts for this

```typescript
export class Server {
  constructor(
    public instanceType: string,
    public name: string,
    public status: string,
    public started: Date
  ) {}
}
```

##### ReverseStr pipe

We created our first pipe for reversing a string. This pipe will take in a string as value, and then output a string. We can make use of the Array.reverse() method to reverse a string, which we first convert into an array using the string.split() method and finally returning into a string using the string.join() method

```typescript
@Pipe({
  name: "reverseStr",
})
export class ReverseStrPipe implements PipeTransform {
  transform(value: string): string {
    const stringArr = value.split("");
    return stringArr.reverse().join("");
  }
}
```

##### sortServer pipe

For sorting the servers according to names, the pipe should take a value, which is an array of Server objects. We used our model for this. Then we used javascript Array.sort() method to return an array that is arranged alphabetically according to server name.

```typescript
@Pipe({
  name: "sortServer",
})
export class SortServerPipe implements PipeTransform {
  transform(value: Server[]): Server[] {
    const sortedArr = value.sort((a, b) => {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });
    return sortedArr;
  }
}
```

Using the pipes are pretty straightforward

```html
<li *ngFor="let server of servers | sortServer">
  {{ server.instanceType | uppercase | reverseStr }}
</li>
```
