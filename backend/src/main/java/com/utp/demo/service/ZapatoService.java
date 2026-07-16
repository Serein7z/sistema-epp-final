package com.utp.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

import com.utp.demo.model.Zapato;
import com.utp.demo.repository.ZapatoRepository;

@Service
public class ZapatoService {

    private final ZapatoRepository repositorio;

    public ZapatoService(ZapatoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Zapato> listar() {
        return repositorio.findAll();
    }

    public Zapato obtenerPorId(int id) {
        return repositorio.findById(id).orElse(null);
    }

    public Zapato guardar(Zapato zapato) {
        zapato.setId(0);
        return repositorio.save(zapato);
    }

    public Zapato actualizar(int id, Zapato datos) {
        Zapato existente = obtenerPorId(id);
        if (existente == null) return null;
        existente.setMarca(datos.getMarca());
        existente.setTalla(datos.getTalla());
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
