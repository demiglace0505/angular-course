import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "reverseStr",
})
export class ReverseStrPipe implements PipeTransform {
  transform(value: string): string {
    const stringArr = value.split("");
    return stringArr.reverse().join("");
  }
}
