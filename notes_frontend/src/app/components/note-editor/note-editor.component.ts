import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note, Category } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent {
  @Input() note: Note | null = null;
  @Input() categories: Category[] = [];
  @Output() save = new EventEmitter<Note>();
  @Output() close = new EventEmitter<void>();

  editTitle: string = '';
  editContent: string = '';
  editCategory: string = 'personal';

  ngOnInit() {
    if (this.note) {
      this.editTitle = this.note.title;
      this.editContent = this.note.content;
      this.editCategory = this.note.category;
    } else {
      this.editTitle = '';
      this.editContent = '';
      this.editCategory = 'personal';
    }
  }

  saveNote() {
    const trimmed = this.editTitle.trim();
    if (!trimmed) return;
    const result: Note = {
      ...this.note,
      title: this.editTitle,
      content: this.editContent,
      category: this.editCategory,
      updated: Date.now(),
      created: this.note?.created || Date.now(),
      id: this.note?.id
    };
    this.save.emit(result);
  }
}
