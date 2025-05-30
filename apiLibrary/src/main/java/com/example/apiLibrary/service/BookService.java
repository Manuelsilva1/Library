package com.example.apiLibrary.service;

import com.example.apiLibrary.dto.BookPageDTO;
import java.math.BigDecimal;
import java.util.Optional;

public interface BookService {
    BookPageDTO getBooks(
            Optional<String> title,
            Optional<String> author,
            Optional<String> category,
            Optional<BigDecimal> minPrice,
            Optional<BigDecimal> maxPrice,
            int page,
            int size
    );

    BookDTO getBookById(Long id);
}
