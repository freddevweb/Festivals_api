<?php
class Musique extends Model implements JsonSerializable {

    private $name;

	// @ name
    function getName(){
        return $this->name;
    }
    function setName( $name ){
        $this->name = $name;
    }

    function jsonSerialize(){
        return [
            "id" => $this->id,
            "name" => $this->name
        ];
    }

}