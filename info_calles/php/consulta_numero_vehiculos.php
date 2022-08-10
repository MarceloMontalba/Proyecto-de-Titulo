<?php
    include("conec.php");

	$histograma  = $_POST["histograma"];
    $yearDeseado = $_POST["year"];
	$datosObtenidos = [];
   
	//Si histograma es igual a uno PHP devolvera un array con los vehiculos 
	//que estuvieron en la ciudad mes a mes.
	if($histograma == 1){
		$select = mysqli_query($conexion, "SELECT DISTINCT id, SUBSTRING(fecha, -5, 2) as mes FROM datos WHERE fecha LIKE '"
				  .$yearDeseado."%' ORDER BY fecha" );
		
		while($datos = mysqli_fetch_assoc($select)){
			$datosObtenidos[] = [$datos["id"], $datos["mes"]];
		}
	}

	//Si histograma es igual a 2 PHP devuelve el numero de vehiculos en 
	//temuco en un mes concreto del año que se ha consultado previamente
	if($histograma == 2){
		$mesDeseado  = $_POST["mes"];
		$mesDeseado  = $mesDeseado < 10 ? "0".$mesDeseado : $mesDeseado;

		$select = mysqli_query($conexion, "SELECT DISTINCT id, fecha FROM datos WHERE fecha LIKE '"
				  .$yearDeseado."-".$mesDeseado."%' ORDER BY fecha");

		while($datos = mysqli_fetch_assoc($select)){
			$datosObtenidos[] = [$datos["id"], $datos["fecha"]];
		}
	}

	echo json_encode($datosObtenidos);

?>