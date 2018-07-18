(function () {
    'use strict';

    angular
        .module('app')
        .controller('landingController', landingController);

    landingController.$inject = ['$scope', 'NgMap', '$location', '$anchorScroll', 'toastr'];

    function landingController($scope, NgMap, $location, $anchorScroll, toastr) {

        $('.modal-backdrop').remove();
        window.scrollTo(0, 0);

        $scope.irAEquipo = irAEquipo;
        $scope.irAContacto = irAContacto;
        $scope.irAFuncionalidades = irAFuncionalidades;
        $scope.irAPlanes = irAPlanes;
        $scope.enviarCorreo = enviarCorreo;
        $scope.irArriba = irArriba;
        $scope.w3_open = w3_open;
        $scope.w3_close = w3_close;
        $scope.openNav = openNav;

        $scope.title = 'controller';
        NgMap.getMap().then(function (map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
        });
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEc3oOQo6ui8EDmn_u9-l0_RztFJNFYTQ";

        activate();

        function activate() { }

        function irAEquipo() {
            $location.hash('team');
            $anchorScroll();
        };

        function irAFuncionalidades() {
            $location.hash('work');
            $anchorScroll();
        };

        function irAPlanes() {
            $location.hash('pricing');
            $anchorScroll();
        };

        function irAContacto() {
            $location.hash('contact');
            $anchorScroll();
        };

        function irArriba() {
            window.scrollTo(0, 0);
        };

        function enviarCorreo() {
            $scope.name = undefined;
            $scope.email = undefined;
            $scope.mensaje = undefined;
            toastr.success('Su consulta ha sido enviada', 'Éxito');
        };

        // Script for side navigation
        function w3_open() {
            var x = document.getElementById("mySidebar");
            x.style.width = "300px";
            x.style.paddingTop = "10%";
            x.style.display = "block";
        }

        // Close side navigation
        function w3_close() {
            document.getElementById("mySidebar").style.display = "none";
        }

        // Used to toggle the menu on smaller screens when clicking on the menu button
        function openNav() {
            var x = document.getElementById("navDemo");
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show";
            } else {
                x.className = x.className.replace(" w3-show", "");
            }
        }
    }
    })();
