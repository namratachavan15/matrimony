package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstPayment;
import org.stormsofts.matrimony.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

public interface MstPaymentRepository extends JpaRepository<MstPayment, Integer> {

    Optional<MstPayment> findByRazorpayOrderId(String razorpayOrderId);

    Page<MstPayment> findByUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query(
            "select coalesce(sum(p.amount), 0) from MstPayment p where p.status = :status")
    BigDecimal sumAmountByStatus(@org.springframework.data.repository.query.Param("status") PaymentStatus status);

    @org.springframework.data.jpa.repository.Query(
            "select coalesce(sum(p.amount), 0) from MstPayment p where p.status = :status and p.createdAt >= :since")
    BigDecimal sumAmountByStatusSince(@org.springframework.data.repository.query.Param("status") PaymentStatus status,
                                      @org.springframework.data.repository.query.Param("since") Instant since);
}
