package com.example.microsave.service;

import com.example.microsave.entity.Loan;
import com.example.microsave.entity.Repayment;
import com.example.microsave.repository.LoanRepository;
import com.example.microsave.repository.RepaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepaymentService {

    private final RepaymentRepository repaymentRepository;
    private final LoanRepository loanRepository;

    public RepaymentService(RepaymentRepository repaymentRepository,
                            LoanRepository loanRepository) {

        this.repaymentRepository = repaymentRepository;
        this.loanRepository = loanRepository;
    }

    public Repayment createRepayment(Long loanId, Repayment repayment) {

        if (repayment.getAmount() == null ||
                repayment.getAmount() <= 0) {

            throw new RuntimeException(
                    "Repayment amount must be greater than zero");
        }

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Loan not found with ID: " + loanId));

        if (!"ACTIVE".equals(loan.getStatus())) {

            throw new RuntimeException(
                    "This loan is already closed");
        }

        if (repayment.getAmount() > loan.getOutstandingAmount()) {

            throw new RuntimeException(
                    "Repayment exceeds outstanding loan balance");
        }

        Double newOutstanding =
                loan.getOutstandingAmount() - repayment.getAmount();

        loan.setOutstandingAmount(newOutstanding);

        if (newOutstanding == 0) {
            loan.setStatus("CLOSED");
        }

        loanRepository.save(loan);

        repayment.setLoan(loan);

        return repaymentRepository.save(repayment);
    }

    public List<Repayment> getAllRepayments() {
        return repaymentRepository.findAll();
    }

    public Repayment getRepaymentById(Long id) {

        return repaymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Repayment not found with ID: " + id));
    }

    public void deleteRepayment(Long id) {

        Repayment repayment = getRepaymentById(id);

        repaymentRepository.delete(repayment);
    }
}