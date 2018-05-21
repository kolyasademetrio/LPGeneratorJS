<?php

file_put_contents('index.html', urldecode($_POST['dom']));

echo $_POST;