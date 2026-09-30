package com.example.microsave.service;

import com.example.microsave.entity.Member;
import com.example.microsave.repository.MemberRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // ==========================================
    // CREATE MEMBER
    // ==========================================
    public Member createMember(Member member) {

        if (member.getName() == null ||
                member.getName().isBlank()) {

            throw new RuntimeException(
                    "Member name is required"
            );
        }

        return memberRepository.save(member);
    }


    // ==========================================
    // GET ALL MEMBERS WITH SORTING
    // ==========================================
    public List<Member> getAllMembers(
            String sortBy,
            String direction) {

        // Allowed fields for sorting
        if (!sortBy.equals("id") &&
                !sortBy.equals("name") &&
                !sortBy.equals("phone") &&
                !sortBy.equals("address") &&
                !sortBy.equals("joinDate")) {

            throw new RuntimeException(
                    "Invalid sort field: " + sortBy
            );
        }

        Sort.Direction sortDirection;

        if (direction.equalsIgnoreCase("desc")) {

            sortDirection = Sort.Direction.DESC;

        } else {

            sortDirection = Sort.Direction.ASC;
        }

        Sort sort = Sort.by(
                sortDirection,
                sortBy
        );

        return memberRepository.findAll(sort);
    }


    // ==========================================
    // GET MEMBER BY ID
    // ==========================================
    public Member getMemberById(Long id) {

        return memberRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + id
                        )
                );
    }


    // ==========================================
    // UPDATE MEMBER
    // ==========================================
    public Member updateMember(
            Long id,
            Member updatedMember) {

        Member member = getMemberById(id);

        if (updatedMember.getName() == null ||
                updatedMember.getName().isBlank()) {

            throw new RuntimeException(
                    "Member name is required"
            );
        }

        member.setName(
                updatedMember.getName()
        );

        member.setPhone(
                updatedMember.getPhone()
        );

        member.setAddress(
                updatedMember.getAddress()
        );

        member.setJoinDate(
                updatedMember.getJoinDate()
        );

        return memberRepository.save(member);
    }


    // ==========================================
    // DELETE MEMBER
    // ==========================================
    public void deleteMember(Long id) {

        if (!memberRepository.existsById(id)) {

            throw new RuntimeException(
                    "Member not found with ID: " + id
            );
        }

        memberRepository.deleteById(id);
    }


    // ==========================================
    // GET MEMBERS WHO HAVE SAVINGS
    // ==========================================
    public List<Member> getMembersWithSavings(
            Double minAmount) {

        if (minAmount == null) {
            minAmount = 0.0;
        }

        if (minAmount < 0) {

            throw new RuntimeException(
                    "Minimum amount cannot be negative"
            );
        }

        return memberRepository.findMembersWithSavings(
                minAmount
        );
    }
}