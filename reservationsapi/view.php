<?php
require 'connect.php';

$bookingID = isset($_GET['bookingID']) ? (int) $_GET['bookingID'] : 0;

if ($bookingID <= 0) {
    http_response_code(400); // Bad request
    exit;
}

$sql = "SELECT * FROM reservations WHERE bookingID = {$bookingID} LIMIT 1";

if ($result = mysqli_query($con, $sql)) {
    if (mysqli_num_rows($result) === 1) {
        echo json_encode(mysqli_fetch_assoc($result));
    } else {
        http_response_code(404); // Not found
    }
} else {
    http_response_code(500); // Server error
}
?>
