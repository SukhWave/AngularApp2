<?php
require 'connect.php';

// Get the posted data
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    
    // Extract the data
    $request = json_decode($postdata);

    // Validate
    if (
        (int)$request->data->bookingID < 1 ||
        trim($request->data->areaName) === '' ||
        trim($request->data->timeSlots) === ''
    ) {
        return http_response_code(400);
    }

    // Sanitize
    $bookingID = mysqli_real_escape_string($con, (int)$request->data->bookingID);
    $areaName = mysqli_real_escape_string($con, $request->data->areaName);
    $timeSlots = mysqli_real_escape_string($con, $request->data->timeSlots);
    $booked = isset($request->data->Booked) ? (int)$request->data->Booked : 0;

    // Prepare and execute update query
    $sql = "UPDATE `reservations` 
            SET `areaName`='$areaName', 
                `timeSlots`='$timeSlots', 
                `Booked`=$booked 
            WHERE `bookingID` = '{$bookingID}' 
            LIMIT 1";

    if (mysqli_query($con, $sql)) {
        http_response_code(204); // Success, no content
    } else {
        http_response_code(422); // Unprocessable Entity
    }
}
?>
