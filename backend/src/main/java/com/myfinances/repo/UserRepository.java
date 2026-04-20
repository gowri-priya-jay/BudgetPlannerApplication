package com.myfinances.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myfinances.entity.Users;

public interface UserRepository extends JpaRepository<Users, Long> {

	boolean existsByUsername(String username);
	
	Users findByUsername(String username);

}
