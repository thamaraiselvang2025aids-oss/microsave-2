package com.example.microsave.service;

import com.example.microsave.entity.Member;
import com.example.microsave.entity.Savings;
import com.example.microsave.repository.MemberRepository;
import com.example.microsave.repository.SavingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsService {

    private final SavingsRepository savingsRepository;
    private final MemberRepository memberRepository;

    public SavingsService(SavingsRepository savingsRepository,
                          MemberRepository memberRepository) {

        this.savingsRepository = savingsRepository;
        this.memberRepository = memberRepository;
    }

    public Savings createSavings(Long memberId, Savings savings) {

        if (savings.getAmount() == null || savings.getAmount() <= 0) {
            throw new RuntimeException("Savings amount must be greater than zero");
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException("Member not found with ID: " + memberId));

        savings.setMember(member);

        return savingsRepository.save(savings);
    }

    public List<Savings> getAllSavings() {
        return savingsRepository.findAll();
    }

    public Savings getSavingsById(Long id) {

        return savingsRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Savings record not found"));
    }

    public Savings updateSavings(Long id, Savings updatedSavings) {

        Savings savings = getSavingsById(id);

        if (updatedSavings.getAmount() == null ||
                updatedSavings.getAmount() <= 0) {

            throw new RuntimeException("Savings amount must be greater than zero");
        }

        savings.setAmount(updatedSavings.getAmount());
        savings.setContributionDate(updatedSavings.getContributionDate());

        return savingsRepository.save(savings);
    }

    public void deleteSavings(Long id) {

        Savings savings = getSavingsById(id);

        savingsRepository.delete(savings);
    }

    public Double getTotalSavings() {
        return savingsRepository.getTotalSavings();
    }
}