<?php 

function parsed($name)
{
  if (isset($_GET[$name])) {
    return $_GET[$name];
  } else if (isset($_POST[$name])) {
    return $_POST[$name];
  } else {
    json([
      'success' => false,
      'message' => 'cant get verb request'
    ]);
  }
}

function json($data)
{
  echo json_encode($data);
  exit;
}
