package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MatchResponseDTO;
import org.stormsofts.matrimony.model.MstMatch;
import org.stormsofts.matrimony.model.ProfileCardDTO;
import org.stormsofts.matrimony.repository.MstUserRepository;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.MatchService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private MstUserRepository userRepository;

    // GET /api/matches?page=0&size=20
    @GetMapping
    public ResponseEntity<?> getMyMatches(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<MstMatch> matches = matchService.getMyMatches(userId, pageable);

        List<Integer> otherIds = matches.getContent().stream()
                .map(m -> m.getUserOneId().equals(userId) ? m.getUserTwoId() : m.getUserOneId())
                .toList();

        List<ProfileCardDTO> cards = otherIds.isEmpty()
                ? List.of()
                : userRepository.findProfileCardsByIds(otherIds);

        List<MatchResponseDTO> body = matches.getContent().stream().map(m -> {
            Integer otherId = m.getUserOneId().equals(userId) ? m.getUserTwoId() : m.getUserOneId();
            ProfileCardDTO card = cards.stream()
                    .filter(c -> c.getId().equals(otherId))
                    .findFirst()
                    .orElse(null);
            return new MatchResponseDTO(m.getId(), card, m.getCreatedAt());
        }).toList();

        return ResponseEntity.ok(Map.of(
                "content", body,
                "totalElements", matches.getTotalElements(),
                "totalPages", matches.getTotalPages(),
                "page", matches.getNumber(),
                "size", matches.getSize()
        ));
    }

    @GetMapping("/count")
    public ResponseEntity<?> getMatchCount() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("count", matchService.countForUser(userId)));
    }
}
