import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NotesService } from './services/notes.service';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    NotesService
  ]
};

export default [
  SidebarComponent,
  NotesListComponent,
  NoteEditorComponent,
  AppComponent
];
