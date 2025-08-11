import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string = 'all';
  @Output() selectCategory = new EventEmitter<string>();
  @Output() addCategory = new EventEmitter<string>();

  newCategoryName: string = '';

  onAddCategory() {
    const name = this.newCategoryName.trim();
    if (name && !this.categories.some(cat => cat.name === name)) {
      this.addCategory.emit(name);
      this.newCategoryName = '';
    }
  }
}
