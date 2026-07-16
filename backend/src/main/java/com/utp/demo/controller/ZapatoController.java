package com.utp.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.utp.demo.model.Zapato;
import com.utp.demo.service.ZapatoService;

@RestController
@RequestMapping("/zapatos")
public class ZapatoController {

    private final ZapatoService servicio;

    public ZapatoController(ZapatoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Zapato> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Zapato> obtener(@PathVariable int id) {
        Zapato zapato = servicio.obtenerPorId(id);
        if (zapato == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(zapato);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Zapato> crear(@RequestBody Zapato zapato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(zapato));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Zapato> actualizar(@PathVariable int id, @RequestBody Zapato zapato) {
        Zapato actualizado = servicio.actualizar(id, zapato);
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
