package com.example.apiLibrary.repository;

import com.example.apiLibrary.model.Book;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository // Optional, but good practice for clarity
public interface BookRepository extends PagingAndSortingRepository<Book, Long> {
    // Custom query methods can be added here later if needed.
    // For example:
    // List<Book> findByCategory(String category);
    // List<Book> findByAuthor(String author);
    // List<Book> findByTitleContainingIgnoreCase(String title);
}
