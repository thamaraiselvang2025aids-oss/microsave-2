package com.example.microsave.controller;

import com.example.microsave.entity.Member;
import com.example.microsave.service.MemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // ==============================
    // CREATE MEMBER
    // ==============================
    @PostMapping
    public Member createMember(@RequestBody Member member) {

        return memberService.createMember(member);
    }


    // ==============================
    // MEMBERS HAVING SAVINGS
    // ==============================
    @GetMapping("/with-savings")
    public List<Member> getMembersWithSavings(
            @RequestParam(defaultValue = "0") Double minAmount) {

        return memberService.getMembersWithSavings(minAmount);
    }


    // ==============================
    // GET ALL MEMBERS + SORTING
    // ==============================
    @GetMapping
    public List<Member> getAllMembers(

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        return memberService.getAllMembers(sortBy, direction);
    }


    // ==============================
    // GET MEMBER BY ID
    // ==============================
    @GetMapping("/{id}")
    public Member getMember(@PathVariable Long id) {

        return memberService.getMemberById(id);
    }


    // ==============================
    // UPDATE MEMBER
    // ==============================
    @PutMapping("/{id}")
    public Member updateMember(
            @PathVariable Long id,
            @RequestBody Member member) {

        return memberService.updateMember(id, member);
    }


    // ==============================
    // DELETE MEMBER
    // ==============================
    @DeleteMapping("/{id}")
    public String deleteMember(@PathVariable Long id) {

        memberService.deleteMember(id);

        return "Member deleted successfully";
    }
}