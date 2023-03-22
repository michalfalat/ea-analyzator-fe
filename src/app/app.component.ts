import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ea-analyzator';

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {
    let input = $event.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = () => {
      let csvData = reader.result as string;
      this.csvToJSON(csvData);
    };

    reader.onerror = function () {
      console.log('error is occured while reading file!');
    };
  }

  csvToJSON(csv: string): void {
    var lines = csv.split(/\r\n|\n|\t\r\n/);
    const separator = '\t';

    var result = [];

    var headers = lines[0].split(separator);

    for (var i = 1; i < lines.length; i++) {
      var obj: any = {};
      var currentline = lines[i].split(separator);

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    console.log(result); //JSON
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}
