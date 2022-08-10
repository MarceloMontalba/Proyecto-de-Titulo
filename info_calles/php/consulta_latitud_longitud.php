<?php  
    include("conec.php");

    $fecha_inicio = $_POST["fecha_inicio"];
    $fecha_fin    = $_POST["fecha_fin"];

    //Se consulta entre un rango de fechas
    $select = 'SELECT * FROM datos WHERE fecha BETWEEN "'.$fecha_inicio.
               '" AND "'.$fecha_fin.'" ORDER BY id ASC, fecha ASC, hora ASC';
    $query   = mysqli_query($conexion, $select);
    
    while($datos = mysqli_fetch_assoc($query)){
        $datosObtenidos[] = [$datos["id"], $datos["lat"], $datos["lon"], 
                             $datos["velo"], $datos["fecha"], $datos["hora"]];
    }

    echo json_encode($datosObtenidos);
?>