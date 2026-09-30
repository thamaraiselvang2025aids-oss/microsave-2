package com.example.microsave.controller;

import com.example.microsave.entity.Loan;
import com.example.microsave.service.LoanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/member/{memberId}")
    public Loan createLoan(
            @PathVariable Long memberId,
            @RequestBody Loan loan) {

        return loanService.createLoan(memberId, loan);
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/{id}")
    public Loan getLoan(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteLoan(@PathVariable Long id) {

        loanService.deleteLoan(id);

        return "Loan deleted successfully";
    }

    @GetMapping("/balance")
    public Double getAvailableBalance() {

        return loanService.getAvailableGroupBalance();
    }
}