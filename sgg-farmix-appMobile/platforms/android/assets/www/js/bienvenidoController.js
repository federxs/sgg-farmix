angular.module('starter')
    .controller('BienvenidoController', function ($ionicPlatform, $scope, $rootScope, $state, $ionicLoading, loginService, $localStorage, conexion, alimentoService, antibioticoService, bovinoService, rodeoService, vacunaService, parametricasService, inseminacionService, $q) {
        $ionicPlatform.ready(function () {
            if (!$rootScope.logueado || $rootScope.logueado == undefined) {
                if (($localStorage.usuario != undefined) && ($localStorage.pass != undefined)) {
                    if (conexion.online()) {
                        $scope.usuario = {};
                        $scope.usuario.usuario = $localStorage.usuario;
                        $scope.usuario.pass = $localStorage.pass;
                        showIonicLoading().then(validarLogin).then(function (_login) {
                            if (_login.resultado == "1") {
                                $localStorage.campo = _login.codigoCampo;
                                $localStorage.token = _login.token;
                                $rootScope.logueado = true;
                                cargarDataBase();
                            } else {
                                $rootScope.logueado = false;
                                $localStorage.usuario = undefined;
                                $localStorage.pass = undefined;
                                $state.go('app.login');
                            }
                        }).then($ionicLoading.hide).catch($ionicLoading.hide);
                    } else {
                        $rootScope.logueado = true;
                    }
                } else {
                    $rootScope.logueado = false;
                }
            } else {
                if ($rootScope.logueado) {
                    cargarDataBase();
                }
            }
        });
        function cargarDataBase() {
            alimentoService.getDatosAlimento($localStorage.campo);
            antibioticoService.getDatosAntibiotico($localStorage.campo);
            bovinoService.getBovinos($localStorage.campo);
            rodeoService.getDatosRodeo($localStorage.campo);
            vacunaService.getDatosVacuna($localStorage.campo);
            //Estado, Raza, Categoria
            parametricasService.getDatosParametricas($localStorage.campo);
            inseminacionService.getInseminacionesPendientes($localStorage.campo);
        }

        $scope.iniciar = function () {
            $state.go('app.login');
        }
        function validarLogin() {
            $scope.usuario.idRol = 3;
            return loginService.validarLogin($scope.usuario);
        }
        function showIonicLoading() {
            return $ionicLoading.show({
                template: '<ion-spinner icon="lines"/>'
            });
        }
    });