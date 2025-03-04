package com.example.be_smartnote.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "note_features")
public class NoteFeature {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @Column(name = "feature_name", nullable = false)
    private String featureName;

    @Lob
    @Column(name = "feature_data")
    private String featureData;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}