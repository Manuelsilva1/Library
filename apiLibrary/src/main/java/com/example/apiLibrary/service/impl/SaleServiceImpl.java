package com.example.apiLibrary.service.impl;

import com.example.apiLibrary.dto.SaleItemDTO;
import com.example.apiLibrary.dto.SaleRequestDTO;
import com.example.apiLibrary.dto.SaleResponseDTO;
import com.example.apiLibrary.exception.BookNotFoundException;
import com.example.apiLibrary.exception.InsufficientStockException;
import com.example.apiLibrary.model.Book;
import com.example.apiLibrary.model.Sale;
import com.example.apiLibrary.model.SaleItem;
import com.example.apiLibrary.repository.BookRepository;
import com.example.apiLibrary.repository.SaleRepository;
import com.example.apiLibrary.service.SaleService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleServiceImpl implements SaleService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SaleServiceImpl.class);

    private final SaleRepository saleRepository;
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;
    // No EmailService needed for Sale based on requirements

    @Autowired
    public SaleServiceImpl(SaleRepository saleRepository,
                           BookRepository bookRepository,
                           ModelMapper modelMapper) {
        this.saleRepository = saleRepository;
        this.bookRepository = bookRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional // Ensures atomicity for sale creation and stock updates
    public SaleResponseDTO createSale(SaleRequestDTO saleRequest) {
        LOGGER.info("Processing sale for seller ID: {}", saleRequest.getSellerId());

        Sale sale = new Sale(); // Manual mapping for some parts
        sale.setSellerId(saleRequest.getSellerId());
        sale.setCustomerName(saleRequest.getCustomerName()); // Can be null
        sale.setTimestamp(LocalDateTime.now());

        List<SaleItem> saleItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (SaleItemDTO itemDTO : saleRequest.getItems()) {
            Book book = bookRepository.findById(itemDTO.getBookId())
                    .orElseThrow(() -> {
                        LOGGER.error("Book not found with ID: {}", itemDTO.getBookId());
                        return new BookNotFoundException("Book not found with ID: " + itemDTO.getBookId());
                    });

            if (book.getStock() < itemDTO.getQuantity()) {
                LOGGER.error("Insufficient stock for book ID: {}. Requested: {}, Available: {}",
                        itemDTO.getBookId(), itemDTO.getQuantity(), book.getStock());
                throw new InsufficientStockException("Insufficient stock for book: " + book.getTitle() +
                        ". Requested: " + itemDTO.getQuantity() + ", Available: " + book.getStock());
            }

            // TODO: Consider transactional safety and race conditions for stock updates.
            book.setStock(book.getStock() - itemDTO.getQuantity());
            bookRepository.save(book); // Update stock

            SaleItem saleItem = new SaleItem(itemDTO.getBookId(), itemDTO.getQuantity());
            saleItems.add(saleItem);

            totalAmount = totalAmount.add(book.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }
        sale.setItems(saleItems);
        sale.setTotalAmount(totalAmount);

        Sale savedSale = saleRepository.save(sale);
        LOGGER.info("Sale {} created successfully. Total amount: {}", savedSale.getSaleId(), savedSale.getTotalAmount());

        return modelMapper.map(savedSale, SaleResponseDTO.class);
    }
}
