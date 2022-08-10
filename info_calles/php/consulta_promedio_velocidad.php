<?php
	include("conec.php");

	$histograma = $_POST['histograma'];
	$yearDeseado = $_POST['year'];
	$datosObtenidos = [];

	//Se obtiene el promedio de velocidad de cada mes de un año concreto
	if($histograma == "1"){
		$select = mysqli_query($conexion, "SELECT fecha, velo as velocidad FROM datos WHERE fecha LIKE '"
										  .$yearDeseado."%' AND velo > 0 ORDER BY fecha");

		while($datos = mysqli_fetch_assoc($select)){
			$datosObtenidos[] = [$datos["fecha"], $datos["velocidad"]];
		}
	}

	//Se obtiene el promedio de velocidad de un mes especifico
	if($histograma == "2"){
		$mesDeseado  = $_POST['mes'];
		$mesDeseado  = $mesDeseado < 10 ? "0".$mesDeseado : $mesDeseado;
	
		$select = mysqli_query($conexion, "SELECT velo as velocidad, fecha FROM datos WHERE fecha LIKE '"
											.$yearDeseado."-".$mesDeseado."%' AND velo > 0 ORDER BY fecha" );
		
		while($datos = mysqli_fetch_assoc($select)){
			$datosObtenidos[] = [$datos["velocidad"], $datos["fecha"]];
		}
	}


	echo json_encode($datosObtenidos);
?>