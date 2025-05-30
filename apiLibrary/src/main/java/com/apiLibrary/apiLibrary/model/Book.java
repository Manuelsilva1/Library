package com.apiLibrary.apiLibrary.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.validation.constraints.Min; // Import Min constraint

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String author;

    private double price;

    private String coverImageUrl;

    @Column(length = 1000)
    private String shortDescription;

    private String category;

    private String publisher;

    private LocalDate publishDate; // Using LocalDate for dates

    private int pages;

    private String isbn;

    private String language;

    @ElementCollection
    @CollectionTable(name = "book_additional_image_urls", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "image_url")
    private List<String> additionalImageUrls;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Min(0) // Basic validation at entity level
    private int stock;
}
