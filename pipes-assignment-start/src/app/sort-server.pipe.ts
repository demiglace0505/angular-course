import { Pipe, PipeTransform } from "@angular/core";
import { Server } from "./server.model";

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
