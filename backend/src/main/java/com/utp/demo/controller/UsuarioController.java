package com.utp.demo.controller;

import com.utp.demo.dto.CambiarPasswordRequest;
import com.utp.demo.dto.UsuarioResumen;
import com.utp.demo.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<UsuarioResumen> listar() {
        return servicio.listar();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> cambiarPassword(@PathVariable int id, @RequestBody CambiarPasswordRequest request) {
        boolean actualizado = servicio.cambiarPassword(id, request.getNuevaPassword());
        if (!actualizado) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
