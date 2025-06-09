<?php
header('Content-Type: application/json');

// 1. Recoge el token
if (!isset($_GET['token'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Token requerido']);
    exit;
}
$token = $_GET['token'];

// 2. Llamada a OAuth2 Userinfo para nombre y apellido
$chProfile = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
curl_setopt_array($chProfile, [
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $token"],
    CURLOPT_RETURNTRANSFER => true,
]);
$profileResp = curl_exec($chProfile);
if (curl_errno($chProfile)) {
    http_response_code(502);
    echo json_encode(['error' => 'Error al obtener perfil: ' . curl_error($chProfile)]);
    exit;
}
curl_close($chProfile);

$profileData = json_decode($profileResp, true);
if (isset($profileData['error'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Perfil API error', 'details' => $profileData['error']]);
    exit;
}

// Extrae nombres
$firstName = $profileData['given_name']  ?? ($profileData['name'] ?? '');
$lastName  = $profileData['family_name'] ?? '';

// 3. Llamada a Google Fit para pasos
$startTimeMillis = strtotime('today') * 1000;
$endTimeMillis   = (int) round(microtime(true) * 1000);

$fitBody = json_encode([
    'aggregateBy'     => [[ 'dataTypeName' => 'com.google.step_count.delta' ]],
    'bucketByTime'    => [ 'durationMillis' => 86_400_000 ],
    'startTimeMillis' => $startTimeMillis,
    'endTimeMillis'   => $endTimeMillis,
]);

$chFit = curl_init('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate');
curl_setopt_array($chFit, [
    CURLOPT_HTTPHEADER     => [
        "Authorization: Bearer $token",
        "Content-Type: application/json",
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $fitBody,
]);

$fitResp = curl_exec($chFit);
if (curl_errno($chFit)) {
    http_response_code(502);
    echo json_encode(['error' => 'Error al obtener pasos: ' . curl_error($chFit)]);
    exit;
}
curl_close($chFit);

$fitData = json_decode($fitResp, true);
if (isset($fitData['error'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Fit API error', 'details' => $fitData['error']]);
    exit;
}

// 4. Suma de pasos
$steps = 0;
if (!empty($fitData['bucket'])) {
    foreach ($fitData['bucket'] as $bucket) {
        foreach ($bucket['dataset'] as $dataset) {
            foreach ($dataset['point'] as $point) {
                foreach ($point['value'] as $value) {
                    $steps += $value['intVal'] ?? 0;
                }
            }
        }
    }
}

// 5. Resultado combinado
echo json_encode([
    'firstName' => $firstName,
    'lastName'  => $lastName,
    'steps'     => $steps,
]);
