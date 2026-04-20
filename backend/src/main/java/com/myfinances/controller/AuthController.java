package com.myfinances.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.myfinances.dto.LoginDTO;
import com.myfinances.dto.UserRegistrationDTO;
import com.myfinances.service.UserService;
import com.myfinances.util.Constants;
import com.myfinances.util.CustomUserDetails;
import com.myfinances.util.CustomUserDetailsService;
import com.myfinances.util.JwtUtil;
import com.myfinances.util.Severity;

@Controller
public class AuthController {
	
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	UserService userService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private CustomUserDetailsService userDetailsService;

	@PostMapping("/login")
	public ResponseEntity<?> loginValidation(@RequestBody LoginDTO loginDto) {
		Map<String, String> response = new HashMap<>();
		try {
			logger.info("Validating login details");
			authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(
					loginDto.getUsername(), loginDto.getPassword()));
			CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(loginDto.getUsername());
			String token = jwtUtil.generateToken(userDetails);
			
			response.put(Constants.TOKEN, token);
			response.put("username", userDetails.getUsername());
			response.put("fullname", userDetails.getFullname());
			response.put(Constants.SEVERITY, Severity.success.toString());
			response.put(Constants.MESSAGE, Constants.LOGIN_SUCCESS);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put(Constants.SEVERITY, Severity.error.toString());
			response.put(Constants.MESSAGE, Constants.LOGIN_FAILURE);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> createUser(@RequestBody UserRegistrationDTO userRegister) {
		Map<String, String> response = new HashMap<>();
		if(userRegister == null) {
			logger.info("UserRegistrationDto is null");
			response.put(Constants.SEVERITY, Severity.error.toString());
			response.put(Constants.MESSAGE, Constants.BAD_REQUEST);
			return ResponseEntity.badRequest().body(response);
		}
		//existing user validation
		if(userService.existsByUsername(userRegister.getUsername())) {
			logger.info(userRegister.getUsername()+ " name already exits");
			response.put(Constants.SEVERITY, Severity.error.toString());
			response.put(Constants.MESSAGE, Constants.USERNAME_EXISTS);
			return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
		}
		try {
			logger.info("Creating a new user with username"+userRegister.getUsername());
			userService.save(userRegister);
			logger.info("Registered Successful");
			response.put(Constants.SEVERITY, Severity.success.toString());
			response.put(Constants.MESSAGE, Constants.REGISTRATION_SUCCESS);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		}
		catch(Exception e) {
			response.put(Constants.SEVERITY, Severity.error.toString());
			response.put(Constants.MESSAGE, Constants.UNKNOWN_ERROR);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

}
