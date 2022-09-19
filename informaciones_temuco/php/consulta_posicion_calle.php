<?php
    include("conec.php");
    $nombreCalle = $_POST["nombreCalle"];
    $horaInicio  = $_POST["horaInicio"];
    $horaFinal   = $_POST["horaFinal"];

    $consulta = "SELECT latitud, longitud FROM datos WHERE calle='$nombreCalle'
                 AND hora BETWEEN $horaInicio AND $horaFinal ORDER BY hora LIMIT 1;";

    $query = mysqli_query($conexion, $consulta);
    $resultado = mysqli_fetch_assoc($query);

    echo json_encode([floatval($resultado["latitud"]), floatval($resultado["longitud"])]);
?>