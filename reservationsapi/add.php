<?php
require 'connect.php';

// Get posted data
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    
    // Decode incoming JSON
    $request = json_decode($postdata);

    // Validate required fields
    if (
        trim($request->data->areaName) === '' ||
        trim($request->data->timeSlots) === ''
    ) {
        return http_response_code(400);
    }

    // Sanitize inputs
    $areaName = mysqli_real_escape_string($con, trim($request->data->areaName));
    $timeSlots = mysqli_real_escape_string($con, trim($request->data->timeSlots));
    $booked = isset($request->data->Booked) ? (int)$request->data->Booked : 0;
    $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));

    $origimg = str_replace('\\', '/', $imageName);
    $newImage = basename($origimg);

    if (empty($newImage)) {
        $newImage = 'placeholder_100.jpg';
    }

    // Insert into database
    $sql = "INSERT INTO `reservations` (`bookingID`, `areaName`, `timeSlots`, `Booked`, `imageName`) 
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
    }
}
?>
