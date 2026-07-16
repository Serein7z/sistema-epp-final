package com.utp.demo.security;

import com.utp.demo.model.*;
import com.utp.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CascoRepository cascoRepository;
    private final GuanteRepository guanteRepository;
    private final LenteRepository lenteRepository;
    private final MascarillaRepository mascarillaRepository;
    private final ZapatoRepository zapatoRepository;

    public DataSeeder(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       CascoRepository cascoRepository,
                       GuanteRepository guanteRepository,
                       LenteRepository lenteRepository,
                       MascarillaRepository mascarillaRepository,
                       ZapatoRepository zapatoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.cascoRepository = cascoRepository;
        this.guanteRepository = guanteRepository;
        this.lenteRepository = lenteRepository;
        this.mascarillaRepository = mascarillaRepository;
        this.zapatoRepository = zapatoRepository;
    }

    @Override
    public void run(String... args) {
        crearUsuarioSiNoExiste("admin", "1234", "ADMIN");
        crearUsuarioSiNoExiste("user", "1234", "USER");

        if (cascoRepository.count() == 0) {
            cascoRepository.save(new Casco(0, "3M", "M", "Nuevo", "Entregado al operario Luis Quispe - Área de construcción"));
            cascoRepository.save(new Casco(0, "Honeywell", "L", "Nuevo", "Entregado al operario Juan Mamani - Área de soldadura"));
            cascoRepository.save(new Casco(0, "MSA", "S", "En uso", "Asignado a supervisora Ana Torres - Turno mañana"));
            cascoRepository.save(new Casco(0, "3M", "L", "Dañado", "Golpe en la parte frontal, retirado de circulación"));
            cascoRepository.save(new Casco(0, "Honeywell", "M", "En uso", "Asignado a operario Carlos Ramos - Área de almacén"));
        }

        if (guanteRepository.count() == 0) {
            guanteRepository.save(new Guante(0, "Nitrilo", "S", "Usado para cambio", "Desgaste en dedos índice y medio, requiere reemplazo"));
            guanteRepository.save(new Guante(0, "Cuero", "M", "Nuevo", "Entregado a operario Pedro Salinas - Área de metalmecánica"));
            guanteRepository.save(new Guante(0, "Nitrilo", "L", "En uso", "Asignado a técnico Mario Flores - Área de químicos"));
            guanteRepository.save(new Guante(0, "Kevlar", "M", "Nuevo", "Stock de seguridad para cortes - Área de corte y ensamble"));
            guanteRepository.save(new Guante(0, "Cuero", "L", "Dado de baja", "Ruptura en la palma, no apto para uso"));
        }

        if (lenteRepository.count() == 0) {
            lenteRepository.save(new Lente(0, "Panorámico", "Transparente", "Nuevo", "Entregado a operario Rosa Huanca - Área de ensamble"));
            lenteRepository.save(new Lente(0, "Estándar", "Oscuro", "En uso", "Asignado a soldador Jorge Condori - Protección UV"));
            lenteRepository.save(new Lente(0, "Panorámico", "Transparente", "Rayado", "Rayones en zona central, visibilidad reducida, para cambio"));
            lenteRepository.save(new Lente(0, "Estándar", "Transparente", "Nuevo", "Stock disponible - Área de laboratorio"));
            lenteRepository.save(new Lente(0, "Panorámico", "Oscuro", "En mantenimiento", "Limpieza profunda de armazón, disponible en 2 días"));
        }

        if (mascarillaRepository.count() == 0) {
            mascarillaRepository.save(new Mascarilla(0, "N95", "95%", "Nuevo", "Lote nuevo ingresado - Área de pintura y solventes"));
            mascarillaRepository.save(new Mascarilla(0, "KN95", "95%", "En uso", "Asignada a técnica Lucia Vargas - Área de químicos"));
            mascarillaRepository.save(new Mascarilla(0, "N95", "95%", "Usado para cambio", "Filtro saturado, supera las 8 horas de uso continuo"));
            mascarillaRepository.save(new Mascarilla(0, "FFP2", "94%", "Nuevo", "Reserva para visitas y supervisores externos"));
            mascarillaRepository.save(new Mascarilla(0, "KN95", "95%", "Dado de baja", "Rotura en la banda elástica, no genera sello facial"));
        }

        if (zapatoRepository.count() == 0) {
            zapatoRepository.save(new Zapato(0, "Caterpillar", 42, "Nuevo", "Entregado a operario Luis Quispe - Área de construcción"));
            zapatoRepository.save(new Zapato(0, "Bata", 40, "En uso", "Asignado a técnico Pedro Salinas - Área de almacén"));
            zapatoRepository.save(new Zapato(0, "Caterpillar", 41, "Usado para cambio", "Suela desgastada, punta de acero intacta, requiere reemplazo"));
            zapatoRepository.save(new Zapato(0, "Panter", 43, "Nuevo", "Stock disponible - Área de metalmecánica"));
            zapatoRepository.save(new Zapato(0, "Bata", 39, "Dado de baja", "Correa rota y suela despegada, no apto para uso en planta"));
        }
    }

    private void crearUsuarioSiNoExiste(String username, String password, String rol) {
        if (usuarioRepository.findByUsername(username).isPresent()) return;
        usuarioRepository.save(new Usuario(username, passwordEncoder.encode(password), rol));
    }
}
