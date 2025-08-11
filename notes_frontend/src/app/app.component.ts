import { Component, effect, inject, signal } from '@angular/core';
import { NotesService } from './services/notes.service';
import { Note } from './models/note.model';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NotesListComponent,
    NoteEditorComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Notes';
  notesService = inject(NotesService);

  notes = this.notesService.filteredNotes;
  categories = this.notesService.categories;
  selectedCategory = this.notesService.selectedCategory;
  searchTerm = this.notesService.searchTerm;
  searchTermSignal = this.searchTerm();
  showEditor = signal(false);
  editingNote = signal<Note | null>(null);
  snackbarMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.showEditor()) {
        this.editingNote.set(null);
      }
    });
    effect(() => {
      this.searchTermSignal = this.searchTerm();
    });
  }

  openEditor(note?: Note) {
    if (note) {
      this.editingNote.set({ ...note });
    } else {
      this.editingNote.set(null);
    }
    this.showEditor.set(true);
  }

  closeEditor() {
    this.showEditor.set(false);
  }

  saveNote(note: Note) {
    if (note.id) {
      this.notesService.updateNote(note);
      this.showSnackBar('Note updated');
    } else {
      this.notesService.addNote(note);
      this.showSnackBar('Note created');
    }
    this.showEditor.set(false);
  }

  deleteNote(noteId: string) {
    this.notesService.deleteNote(noteId);
    this.showSnackBar('Note deleted');
  }

  showSnackBar(message: string) {
    this.snackbarMessage.set(message);
    const timer = typeof window !== 'undefined'
      ? window.setTimeout
      : (handler: () => void, timeout?: number) => setTimeout(handler, timeout); // fallback
    timer(() => this.snackbarMessage.set(null), 1400);
  }
}
