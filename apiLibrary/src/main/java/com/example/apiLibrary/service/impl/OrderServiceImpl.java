package com.example.apiLibrary.service.impl;

import com.example.apiLibrary.dto.OrderDTO;
import com.example.apiLibrary.dto.OrderItemDTO;
import com.example.apiLibrary.dto.OrderRequestDTO;
import com.example.apiLibrary.dto.OrderResponseDTO;
import com.example.apiLibrary.exception.BookNotFoundException;
import com.example.apiLibrary.exception.InsufficientStockException;
import com.example.apiLibrary.model.Book;
import com.example.apiLibrary.model.Order;
import com.example.apiLibrary.model.OrderItem;
import com.example.apiLibrary.repository.BookRepository;
import com.example.apiLibrary.repository.OrderRepository;
import com.example.apiLibrary.service.EmailService;
import com.example.apiLibrary.service.OrderService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Important for stock updates

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository,
                            BookRepository bookRepository,
                            EmailService emailService,
                            ModelMapper modelMapper) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.emailService = emailService;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional // Ensures atomicity for order creation and stock updates
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequest) {
        LOGGER.info("Creating order for customer: {}", orderRequest.getCustomerEmail());

        Order order = modelMapper.map(orderRequest, Order.class);
        order.setStatus("CREATED"); // Initial status

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemDTO itemDTO : orderRequest.getItems()) {
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

            // TODO: Consider transactional safety and race conditions for stock updates more deeply.
            // For high concurrency, pessimistic locking (SELECT ... FOR UPDATE) or optimistic locking might be needed.
            book.setStock(book.getStock() - itemDTO.getQuantity());
            bookRepository.save(book); // Update stock

            OrderItem orderItem = new OrderItem(itemDTO.getBookId(), itemDTO.getQuantity());
            orderItems.add(orderItem);
        }
        order.setItems(orderItems); // Set the processed items

        Order savedOrder = orderRepository.save(order);
        LOGGER.info("Order {} created successfully for customer {}", savedOrder.getOrderId(), savedOrder.getCustomerEmail());

        // Prepare OrderDTO for email service
        OrderDTO emailOrderDetails = modelMapper.map(savedOrder, OrderDTO.class);
        // ModelMapper might not map items correctly if OrderItemDTO structure is different from OrderItem entity structure
        // or if explicit mapping for the list is needed. Let's assume basic mapping works or adjust if needed.
        // Ensure OrderItemDTOs are correctly populated in emailOrderDetails
         emailOrderDetails.setItems(orderRequest.getItems()); // Use original DTOs for email for simplicity for now


        emailService.sendOrderConfirmationEmail(emailOrderDetails);

        OrderResponseDTO response = modelMapper.map(savedOrder, OrderResponseDTO.class);
        response.setMessage("Order created successfully and confirmation email is being sent.");
        return response;
    }
}
