package com.example.microsave.repository;

import com.example.microsave.entity.Savings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SavingsRepository extends JpaRepository<Savings, Long> {

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Savings s")
    Double getTotalSavings();
}