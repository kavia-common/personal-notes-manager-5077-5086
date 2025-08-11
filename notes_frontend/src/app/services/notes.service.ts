import { Injectable, signal } from '@angular/core';
import { Note, Category } from '../models/note.model';

const STORAGE_KEY = 'notes_app_data';
const CATEGORY_KEY = 'notes_app_categories';

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class NotesService {
  private _notes = signal<Note[]>([]);
  private _categories = signal<Category[]>([]);
  private _selectedCategory = signal<string>('all');
  private _searchTerm = signal<string>('');

  constructor() {
    this.loadFromStorage();
  }

  get notes() { return this._notes.asReadonly(); }
  get categories() { return this._categories.asReadonly(); }
  get selectedCategory() { return this._selectedCategory.asReadonly(); }
  get searchTerm() { return this._searchTerm.asReadonly(); }

  get filteredNotes() {
    return signal(
      this._notes().filter(note => {
        const matchesCategory =
          this._selectedCategory() === 'all' ||
          note.category === this._selectedCategory();
        const matchesSearch =
          note.title.toLowerCase().includes(this._searchTerm().toLowerCase()) ||
          note.content.toLowerCase().includes(this._searchTerm().toLowerCase());
        return matchesCategory && matchesSearch;
      })
      // Sort: latest updated first
      .sort((a, b) => b.updated - a.updated)
    );
  }

  private getLocalStorage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        return window.localStorage;
      }
    } catch { }
    return null;
  }

  loadFromStorage() {
    const localStorage = this.getLocalStorage();
    let catArray: Category[] = [
      { id: 'all', name: 'All' },
      { id: 'personal', name: 'Personal' },
      { id: 'work', name: 'Work' },
      { id: 'ideas', name: 'Ideas' }
    ];

    if (localStorage) {
      const notesRaw = localStorage.getItem(STORAGE_KEY);
      const catsRaw = localStorage.getItem(CATEGORY_KEY);

      if (catsRaw) {
        try {
          const loaded = JSON.parse(catsRaw);
          if (Array.isArray(loaded)) catArray = loaded;
        } catch {
          // Ignore corrupted storage
        }
      }
      this._categories.set(catArray);

      if (notesRaw) {
        try {
          const noteArr = JSON.parse(notesRaw);
          if (Array.isArray(noteArr)) this._notes.set(noteArr);
        } catch {
          // Ignore corrupted storage
        }
      }
    } else {
      // Not in browser, provide defaults
      this._categories.set(catArray);
    }
  }

  persist() {
    const localStorage = this.getLocalStorage();
    if (localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._notes()));
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(this._categories()));
    }
  }

  // PUBLIC_INTERFACE
  addNote(note: Note): void {
    note.id = generateId();
    note.created = note.updated = Date.now();
    const notes = [...this._notes()];
    notes.unshift(note);
    this._notes.set(notes);
    this.persist();
  }

  // PUBLIC_INTERFACE
  updateNote(note: Note): void {
    const notes = [...this._notes()];
    const idx = notes.findIndex(n => n.id === note.id);
    if (idx !== -1) {
      notes[idx] = { ...note, updated: Date.now() };
      this._notes.set(notes);
      this.persist();
    }
  }

  // PUBLIC_INTERFACE
  deleteNote(id: string): void {
    this._notes.set(this._notes().filter(n => n.id !== id));
    this.persist();
  }

  // PUBLIC_INTERFACE
  setCategory(categoryId: string): void {
    this._selectedCategory.set(categoryId);
  }
  // PUBLIC_INTERFACE
  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  // PUBLIC_INTERFACE
  addCategory(name: string): void {
    if (!name.trim()) return;
    const exists = this._categories().some(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      const newCat = { id: generateId(), name: name };
      const cats = [...this._categories()];
      cats.push(newCat);
      this._categories.set(cats);
      this.persist();
    }
  }
}
