package com.example.microsave.repository;

import com.example.microsave.entity.Member;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query("""
        SELECT m
        FROM Member m
        WHERE (
            SELECT COALESCE(SUM(s.amount), 0)
            FROM Savings s
            WHERE s.member = m
        ) > :minAmount
        """)
    List<Member> findMembersWithSavings(
            @Param("minAmount") Double minAmount
    );
}