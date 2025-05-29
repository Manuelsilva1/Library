package com.apiLibrary.apiLibrary.controller;

import com.apiLibrary.apiLibrary.model.Book;
import com.apiLibrary.apiLibrary.service.BookService;
// Import the BookNotFoundException if it's a separate public class
// For example: import com.apiLibrary.apiLibrary.exception.BookNotFoundException;
// If it's an inner class in BookService, it needs to be public or we handle it differently.
// For this example, assuming BookNotFoundException might be thrown from service.

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Import for POST, PUT, DELETE
import org.springframework.web.server.ResponseStatusException;

import com.apiLibrary.apiLibrary.dto.BookDto; // Import BookDto
import jakarta.validation.Valid; // Import @Valid

import java.util.List;

@RestController
@RequestMapping("/api") // Base path for book-related endpoints
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/books")
    public ResponseEntity<Page<Book>> getAllBooks(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String searchTerm,
            Pageable pageable) {
        Page<Book> books = bookService.getAllBooks(category, author, priceMin, priceMax, searchTerm, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id);
            return ResponseEntity.ok(book);
        } catch (RuntimeException e) { // Catching BookNotFoundException (or any runtime exception from service for now)
            // This assumes BookNotFoundException is a RuntimeException
            // A more specific catch (e.g. catch (BookNotFoundException e)) is better if BookNotFoundException is public
            if (e.getMessage().contains("not found")) { // Basic check
                 throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving book", e);
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = bookService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody BookDto bookDto) {
        try {
            Book createdBook = bookService.createBook(bookDto);
            return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) { // Catching potential date parsing errors from service
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (RuntimeException e) { // Generic catch for other unexpected errors
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating book", e);
        }
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody BookDto bookDto) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDto);
            return ResponseEntity.ok(updatedBook);
        } catch (RuntimeException e) { // Catching BookNotFoundException (if it's a RuntimeException)
            if (e.getMessage().contains("not found")) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
            } else if (e instanceof IllegalArgumentException) { // Catching potential date parsing errors
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating book", e);
        }
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build(); // Or ResponseEntity.ok().build();
        } catch (RuntimeException e) { // Catching BookNotFoundException
            if (e.getMessage().contains("not found")) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting book", e);
        }
    }
}
