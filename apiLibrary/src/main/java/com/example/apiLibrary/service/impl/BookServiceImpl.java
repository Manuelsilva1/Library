package com.example.apiLibrary.service.impl;

import com.example.apiLibrary.dto.BookDTO;
import com.example.apiLibrary.dto.BookPageDTO;
import com.example.apiLibrary.model.Book;
import com.example.apiLibrary.repository.BookRepository;
import com.example.apiLibrary.service.BookService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public BookServiceImpl(BookRepository bookRepository, ModelMapper modelMapper) {
        this.bookRepository = bookRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public BookPageDTO getBooks(
            Optional<String> title,
            Optional<String> author,
            Optional<String> category,
            Optional<BigDecimal> minPrice,
            Optional<BigDecimal> maxPrice,
            int page,
            int size
    ) {
        // TODO: Implement filtering based on title, author, category, minPrice, maxPrice.
        // For now, only pagination is implemented.

        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);

        List<BookDTO> bookDTOs = bookPage.getContent().stream()
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());

        BookPageDTO bookPageDTO = new BookPageDTO();
        bookPageDTO.setContent(bookDTOs);
        bookPageDTO.setPage(bookPage.getNumber());
        bookPageDTO.setSize(bookPage.getSize());
        bookPageDTO.setTotalElements(bookPage.getTotalElements());
        bookPageDTO.setTotalPages(bookPage.getTotalPages());

        return bookPageDTO;
    }

    @Override
    public BookDTO getBookById(Long id) {
        LOGGER.debug("Fetching book by ID: {}", id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> {
                    LOGGER.warn("Book not found with ID: {}", id);
                    return new com.example.apiLibrary.exception.BookNotFoundException("Book not found with ID: " + id);
                });
        return modelMapper.map(book, BookDTO.class);
    }
}
