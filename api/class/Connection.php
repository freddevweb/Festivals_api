<?php 
class Connection {

    static $connection = null;

    static function getConnection(){
      
        if( empty( self::$connection ) ){    
            self::$connection = new PDO(
                "mysql:dbname=festival;host=localhost",
                "root",
                ""
            );
        }

        return self::$connection;
    }

    private function __construct(){}

}

//
//->getConnection(); //Tout le temps la meme connexion
// new Connection() -> impossible a faire de l'exterrieur
// Singleton pattern