package com.example.be_smartnote.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "note_features")
public class NoteFeature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "feature_name", nullable = false)
    private String featureName;

    @Lob
    @Column(name = "feature_data")
    private String featureData;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}