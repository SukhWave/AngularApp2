<?php
require 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Access form fields normally
    $bookingID = isset($_POST['bookingID']) ? (int)$_POST['bookingID'] : 0;
    $areaName = isset($_POST['areaName']) ? trim($_POST['areaName']) : '';
    $timeSlots = isset($_POST['timeSlots']) ? trim($_POST['timeSlots']) : '';
    $booked = isset($_POST['Booked']) ? (int)$_POST['Booked'] : 0;
    $imageName = isset($_POST['imageName']) ? trim($_POST['imageName']) : '';
    $oldImageName = isset($_POST['oldImageName']) ? trim($_POST['oldImageName']) : '';

    if ($bookingID < 1 || $areaName === '' || $timeSlots === '') {
        http_response_code(400);
        exit;
    }

    // Handle image upload if a new file is provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        $tmpName = $_FILES['image']['tmp_name'];
        $newFileName = basename($_FILES['image']['name']);
        $targetFilePath = $uploadDir . $newFileName;

        if (move_uploaded_file($tmpName, $targetFilePath)) {
            // Optionally delete old image
            if ($oldImageName && file_exists($uploadDir . $oldImageName)) {
                unlink($uploadDir . $oldImageName);
            }
            $imageName = $newFileName;
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to upload image']);
            exit;
        }
    } else {
        // No new image uploaded, keep old image name
        $imageName = $oldImageName;
    }

    // Sanitize inputs for SQL
    $bookingID = mysqli_real_escape_string($con, $bookingID);
    $areaName = mysqli_real_escape_string($con, $areaName);
    $timeSlots = mysqli_real_escape_string($con, $timeSlots);
    $booked = mysqli_real_escape_string($con, $booked);
    $imageName = mysqli_real_escape_string($con, $imageName);

    // Update query including imageName
    $sql = "UPDATE `reservations` SET 
            `areaName`='$areaName',
            `timeSlots`='$timeSlots',
            `Booked`=$booked,
            `imageName`='$imageName'
            WHERE `bookingID` = '$bookingID' LIMIT 1";

    if (mysqli_query($con, $sql)) {
        http_response_code(200);
        echo json_encode(['message' => 'Reservation updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update reservation']);
    }
} else {
    http_response_code(405); // Method not allowed
}
?>
