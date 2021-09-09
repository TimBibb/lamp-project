<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $phone = $inData["Phone"];
    $email = $inData["Email"];
    $contactId = $inData["ContactID"];
    
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallProject");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("DELETE FROM CONTACTS WHERE ContactID=?;");
        $stmt->bind_param("i", $contactID);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>
