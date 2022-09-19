<?php
    include("conec.php");

    $fecha = $_POST["fecha"];
    $calle = $_POST["calle"];
    $datosObtenidos = [];

    $consulta = 'SELECT TRUNCATE((hora/3600000),0) AS hora, AVG(velocidad) as velocidad_promedio 
                 FROM datos WHERE fecha="'.$fecha.'" AND calle="'.$calle.'"
                 GROUP BY TRUNCATE((hora/3600000),0);';

    $query    = mysqli_query($conexion, $consulta);
    $contador = 0;
    
    while($datos = mysqli_fetch_assoc($query)){
        $hora                = intval($datos["hora"]);
        $velocidad_promedio  = floatval($datos["velocidad_promedio"]);

        while($contador<$hora){
            $datosObtenidos[] = 0;
            $contador += 1;
        }

        $datosObtenidos[] = $velocidad_promedio;
        $contador += 1;
    }

    while(count($datosObtenidos)<24){
        $datosObtenidos[] = 0;
    }

    echo json_encode($datosObtenidos);

?>