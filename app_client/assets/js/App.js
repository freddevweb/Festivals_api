class App {

    constructor(){

        //  ######### dom variables
        // nav
        this.$nav = $( "#menu" );
        this.$signinBtn = $( "#signinBtn" );
        this.$loginBtn = $( "#loginBtn" );
        this.$logoutBtn = $( "#logoutBtn" );
        this.$chercherBtn = $( "#chercherBtn" );
        this.$ajouterBtn = $( "#ajouterBtn" );
        // map
        this.$map = $( "#map" )[0];
        this.$legend = $( "#legend" );
        // modal windows
        this.$modalLogin = $( "#login" );
        this.$loginForm = $( "#loginForm" );
        this.$modalSignin = $( "#signin" );
        this.$signinForm = $( "#signinForm" );
        this.$eltForm = $( ".eltForm" );
        // form add
        this.$ajouterGroup = $( "#ajouterGroup" );
        this.$addForm = $( "#formAjouter" );
        this.$nom = $( "#nom" );
        this.$dateDebut = $( "#dateDebut" );
        this.$dateFin = $( "#dateFin" );
        this.$position = $( "#position");
        this.$urlLogo = $( "#urlLogo" );
        this.$checkboxes = $( "#ajouterGroup :checkbox" );
        this.$checkboxeAdd =  $( "#checkboxeAdd" );
        // form filter
        this.$chercherGroup = $( "#chercherGroup" );
        this.$nomSearch = $( "#nomSearch" );
        this.$searchElts = $( ".search" );
        this.$dateDebutSearch = $( "#dateDebutSearch" );
        this.$dateFinSearch = $( "#dateFinSearch" );
        this.$variete = $( "#variete" );
        this.$pop = $( "#pop" );
        this.$rock = $( "#rock" );
        this.$punk = $( "#punk" );
        this.$electro = $( "#electro" );
        this.$house = $( "#house" );
        this.$divError = $( ".error" );
        this.$checkboxeSearch =  $( "#checkboxeSearch" );
        // participation space
        this.$participation = $( "#participation" );
        this.$mesParticipations = $( "#mesParticipations" );
        // ######################################################
        // ######### standard variables
        // user
        this.user = false;
        // api 
        this.url = "http://localhost/2_dev_idem/4_webservices/Festivals_api/api/"
        // datepicker
        this.dateMin = new Date( Date.now() );
        this.dateMin2 = null;
        this.dateMax = "";
        // maps
        this.main = null;
        this.map = null;
        this.festivals = [];
        this.musiques = {};
        this.positionTemp = {
            lat : "",
            lng : ""
        };
        this.initCoords = {
            LatLng : {lat: 46.52863469527167, lng: 2.43896484375},
            zoom : 6
        }
        // this.locations = [];
        // search
        this.selection = {
            "name" : "",
            "dates" : {
                "debut" :"",
                "fin" : ""
            },
            "types" : {
                "variete" : false,
                "rock" : false,
                "pop" :false,
                "punk" : false,
                "electro" : false,
                "house" : false
            }
        };
        // participation
        this.participation = [];
        // global
        this.errors = [];
        this.now = Date.now();
        // regex variables
        this.regexDate = /^([0-3][0-9])\-[0-1][0-9]\-[0-9]{4}$/;
        
        //  ######################################################
        //  ######### function
        
        this.setElements();
        this.initCheckbox();
        this.initDatepicker();
    }

    setElements(){

        if( this.user != false ){

            if( this.user.id > 0 ){

                this.$chercherBtn.css( "display" ,"block" );
                
                if( this.user.role = 2 ){
                    this.$chercherGroup.css("display" , "block" );
                    this.$ajouterBtn.css( "display" ,"block" );
                }
                this.$logoutBtn.css( "display" ,"block" );
            }
        }
        else {

            this.$signinBtn.css( "display" ,"block" );
            this.$loginBtn.css( "display" ,"block" );
        }
    }

    initCheckbox(){

        var that = this;

        $.ajax({
            
            url: that.url + "musiques",
            dataType :  "json",
            method :    "GET",
            success : function( data ){

                for( var music of data){

                    var checkbox = '<span class="checkbox-line">';
                    checkbox += '<input type="checkbox" id="' + music.name + '" value="' + music.id  + '">';
                    checkbox += '<label for="' + music.name + '">' + music.name.toUpperCase() + '</label>';
                    checkbox += '</span>';

                    that.$checkboxeSearch.append(checkbox);
                    that.$checkboxeAdd.append(checkbox);
                    that.musiques[music.id] = music.name;
                }
            },
            error : function( error ){ 
                console.log(error);
            }  
        });
    }

    // USER

    login( pass, use ){

        var that = this;

        var passLog = MD5( pass );

        $.ajax({
            
            url: that.url + "user/" + passLog + "/" + use ,
            dataType :  "json",
            method :    "get",
            success : function( data ){

                console.log(data);
            },
            error : function( error ){ 
                console.log(error);
            }  
        });
    }

    signin( name , email, pass ){
        
        var that = this;

        var passSign = MD5( pass );

        $.ajax({
            
            url: that.url + "user/",
            dataType :  "json",
            method :    "post",
            data : {
                name : name,
                email : email,
                pass : passSign
            },
            success : function( data ){

                console.log(data);
                
            },
            error : function( error ){ 
                console.log(error);
            }  
        });
    }

    // ########################### datepicker
    initDatepicker( startDate ){

        var options = {
            dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
            dayNamesMin: [ "Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ],
            monthNames: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre" ],
            monthNamesShort: [ "Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aout", "Sep", "Oct", "Nov", "Dec" ],
            firstDay: 1,
            dateFormat : "dd-mm-yy"
        };

        if( this.dateMin2 ){
            var datemin = this.dateMin2;
        }
        else{
            var datemin = this.dateMin;
        }
        options.minDate = datemin;

        if( !this.dateMax ){
            options.maxDate = this.dateMax;
        };

        this.$dateDebut.datepicker( options );
        this.$dateFin.datepicker( options );
        this.$dateDebutSearch.datepicker( options );
        this.$dateFinSearch.datepicker( options );
    }


    // // ########################### maps

    initMap() {

        this.map = new google.maps.Map( this.$map, {
            center : this.initCoords.LatLng,
            zoom : this.initCoords.zoom
        });

        this.main();

    };

    addMarkerCluster(){

        var markerCluster = new MarkerClusterer( 
            this.map, 
            this.festivals, 
            { imagePath: 'assets/img/clusters/m' }
            );
    }

    addFestival( position, titre, type, logo, debut, fin ){

        var encours = false;

        if( dateNow > debut && dateNow < fin ){
        
            enCours = true;
        }


        var image = {
            url : logo,
            scaledSize: new google.maps.Size(100, 20)
        }

        var festival = new google.maps.Marker({
            position: position,
            map: this.map,
            title: titre,
            icon : image
        });
        

        festival.type = type;
        festival.debut = debut;
        festival.fin = fin;


        var dateNow = Date.now();

        
        this.festivals.push( festival );

        var infowindow = this.addInfoWindow( festival, titre, type, debut, fin, encours);
        
        var that = this;
        festival.addListener('click', function() {
            infowindow.open(that.map, festival);
        });

        return festival;
    };

    addInfoWindow( marker, titre, type, debut, fin, enCours ){

        var newDebut = new Date( debut );
        var dateDebut = newDebut.getDate() + "/" + newDebut.getMonth() + "/" + newDebut.getFullYear();
        var newFin = new Date( fin );
        var dateFin = newFin.getDate() + "/" + newFin.getMonth() + "/" + newFin.getFullYear();
        
        var contentInfo = "<div id=" + titre.replace( /\s/g,'' ) + ">";
        contentInfo += '<h1 id="firstHeading" class="firstHeading">' + titre + '</h1>';
        contentInfo += '<div id="bodyContent">';
        contentInfo += '<p>Du : ' + dateDebut + ', au : ' + dateFin + '</p>';
        contentInfo += '<ul>Styles de musiques du festival :'

        for( var a of type ){

            contentInfo += '<li>' + this.musiques[parseInt(a)] + '</li>';
        }
        contentInfo += '</ul>';

        if( this.user != false ){

            if( enCours == true ){
                contentInfo += '<div class"participation"> Festival en Cours</div>'; 
            }
            else {
    
                if( this.participation.indexOf( titre ) != -1 ){
                    contentInfo += '<button id="' + titre.replace( /\s/g,'_' ) + '_btn" class="participation red">Ne plus participer</button>';
                }
                else {
                    contentInfo += '<button id="' + titre.replace( /\s/g,'_' ) + '_btn" class="participation green">Je participe</button>';
                }
            }
        }
        
        

        
        contentInfo += '</div></div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentInfo
          });
        return infowindow;
    }

    showError(){
        var pError = "";
        for( var error of this.errors ){
            pError += "<p>" + error + "</p>";
        }

        this.$divError.append( pError );
        var that = this;
        this.$divError.fadeIn( 300, function(){
            setTimeout(function() {
                that.$divError.fadeOut( 300 );
                that.$divError.html( "" );
                that.errors = [];
            }, 4000 );
        })
    }


    saveFestivals(){

        var arrayFestivals = [];

        for( var festival of this.festivals ){
            var objectFestivals = {
                position : festival.position,
                titre : festival.title,
                type : festival.type,
                logo : festival.icon.url,
                debut : festival.debut,
                fin : festival.fin
            };

            arrayFestivals.push( objectFestivals );
        }
        var festivalsString = JSON.stringify( arrayFestivals );
        localStorage.setItem( "festivals", festivalsString );
        
    }


    readFestivals(){

        var that = this;
        
            $.ajax({
                
                url: that.url + "festivals",
                dataType :  "json",
                method :    "GET",
                success : function( data ){
    
                    for( var festivalObjet of data ){

                        var position = {
                            lat : parseFloat(festivalObjet.lat),
                            lng : parseFloat(festivalObjet.lng)
                        }

                        that.addFestival(
                            position,
                            festivalObjet.title,
                            festivalObjet.musiqueType,
                            festivalObjet.urlLogo,
                            festivalObjet.dateDebut,
                            festivalObjet.dateFin
                        );
                        
                        that.addOptions( festivalObjet.title );
            
                        if( that.participation.indexOf( festivalObjet.title ) != -1 ){
            
                            that.addParticipation( festivalObjet.title );
                        }
                    }
                    that.addMarkerCluster();
                },
                error : function( error ){ 
                    console.log(error);
                }  
            });
    }

    addOptions( titre ){

        var option = "<option value=" + titre.replace( /\s/g,'_' ) + ">" + titre + "</option>";
        this.$nomSearch.append( option );
    }
    

    filter$chercherBtns(){

        for( var festival of this.festivals ){

            festival.setVisible( false );

            if( festival.title.replace( /\s/g,'_' ) == this.selection.name ) {

                festival.setVisible( true );
            }

            if( festival.debut <= this.selection.dates.debut && festival.fin >= this.selection.dates.fin ) {

                festival.setVisible( true );
            }
            
            for( var typ of festival.type ){

                if( this.selection.types[typ] == true ){

                    festival.setVisible( true );
                }
            }
        }
    }
    

    addParticipation( festivalName ){
        
        if( this.participation.indexOf( festivalName ) == -1){

            this.participation.push( festivalName );
        }
        
        var festivals = this.festivals;
        function object( festival ){
            return festival.title === festivalName;
        }
        var curentFestival = this.festivals.find( object );

        var newDebut = new Date( curentFestival.debut );
        var dateDebut = newDebut.getDate() + "/" + newDebut.getMonth() + "/" + newDebut.getFullYear();
        var newFin = new Date( curentFestival.fin );
        var dateFin = newFin.getDate() + "/" + newFin.getMonth() + "/" + newFin.getFullYear();

        var divParticip = '<div id="participation_' + festivalName.replace( /\s/g,'_' ) + '" class="blocParticip" >';
        divParticip += '<h3>' + festivalName + '</h3>';
        divParticip += '<div>';
        divParticip += '<span>Du ' + dateDebut + ' au ' + dateFin + '</span>';
        divParticip += '<span class="localiser">Localiser</span>';
        divParticip += '</div>';
        divParticip += '</div>';
        
        this.$participation.append( divParticip );
    }

    removeParticipation( titre ){

        var index = this.participation.indexOf( titre );
        this.participation.splice( index, 1);

        $( "#" + 'participation_' + titre.replace(/\s/g,'_') ).remove();
    }

    saveParticipation(){
        
        var participationString = JSON.stringify( this.participation );
        localStorage.setItem( "participation", participationString );
    }

    readParticipation(){

        var participationString = localStorage.getItem( "participation" );

        if( !participationString ){
            return;
        }
        var participationArray = JSON.parse(participationString);

        for( var participation of participationArray ){
            
            if( this.participation.indexOf( participation ) === -1){

                this.participation.push( participation );
            }
        }
    }

    mapCenter( festivalName ){

        var festivals = this.festivals;

        function object( festival ){

            return festival.title === festivalName;
        }

        var curentFestival = this.festivals.find( object );

        var coords = {
            center : {
                lat: curentFestival.position.lat(), 
                lng: curentFestival.position.lng()
            },
            zoom : 12
        }

        this.map.setCenter( coords.center );
        this.map.setZoom( coords.zoom );
    }

    addToLegend( ){

        function tri(a,b)
        {
            if (a.debut < b.debut) return -1;
            else if (a.debut == b.debut) return 0;
            else return 1;
        }
         
        
        this.festivals.sort(tri);

        for( var festival of this.festivals ){

            if( this.now < Date.parse( festival.fin ) ){
                
                var div = '<div id="' + festival.title.replace( /\s/g,'_' ) + '_ico" class="ico">';
                div += '<img src="' + festival.icon.url + '" title="' + festival.title + '" alt="' + festival.title + '" />';
                
                if( this.now < Date.parse( festival.fin ) && this.now >= Date.parse( festival.debut ) ){

                    var diff = this.dateDiff( festival.fin );
                    div += '<span class=""> Fin:' + ' j-' + diff + '<span>';
                    
                }

                if( this.now < Date.parse( festival.debut ) ){

                    var diff = this.dateDiff( festival.debut );
                    div += '<span> Début:' + ' j-' + diff  + '<span>';
                }
                
                div += '</div>';

                this.$legend.append( div );
            }
        }
        
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push
        (document.getElementById('legend'));
    }

    dateDiff( date ){

        var newdate = new Date( date );
        var now = new Date( this.now );

        var yDif = newdate.getFullYear() - now.getFullYear();
        var mDif = newdate.getMonth() - now.getMonth();
        var dDif = newdate.getDate() - now.getDate();

        return ( ( yDif * 365 ) + ( mDif * 30 ) + dDif );
    }



    formValueControl( type, value ){

        var regEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        var controlSet = {
            msg : [],
            control : false
        }

        if( type == "name"){
            if( value.length < 6 ){
                controlSet.msg = "Pseudo trop court (6 min)";
            };
        }
        if( type == "email" ){
            if( value.length == 0 ){
                controlSet.msg = "Email non saisi";
            };
            if( value.match(regEmail) == null ){
                controlSet.msg = "Email non valide";
            };
        }
        if( type == "pass" ){
            if( value.length < 6 ){
                controlSet.msg = "Mot de passe trop court (8 min)";
            };
            if( value.match(/[a-z]{4}/)  == null ){
                controlSet.msg = "Le mot de passe doit contenir au moins 4 caractères en minuscule";
            };
            if( value.match(/[1-9]{2}/)  == null ){
                controlSet.msg = "Le mot de passe doit contenir au moins 2 caractères numériques";
            };
            if( value.match(/[A-Z]{2}/)  == null ){
                controlSet.msg = "Le mot de passe doit contenir au moins 2 caractères majuscules";
            };
        }

        if( controlSet.msg.length == 0 ){
            controlSet.control = true;
        }

        return controlSet;
    }


    encodePass( pass ){

    }





}