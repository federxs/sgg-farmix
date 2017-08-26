angular.module('starter')
    .controller('VacunacionController', function ($ionicLoading, $scope, vacunaService) {
        $ionicLoading.show().then(obtenerVacuna).then(function (_vacunas) {
            $scope.vacunas = _vacunas;
        }).then($ionicLoading.hide).catch($ionicLoading.hide);
        //var combo = obtenerVacuna();
        //$scope.vacunas = combo;
        function obtenerVacuna() {
            return vacunaService.getDatosVacuna();
        }
        //alert(combo);
    })