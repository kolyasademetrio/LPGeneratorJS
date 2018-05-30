<?php

$baseFromJavascript = $_POST['base64'];

$base_to_php = explode(';', $baseFromJavascript);
$file_data = base64_decode($base_to_php[1]);

echo $file_data;

/*
// Get file mime type
$finfo = finfo_open();
$file_mime_type = finfo_buffer($finfo, $file_data, FILEINFO_MIME_TYPE);

// File extension from mime type
if($file_mime_type == 'image/jpeg' || $file_mime_type == 'image/jpg')
    $file_type = 'jpeg';
else if($file_mime_type == 'image/png')
    $file_type = 'png';
else if($file_mime_type == 'image/gif')
    $file_type = 'gif';
else
    $file_type = 'other';

// Validate type of file
if(in_array($file_type, [ 'jpeg', 'png', 'gif' ])) {
    // Set a unique name to the file and save
    $file_name = uniqid() . '.' . $file_type;
    file_put_contents($file_name, $file_data);
}
else {
    echo 'Error : Only JPEG, PNG & GIF allowed';
}