import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-news.html',
  styleUrls: ['./delete-news.css'],
})
export class DeleteNewsComponent {
  // Datos que vienen del padre (ViewNews)
  @Input() newsId!: number;
  @Input() newsTitle!: string;
  
  // Eventos hacia el padre
  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() confirmedDelete = new EventEmitter<number>();

  constructor() {}

  close(): void {
    this.closeDialog.emit();
  }

  onDelete(): void {
    // Emitimos el ID para que view-news llame al servicio
    this.confirmedDelete.emit(this.newsId);
    this.close();
  }
}