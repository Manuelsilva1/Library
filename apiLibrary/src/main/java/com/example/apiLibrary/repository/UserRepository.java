package com.example.apiLibrary.repository;

import com.example.apiLibrary.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    /**
     * Finds a user by their username.
     * Spring Data JDBC will automatically implement this method based on its name.
     *
     * @param username The username to search for.
     * @return An Optional containing the User if found, or an empty Optional otherwise.
     */
    Optional<User> findByUsername(String username);
}
