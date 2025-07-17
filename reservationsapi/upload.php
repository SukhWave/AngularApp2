<?php
session_start();

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connect.php';

// Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    $originalFileName = basename($_FILES['image']['name']);

    $newFileName = $originalFileName;
    $targetFilePath = $uploadDir . $newFileName;

    // Move uploaded file to uploads/ directory
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        echo json_encode(['message' => 'Image uploaded successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to upload image']);
    }

    exit; // Finish execution after handling upload
}
?>
