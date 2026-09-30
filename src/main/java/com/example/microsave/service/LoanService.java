package com.example.microsave.service;

import com.example.microsave.entity.Loan;
import com.example.microsave.entity.Member;
import com.example.microsave.repository.LoanRepository;
import com.example.microsave.repository.MemberRepository;
import com.example.microsave.repository.SavingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final MemberRepository memberRepository;
    private final SavingsRepository savingsRepository;

    public LoanService(LoanRepository loanRepository,
                       MemberRepository memberRepository,
                       SavingsRepository savingsRepository) {

        this.loanRepository = loanRepository;
        this.memberRepository = memberRepository;
        this.savingsRepository = savingsRepository;
    }

    // =========================
    // CREATE LOAN
    // =========================

    public Loan createLoan(Long memberId, Loan loan) {

        // Validate loan amount
        if (loan.getAmount() == null || loan.getAmount() <= 0) {
            throw new RuntimeException(
                    "Loan amount must be greater than zero"
            );
        }

        // Validate loan date
        if (loan.getLoanDate() == null) {
            throw new RuntimeException(
                    "Loan date is required"
            );
        }

        // Validate payment deadline
        if (loan.getPaymentDeadline() == null) {
            throw new RuntimeException(
                    "Payment deadline is required"
            );
        }

        // Deadline cannot be before loan date
        if (loan.getPaymentDeadline()
                .isBefore(loan.getLoanDate())) {

            throw new RuntimeException(
                    "Payment deadline cannot be before loan date"
            );
        }

        // Find member
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + memberId
                        )
                );

        // Calculate group balance
        Double totalSavings =
                savingsRepository.getTotalSavings();

        Double outstandingLoans =
                loanRepository.getTotalOutstandingLoans();

        Double availableBalance =
                totalSavings - outstandingLoans;

        // Check available funds
        if (loan.getAmount() > availableBalance) {

            throw new RuntimeException(
                    "Loan cannot be approved. Insufficient group funds. "
                            + "Available balance: "
                            + availableBalance
            );
        }

        // Set loan details
        loan.setMember(member);

        loan.setOutstandingAmount(
                loan.getAmount()
        );

        loan.setStatus("ACTIVE");

        // Save loan
        return loanRepository.save(loan);
    }

    // =========================
    // GET ALL LOANS
    // =========================

    public List<Loan> getAllLoans() {

        return loanRepository.findAll();
    }

    // =========================
    // GET LOAN BY ID
    // =========================

    public Loan getLoanById(Long id) {

        return loanRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found with ID: " + id
                        )
                );
    }

    // =========================
    // DELETE LOAN
    // =========================

    public void deleteLoan(Long id) {

        Loan loan = getLoanById(id);

        loanRepository.delete(loan);
    }

    // =========================
    // AVAILABLE GROUP BALANCE
    // =========================

    public Double getAvailableGroupBalance() {

        Double totalSavings =
                savingsRepository.getTotalSavings();

        Double outstandingLoans =
                loanRepository.getTotalOutstandingLoans();

        return totalSavings - outstandingLoans;
    }
}