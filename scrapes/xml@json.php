<?php

$data = array();

$xml = simplexml_load_file('reky.xml');

//var_dump($xml);

foreach ($xml->geometry as $geometry) {
	$xmlat = $geometry->attributes();
	$name = (string)$xmlat['name'];
	$river = array(
		$name => array(
			'coords' => array()
		)
	);
	foreach ($geometry->linestring->point as $point) {
		$attrs = $point->attributes();
		$coords[] = array(
			'lat' => (string)$attrs['x'],
			'lng' => (string)$attrs['y']
		);
		$river[$name]['coords'] = $coords;
	}
	$data[] = $river;
}

$fd = fopen('rivers.json','w');
fputs($fd,json_encode($data));
fclose($fd);

?>