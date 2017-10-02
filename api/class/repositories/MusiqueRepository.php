<?php 
class MusiqueRepository extends Repository {

	function getAll(){
		$query = "SELECT * FROM musique";
		$result = $this->connection->query( $query );
		$result = $result->fetchAll( PDO::FETCH_ASSOC );

		$musique = [];

		foreach( $result as $data ){

			$musique[] = new Musique( $data );
		}

		return $musique;  
	}

	function checkfestivalMusique( Musique $musique ){

		$query = "SELECT count( musiqueId ) FROM festivalMusique WHERE musiqueId = :musiqueId";
		$value = array(
			"musiqueId" => $musique->getId()
		);
		$prep = $this->connection->prepare( $query );
		$prep->execute( $value );
		$result = $prep->fetch();

		return $result;
	}

	function insertMusic( Musique $musique ){

		$query = "INSERT INTO musique SET name = :name";
		$values = array(
			"name" => $musique->getName()
		);

		$prep = $this->connection->prepare( $query );
		$prep->execute( $values );

		return $this->connection->lastInsertId();
	}

	function deleteMusic( Musique $musique ) {

		$query = "DELETE FROM musique WHERE id=:id";
		$prep = $this->connection->prepare( $query );
		$prep->execute([
			"id" => $musique->getId()
		]);

		return $prep->rowCount();
	}



}