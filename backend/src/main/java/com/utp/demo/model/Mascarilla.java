package com.utp.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Mascarilla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String tipo;
    private String filtracion;
    private String estado;
    private String observacion;

    public Mascarilla() {}

    public Mascarilla(int id, String tipo, String filtracion, String estado, String observacion) {
        this.id = id;
        this.tipo = tipo;
        this.filtracion = filtracion;
        this.estado = estado;
        this.observacion = observacion;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getFiltracion() { return filtracion; }
    public void setFiltracion(String filtracion) { this.filtracion = filtracion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
