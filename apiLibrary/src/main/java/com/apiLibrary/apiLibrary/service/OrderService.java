package com.apiLibrary.apiLibrary.service;

import com.apiLibrary.apiLibrary.dto.CreateOrderRequestDto;
import com.apiLibrary.apiLibrary.dto.OrderItemRequestDto;
import com.apiLibrary.apiLibrary.dto.OrderItemResponseDto;
import com.apiLibrary.apiLibrary.dto.OrderResponseDto;
import com.apiLibrary.apiLibrary.exception.InsufficientStockException;
import com.apiLibrary.apiLibrary.model.Book;
import com.apiLibrary.apiLibrary.model.Order;
import com.apiLibrary.apiLibrary.model.OrderItem;
import com.apiLibrary.apiLibrary.model.User;
import com.apiLibrary.apiLibrary.model.enums.OrderStatus;
import com.apiLibrary.apiLibrary.repository.BookRepository;
import com.apiLibrary.apiLibrary.repository.OrderRepository;
import com.apiLibrary.apiLibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Or a custom UserNotFoundException
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException; // For Book not found
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponseDto createOrder(CreateOrderRequestDto requestDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddressLine1(requestDto.getShippingAddressLine1());
        order.setShippingAddressLine2(requestDto.getShippingAddressLine2());
        order.setShippingCity(requestDto.getShippingCity());
        order.setShippingPostalCode(requestDto.getShippingPostalCode());
        order.setShippingCountry(requestDto.getShippingCountry());
        order.setStatus(OrderStatus.PENDING);
        // orderDate is set by @CreationTimestamp

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequestDto itemDto : requestDto.getItems()) {
            Book book = bookRepository.findById(itemDto.getBookId())
                    .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + itemDto.getBookId()));

            if (book.getStock() < itemDto.getQuantity()) {
                throw new InsufficientStockException("Stock insuficiente para el libro: " + book.getTitle() +
                        ". Solicitado: " + itemDto.getQuantity() + ", Disponible: " + book.getStock());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setBook(book);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPriceAtPurchase(book.getPrice()); // Current price
            // orderItem.setOrder(order); // Set by helper method or after order is saved if not using cascade persist correctly from Order side only
            order.addOrderItem(orderItem); // This also sets orderItem.setOrder(this)

            book.setStock(book.getStock() - itemDto.getQuantity());
            bookRepository.save(book); // Update stock

            totalAmount += orderItem.getPriceAtPurchase() * orderItem.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        // order.setOrderItems(orderItems); // Items are added via order.addOrderItem

        Order savedOrder = orderRepository.save(order);
        return mapOrderToOrderResponseDto(savedOrder);
    }

    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
             throw new UsernameNotFoundException("User not found with id: " + userId + ", cannot retrieve orders.");
        }
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapOrderToOrderResponseDto)
                .collect(Collectors.toList());
    }

    public OrderResponseDto getOrderDetails(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            // Consider a more generic AccessDeniedException or just EntityNotFound for security by obscurity
            throw new SecurityException("User not authorized to view this order.");
        }
        return mapOrderToOrderResponseDto(order);
    }


    // --- Private Helper Methods for DTO Mapping ---

    private OrderResponseDto mapOrderToOrderResponseDto(Order order) {
        if (order == null) return null;
        return new OrderResponseDto(
                order.getId(),
                order.getUser().getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddressLine1(),
                order.getShippingAddressLine2(),
                order.getShippingCity(),
                order.getShippingPostalCode(),
                order.getShippingCountry(),
                order.getOrderItems().stream()
                        .map(this::mapOrderItemToOrderItemResponseDto)
                        .collect(Collectors.toList())
        );
    }

    private OrderItemResponseDto mapOrderItemToOrderItemResponseDto(OrderItem orderItem) {
        if (orderItem == null) return null;
        return new OrderItemResponseDto(
                orderItem.getBook().getId(),
                orderItem.getBook().getTitle(), // Assuming Book has getTitle()
                orderItem.getQuantity(),
                orderItem.getPriceAtPurchase()
        );
    }
}
