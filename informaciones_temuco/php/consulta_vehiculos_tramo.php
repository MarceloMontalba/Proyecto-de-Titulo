<?php
    include("conec.php");

    $fecha       = $_POST["fecha"];
    $horaInicial = $_POST["horaInicial"];
    $horaFinal   = $_POST["horaFinal"];
    $datosObtenidos = [];

    //Se consulta a la bd por vehiculos que transiten entre el periodo de tiempo y fecha
    //indicados. Lo que hace es un conteo de vehiculos por calle,sin repetir un mismo 
    //vehiculo en el conteo, sin embargo este mismo si puede estar presente
    //en el conteo de otra calle en este periodo de tiempo.

    $consulta = "SELECT calle, COUNT(DISTINCT vehiculo) as flujo FROM datos 
    WHERE fecha='$fecha' AND hora BETWEEN $horaInicial AND $horaFinal GROUP BY calle;";

    $query = mysqli_query($conexion, $consulta);

    while($datos = mysqli_fetch_assoc($query)){
        $datosObtenidos[] = [$datos["calle"], $datos["flujo"]]; 
    }

    echo json_encode($datosObtenidos);

?>