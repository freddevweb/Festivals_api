<?php
class Festival extends Model implements JsonSerializable {

    private $title;
    private $dateDebut;
    private $dateFin;
    private $urlLogo;
    private $lat;
    private $lng;
    private $musiqueType = [];

    // @ title
    function getTitle(){
        return $this->title;
    }
    function setTitle( $title ){
        $this->title = $title;
    }

    // @ dateDebut
    function getDateDebut(){
        return $this->dateDebut;
    }
    function setDateDebut( $dateDebut ){
        $this->dateDebut = $dateDebut;
    }

    // @ dateFin
    function getDateFin(){
        return $this->dateFin;
    }
    function setDateFin( $dateFin ){
        $this->dateFin = $dateFin;
    }

    // @ urlLogo
    function getUrlLogo(){
        return $this->urlLogo;
    }
    function setUrlLogo( $urlLogo ){
        $this->urlLogo = $urlLogo;
    }

    // @ lat
    function getLat(){
        return $this->lat;
    }
    function setLat( $lat ){
        $this->lat = $lat;
    }

    // @ lng
    function getLng(){
        return $this->lng;
    }
    function setLng( $lng ){
        $this->lng = $lng;
    }

    // @ lng
    function getMusiqueType(){
        return $this->musiqueType;
    }
    function setMusiqueType( $musiqueType ){
        $this->musiqueType = $musiqueType;
    }

    function jsonSerialize(){
        return [
            "id" => $this->id,
            "title" => $this->title,
            "dateDebut" => $this->dateDebut,
            "dateFin" => $this->dateFin,
            "urlLogo" => $this->urlLogo,
            "lat" => $this->lat,
            "lng" => $this->lng,
            "musiqueType" => $this->musiqueType
        ];
    }

}