import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
  pure: false,
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
