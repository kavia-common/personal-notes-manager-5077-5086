export interface Note {
  id?: string;
  title: string;
  content: string;
  category: string;
  updated: number;
  created: number;
}

export interface Category {
  id: string;
  name: string;
}
