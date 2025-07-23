<?php
require '../connect.php'; // Adjust path if needed

session_start();
header('Content-Type: application/json');

// Get JSON POST data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (!isset($data->userName, $data->password)) {
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

$username = trim($data->userName);
$password = trim($data->password);

// Prepare and execute query
$query = $con->prepare("SELECT * FROM registrations WHERE userName = ?");
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Use password hashing best practice
    if (password_verify($password, $user['password'])) {
        // Start session or return token (for SPA, session works in development)
        $_SESSION['loggedIn'] = true;
        $_SESSION['username'] = $username;

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'userName' => $username
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
?>
