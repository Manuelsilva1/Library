package com.example.apiLibrary.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("USERS")
public class User {

    @Id
    private Long id;
    private String username; // Should be unique
    private String password; // Will be stored hashed
    private String roles;    // e.g., "ROLE_SELLER,ROLE_ADMIN" or "ROLE_USER"

    // Note: For uniqueness constraints like on 'username',
    // Spring Data JDBC relies on database schema definitions.
    // You would typically add a UNIQUE constraint to the USERNAME column in the USERS table.
}
