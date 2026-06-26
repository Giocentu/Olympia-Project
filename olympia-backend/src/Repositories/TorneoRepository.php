<?php
namespace Olympia\Repositories;

use Olympia\Domain\Torneo;
use PDO;
use Exception;

/**
 * Clase TorneoRepository
 * Encargada de la persistencia y recuperación de datos de la entidad Torneo usando Procedimientos Almacenados.
 */
class TorneoRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Busca un torneo por su ID, uniendo con sus catálogos normalizados.
     */
    public function find(int $id_torneo): ?Torneo {
        $stmt = $this->db->prepare("CALL sp_BuscarTorneoPorId(:id)");
        $stmt->execute(['id' => $id_torneo]);
        $row = $stmt->fetch();
        $stmt->closeCursor();

        if (!$row) {
            return null;
        }

        $t = new Torneo(
            $row['nombre_torneo'],
            $row['torneo_inicio'],
            $row['torneo_fin'],
            (int)$row['max_equipos'],
            $row['nombre_formato'],
            $row['nombre_categoria'],
            $row['nombre_deporte'],
            $row['pin_asistente'] ?? null,
            (int)$row['id_torneo']
        );
        $t->created_at = $row['created_at'] ?? null;
        return $t;
    }

    /**
     * Recupera todos los torneos del sistema.
     */
    public function findAll(): array {
        $stmt = $this->db->query("CALL sp_ListarTorneos()");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $torneos = [];
        foreach ($rows as $row) {
            $t = new Torneo(
                $row['nombre_torneo'],
                $row['torneo_inicio'],
                $row['torneo_fin'],
                (int)$row['max_equipos'],
                $row['nombre_formato'],
                $row['nombre_categoria'],
                $row['nombre_deporte'],
                $row['pin_asistente'] ?? null,
                (int)$row['id_torneo']
            );
            $t->created_at = $row['created_at'] ?? null;
            $torneos[] = $t;
        }

        return $torneos;
    }

    /**
     * Guarda (inserta o actualiza) un torneo en la base de datos.
     */
    public function save(Torneo $torneo): bool {
        $stmt = $this->db->prepare("CALL sp_GuardarTorneo(:id, :nombre, :inicio, :fin, :max_eq, :formato, :deporte, :categoria, :pin, @id_generado, @resultado, @mensaje)");
        $stmt->bindValue(':id', $torneo->id_torneo, PDO::PARAM_INT);
        $stmt->bindValue(':nombre', $torneo->nombre_torneo);
        $stmt->bindValue(':inicio', $torneo->torneo_inicio);
        $stmt->bindValue(':fin', $torneo->torneo_fin);
        $stmt->bindValue(':max_eq', $torneo->max_equipos);
        $stmt->bindValue(':formato', $torneo->formato_torneo);
        $stmt->bindValue(':deporte', $torneo->deporte_torneo);
        $stmt->bindValue(':categoria', $torneo->categoria_torneo);
        $stmt->bindValue(':pin', $torneo->pin_asistente);

        $stmt->execute();
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @id_generado AS id_generado, @resultado AS resultado, @mensaje AS mensaje")->fetch();
        
        if (!$res || !$res['resultado']) {
            return false;
        }

        // Actualizar el ID en el objeto si fue generado
        if ($torneo->id_torneo === null && isset($res['id_generado'])) {
            $torneo->id_torneo = (int)$res['id_generado'];
        }

        return true;
    }

    /**
     * Elimina físicamente un torneo.
     */
    public function delete(int $id_torneo): bool {
        $stmt = $this->db->prepare("DELETE FROM Torneo WHERE id_torneo = :id");
        return $stmt->execute(['id' => $id_torneo]);
    }

    /**
     * Guarda el PIN del asistente para un torneo.
     */
    public function updatePin(int $id_torneo, ?string $pin): bool {
        $stmt = $this->db->prepare("CALL sp_AsignarPinAsistente(:id, :pin, @resultado, @mensaje)");
        $stmt->execute([
            'id' => $id_torneo,
            'pin' => $pin
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Busca un torneo por PIN.
     */
    public function findByPin(string $pin): ?Torneo {
        $stmt = $this->db->prepare("CALL sp_VerificarPinAsistente(:pin, @id_torneo, @nombre_torneo)");
        $stmt->execute(['pin' => $pin]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @id_torneo AS id_torneo, @nombre_torneo AS nombre_torneo")->fetch();
        
        if (!$res || $res['id_torneo'] === null) {
            return null;
        }

        // Recuperar torneo completo usando el ID encontrado
        return $this->find((int)$res['id_torneo']);
    }

    /**
     * Registra un colaborador/creador para el torneo.
     */
    public function registrarCreadorColaborador(int $dni, int $idTorneo, int $idRol): bool {
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
}
