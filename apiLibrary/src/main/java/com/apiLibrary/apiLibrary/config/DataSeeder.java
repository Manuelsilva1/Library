package com.apiLibrary.apiLibrary.config;

import com.apiLibrary.apiLibrary.model.Book;
import com.apiLibrary.apiLibrary.model.Role; // Import Role
import com.apiLibrary.apiLibrary.model.User; // Import User
import com.apiLibrary.apiLibrary.repository.BookRepository;
import com.apiLibrary.apiLibrary.repository.RoleRepository; // Import RoleRepository
import com.apiLibrary.apiLibrary.repository.UserRepository; // Import UserRepository
import org.springframework.security.crypto.password.PasswordEncoder; // Import PasswordEncoder

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet; // Import HashSet
import java.util.List;
import java.util.Set; // Import Set

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final UserRepository userRepository; // Uncommented
    private final RoleRepository roleRepository; // Added RoleRepository
    private final PasswordEncoder passwordEncoder; // Uncommented

    @Autowired
    public DataSeeder(BookRepository bookRepository,
                      UserRepository userRepository, // Uncommented
                      RoleRepository roleRepository, // Added RoleRepository
                      PasswordEncoder passwordEncoder // Uncommented
                      ) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository; // Uncommented
        this.roleRepository = roleRepository; // Added RoleRepository
        this.passwordEncoder = passwordEncoder; // Uncommented
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            createBookSeedData();
        }
        if (userRepository.count() == 0) { // Uncommented
            createUserSeedData();
        }
    }

    private void createBookSeedData() {
        Book book1 = new Book();
        book1.setTitle("El Misterio del Tiempo Perdido");
        book1.setAuthor("Elena Autora");
        book1.setPrice(19.99);
        book1.setCategory("Ciencia Ficción");
        book1.setShortDescription("Un emocionante thriller sobre viajes en el tiempo. Perfecto para los amantes de la intriga y la ciencia ficción.");
        book1.setCoverImageUrl("assets/images/covers/cover1.jpg");
        book1.setPublisher("Ediciones Cronos");
        book1.setPublishDate(LocalDate.of(2023, 3, 15));
        book1.setPages(320);
        book1.setIsbn("978-1234567890");
        book1.setLanguage("Español");
        book1.setAdditionalImageUrls(Arrays.asList("assets/images/covers/cover2.jpg", "assets/images/covers/cover3.jpg"));
        book1.setStock(15); // Stock para book1

        Book book2 = new Book();
        book2.setTitle("Crónicas de un Futuro Imaginado");
        book2.setAuthor("Marcos Escritor");
        book2.setPrice(22.50);
        book2.setCategory("Ciencia Ficción");
        book2.setShortDescription("Visiones de la sociedad del mañana, explorando tecnologías emergentes y sus impactos.");
        book2.setCoverImageUrl("assets/images/covers/cover2.jpg");
        book2.setPublisher("FuturoPress");
        book2.setPublishDate(LocalDate.of(2022, 11, 1));
        book2.setPages(280);
        book2.setIsbn("978-0987654321");
        book2.setLanguage("Español");
        book2.setAdditionalImageUrls(Arrays.asList("assets/images/covers/cover1.jpg"));
        book2.setStock(10); // Stock para book2

        Book book3 = new Book();
        book3.setTitle("Recetas para el Alma Curiosa");
        book3.setAuthor("Sofía Chef");
        book3.setPrice(15.75);
        book3.setCategory("Cocina");
        book3.setShortDescription("Deliciosas recetas para experimentar y nutrir el cuerpo y el alma. Un viaje culinario para todos.");
        book3.setCoverImageUrl("assets/images/covers/cover3.jpg");
        book3.setPublisher("Sabor Ediciones");
        book3.setPublishDate(LocalDate.of(2023, 1, 10));
        book3.setPages(190);
        book3.setIsbn("978-5550011223");
        book3.setLanguage("Español");
        book3.setStock(25); // Stock para book3

        Book book4 = new Book();
        book4.setTitle("Aventuras en la Montaña Nublada");
        book4.setAuthor("Carlos Viajero");
        book4.setPrice(18.00);
        book4.setCategory("Aventura");
        book4.setShortDescription("Un viaje épico lleno de peligros, misterios ancestrales y paisajes impresionantes en la indómita Montaña Nublada.");
        book4.setCoverImageUrl("assets/images/covers/cover1.jpg"); // Reusing cover image
        book4.setPublisher("Explora Mundos");
        book4.setPublishDate(LocalDate.of(2021, 7, 22));
        book4.setPages(350);
        book4.setIsbn("978-9876543210");
        book4.setLanguage("Español"); // Corrected: was book1.setLanguage before
        book4.setAdditionalImageUrls(Arrays.asList());
        book4.setStock(5); // Stock para book4


        Book book5 = new Book();
        book5.setTitle("El Secreto Mejor Guardado");
        book5.setAuthor("Laura BestSeller");
        book5.setPrice(25.00);
        book5.setCategory("Misterio");
        book5.setShortDescription("Un secreto que cambiará todo. Un bestseller internacional que te mantendrá en vilo hasta la última página.");
        book5.setCoverImageUrl("assets/images/covers/cover2.jpg"); // Reusing cover image
        book5.setPublisher("Misterios S.A.");
        book5.setPublishDate(LocalDate.of(2021, 7, 20));
        book5.setPages(450);
        book5.setIsbn("978-1122334455");
        book5.setLanguage("Inglés");
        book5.setAdditionalImageUrls(Arrays.asList("assets/images/covers/cover1.jpg"));
        book5.setStock(12); // Stock para book5

        Book book6 = new Book();
        book6.setTitle("Historia Antigua: De Sumeria a Roma");
        book6.setAuthor("Dr. Historiador");
        book6.setPrice(29.99);
        book6.setCategory("Historia");
        book6.setShortDescription("Un recorrido completo por las civilizaciones antiguas, sus culturas, conflictos y legados.");
        book6.setCoverImageUrl("assets/images/covers/cover3.jpg"); // Reusing cover image
        book6.setPublisher("Academia Press");
        book6.setPublishDate(LocalDate.of(2020, 5, 10));
        book6.setPages(600);
        book6.setIsbn("978-3322110099");
        book6.setLanguage("Español");
        book6.setStock(8); // Stock para book6


        List<Book> seedBooks = Arrays.asList(book1, book2, book3, book4, book5, book6);
        bookRepository.saveAll(seedBooks);
        System.out.println(seedBooks.size() + " libros de ejemplo han sido creados.");
    }

    private void createUserSeedData() {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_ADMIN")));
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_USER")));

        // Admin User
        User adminUser = new User();
        adminUser.setEmail("admin@example.com");
        adminUser.setFullName("Admin User");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminRoles.add(userRole);
        adminUser.setRoles(adminRoles);
        userRepository.save(adminUser);
        System.out.println("Usuario admin@example.com de ejemplo creado con roles: " + adminUser.getRoles().stream().map(Role::getName).toList());

        // Regular User
        User regularUser = new User();
        regularUser.setEmail("user@example.com");
        regularUser.setFullName("Regular User");
        regularUser.setPassword(passwordEncoder.encode("user123"));
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        regularUser.setRoles(userRoles);
        userRepository.save(regularUser);
        System.out.println("Usuario user@example.com de ejemplo creado con roles: " + regularUser.getRoles().stream().map(Role::getName).toList());
    }
}
