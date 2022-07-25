<?php
	include("conec.php");

	$select = mysqli_query($conexion, "SELECT * FROM datos");

	while($datos = mysqli_fetch_assoc($select)){
		$datosObtenidos[] = $datos;
	}

	echo json_encode($datosObtenidos);
?>