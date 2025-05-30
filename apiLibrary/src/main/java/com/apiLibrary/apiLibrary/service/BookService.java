package com.apiLibrary.apiLibrary.service;

import com.apiLibrary.apiLibrary.model.Book;
import com.apiLibrary.apiLibrary.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification; // Import Specification
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apiLibrary.apiLibrary.dto.BookDto; // Import BookDto

import java.time.LocalDate; // For publishDate
import java.time.format.DateTimeFormatter; // For parsing publishDate
import java.time.format.DateTimeParseException; // For handling parsing errors
import java.util.List;
// import java.util.Optional; // No longer needed directly in this file's changes
import java.util.stream.Collectors;

// Custom Exception
class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(String message) {
        super(message);
    }
}

@Service
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Page<Book> getAllBooks(
            String category,
            String author,
            Double priceMin,
            Double priceMax,
            String searchTerm,
            Pageable pageable
    ) {
        Specification<Book> spec = Specification.where(null); // Start with a null specification

        if (category != null && !category.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }
        if (author != null && !author.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("author")), "%" + author.toLowerCase() + "%"));
        }
        if (priceMin != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), priceMin));
        }
        if (priceMax != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), priceMax));
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String lowerSearchTerm = searchTerm.toLowerCase();
            Specification<Book> titleSpec = (root, q, cb) -> cb.like(cb.lower(root.get("title")), "%" + lowerSearchTerm + "%");
            Specification<Book> authorSearchSpec = (root, q, cb) -> cb.like(cb.lower(root.get("author")), "%" + lowerSearchTerm + "%");
            Specification<Book> descriptionSpec = (root, q, cb) -> cb.like(cb.lower(root.get("shortDescription")), "%" + lowerSearchTerm + "%");

            spec = spec.and(Specification.where(titleSpec).or(authorSearchSpec).or(descriptionSpec));
        }

        // If spec is still Specification.where(null) (meaning no criteria added),
        // it will fetch all. Otherwise, it fetches based on criteria.
        return bookRepository.findAll(spec, pageable);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book with id " + id + " not found."));
    }

    public List<String> getAllCategories() {
        List<Book> allBooks = bookRepository.findAll();
        return allBooks.stream()
                .map(Book::getCategory)
                .filter(category -> category != null && !category.trim().isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @Transactional
    public Book createBook(BookDto bookDto) {
        Book book = new Book();
        mapDtoToEntity(bookDto, book);
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, BookDto bookDto) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book with id " + id + " not found. Cannot update."));
        mapDtoToEntity(bookDto, existingBook);
        return bookRepository.save(existingBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException("Book with id " + id + " not found. Cannot delete.");
        }
        bookRepository.deleteById(id);
    }

    private void mapDtoToEntity(BookDto dto, Book entity) {
        entity.setTitle(dto.getTitle());
        entity.setAuthor(dto.getAuthor());
        entity.setPrice(dto.getPrice());
        entity.setCoverImageUrl(dto.getCoverImageUrl());
        entity.setShortDescription(dto.getShortDescription());
        entity.setCategory(dto.getCategory());
        entity.setPublisher(dto.getPublisher());

        // Handle publishDate (String to LocalDate)
        if (dto.getPublishDate() != null && !dto.getPublishDate().trim().isEmpty()) {
            try {
                // Assuming "yyyy-MM-dd" format for the string date
                DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
                entity.setPublishDate(LocalDate.parse(dto.getPublishDate(), formatter));
            } catch (DateTimeParseException e) {
                // Handle parsing error, e.g., log it or throw a custom exception
                // For now, we'll set it to null or ignore, depending on requirements
                // Or throw new IllegalArgumentException("Invalid date format for publishDate. Please use yyyy-MM-dd.", e);
                entity.setPublishDate(null); // Or handle as an error
            }
        } else {
            entity.setPublishDate(null);
        }

        entity.setPages(dto.getPages());
        entity.setIsbn(dto.getIsbn());
        entity.setLanguage(dto.getLanguage());
        entity.setAdditionalImageUrls(dto.getAdditionalImageUrls());

        // Handle stock
        if (dto.getStock() != null) {
            entity.setStock(dto.getStock());
        } else {
            // If it's a new entity (id is null) and stock is not provided in DTO, default to 0
            if (entity.getId() == null) {
                entity.setStock(0);
            }
            // If it's an existing entity and stock is null in DTO, stock is not updated.
        }
        // id, createdAt, and updatedAt are managed by JPA/database
    }
}
