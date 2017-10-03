<?php 
class UserRepository extends Repository {

	
    function getUser( User $user ){

		$email = $user->getEmail();

		if( !empty( $email ) ){

			$query = "SELECT * FROM user WHERE email = :email";
			$values = array( "email" => $user->getEmail() );
		}
		else {

			$query = "SELECT * FROM user WHERE name = :name";
			$values = array( "name" => $user->getName() );
		}

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );
		$result = $prep->fetch(PDO::FETCH_ASSOC);

		return $result;
	}

	function checkUserName( User $user ){
		
		$query = "SELECT id FROM user WHERE name = :name";
		$values = array( "name" => $user->getName() );

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );
		$result = $prep->fetch();

		return $result;
	}

	function checkUserEmail( User $user ){

		$query = "SELECT id FROM user WHERE email = :email";
		$values = array( "email" => $user->getEmail() );

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );
		$result = $prep->fetch();

		return $result;
	}

	function getUsersParticipation( User $user ){
		$query = "SELECT festivalId FROM participate WHERE userId = :userId";
		$values = array(
			"userId" => $user->getId()
		);

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );
		$result = $prep->fetchAll( PDO::FETCH_COLUMN );

		return $result;  
	}

	private function accessTocken( User $user ){

		$name = $user->getName();
		$email = $user->getEmail();
		$pass = $user->getPass();

		$rand = int( rand( 0, 5) );

		// nom email pass 
		if( $rand == 0){
			$string = $rand.$name.$email.$pass;
		}
		// nom pass email 
		if( $rand == 1){
			$string = $rand.$name.$pass.$email;
		}
		// email nom pass
		if( $rand == 2){
			$string = $rand.$email.$name.$pass;
		}
		// email pass nom
		if( $rand == 3){
			$string = $rand.$email.$pass.$name;
		}
		// pass nom email 
		if( $rand == 4){
			$string = $rand.$pass.$name.$email;
		}
		// pass email nom 
		if( $rand == 5){
			$string = $rand.$pass.$email.$name;
		}

		$tocken = sha1($string);


	}

	function insert( User $user ){

		$tocken = $this->accessTocken( $user );

		$query = "INSERT INTO user SET name = :name, email = :email, pass = :pass";
		$values = array(
			"name" => $user->getName(),
			"email" => $user->getEmail(),
			"pass" => $user->getPass(),
			"tockenAccess" => $tocken
		);

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );

		return $this->connection->lastInsertId();
	}

	function insertParticipation( $userId , $festivalId ){

		$prep = $this->connection->prepare( "INSERT INTO participate SET userId = :userId, festivalId = :festivalId" );
		$prep->execute( array(
			"userId" => $userId,
			"festivalId" => $festivalId
		) );

		return $prep->rowCount();
	}

	function deleteParticipation( $userId , $festivalId ){

		$prep = $this->connection->prepare( "DELETE FROM participate WHERE userId = :userId AND festivalId = :festivalId" );
		$prep->execute( array(
			"userId" => $userId,
			"festivalId" => $festivalId
		) );

		return $prep->rowCount();
	}

	private function deleteParticipations( User $user ){

		$prep = $this->connection->prepare( "DELETE FROM participate WHERE userId = :userId" );
		$prep->execute( array(
			"userId" => $user->getId()
		) );

		return $prep->rowCount();
	}

	function deleteUser( User $user ) {

		$this->deleteParticipations( $user );

		$query = "DELETE FROM user WHERE id = :id";
		$prep = $this->connection->prepare( $query );
		$prep->execute([
			"id" => $user->getId()
		]);

		return $prep->rowCount();
	}

	function getRole( User $user){
		
		$query = "SELECT roleId FROM roleUser WHERE userId = :userId";
		$values = array( "userId" => $user->getId() );

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );
		$result = $prep->fetch();
		
		return $result["roleId"];
	}

	function insertRole( User $user ){
	
		$query = "INSERT INTO roleId FROM roleUser WHERE roleId = :roleId, userId = :userId";
		$values = array( 
			"userId" => $user->getId(),
			"roleId" => $user->getRole(),
		);

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );
		$result = $prep->fetch();

		return $result;
	
	}

}