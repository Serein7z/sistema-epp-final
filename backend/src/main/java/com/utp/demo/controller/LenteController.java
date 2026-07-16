package com.utp.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.utp.demo.model.Lente;
import com.utp.demo.service.LenteService;

@RestController
@RequestMapping("/lentes")
public class LenteController {

    private final LenteService servicio;

    public LenteController(LenteService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Lente> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Lente> obtener(@PathVariable int id) {
        Lente lente = servicio.obtenerPorId(id);
        if (lente == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(lente);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lente> crear(@RequestBody Lente lente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(lente));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lente> actualizar(@PathVariable int id, @RequestBody Lente lente) {
        Lente actualizado = servicio.actualizar(id, lente);
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
