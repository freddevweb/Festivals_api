<?php
// // version alfonso
// function loadMyClass($class){
    
//     if(class_exists($class)===false){
        
//         $string = 'models/'.$class.'.php';
        
//         if(file_exists($string)===true){
        
//             require $string;
//         }
//     }
// }
// spl_autoload_register('loadMyClass');

// version pierre

function myautoload( $className ){

    $folders = [
        "class/",
        "class/models/",
        "class/repositories/"
    ];

    foreach( $folders as $folder ){

        $file = $folder . $className . ".php";
        if( file_exists( $file ) ){
            require $file;
            return;
        }
    }
}

spl_autoload_register('myautoload');
