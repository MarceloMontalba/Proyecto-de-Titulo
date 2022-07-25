<?php
	include("conec.php");
	$idAuto = $_POST['idAuto'];
	$select = mysqli_query($conexion, "SELECT lat, lon, fecha, hora from datos WHERE id=".$idAuto);

	while($datos = mysqli_fetch_assoc($select)){
		$datosObtenidos [] = $datos;
	}

	echo json_encode($datosObtenidos);
?>