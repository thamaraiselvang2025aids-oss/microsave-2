package com.example.microsave.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private Double outstandingAmount;

    private LocalDate loanDate;

    private LocalDate paymentDeadline;

    private String status;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    public Loan() {
    }

    public Loan(Double amount,
                Double outstandingAmount,
                LocalDate loanDate,
                LocalDate paymentDeadline,
                String status,
                Member member) {

        this.amount = amount;
        this.outstandingAmount = outstandingAmount;
        this.loanDate = loanDate;
        this.paymentDeadline = paymentDeadline;
        this.status = status;
        this.member = member;
    }

    // =========================
    // ID
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =========================
    // AMOUNT
    // =========================

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    // =========================
    // OUTSTANDING AMOUNT
    // =========================

    public Double getOutstandingAmount() {
        return outstandingAmount;
    }

    public void setOutstandingAmount(Double outstandingAmount) {
        this.outstandingAmount = outstandingAmount;
    }

    // =========================
    // LOAN DATE
    // =========================

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public void setLoanDate(LocalDate loanDate) {
        this.loanDate = loanDate;
    }

    // =========================
    // PAYMENT DEADLINE
    // =========================

    public LocalDate getPaymentDeadline() {
        return paymentDeadline;
    }

    public void setPaymentDeadline(LocalDate paymentDeadline) {
        this.paymentDeadline = paymentDeadline;
    }

    // =========================
    // STATUS
    // =========================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // =========================
    // MEMBER
    // =========================

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}