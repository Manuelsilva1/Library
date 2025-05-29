package com.apiLibrary.apiLibrary.repository;

import com.apiLibrary.apiLibrary.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // Import JpaSpecificationExecutor
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> { // Extend JpaSpecificationExecutor
    // Métodos de consulta personalizados pueden ser añadidos aquí en el futuro.
}
