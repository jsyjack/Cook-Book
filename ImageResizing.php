<?php
class Img {
	public $name, $oName, $type, $tmpName, $path, $error, $size, $width, $height, $ratio;

	public function init($path, $file = null) {

		if(!$file) {

			$this->path = $path;

		} else {

			$this->name = time().$file['name'];
			$this->type = $file['type'];
			$this->tmpName = $file['tmp_name'];
			$this->error = $file['error'];
			$this->size = $file['size'];
			$imagesize = getimagesize($this->tmpName);

			$this->path = $path;

			$this->width = $imagesize[0];
			$this->height = $imagesize[1];
			$this->ratio = $this->width / $this->height;

			move_uploaded_file($this->tmpName, $this->path.$this->name);
			$this->oName = $this->name;

		}
	}

	public function makeImage() {

		$type = explode('/', $this->type);

		switch($type[1]) {
			case 'jpg':
				$image = imagecreatefromjpeg($this->path.$this->name);
			break;
			case 'jpeg':
				$image = imagecreatefromjpeg($this->path.$this->name);
			break;
			case 'png':
				$image = imagecreatefrompng($this->path.$this->name);
			break;
			default:
				die('could not make image');
			break;
		}

		return $image;
	}

	public function resize($width, $height, $image) {

		$targetRatio = $width / $height;

		if($this->ratio < $targetRatio) {
	  		$newWidth = $width;
	  		$newHeight = $newWidth / $this->ratio;
	  	} else {
	  		$newHeight = $height;
	  		$newWidth = $this->ratio * $newHeight;
	  	}

	  	$newTarget = imagecreatetruecolor($newWidth, $newHeight);

		if($this->type == 'image/png') {
			$color = imagecolorallocatealpha($newTarget, 0, 0, 0, 127);
			imagefill($newTarget, 0, 0, $color);
			imagesavealpha($newTarget, TRUE);
		}

	  	imagecopyresampled($newTarget, $image, 0, 0, 0, 0, $newWidth, $newHeight, $this->width, $this->height);
	  	$image = $newTarget;

	  	$this->width = imagesx($image);
	  	$this->height = imagesy($image);
		$this->ratio = $this->width / $this->height;

	  	return $image;
	}

	public function crop($width, $height, $image) {

		$targetHeight = min($height, $this->height);
		$targetWidth = min($width, $this->width);
		$targetRatio = $width / $height;

		if ($this->ratio >= $targetRatio) {
		    $targetWidth = $targetRatio * $targetHeight;
		} else {
		    $targetHeight = $targetWidth / $targetRatio;
		}

		$srcWidth = $this->width;
		$srcHeight = $this->height;
		
		$srcX = ($this->width - $targetWidth) / 2;
		$srcY = ($this->height - $targetHeight) / 2;

		$targetImage = imagecreatetruecolor($targetWidth, $targetHeight);

		if($this->type == 'image/png') {
			$color = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
			imagefill($targetImage, 0, 0, $color);
			imagesavealpha($targetImage, TRUE);
		}

		imagecopy($targetImage, $image, 0, 0, $srcX, $srcY, $this->width, $this->height);

		$image = $targetImage;

		$this->width = imagesx($image);
	  	$this->height = imagesy($image);
		$this->ratio = $this->width / $this->height;

	  	return $image;
	}

	public function save($image) {

		$path = $this->name;

		$pos = strrpos($path, '.');

		$length = strlen($path) - $pos;

		$ext = substr($path, $pos);

		$newPath = substr($path, 0, -$length);
		$path = $newPath.time().$ext;

		$this->name = $path;

		$this->init($this->path);

		$type = explode('/', $this->type);
		
		switch($type[1]) {
			case 'jpg':
				$error = (imagejpeg($image, $this->path.$this->name, 100)) ? true : false;
			break;
			case 'jpeg':
				$error = (imagejpeg($image, $this->path.$this->name, 100)) ? true : false;
			break;
			case 'png':
				$error = (imagepng($image, $this->path.$this->name, 9)) ? true : false;
			break;
			default:
				return false;
			break;
		}

		if($error) {
			return $image;
		} else {
			return false;
		}
	}

}
