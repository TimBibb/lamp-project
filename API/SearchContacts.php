<?php
    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;
    
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallProject");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("SELECT FirstName,LastName,Phone,Email,ContactID FROM CONTACTS WHERE FirstName LIKE ? AND LastName LIKE ? AND UserID=?");
        $firstName = "%" . $inData["FirstName"] . "%";
        $lastName = "%" . $inData["LastName"] . "%";
        $stmt->bind_param("ssi", $firstName, $lastName, $inData["UserID"]);
        $stmt->execute();

        $result = $stmt->get_result();

         while($row = $result->fetch_assoc()) 
         {
            if( $searchCount > 0 ) 
            { 
                $searchResults .= ","; 
            }

            $searchResults .= '{"FirstName":"' . $row["FirstName"];
            $searchResults .= '","LastName":"' . $row["LastName"];
            $searchResults .= '","Phone":"' . $row["Phone"];
            $searchResults .= '","Email":"' . $row["Email"];
            $searchResults .= '","ContactID":"' . $row["ContactID"] . '"}';
            $searchCount++;
        } 

        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
        }

            $stmt->close();
            $conn->close();
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
        $retValue = '{"id":0,"FirstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>
