<?php

$cnt = $argv[1];

$limits = file_get_contents('limits.json');
$limits = json_decode($limits);

$names = array();
foreach ($limits as $name => $value) {
	$names[] = $name;
}
echo 'severity, over';
echo "\n";

$names_cnt = count($names);

for ($i = 0; $i < $cnt; $i++) {

	$over = array();

	$severity = rand(0, 3);
	echo $severity.',';

	if ($severity > 1) {
		$over_keys = array_rand($names, rand(1,3));
		if (!is_array($over_keys)) {
			$over_keys = array($over_keys);
		}

		foreach ($over_keys as $key) {
			$over[$key] = $names[$key];
		}

		echo '"'.join(', ', $over).'"';
	}


	echo "\n";
}
