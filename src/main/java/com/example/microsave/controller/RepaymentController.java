package com.example.microsave.controller;

import com.example.microsave.entity.Repayment;
import com.example.microsave.service.RepaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repayments")
public class RepaymentController {

    private final RepaymentService repaymentService;

    public RepaymentController(RepaymentService repaymentService) {
        this.repaymentService = repaymentService;
    }

    @PostMapping("/loan/{loanId}")
    public Repayment createRepayment(
            @PathVariable Long loanId,
            @RequestBody Repayment repayment) {

        return repaymentService.createRepayment(
                loanId,
                repayment
        );
    }

    @GetMapping
    public List<Repayment> getAllRepayments() {
        return repaymentService.getAllRepayments();
    }

    @GetMapping("/{id}")
    public Repayment getRepayment(@PathVariable Long id) {
        return repaymentService.getRepaymentById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteRepayment(@PathVariable Long id) {

        repaymentService.deleteRepayment(id);

        return "Repayment deleted successfully";
    }
}