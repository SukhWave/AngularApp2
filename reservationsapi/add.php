<?php
require 'connect.php';

// Get the posted data
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    // Decode incoming JSON
    $request = json_decode($postdata);

    // ✅ Validate required fields
    if (
        trim($request->data->areaName) === '' ||
        trim($request->data->timeSlots) === ''
    ) {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Missing required fields.']);
        exit;
    }

    // 🧼 Sanitize inputs
    $areaName = mysqli_real_escape_string($con, trim($request->data->areaName));
    $timeSlots = mysqli_real_escape_string($con, trim($request->data->timeSlots));
    $booked = isset($request->data->Booked) ? (int)$request->data->Booked : 0;
    $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));

    $origimg = str_replace('\\', '/', $imageName);
    $newImage = basename($origimg);

    if (empty($newImage)) {
        $newImage = 'placeholder_100.jpg';
    }

    // ❌ Prevent double booking for the same area and time
    $checkQuery = "SELECT 1 FROM reservations WHERE areaName = '{$areaName}' AND timeSlots = '{$timeSlots}' AND Booked = 1 LIMIT 1";
    $result = mysqli_query($con, $checkQuery);

    if (mysqli_num_rows($result) > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'This time slot is already booked for this area.']);
        exit;
    }

    // ✅ Insert reservation
    $sql = "INSERT INTO reservations (bookingID, areaName, timeSlots, Booked, imageName)
            VALUES (NULL, '{$areaName}', '{$timeSlots}', {$booked}, '{$newImage}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);

        $reservation = [
            'bookingID' => mysqli_insert_id($con),
            'areaName' => $areaName,
            'timeSlots' => $timeSlots,
            'Booked' => $booked,
            'imageName' => $newImage
        ];

        echo json_encode(['data' => $reservation]);
    } else {
        http_response_code(422);
        echo json_encode(['message' => 'Failed to add reservation.']);
    }
}
?>
