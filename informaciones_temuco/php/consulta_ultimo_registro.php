<?php
    include("conec.php");

    #Se consulta por el ultimo dato registrado
    $consulta = 'SELECT MAX(fecha) as fecha from datos';
    $query = mysqli_query($conexion, $consulta);
    $fecha = "";

    while($datos = mysqli_fetch_assoc($query)){
        $fecha = $datos["fecha"];
    }

    echo $fecha
?>