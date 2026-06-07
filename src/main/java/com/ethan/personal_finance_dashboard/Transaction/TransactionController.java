package com.ethan.personal_finance_dashboard.Transaction;

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
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> findTransactionById(@PathVariable Long id) {
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(transaction);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.created(URI.create("/transactions/" + savedTransaction.getId())).body(savedTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> editTransactionById(@Valid @RequestBody Transaction t, @PathVariable Long id) {
        Transaction transactionToEdit = transactionRepository.findById(id).orElse(null);
        if (transactionToEdit == null) {
            return ResponseEntity.notFound().build();
        }

        transactionToEdit.setAmount(t.getAmount());
        transactionToEdit.setCategory(t.getCategory());
        transactionToEdit.setDescription(t.getDescription());

        Transaction savedTransaction = transactionRepository.save(transactionToEdit);

        transactionRepository.save(transactionToEdit);

        return ResponseEntity.ok(savedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransactionById(@PathVariable Long id) {
        Transaction transactionToDel = transactionRepository.findById(id).orElse(null);
        if (transactionToDel == null) {
            return ResponseEntity.notFound().build();
        }

        transactionRepository.delete(transactionToDel);
        return ResponseEntity.noContent().build();

    }

}
