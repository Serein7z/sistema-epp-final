package com.utp.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.utp.demo.model.Mascarilla;
import com.utp.demo.service.MascarillaService;

@RestController
@RequestMapping("/mascarillas")
public class MascarillaController {

    private final MascarillaService servicio;

    public MascarillaController(MascarillaService servicio) {
        this.servicio = servicio;
    }

      @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Mascarilla> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Mascarilla> obtener(@PathVariable int id) {
        Mascarilla mascarilla = servicio.obtenerPorId(id);
        if (mascarilla == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mascarilla);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Mascarilla> crear(@RequestBody Mascarilla mascarilla) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(mascarilla));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Mascarilla> actualizar(@PathVariable int id, @RequestBody Mascarilla mascarilla) {
        Mascarilla actualizado = servicio.actualizar(id, mascarilla);
        if (actualizado == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!servicio.eliminar(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
