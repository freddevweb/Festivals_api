var app = new App();
// localStorage.clear("festivals");

// ########################### menu

app.$chercherBtn.click(function(){

    if( app.$ajouterGroup.css("display") == "block" ){

        app.$ajouterGroup.css("display", "none");
    }
    if( app.$mesParticipations.css("display") == "block" ){
        
        app.$mesParticipations.css("display", "none");
    }

    app.$chercherGroup.css( "display", "block" );
});

app.$ajouterBtn.click(function(){
    if( app.$chercherGroup.css( "display" ) == "block" ){

        app.$chercherGroup.css( "display", "none" );    
    }
    if( app.$mesParticipations.css("display") == "block" ){
        
        app.$mesParticipations.css("display", "none");
    }

    app.$mesParticipations.css( "display", "none" );
    app.$ajouterGroup.css("display", "block");
});

app.$participBtn.click(function(){
    if( app.$chercherGroup.css( "display" ) == "block" ){

        app.$chercherGroup.css( "display", "none" );    
    }
    if( app.$ajouterGroup.css("display") == "block" ){
        
        app.$ajouterGroup.css("display", "none");
    }

    app.$mesParticipations.css( "display", "block" );
});

// ########################### modal
// btn menu for modal
app.$signinBtn.click(function(){

    app.$modalSignin.css( "display", "block" );
});

app.$loginBtn.click(function(){

    app.$modalLogin.css( "display", "block" );
});

// fermeture des modal
$( "#closeLog" )[0].onclick = function() {

    $(this).parent().parent()[0].style.display = "none";
}

$( "#closeSign" )[0].onclick = function() {

    $(this).parent().parent()[0].style.display = "none";
}

window.onclick = function( event ) {
    if ( event.target == app.$modalSignin[0] ) {
        
        app.$modalSignin[0].style.display = "none";
    }
    if ( event.target == app.$modalLogin[0] ) {
        app.$modalLogin[0].style.display = "none";
    }
}

// validation form
app.$eltForm.focusout( function(){

    var controlSet = app.formValueControl( $( this ).attr( "data-value" ) , $( this ).val() );

    if( controlSet.control == true ){
        $( this ).addClass( "green" );
        $( this ).attr( 'data-validate', "true" );
    }
    if ( controlSet.control == false ){
        $( this ).addClass( "red" );
        $( this ).attr( "data-validate", "false");
        // $( this ).parent().children("error") = controlSet.msg;
    }

})

// submit form
app.$loginForm.submit( function( event ){
    event.preventDefault();

    var $use = $(this).children("#logUse");
    var $pass = $(this).children("#pass");

    if( $use.val() != "" && $use.attr("data-validate") == "true" && $pass.val() != "" && $pass.attr("data-validate") == "true"){
        app.login( MD5( $pass.val() ) , $use.val() );
    }
})

app.$signinForm.submit( function( event ){
    event.preventDefault( );
    
    var $name = $(this).children("#signName");
    var $email = $(this).children("#signEmail");
    var $pass = $(this).children("#signPass");

    var name = "";
    var email = "";
    var pass = "";

    if( $name.attr("data-validate") == true ){
        name = $name.val();
    }
    if( $email.attr("data-validate") == true ){
        email = $email.val();
    }
    if( $pass.attr("data-validate") == true ){
        pass = $pass.val();
    }

    if( name != "" && email != "" && pass != "" ){
        app.signin( name, email, pass);
    }
})

// ########################### datepicker

app.$dateDebut.change(function(){ // ne fonctionne pas !

    var dateSelectedDebut = app.$dateDebut.datepicker( "getDate" );
    app.dateMin2 = dateSelectedDebut;
    var refresh = app.$dateFin.datepicker( "refresh" );
    
});


// ########################### maps

app.main = function(){

    // when maps is ready execute this
    app.readParticipation();
    app.readFestivals();

    moralite();
    


    // ########################### form ajouter festival

    // click sur map ajoute la position a la position temporaire
    google.maps.event.addListener(app.map, 'click', function(event) {

        app.positionTemp.lat = event.latLng.lat();
        app.positionTemp.lng = event.latLng.lng();
        app.$position.val( event.latLng.lat() + " / " + event.latLng.lng() );
    });
    
    // form add new festival
    app.$addForm.submit(function(event){

        event.preventDefault();
        
        if( !app.$nom.val() ){
            app.errors.push("Veuillez saisir le nom du festival");
        }
        if( !app.regexDate.test( app.$dateDebut.val() ) ){
            app.errors.push("Veuillez ressaisir la date du début dans le bon format (ex:01-12-2017)");
        }
        if( !app.$dateDebut.val() ){
            app.errors.push("Veuillez saisir une date du début");
        }
        if( !app.regexDate.test( app.$dateFin.val() ) ){
            app.errors.push("Veuillez ressaisir la date du début dans le bon format (ex:01-12-2017)");
        }
        if( !app.$dateFin.val() ){
            app.errors.push("Veuillez saisir une date du début");
        }
        if( !app.$dateFin.val() ){
            app.errors.push("Veuillez saisir une date du début");
        }
        if( !app.$checkboxes.is(":checked") ){
            app.errors.push("Veuillez renseigner au moins un type de musique");
        }
        
        if( app.errors == "" ){

            var type = [];
            app.$checkboxes.each(function(element) {
                if( $( this ).is(":checked") ){
                    type.push( $( this ).attr("id") );
                }
            });

            var image = {
                url: app.$urlLogo.val()
            };
            
            app.addFestival( 
                app.positionTemp, 
                app.$nom.val(), 
                type, 
                app.$urlLogo.val(), 
                app.$dateDebut.datepicker('getDate'), 
                app.$dateFin.datepicker('getDate')
            );

            addToLegend();
        }
        else {

            app.showError();
        }
        
    });



    // ########################### form search festival

    $( document ).on("change", ".search", function(){

        if( app.$nomSearch.val() != "Choisissez un festival" ){

            app.selection.name = app.$nomSearch.val();
        }
        else {
            app.selection.name = "";
        }

        if( app.$nomSearch.val() != "" ){

            if( app.$dateDebutSearch.datepicker( "getDate" ) != "" && app.$dateFinSearch.datepicker( "getDate" ) != "" ){
                app.selection.dates.debut = app.$dateDebutSearch.datepicker( "getDate" );
                app.selection.dates.fin = app.$dateFinSearch.datepicker( "getDate" );
            }
            else {
                app.selection.dates.debut = "";
                app.selection.dates.fin = "";
            }
        };

        if( $( this ).attr("class") == "search checkSearch" ){
            
            if( $( this ).is(":checked") ){
                console.log($(this).attr("id").toLowerCase());
                app.selection.types[$( this ).attr("id").toLowerCase()] = true;
            }
            else {

                app.selection.types[$(this).attr("id").toLowerCase()] = false;
            }
        }

        app.filterElts();
    });


    // ########################### click participation
    $(document).on("click", ".participation", function(){
        
        if( $( this ).attr( "class" ).indexOf( "green" ) != -1){

            $( this ).removeClass( "green" );
            $( this ).addClass( "red" );
            $( this ).text( "Ne plus participer" );
            var id = $( this ).attr( "id" ).replace("_btn", "");
            var dataId = $( this ).attr("data-id");
            app.addParticipation( dataId );

            return;
        }


        if( $( this ).attr( "class" ).indexOf( "red" ) != -1){

            $( this ).removeClass( "red" );
            $( this ).addClass( "green" );
            $( this ).text( "Je participe" );

            app.removeParticipation( $( this ).attr( "id" ) );

            return;
        }
    });

    // ########################### click on localiser
    $(document).on("click", ".localiser", function(){
        
        var id = $(this).parent().parent().attr("id");
        var name = id.replace("participation_",'');
        var title = name.replace(/_/g,' ');
        app.mapCenter( title );
    });

    $(document).on("click", ".ico", function(){
        var id = $(this).attr("id");
        var name = id.replace("_ico",'');
        var title = name.replace(/_/g,' ');
        app.mapCenter( title );
    });

}
app.$logoutBtn.click( function(){
    
    app.$signinBtn.css( "display" ,"block" );
    app.$loginBtn.css( "display" ,"block" );

    app.$chercherBtn.css( "display" ,"none" );
    app.$logoutBtn.css( "display" ,"none" );
    app.$participBtn.css("display", "none");

    app.$mesParticipations.css( "display" ,"none" );

    app.user = false;

    app.$ajouterBtn.css( "display" ,"none" );

    $( ".participation" ).addClass("hidden");
});


// ###################################  A LA FERMETURE

window.onbeforeunload = function(){

    app.saveProfile();
    app.saveFestivalsLocal();
    if( app.connection == false ){
        app.saveLocalStorage();
    }
}


function moralite(){
    alert("Moralité du tp : il vaut mieux appliquer les grand principes de jquery : 'less is more' => de petites fonctions qui font chacune une petite chose que de grosses fonctions et on s'y perd !")
}

