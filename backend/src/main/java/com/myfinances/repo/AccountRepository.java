package com.myfinances.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {

	boolean existsByAccountName(String accountName);

}
