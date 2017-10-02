<?php 
//BddManager va contenir les instances de nos repository
class BddManager {

    private $noteRepository;
    private $connection;

    function __construct(){
        $this->connection = Connection::getConnection();
        $this->festivalRepository = new FestivalRepository( $this->connection );
        $this->musiqueRepository = new MusiqueRepository( $this->connection );
        $this->userRepository = new UserRepository( $this->connection );
    }

    function getFestivalRepository(){
        return $this->festivalRepository;
    }
    function getMusiqueRepository(){
        return $this->musiqueRepository;
    }
    function getUserRepository(){
        return $this->userRepository;
    }

}