<?php 

    include_once('./vendor/autoload.php');
    include_once('./prosedural.php');

    //cors 
    header('Content-type: application/json');
    header('Access-Control-Allow-Origin: http://localhost:8080');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type, client-token');

    $headers = apache_request_headers();
    
    if (isset($headers['client-token'])) {
      $header_client_token = $headers['client-token'];
    } else {
      json([
        'success' => false,
        'message' => 'cant retrieve token'
      ]);
    }

    use Kreait\Firebase\Factory;
    use Kreait\Firebase\ServiceAccount;
    
    $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/google-service-account.json');
    $apiKey = 'AIzaSyBiOfoPL7j_7Wi6e2QdrdJNahjEkzHNLII';
    
    $firebase = (new Factory)
        ->withServiceAccountAndApiKey($serviceAccount, $apiKey)
        ->create();

    $auth = $firebase->getAuth();
  
    try {
      $idToken = $auth->verifyIdToken($header_client_token);
      $uid = $idToken->getClaim('sub');  
    } catch (\Exception $e) {
      json([
        'success' => false,
        'message' => $e->getMessage()
      ]);
    }

    $database = $firebase->getDatabase();
    $reference = $database->getReference('users/' . $uid);
    $snapshot = $reference->getSnapshot();
    // return array
    // ex [role => 1]
    $value = $snapshot->getValue();
    if ($value['role'] != 1) {
        json([
          'success' => false,
          'message' => 'not allowed'
        ]);
    }

    $type = parsed('type');
    if ($type == 'delete') {
        $targetUid = parsed('target-uid');
        try {
          $targetUser = $auth->getUser($targetUid);
          $auth->deleteUser($targetUser);
          json([
            'success' => true,
            'message' => 'success'
          ]);
        } catch (\Exception $e) {
          json([
            'success' => false,
            'message' => 'failed'
          ]);
        }
    }
    