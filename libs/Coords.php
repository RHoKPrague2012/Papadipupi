<?php

namespace Libs;

class Coords {
	const PI = 3.14159;

	private function Helmert_transformation($xs, $ys, $zs, $dx, $dy, $dz, $wx, $wy, $wz, $m) {

		$xn = $dx + (1+$m)*($xs + $wz*$ys - $wy*$zs);
		$yn = $dy + (1+$m)*(-$wz*$xs + $ys + $wx*$zs);
		$zn = $dz + (1+$m)*($wy*$xs - $wx*$ys + $zs);

		return array($xn, $yn, $zn);
	}


	function SJTSKtoWGS($xs, $ys, $zs = 0) {
		# coefficients of the transformation WGS-84 -> S-JTSK
		$dx = +570.69; 
		$dy = +85.69; 
		$dz = +462.84;   # translation

		$arcsec = 1./3600.*self::PI/180.;
		
		$wz = -5.2611*$arcsec; 
		$wy = -1.58676*$arcsec; 
		$wx = -4.99821*$arcsec;        # rotation

		$m = +3.543e-6;

		list($xn, $yn, $zn) = Helmert_transformation($xs, $ys, $zs, $dx, $dy, $dz, $wx, $wy, $wz, $m);

		return array($xn, $yn, $zn);
	}

}
