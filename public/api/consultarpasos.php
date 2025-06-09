<?php
header('Content-Type: application/json');

// Validación básica
if (!isset($_GET['token'])) {
    echo json_encode(['error' => 'Token requerido']);
    exit;
}

$token = $_GET['token'];

// Timestamps para hoy (en nanosegundos)
$startTime = strtotime("today midnight") * 1000000000;
$endTime = time() * 1000000000;

$url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";

$body = json_encode([
    "aggregateBy" => [[
        "dataTypeName" => "com.google.step_count.delta"
    ]],
    "bucketByTime" => ["durationMillis" => 86400000],
    "startTimeMillis" => intval($startTime / 1000000),
    "endTimeMillis" => intval($endTime / 1000000)
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$steps = 0;

if (!empty($data['bucket'])) {
    foreach ($data['bucket'] as $bucket) {
        foreach ($bucket['dataset'] as $dataset) {
            foreach ($dataset['point'] as $point) {
                foreach ($point['value'] as $value) {
                    $steps += $value['intVal'];
                }
            }
        }
    }
}

echo json_encode(['steps' => $steps]);
