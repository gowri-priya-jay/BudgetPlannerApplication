package com.myfinances.service;

import com.myfinances.dto.UserRegistrationDTO;
import com.myfinances.entity.Users;

public interface UserService {
	
	boolean existsByUsername(String username);

	Users save(UserRegistrationDTO userRegister);

}
