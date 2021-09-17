<?php

$inData = getRequestInfo();
$contactId = $inData["ContactID"];

// Create connection
$conn = new mysqli("localhost","TheBeast","WeLoveCOP4331","smallProject");

// Check connection
if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

// sql to delete a record
$stmt = $conn->prepare("DELETE FROM CONTACTS WHERE ContactID=?;");
$stmt->bind_param("i", $contactId);
$stmt->execute();

$stmt->close();
$conn->close();
returnWithError("");

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
