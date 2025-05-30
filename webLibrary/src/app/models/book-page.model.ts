import { Book } from './book.model';

export interface BookPage {
  content: Book[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
