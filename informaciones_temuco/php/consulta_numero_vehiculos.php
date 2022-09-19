<?php
    include("conec.php");

    $fecha = $_POST["fecha"];
    $calle = $_POST["calle"];
    $datosObtenidos = [];

    $consulta = 'SELECT TRUNCATE((hora/3600000),0) AS hora, 
                 COUNT(DISTINCT vehiculo) AS numero_vehiculos 
                 FROM datos WHERE fecha="'.$fecha.'" AND calle="'.$calle.'" 
                 GROUP BY TRUNCATE((hora/3600000),0);';

    $query    = mysqli_query($conexion, $consulta);
    $contador = 0;
    
    while($datos = mysqli_fetch_assoc($query)){
        $hora                = intval($datos["hora"]);
        $numero_vehiculos    = intval($datos["numero_vehiculos"]);
        
        while($contador<$hora){
            $datosObtenidos[] = 0;
            $contador += 1;
        }

        $datosObtenidos[] = $numero_vehiculos;
        $contador += 1;
    }

    while(count($datosObtenidos)<24){
        $datosObtenidos[] = 0;
    }

    echo json_encode($datosObtenidos);

?>