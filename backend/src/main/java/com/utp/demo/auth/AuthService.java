package com.utp.demo.auth;

import com.utp.demo.model.Usuario;
import com.utp.demo.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authManager,
                       UserDetailsService userDetailsService,
                       JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(AuthRequest request) {
        // Valida usuario y contraseña — lanza excepción si son incorrectos
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generarToken(userDetails);
        return new AuthResponse(token);
    }
}
