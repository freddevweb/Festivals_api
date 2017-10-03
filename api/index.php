<?php

// header("Access-Control-Allow-Origin:http://" + "ip ou * = all " );
require 'flight/Flight.php';
require 'autoloader.php';

// Enregistrer en global dans Flight le BddManager
Flight::set( "BddManager", new BddManager() );

// ###################################################################
// ####################################################### FESTIVAL
// recupérer tous les festivals
Flight::route('GET /festivals', function(){

    $bddManager = Flight::get( "BddManager" );
    $repo = $bddManager->getFestivalRepository();
    $festivals = $repo->getAll();
    
    echo json_encode( $festivals );
});

// recupérer un festival
Flight::route('GET /festival/@id', function( $id ){
    
    $status = [
        "success" => false,
        "festival"=>false
    ];

    $id = htmlspecialchars( $id );

    $bddManager = Flight::get( "BddManager" );
    $newFestival = new Festival();
    $newFestival->setId( $id );
    $repo = $bddManager->getFestivalRepository();
    $festival = $repo->getById( $newFestival );
    
    if( $festival != false ){
        $status["success"] = true;
        $status["festival"] = $festival;
    }

    echo json_encode( $status ) ;
});


// enregistrer un festival
Flight::route('POST /festival', function(){
    
    
    $title = htmlspecialchars( FLIGHT::request()->data["title"] );
    $dateDebut = htmlspecialchars( FLIGHT::request()->data["dateDebut"] );
    $dateFin = htmlspecialchars( FLIGHT::request()->data["dateFin"] );
    $urlLogo = htmlspecialchars( FLIGHT::request()->data["urlLogo"] );
    $lat = htmlspecialchars( FLIGHT::request()->data["lat"] );
    $lng = htmlspecialchars( FLIGHT::request()->data["lng"] );
    $musiqueType = htmlspecialchars( FLIGHT::request()->data["musiqueType"] );
    
    $status = [
        "success" =>false,
        "id" => 0
    ];
    
    if( !empty( $title ) && !empty( $dateDebut ) && !empty( $dateFin ) && !empty( $urlLogo ) && !empty( $lat ) && !empty( $lng ) && !empty( $musiqueType ) ){

        $newFestiv = new Festival();
        $newFestiv->setTitle( $title );
        $newFestiv->setDateDebut( $dateDebut );
        $newFestiv->setDateFin( $dateFin );
        $newFestiv->setUrlLogo( $urlLogo );
        $newFestiv->setLat( $lat );
        $newFestiv->setLng( $lng );
        $newFestiv->setMusiqueType( $musiqueType );

        $bddManager = Flight::get( "BddManager" );
        $repo = $bddManager->getFestivalRepository();
        $id = $repo->save( $newFestiv );

        if( $id != 0 ){
            $status["success"] = true;
            $status["id"] = $id;
        }
    }

    echo json_encode( $status );

});

// modifier un festival
Flight::route('PUT /festival/@id', function( $id ){
    
    // pour récupérer les connées PUT -> les connées sont encodées en json string avec ajax, puis décodé ici en php
    $json = Flight::request()->getBody();
    $_PUT = json_decode( $json , true ); // true pour un tableau associatif

    $status = [
        "success" => false
    ];

    if( isset( $_PUT["id"] ) && isset( $_PUT["title"] ) && isset( $_PUT["dateDebut"] ) && isset( $_PUT["dateFin"] ) && isset( $_PUT["urlLogo"] ) && isset( $_PUT["lat"] ) && isset( $_PUT["lng"] ) && isset( $_PUT["musiqueType"] ) ){

        $id = htmlspecialchars( $_PUT["id"] );
        $title = htmlspecialchars( $_PUT["title"] );
        $dateDebut = htmlspecialchars( $_PUT["dateDebut"] );
        $dateFin = htmlspecialchars( $_PUT["dateFin"] );
        $urlLogo = htmlspecialchars( $_PUT["urlLogo"] );
        $lat = htmlspecialchars( $_PUT["lat"] );
        $lng = htmlspecialchars( $_PUT["lng"] );
        $musiqueType = htmlspecialchars( $_PUT["musiqueType"] );

        $newFestiv = new Festival();
        $newFestiv->setId( $id );
        $newFestiv->setTitle( $title );
        $newFestiv->setDateDebut( $dateDebut );
        $newFestiv->setDateFin( $dateFin );
        $newFestiv->setUrlLogo( $urlLogo );
        $newFestiv->setLat( $lat );
        $newFestiv->setLng( $lng );
        $newFestiv->setMusiqueType( $musiqueType );

        $bddManager = Flight::get("BddManager");
        $repo = $bddManager->getFestivalRepository();
        $rowCount = $repo->save( $newFestiv );

        if( $rowCount == 1 ){
            $status["success"] = true;
        }
    }

    echo $rowCount;
    

});


Flight::route('DELETE /festival/@id', function( $id ){

    $status = [
        "success" =>false
    ];

    $newFestival = new Festival();
    $newFestival->setId( $id );

    $bddManager = Flight::get( "BddManager" );
    $repo = $bddManager->getFestivalRepository();
    $count = $repo->deleteFestival( $newFestival );

    if( $count != 0 ){
        $status["success"] = true;
    }

    echo json_encode( $status );

});

// ###################################################################
// ####################################################### MUSIQUES
// recupérer tous les style de musiques
Flight::route('GET /musiques', function(){
    
    $bddManager = Flight::get( "BddManager" );
    $repo = $bddManager->getmusiqueRepository();
    $musiques = $repo->getAll();
    
    echo json_encode( $musiques );
});

// enregistrer un style de musique
Flight::route('POST /musique', function(){
    
    $nom = FLIGHT::request()->data["name"];
    
    $status = [
        "success" =>false,
        "id" => 0
    ];

    $name = htmlspecialchars( $nom );
    
    if( !empty( $name ) ){

        $newMusic = new Musique();
        $newMusic->setName( $name );

        $bddManager = Flight::get( "BddManager" );
        $repo = $bddManager->getMusiqueRepository();
        $id = $repo->insertMusic( $newMusic );

        if( $id != 0 ){
            $status["success"] = true;
            $status["id"] = $id;
        }
    }

    echo json_encode( $status );
});

// supprimer un style de musique 
Flight::route('DELETE /musique/@id', function( $id ){

    $status = [
        "success" =>false,
        "presence" => 0
    ];

    $newMusic = new Musique();
    $newMusic->setId( $id );

    $bddManager = Flight::get( "BddManager" );
    $repo = $bddManager->getmusiqueRepository();

    $countPresence = $repo->checkfestivalMusique( $newMusic );

    $status["presence"] = intval( $countPresence["count( musiqueId )"] );

    if( $countPresence["count( musiqueId )"] == 0 ){

        $count = $repo->deleteMusic( $newMusic );
        

        if( $count != 0 ){

            $status["success"] = true;
        }
    }

    echo json_encode( $status );
});


// ###################################################################
// ####################################################### USER
// recupérer user pour login
Flight::route('GET /user/@pass/@use', function( $pass, $use ){
    

    $status = [
        "success" => false,
        "user"=> false,
        "errors" => []
    ];
    if( isset( $pass ) && isset( $use) ){

        $pass = htmlspecialchars( $pass );
        $use = htmlspecialchars( $use );
        
        $bddManager = Flight::get( "BddManager" );
    
        $newUser = new User();
        $newUser->setPass( $pass );

        $v = "/[a-zA-Z0-9_\-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/";

        if( (bool)preg_match( $v , $use ) == true ){

            $newUser->setEmail( $use );
        }
        else {
            $newUser->setName( $use );
        }

        $repo = $bddManager->getUserRepository();
        $user = new User( $repo->getUser( $newUser ) );

        if( $user->getId() != null ){

            if( $user->getPass() === $newUser->getPass() ){
                

                $status["success"] = true;
                $status["user"] = $user;

                $user->setRole( $repo->getRole( $user ) );

                $participation = $repo->getUsersParticipation( $user );

                if( !empty( $participation ) ){

                    $user->setParticipate($participation);
                }
            }
            else {
                $status["error"] = "Mot de passe non valide";
            }
        }
        else {
            $status["error"] = "Utilisateur inconnu";
        }
    }

    echo json_encode( $status );
});


// enregistrer un user
Flight::route('POST /user', function(){
    
    
    $name = FLIGHT::request()->data["name"];
    $email = FLIGHT::request()->data["email"];
    $pass = FLIGHT::request()->data["pass"];
    
    $status = [
        "success" =>false,
        "id" => 0,
        "errors" => []
    ];

    $v = "/[a-zA-Z0-9_\-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/";
    
    if( isset( $name ) && isset( $email ) && isset( $pass ) && preg_match( $v, $email ) ){
        
        $bddManager = Flight::get( "BddManager" );
        $repo = $bddManager->getUserRepository();

        $newUser = new User();
        $newUser->setName( htmlspecialchars( $name ) );
        $newUser->setEmail( htmlspecialchars( $email ) );
        $newUser->setPass( htmlspecialchars( $pass ) );
        $newUser->setRole( 1 );
        $checkName = $repo->checkUserName( $newUser );
        $checkEmail = $repo->checkUserEmail( $newUser );

        if( $checkEmail == false && $checkName == false ){

            $id = $repo->insert( $newUser );

            if( $id != 0 ){

                $role = $repo->insertRole( $newUser );

                $status["success"] = true;
                $status["id"] = $id;
            }
        }
        else {
            if( $checkName > 0 ){
                $status["errors"] = "Nom d'utilisateur déjà pris";
            }
            if( $checkEmail > 0 ){
                $status["errors"] = "Vous êtes déjà inscrit, veuillez vous logger";
            }
        }
    }
    else {
        if( empty( $name ) ){
            $status["errors"] = "Nom d'utilisateur non renseigné";
        }
        if( empty( $email ) ){
            $status["errors"] = "Email non renseigné";
        }
        if( empty( $pass ) ){
            $status["errors"] = "Mot de passe non renseigné";
        }
        if( !preg_match( $v, $email ) ){
            $status["errors"] = "L'email renseigné n'est pas un email valide";
        }
    }

    echo json_encode( $status );
});

// enregistrer une participation
Flight::route('POST /participation', function(){
    
    $userId = FLIGHT::request()->data["userId"];
    $festivalId = FLIGHT::request()->data["festivalId"];
    
    $status = [
        "success" =>false
    ];
    
    $bddManager = Flight::get( "BddManager" );
    $repo = $bddManager->getUserRepository();
    
    $id = $repo->insertParticipation( $userId , $festivalId );

    if( $id > 0){

        $status["success"] = true;
    }

    echo json_encode( $status );
});

Flight::route('DELETE /participation/@userId/@festivalId', function( $userId , $festivalId ){
    
    $status = [
        "success" =>false
    ];

    $bddManager = Flight::get( "BddManager" );
    $repo = $bddManager->getUserRepository();
    $count = $repo->deleteParticipation( $userId , $festivalId );

    if( $count > 0){

        $status["success"] = true;
    }

    echo json_encode( $status );
});

Flight::start();


