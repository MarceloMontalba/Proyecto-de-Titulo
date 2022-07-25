<?php
	include("conec.php");

	$calleDeseada = $_POST['calle'];

	if($calleDeseada==""){
		$select = mysqli_query($conexion, "SELECT * FROM calles ORDER BY nombre ASC");
	}
	else{
		$select = mysqli_query($conexion, "SELECT * FROM calles WHERE nombre LIKE '%".$calleDeseada."%' ORDER BY nombre ASC ");
	}

	while($datos = mysqli_fetch_assoc($select)){
		$datosObtenidos[] = $datos;
	}

	echo json_encode($datosObtenidos);
?>