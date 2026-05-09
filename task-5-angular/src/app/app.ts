import { Component } from '@angular/core';
import { ContactComponent } from './contact.component';

@Component({
  selector: 'app-root',
  imports: [ContactComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
