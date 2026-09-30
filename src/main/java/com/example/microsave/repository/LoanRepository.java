package com.example.microsave.repository;

import com.example.microsave.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    @Query("""
           SELECT COALESCE(SUM(l.outstandingAmount), 0)
           FROM Loan l
           WHERE l.status = 'ACTIVE'
           """)
    Double getTotalOutstandingLoans();
}