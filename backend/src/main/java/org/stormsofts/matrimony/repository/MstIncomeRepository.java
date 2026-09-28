package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstIncome;

public interface MstIncomeRepository extends JpaRepository<MstIncome, Integer> {
}