package org.stormsofts.matrimony.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstSubscription;
import org.stormsofts.matrimony.model.SubscriptionStatus;
import org.stormsofts.matrimony.repository.MstSubscriptionRepository;

import java.time.Instant;

/**
 * Spec #10: subscriptions must become EXPIRED in the backend, not only be
 * date-checked in React. This sweeps hourly; SubscriptionServiceImpl
 * #getEffectivePlan also expires lazily on every check, so access is never
 * granted past endDate even between sweeps.
 */
@Component
@EnableScheduling
public class MembershipExpiryJob {

    private static final Logger log = LoggerFactory.getLogger(MembershipExpiryJob.class);

    @Autowired private MstSubscriptionRepository subscriptionRepository;

    @Scheduled(fixedDelay = 3600000, initialDelay = 60000)
    @Transactional
    public void expireSubscriptions() {
        Instant now = Instant.now();
        int count = 0;
        for (MstSubscription s : subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE)) {
            if (s.getEndDate() != null && s.getEndDate().isBefore(now)) {
                s.setStatus(SubscriptionStatus.EXPIRED);
                s.setUpdatedAt(now);
                subscriptionRepository.save(s);
                count++;
            }
        }
        if (count > 0) log.info("Expired {} subscription(s)", count);
    }
}
