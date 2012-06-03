<?php


function get_modifier($value) {
	$i = 1;
	while ($value < 100) {
		$i *= 10;
		$value *= 10;
	}

	return $i;
}

$cnt = $argv[1];

$limits = file_get_contents('limits.json');
$limits = json_decode($limits);

$names = array();
foreach ($limits as $name => $value) {
	$names[] = $name;
}
echo join(',', $names);
echo "\n";

for ($i = 0; $i < $cnt; $i++) {

	$over = array();
	foreach ($limits as $name => $value) {

		if (!empty($value)) {
			$modifier = get_modifier($value);
			$rnd = rand(0, 2 * $modifier * $value);

			$val = $rnd/$modifier;
			if ($val >= $value) {
				$over[] = $name;
			}

			echo $val;
		}

		echo ',';
	}

	echo '"'.join(',', $over).'"';

	echo "\n";
}
