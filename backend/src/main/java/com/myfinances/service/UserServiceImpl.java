package com.myfinances.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.myfinances.dto.UserRegistrationDTO;
import com.myfinances.entity.Users;
import com.myfinances.repo.UserRepository;

@Service
public class UserServiceImpl  implements UserService{

	@Autowired
	UserRepository userRepo;
	
	@Override
	public boolean existsByUsername(String username) {
		return userRepo.existsByUsername(username);
	}
	
	@Override
	public Users save(UserRegistrationDTO userRegister) {
		Users user = new Users();
		user.setFullname(userRegister.getFullname());
		user.setPassword(new BCryptPasswordEncoder().encode(userRegister.getPassword()));
		user.setUsername(userRegister.getUsername());
		user.setCreatedDate(LocalDateTime.now());
		return userRepo.save(user);
	}

}
