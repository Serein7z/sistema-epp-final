package com.utp.demo.dto;

public class UsuarioResumen {
    private int id;
    private String username;
    private String rol;

    public UsuarioResumen(int id, String username, String rol) {
        this.id = id;
        this.username = username;
        this.rol = rol;
    }

    public int getId() { return id; }
    public String getUsername() { return username; }
    public String getRol() { return rol; }
}
