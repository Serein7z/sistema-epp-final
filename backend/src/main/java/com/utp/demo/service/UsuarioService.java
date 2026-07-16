package com.utp.demo.service;

import com.utp.demo.dto.UsuarioResumen;
import com.utp.demo.model.Usuario;
import com.utp.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repositorio, PasswordEncoder passwordEncoder) {
        this.repositorio = repositorio;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResumen> listar() {
        return repositorio.findAll().stream()
            .map(u -> new UsuarioResumen(u.getId(), u.getUsername(), u.getRol()))
            .toList();
    }

    public boolean cambiarPassword(int id, String nuevaPassword) {
        Usuario usuario = repositorio.findById(id).orElse(null);
        if (usuario == null) return false;
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        repositorio.save(usuario);
        return true;
    }
}
