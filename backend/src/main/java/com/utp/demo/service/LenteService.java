package com.utp.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

import com.utp.demo.model.Lente;
import com.utp.demo.repository.LenteRepository;

@Service
public class LenteService {

    private final LenteRepository repositorio;

    public LenteService(LenteRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Lente> listar() {
        return repositorio.findAll();
    }

    public Lente obtenerPorId(int id) {
        return repositorio.findById(id).orElse(null);
    }

    public Lente guardar(Lente lente) {
        lente.setId(0);
        return repositorio.save(lente);
    }

    public Lente actualizar(int id, Lente datos) {
        Lente existente = obtenerPorId(id);
        if (existente == null) return null;
        existente.setTipo(datos.getTipo());
        existente.setColor(datos.getColor());
        existente.setEstado(datos.getEstado());
        existente.setObservacion(datos.getObservacion());
        return repositorio.save(existente);
    }

    public boolean eliminar(int id) {
        if (!repositorio.existsById(id)) return false;
        repositorio.deleteById(id);
        return true;
    }
}
