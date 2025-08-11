import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();

  getShort(text: string, length = 120): string {
    if (!text) return '';
    return text.length > length ? text.slice(0, length) + '…' : text;
  }
  formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
