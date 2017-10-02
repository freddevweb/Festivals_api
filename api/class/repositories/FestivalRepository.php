<?php 
class FestivalRepository extends Repository {

    function getMusicForFestival( $id ){

        $queryFestivMusic = "SELECT musiqueId FROM festivalMusique WHERE festivalId = :festivalId";
        $valuesFestivMusic = array(
            "festivalId" => $id
        );

        $prep = $this->connection->prepare( $queryFestivMusic );
        $prep->execute( $valuesFestivMusic );
        $result = $prep->fetchAll(PDO::FETCH_COLUMN);

        return $result;
    }

    function getAll(){
        $queryFestiv = "SELECT * FROM festival";
        $resultFestiv = $this->connection->query( $queryFestiv );
        $resultFestiv = $resultFestiv->fetchAll( PDO::FETCH_ASSOC );

        $festival = [];

        foreach( $resultFestiv as $data ){
            
            $styles = $this->getMusicForFestival( $data["id"] );
            $data["musiqueType"] = $styles;
            $festival[] = new Festival( $data );
        }

        return $festival;  
    }

    function getById( Festival $festival ){

        $query = "SELECT * FROM festival WHERE id=:id";
        $prep = $this->connection->prepare( $query );
        $prep->execute([
            "id" => $festival->getId()
        ]);
        $result = $prep->fetch(PDO::FETCH_ASSOC);

        $styles = $this->getMusicForFestival( $result["id"] );
        $result["musiqueType"] = $styles;

        if( empty( $result ) ){
            return false;
        }
        else {
            return new Festival( $result );
        }
    }

    function save( Festival $festival ){
        
        if( empty( $festival->getId() ) ){

            return $this->insertFestival( $festival );
        }
        else {

            return $this->updateFestival( $festival );
        }
    }

    private function insertFestival( Festival $festival ){

        $queryFestival = "INSERT INTO festival SET title = :title, dateDebut = :dateDebut, dateFin = :dateFin, urlLogo = :urlLogo, lat = :lat, lng = :lng";
        $valuesFestival = array(
            "title" => $festival->getTitle(),
            "dateDebut" => $festival->getDateDebut(),
            "dateFin" => $festival->getDateFin(),
            "urlLogo" => $festival->getUrlLogo(),
            "lat" => $festival->getLat(),
            "lng" => $festival->getLng()
        );

        $prep = $this->connection->prepare( $queryFestival );
        $prep->execute( $valuesFestival );
        $lastInsertId = $this->connection->lastInsertId();
        
        // var_dump($lastInsertId);
        // die();

        if( $lastInsertId != 0 ){

            $arrayFestival = json_decode( $festival->getMusiqueType() );

            foreach( $arrayFestival as $value ){
                
                $this->insertMusicFestival( $lastInsertId, $value );
                
            }
        }

        return $lastInsertId;
    }

    function insertMusicFestival( $id , $value ){
        
        $intId = intval( $id );
        
        $query = "INSERT INTO festivalMusique SET festivalId = :festivalId, musiqueId=:musiqueId";
        $values = array(
            "festivalId" => $intId,
            "musiqueId" => $value
        );

        $prep = $this->connection->prepare( $query );
        $prep->execute( $values );
    }



    private function updateFestival( Festival $festival ){

        $query = "UPDATE festival SET title = :title, dateDebut = :dateDebut, dateFin = :dateFin, urlLogo = :urlLogo, lat = :lat, lng = :lng WHERE id=:id";
        $values = array(
            "title" => $festival->getTitle(),
            "dateDebut" => $festival->getDateDebut(),
            "dateFin" => $festival->getDateFin(),
            "urlLogo" => $festival->getUrlLogo(),
            "lat" => $festival->getLat(),
            "lng" => $festival->getLng(),
            "id" => $festival->getId()
        );

        $prep = $this->connection->prepare( $query );
        $prep->execute( $values );
        $rowCount = $prep->rowCount();

        if( $rowCount != 0 ){

            $this->deleteMusicFestival( $festival );

            $arrayFestival = $festival->getMusiqueType();

            foreach( $arrayFestival as $value ){

                $this->insertMusicFestival( $festival->getId() , $value );
                
            }
        }

        return $prep->rowCount();

    }

    private function deleteMusicFestival( Festival $festival ){

        $prep = $this->connection->prepare( "DELETE FROM festivalMusique WHERE festivalId = :festivalId" );
        $prep->execute( array(
            "festivalId" => $festival->getId()
        ) );
        
        return $prep->rowCount();
    }

    function deleteFestival( Festival $festival ) {

        $this->deleteMusicFestival( $festival );

        $query = "DELETE FROM festival WHERE id=:id";
        $prep = $this->connection->prepare( $query );
        $prep->execute([
            "id" => $festival->getId()
        ]);

        return $prep->rowCount();
    }

}