<?php
	include("conec.php");

	$yearDeseado = $_POST['year'];

	for($i=1; $i<13; $i++){
		if($i<10){
			$select = mysqli_query($conexion, "SELECT AVG(velo) FROM datos WHERE fecha LIKE '".$yearDeseado."-0".$i."%'" );
		}
		else{
			$select = mysqli_query($conexion, "SELECT AVG(velo) FROM datos WHERE fecha LIKE '".$yearDeseado."-".$i."%'" );
		}
		
		while($datos = mysqli_fetch_assoc($select)){
			$datosObtenidos[] = $datos;
		}
	}

	echo json_encode($datosObtenidos);
?>