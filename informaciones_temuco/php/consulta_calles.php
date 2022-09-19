<?php
    include("conec.php");
    $diccionario    = $_POST["diccionario"];

    //Se consulta a la bd por vehiculos que transiten entre el periodo de tiempo y fecha
    //indicados. Lo que hace es un conteo de vehiculos por calle,sin repetir un mismo 
    //vehiculo en el conteo, sin embargo este mismo si puede estar presente
    //en el conteo de otra calle en este periodo de tiempo.

    //Se devuelven calles en forma de arreglo o lista:
    if($diccionario == 0){
        $calleDeseada   = $_POST["calle-deseada"];
        $consulta       = "SELECT DISTINCT calle from datos 
                           WHERE calle LIKE '%$calleDeseada%' ORDER BY calle ASC;";
        $query          = mysqli_query($conexion, $consulta);
        $datosObtenidos = [];

        while($datos = mysqli_fetch_assoc($query)){
            if($datos["calle"] != ""){
                $datosObtenidos[] = $datos["calle"]; 
            }
        }

        echo json_encode($datosObtenidos);
    }

    //Se devuelven calles en forma de objeto con cada calle como atributo
    //igualadas todas a 0:
    if($diccionario == 1){
        $consulta       = "SELECT DISTINCT calle from datos ORDER BY calle ASC;";
        $query          = mysqli_query($conexion, $consulta);
        $datosObtenidos = array();

        while($datos = mysqli_fetch_assoc($query)){
            $datosObtenidos += [$datos["calle"] => 0]; 
        }

        echo json_encode($datosObtenidos);
    }
?>