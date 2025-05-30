package com.example.apiLibrary.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookPageDTO {
    private List<BookDTO> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
