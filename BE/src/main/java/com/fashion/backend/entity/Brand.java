package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "brands")
@Data
public class Brand {
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String slug;

    private String description;
    private String logoUrl;
<<<<<<< Updated upstream
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
=======
    private String bannerUrl;
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
>>>>>>> Stashed changes
