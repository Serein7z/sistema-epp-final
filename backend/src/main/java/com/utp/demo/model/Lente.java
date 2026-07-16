package com.utp.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Lente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String tipo;
    private String color;
    private String estado;
    private String observacion;

    public Lente() {}

    public Lente(int id, String tipo, String color, String estado, String observacion) {
        this.id = id;
        this.tipo = tipo;
        this.color = color;
        this.estado = estado;
        this.observacion = observacion;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
