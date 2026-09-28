package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstIncome;
import org.stormsofts.matrimony.repository.MstIncomeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstIncomeController {

    @Autowired
    private MstIncomeRepository incomeRepo;

    // GET all incomes
    @GetMapping
    public List<MstIncome> getAllIncomes() {
        return incomeRepo.findAll();
    }
}
