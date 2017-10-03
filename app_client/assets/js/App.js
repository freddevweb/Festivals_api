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
        this.$participBtn = $( "#participBtn" );
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
        this.url = "http://localhost/2_dev_idem/4_webservices/Festivals_api/api/";
        this.connection = false;
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
        // for outline
        this.participationOutline = [];
        this.festivalsOutline = [];
        this.musiquesOutline = {};
        
        //  ######################################################
        //  ######### function
        this.checkConnect();
        this.readProfile();
        this.setElements();
        this.initDatepicker();
        this.initCheckbox();
    }

    // test Connection
    checkConnect(){
        
        if( navigator.onLine == true ){
            this.connection = true;
            
        }
        else {
            this.connection = false;
        }
        return navigator.onLine;
    }

    setElements(){

        if( this.user != false ){
            
            if( this.user.id > 0 ){

                this.$signinBtn.css( "display" ,"none" );
                this.$loginBtn.css( "display" ,"none" );

                this.$chercherBtn.css( "display" ,"block" );
                this.$participBtn.css( "display" ,"block" );

                if( this.user.role == 2 ){
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

        if( this.checkConnect() == true && this.connection == true ){

            $.ajax({
                
                url: that.url + "musiques",
                dataType :  "json",
                method :    "GET",
                success : function( data ){

                    for( var music of data){
    
                        var checkbox = '<span class="checkbox-line">';
                        checkbox += '<input type="checkbox" id="' + music.name + '" value="' + music.name  + '"class="search checkSearch">';
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
    }

    // // ########################### USER

    login( pass, use ){

        var that = this;

        $.ajax({
            
            url: that.url + "user/" + pass + "/" + use ,
            dataType :  "json",
            method :    "get",
            success : function( data ){

                that.user = data.user;
                $( ".participation" ).removeClass("hidden");

                that.setElements();
                that.$modalLogin[0].style.display = "none";
            },
            error : function( error ){ 
                console.log(error);
            }  
        });

        if( this.connection == true ){

            if( localStorage.lastData != undefined ){
                
                var lastDatasSavedOuline = localStorage.getItem( "lastData" );
                
                var arrayDatas = JSON.parse( lastDatasSavedOuline ); 
                            
                this.uploadDataSaved( arrayDatas );
            }
        }
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

    addFestival( position, titre, type, logo, debut, fin, id ){

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
        
        festival.id = id;
        festival.type = type;
        festival.debut = debut;
        festival.fin = fin;


        var dateNow = Date.now();

        
        this.festivals.push( festival );

        var infowindow = this.addInfoWindow( festival, titre, type, debut, fin, encours, id);
        
        var that = this;
        festival.addListener('click', function() {
            infowindow.open(that.map, festival);
        });

        return festival;
    };

    addInfoWindow( marker, titre, type, debut, fin, enCours, id ){

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

        var participBtn = "";
        if( enCours == true ){
            participBtn = '<div class"participation"> Festival en Cours</div>'; 
        }
        else{

            var hide = "";
            if( this.user == false ){
                hide = "hidden";
            }

            if( this.participation.indexOf( titre ) != -1 ){
                participBtn = '<button id="' + titre.replace( /\s/g,'_' ) + '_btn" data-id="' + id + '" class="participation red' + hide + '">Ne plus participer</button>';
            }
            else {
                participBtn = '<button id="' + titre.replace( /\s/g,'_' ) + '_btn" data-id="' + id + '" class="participation green ' + hide + '">Je participe</button>';
            }
        }

        contentInfo += participBtn;
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
// ###########################################################
// ##########################################################
    saveFestivals( title, dateDebut, dateFin, urlLogo, lat, lng, musiqueType){
        
        if( this.checkConnect() == true && this.connection == true ){

            $.ajax({
                
                url: that.url + "festival",
                dataType :  "json",
                method :    "POST",
                data : {
                    title : title,
                    dateDebut : dateDebut,
                    dateFin : dateFin,
                    urlLogo : urlLogo,
                    lat : lat,
                    lng : lng,
                    musiqueType : musiqueType
                },
                success : function( data ){
                    console.log(data);
                },
                error : function( error ){ 
                    console.log(error);
                }  
            });
        }
        else {

            var objectFestivals = {
                title : title,
                dateDebut : dateDebut,
                dateFin : dateFin,
                urlLogo : urlLogo,
                lat : lat,
                lng : lng,
                musiqueType : musiqueType
            };
    
            this.festivalsOutline.push( objectFestivals );
        }
    }

    saveFestivalsLocal(){

        var localSave = {};

        var festivalForSave = [];

        for( var festival of this.festivals ){

            var objetFestival = {
                title : festival.title,
                dateDebut : festival.debut,
                dateFin : festival.fin,
                urlLogo : festival.icon.url,
                lat : festival.position.lat(),
                lng : festival.position.lng(),
                musiqueType : festival.type
            }

            festivalForSave.push( objetFestival );
        }

        localSave.festivals = festivalForSave;
        localSave.musiques = this.musiques;
        localSave.participation = this.participation;

        var localSaveString = JSON.stringify( localSave );
        localStorage.setItem( "festivals", localSaveString );
    }
    
    readFestivals(){

        var that = this;

        if( this.checkConnect() == true && this.connection == true){

            $.ajax({
                
                url: that.url + "festivals",
                dataType :  "json",
                method :    "GET",
                success : function( data ){

                    that.generateFestival( data );
                },
                error : function( error ){ 
                    console.log(error);
                }  
            });
        }
        else {

            var festivalsString = localStorage.getItem( "festivals" );
            var data = JSON.parse( festivalsString );

            this.generateFestival( data.festivals );
            this.musiques = data.musiques;
            this.participation.push( data.participation );
        }
    }

    generateFestival( data ){

        for( var festivalObjet of data ){

            var position = {
                lat : parseFloat(festivalObjet.lat),
                lng : parseFloat(festivalObjet.lng)
            }

            this.addFestival(
                position,
                festivalObjet.title,
                festivalObjet.musiqueType,
                festivalObjet.urlLogo,
                festivalObjet.dateDebut,
                festivalObjet.dateFin,
                festivalObjet.id
            );
            
            this.addOptions( festivalObjet.title );

            if( this.participation.indexOf( festivalObjet.title ) != -1 ){

                this.addParticipation( festivalObjet.title );
            }
        }
        this.addMarkerCluster();

        if( this.user != false ){

            for( var elt of this.user.participate ){

                this.displayParticipaton( elt );
            }
        }
        
        app.addToLegend();
    }

    addOptions( titre ){

        var option = "<option value=" + titre.replace( /\s/g,'_' ) + ">" + titre + "</option>";
        this.$nomSearch.append( option );
    }
    

    filterElts(){
        
        for( var festival of this.festivals ){

            festival.setVisible( false );
            // console.log(this.selection);
            if( festival.title.replace( /\s/g,'_' ) == this.selection.name ) {
                
                if( this.selection.name == "" ){

                    festival.setVisible( true );
                }
                else{
                    festival.setVisible( true );
                }
            }

            if( festival.debut <= this.selection.dates.debut && festival.fin >= this.selection.dates.fin ) {

                festival.setVisible( true );
            }
            
            for( var typ of festival.type ){
                
                var nameType = this.musiques[typ].toLowerCase();

                if( this.selection.types[nameType] == true ){

                    festival.setVisible( true );
                }
            }
        }
    }
    

    addParticipation( festivalId ){
        
        var that = this;
        
        if( this.checkConnect() == true  && this.connection == true ){

            $.ajax({
                
                url: that.url + "participation",
                dataType :  "json",
                method :    "POST",
                data: {
                    userId : that.user.id,
                    festivalId : festivalId,
                },
                success : function( data ){
                    // console.log(data);
                    if( data.success == true ){

                        that.user.participate.push( festivalId );

                        that.displayParticipation( festivalId );
                    }
                },
                error : function( error ){ 
                    console.log(error);
                }  
            });
        }
        else {

            this.connection = false;

            if( this.participation.indexOf( festivalId ) == -1){
                
                this.participation.push( festivalId );
            }
            
            this.displayParticipation( festivalId );
        }
        

    }

    displayParticipaton( festivalId ){

        var curentFestival = this.festivals[festivalId - 1];
        
        var newDebut = new Date( curentFestival.debut );
        var dateDebut = newDebut.getDate() + "/" + newDebut.getMonth() + "/" + newDebut.getFullYear();
        var newFin = new Date( curentFestival.fin );
        var dateFin = newFin.getDate() + "/" + newFin.getMonth() + "/" + newFin.getFullYear();

        var divParticip = '<div id="participation_' + this.festivals[festivalId - 1].title.replace( /\s/g,'_' ) + '" class="blocParticip" >';
        divParticip += '<h3>' + this.festivals[festivalId - 1].title + '</h3>';
        divParticip += '<div>';
        divParticip += '<span>Du ' + dateDebut + ' au ' + dateFin + '</span>';
        divParticip += '<span class="localiser">Localiser</span>';
        divParticip += '</div>';
        divParticip += '</div>';
        
        this.$participation.append( divParticip );
    }
// ********************************************************
// ***********************************************************
// ************************************************************
    removeParticipation( titre ){

        var index = this.participation.indexOf( titre );
        this.participation.splice( index, 1);

        $( "#" + 'participation_' + titre.replace(/\s/g,'_') ).remove();
    }
// ********************************************************
// ***********************************************************
// ************************************************************
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

    addToLegend(){

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

        // // POUR LES TESTS CES OPTIONS SONT DESACTIVEES
        // if( type == "name"){
        //     if( value.length < 6 ){
        //         controlSet.msg = "Pseudo trop court (6 min)";
        //     };
        // }
        if( type == "email" ){
            if( value.length == 0 ){
                controlSet.msg = "Email non saisi";
            };
            if( value.match(regEmail) == null ){
                controlSet.msg = "Email non valide";
            };
        }

        // // POUR LES TESTS CES OPTIONS SONT DESACTIVEES
        // if( type == "pass" ){
        //     if( value.length < 6 ){
        //         controlSet.msg = "Mot de passe trop court (8 min)";
        //     };
        //     if( value.match(/[a-z]{4}/)  == null ){
        //         controlSet.msg = "Le mot de passe doit contenir au moins 4 caractères en minuscule";
        //     };
        //     if( value.match(/[1-9]{2}/)  == null ){
        //         controlSet.msg = "Le mot de passe doit contenir au moins 2 caractères numériques";
        //     };
        //     if( value.match(/[A-Z]{2}/)  == null ){
        //         controlSet.msg = "Le mot de passe doit contenir au moins 2 caractères majuscules";
        //     };
        // }

        if( controlSet.msg.length == 0 ){
            controlSet.control = true;
        }

        return controlSet;
    }

    saveProfile(){

        var userString = JSON.stringify( this.user );
        localStorage.setItem( "festivalProfil", userString );
    }

    readProfile(){

        var userString = localStorage.getItem( "festivalProfil" );

        var userObject = JSON.parse(userString);

        if( userObject == false ){
            return;
        }

        this.login( userObject.pass , userObject.name );
    }

    saveLocalStorage(){

        var saveOnLocal = [];
        
        saveOnLocal['lastConnection'] =  false;


        if( app.participationOutline != "" ){
            
            saveOnLocal["participation"] = app.participationOutline;
        }

        if( app.festivalsOutline != "" ){
            
            saveOnLocal["festival"] = app.festivalsOutline;
        }

        var saveDataOutline = JSON.stringify( saveOnLocal );
        localStorage.setItem( "lastData", saveOnLocal );
    }


    uploadDataSaved( arrayDatas ){

        if( arrayDatas["participation"] != "" ){
            console.log( arrayDatas["participation"] );
            
            // this.addParticipation( dataId );
        }

        if( arrayDatas["festival"] != "" ){
            console.log( arrayDatas["festival"] );
            // this.addFestival();
        }

        for( var festivalObjet of arrayFestivals ){
            
            this.addFestival(

                festivalObjet.position,
                festivalObjet.titre,
                festivalObjet.type,
                festivalObjet.logo,
                festivalObjet.debut,
                festivalObjet.fin
            );

            this.addOptions( festivalObjet.titre );

            if( this.participation.indexOf( festivalObjet.titre ) != -1 ){

                this.addParticipation( festivalObjet.titre );
            }
        }

        this.addMarkerCluster();
    }
}