package com.ethan.personal_finance_dashboard.transaction;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponse> getTransactions(@RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category, @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction, @RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate) {
        return transactionService.getFilteredTransactions(type, category, sortBy, direction, startDate, endDate);
    }

    @GetMapping("/recent")
    public List<TransactionResponse> findRecentTransactions() {
        return transactionService.getRecentTransactions();
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse savedTransaction = transactionService.createTransaction(request);
        return ResponseEntity.created(URI.create("/transactions/" + savedTransaction.id())).body(savedTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> editTransactionById(@Valid @RequestBody TransactionRequest request, @PathVariable Long id) {
        TransactionResponse savedTransaction = transactionService.editTransactionById(id, request);

        return ResponseEntity.ok(savedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransactionById(@PathVariable Long id) {
        transactionService.deleteTransactionById(id);
        return ResponseEntity.noContent().build();
    }
}
