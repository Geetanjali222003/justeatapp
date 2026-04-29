package com.CAPSTONEPROJECT.CAPSTONE.security;

import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CustomUserDetailsService
 *
 * Spring Security uses this service to load a user from the database
 * based on username.
 *
 * Important:
 * - We map our Role (CUSTOMER/OWNER) to a Spring "authority".
 * - By convention we prefix it with "ROLE_" so we can use hasRole("CUSTOMER").
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}

