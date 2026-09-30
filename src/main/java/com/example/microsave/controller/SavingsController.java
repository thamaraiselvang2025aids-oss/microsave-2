package com.example.microsave.controller;

import com.example.microsave.entity.Savings;
import com.example.microsave.service.SavingsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
public class SavingsController {

    private final SavingsService savingsService;

    public SavingsController(SavingsService savingsService) {
        this.savingsService = savingsService;
    }

    @PostMapping("/member/{memberId}")
    public Savings createSavings(
            @PathVariable Long memberId,
            @RequestBody Savings savings) {

        return savingsService.createSavings(memberId, savings);
    }

    @GetMapping
    public List<Savings> getAllSavings() {
        return savingsService.getAllSavings();
    }

    @GetMapping("/{id}")
    public Savings getSavings(@PathVariable Long id) {
        return savingsService.getSavingsById(id);
    }

    @PutMapping("/{id}")
    public Savings updateSavings(
            @PathVariable Long id,
            @RequestBody Savings savings) {

        return savingsService.updateSavings(id, savings);
    }

    @DeleteMapping("/{id}")
    public String deleteSavings(@PathVariable Long id) {

        savingsService.deleteSavings(id);

        return "Savings deleted successfully";
    }

    @GetMapping("/total")
    public Double getTotalSavings() {
        return savingsService.getTotalSavings();
    }
}