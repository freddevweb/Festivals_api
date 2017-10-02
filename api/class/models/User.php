<?php
class User extends Model implements JsonSerializable {

    private $name;
	private $email;
    private $pass;
    private $participate = [];
    private $role;

	// @ name
    function getName(){
        return $this->name;
	}
	function setName( $name ){
        $this->name = $name;
	}
	
	// @ email
    function getEmail(){
        return $this->email;
	}
    function setEmail( $email ){
        $this->email = $email;
    }

	// @ pass
    function getPass(){
        return $this->pass;
	}
    function setPass( $pass ){
        $this->pass = $pass;
    }
    
    // @ participate
    function getParticipate(){
        return $this->participate;
	}
    function setParticipate( $participate ){
        $this->participate = $participate;
    }
    
    // @ role
    function getRole(){
        return $this->role;
	}
    function setRole( $role ){
        $this->role = $role;
	}
	

    function jsonSerialize(){
        return [
            "id" => $this->id,
            "name" => $this->name,
			"email" => $this->email,
            "pass" => $this->pass,
            "participate" => $this->participate,
            "role" => $this->role
        ];
    }

}