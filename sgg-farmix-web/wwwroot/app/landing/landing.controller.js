(function () {
    'use strict';

    angular
        .module('app')
        .controller('landingController', landingController);

    landingController.$inject = ['$scope','NgMap'];

    function landingController($scope, NgMap) {
        $scope.title = 'controller';
        NgMap.getMap().then(function (map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
        });
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEc3oOQo6ui8EDmn_u9-l0_RztFJNFYTQ";

        activate();

        function activate() { }
    }
    })();
