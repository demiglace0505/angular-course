import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { ReverseStrPipe } from './reverse-str.pipe';
import { SortServerPipe } from './sort-server.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ReverseStrPipe,
    SortServerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
