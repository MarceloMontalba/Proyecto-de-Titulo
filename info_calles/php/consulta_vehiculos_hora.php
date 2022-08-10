<?php
    include("conec.php");

    $yearDeseado = $_POST["year"];
    $datosObtenidos = [];


    /*El php devolvera cada uno de los vehiculos circundantes por dia.
    Cabe destacar que no habran autos repetidos en una misma hora, pero 
    si puede salir el mismo vehiculo en otra hora o a la misma hora,
    pero de otro dia.*/
    $mesDeseado = $_POST["mes"];
    $mesDeseado = $mesDeseado <10 ? "0".$mesDeseado : $mesDeseado;

    $sentencia = "SELECT DISTINCT id, fecha, SUBSTRING(hora, 1, 2) as hora FROM datos WHERE fecha LIKE '"
                .$yearDeseado."-".$mesDeseado."%' AND velo>0 GROUP BY hora";

    $select = mysqli_query($conexion, $sentencia);
            
    while($datos = mysqli_fetch_assoc($select)){
        $datosObtenidos[] = [$datos["id"], $datos["fecha"], $datos["hora"]];
    }
	echo json_encode($datosObtenidos);
?>