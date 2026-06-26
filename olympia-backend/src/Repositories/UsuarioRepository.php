<?php
namespace Olympia\Repositories;

use Olympia\Domain\Usuario;
use PDO;
use Exception;

/**
 * Clase UsuarioRepository
 * Encargada de la persistencia y recuperación de datos de la entidad Usuario usando Procedimientos Almacenados.
 */
class UsuarioRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Busca un usuario por DNI.
     */
    public function find(int $dni_usuario): ?Usuario {
        $stmt = $this->db->prepare("CALL sp_BuscarUsuarioPorDni(:dni)");
        $stmt->execute(['dni' => $dni_usuario]);
        $row = $stmt->fetch();

        // Limpiar el buffer de PDO para poder realizar consultas posteriores
        $stmt->closeCursor();

        if (!$row) {
            return null;
        }

        return new Usuario(
            (int)$row['dni_usuario'],
            $row['nombre_usuario'],
            $row['apellido_usuario'],
            $row['fecha_nac'],
            $row['email'],
            isset($row['telefono_usuario']) ? (int)$row['telefono_usuario'] : null,
            $row['password_hash']
        );
    }

    /**
     * Trae todos los usuarios junto con sus roles concatenados.
     */
    public function findAllWithRoles(): array {
        $stmt = $this->db->query("CALL sp_ListarUsuariosConRoles()");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        return $rows;
    }

    /**
     * Busca un usuario por email.
     */
    public function findByEmail(string $email): ?Usuario {
        $stmt = $this->db->prepare("CALL sp_BuscarUsuarioPorEmail(:email)");
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();
        $stmt->closeCursor();

        if (!$row) {
            return null;
        }

        return new Usuario(
            (int)$row['dni_usuario'],
            $row['nombre_usuario'],
            $row['apellido_usuario'],
            $row['fecha_nac'],
            $row['email'],
            isset($row['telefono_usuario']) ? (int)$row['telefono_usuario'] : null,
            $row['password_hash']
        );
    }

    /**
     * Obtiene todos los roles asignados a un usuario.
     */
    public function getUserRoles(int $dni_usuario): array {
        $stmt = $this->db->prepare("CALL sp_ObtenerRolesUsuario(:dni)");
        $stmt->execute(['dni' => $dni_usuario]);
        $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $stmt->closeCursor();

        if (empty($roles)) {
            $roles[] = 'Capitán'; // Rol por defecto si no tiene otro
        }

        return array_unique($roles);
    }

    /**
     * Guarda (inserta o actualiza) un usuario.
     */
    public function save(Usuario $usuario): bool {
        $stmt = $this->db->prepare("CALL sp_GuardarUsuario(:dni, :nombre, :apellido, :fecha_nac, :email, :telefono, :pass, @resultado, @mensaje)");
        $stmt->execute([
            'dni' => $usuario->dni_usuario,
            'nombre' => $usuario->nombre_usuario,
            'apellido' => $usuario->apellido_usuario,
            'fecha_nac' => $usuario->fecha_nac,
            'email' => $usuario->email,
            'telefono' => $usuario->telefono_usuario,
            'pass' => $usuario->password_hash ?? password_hash('olympia123', PASSWORD_DEFAULT)
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        
        if (!$res || !$res['resultado']) {
            return false;
        }

        return true;
    }

    /**
     * Asocia un usuario a un torneo con un rol de colaborador específico.
     */
    public function guardarColaborador(int $dni, int $idTorneo, int $idRol): bool {
        $stmt = $this->db->prepare("CALL sp_GuardarColaborador(:dni, :id_torneo, :id_rol, @resultado, @mensaje)");
        $stmt->execute([
            'dni' => $dni,
            'id_torneo' => $idTorneo,
            'id_rol' => $idRol
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Elimina las colaboraciones registradas de un usuario.
     */
    public function eliminarColaboradoresPorDni(int $dni): bool {
        $stmt = $this->db->prepare("CALL sp_EliminarColaboradoresPorDni(:dni, @resultado, @mensaje)");
        $stmt->execute(['dni' => $dni]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Asocia un jugador a la plantilla de un equipo.
     */
    public function asociarAPlantilla(int $dni, int $idEquipo): bool {
        $stmt = $this->db->prepare("CALL sp_AsociarAPlantilla(:dni, :id_equipo, @resultado, @mensaje)");
        $stmt->execute([
            'dni' => $dni,
            'id_equipo' => $idEquipo
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }
}
