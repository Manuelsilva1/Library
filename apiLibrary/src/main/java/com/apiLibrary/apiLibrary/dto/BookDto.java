package com.apiLibrary.apiLibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
// import java.time.LocalDate; // Use String for simplicity for now, can be LocalDate
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {

    @NotBlank(message = "Title is mandatory")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 255, message = "Author cannot exceed 255 characters")
    private String author;

    @Min(value = 0, message = "Price must be positive")
    private double price;

    private String coverImageUrl;

    @Size(max = 1000, message = "Short description cannot exceed 1000 characters")
    private String shortDescription;

    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;

    @Size(max = 100, message = "Publisher cannot exceed 100 characters")
    private String publisher;

    // Using String for publishDate for simplicity, can be changed to LocalDate
    // If using LocalDate, ensure proper serialization/deserialization configuration
    private String publishDate;

    @Min(value = 0, message = "Pages must be a positive number")
    private int pages;

    @Size(max = 20, message = "ISBN cannot exceed 20 characters")
    private String isbn;

    @Size(max = 50, message = "Language cannot exceed 50 characters")
    private String language;

    private List<String> additionalImageUrls;

    @Min(value = 0, message = "Stock must be a positive number or zero")
    private Integer stock; // Using Integer to allow null if not provided
}
