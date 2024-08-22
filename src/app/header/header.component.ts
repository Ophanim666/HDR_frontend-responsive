import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() buttonText: string = 'Agregar';
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}