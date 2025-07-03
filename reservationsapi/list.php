<?php
    require 'connect.php';

    $reservations = [];
    $sql = "SELECT bookingID, areaName, timeSlots, Booked, imageName FROM reservations";

    if ($result = mysqli_query($con, $sql))
    {
        $count = 0;
        while ($row = mysqli_fetch_assoc($result))
        {
            $reservations[$count]['bookingID'] = $row['bookingID'];
            $reservations[$count]['areaName'] = $row['areaName'];
            $reservations[$count]['timeSlots'] = $row['timeSlots'];
            $reservations[$count]['Booked'] = $row['Booked'];
            $reservations[$count]['imageName'] = $row['imageName'];
            
            $count++;
        }

        echo json_encode(['data' => $reservations]);
    }
    else
    {
        http_response_code(404);
    }
?>
