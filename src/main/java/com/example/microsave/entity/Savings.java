package com.example.microsave.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "savings")
public class Savings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private LocalDate contributionDate;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    public Savings() {
    }

    public Savings(Double amount, LocalDate contributionDate, Member member) {
        this.amount = amount;
        this.contributionDate = contributionDate;
        this.member = member;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getContributionDate() {
        return contributionDate;
    }

    public void setContributionDate(LocalDate contributionDate) {
        this.contributionDate = contributionDate;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}