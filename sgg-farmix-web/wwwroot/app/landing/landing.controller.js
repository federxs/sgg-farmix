(function () {
    'use strict';

    angular
        .module('app')
        .controller('landingController', landingController);

    landingController.$inject = ['$scope', 'NgMap', '$location', '$anchorScroll'];

    function landingController($scope, NgMap, $location, $anchorScroll) {

        $('.modal-backdrop').remove();
        window.scrollTo(0, 0);

        $scope.irAEquipo = irAEquipo;
        $scope.irAContacto = irAContacto;
        $scope.irAFuncionalidades = irAFuncionalidades;
        $scope.irAPlanes = irAPlanes;

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
    }
    })();
