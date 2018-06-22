angular.module('starter')
    .controller('BienvenidoController', function ($ionicPlatform, $scope, $rootScope, $state, $ionicLoading, loginService, $localStorage, conexion, alimentoService, antibioticoService, bovinoService, rodeoService, vacunaService, parametricasService, inseminacionService) {
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

            /*var vacuna = null, antibiotico = null, alimento = null, rodeo = null;
            if (evento.idVacuna != undefined) {
                vacuna = evento.idVacuna;
            }
            if (evento.idAntibiotico != undefined) {
                antibiotico = evento.idAntibiotico;
            }
            if (evento.idAlimento != undefined) {
                alimento = evento.idAlimento;
            }
            if (evento.idRodeoDestino != undefined) {
                rodeo = evento.idRodeoDestino;
            }
            tx.executeSql("INSERT OR IGNORE INTO Evento(fechaHora, cantidad, idTipoEvento, idVacuna, idAntibiotico, idAlimento, idRodeoDestino) VALUES(?, ?, ?, ?, ?, ?, ?)", [evento.fechaHora, evento.cantidad, evento.idTipoEvento, vacuna, antibiotico, alimento, rodeo]);
            */
            $rootScope.db.executeSql("INSERT OR IGNORE INTO Evento(fechaHora, cantidad, idTipoEvento, idVacuna, idAntibiotico, idAlimento, idRodeoDestino) VALUES(?, ?, ?, ?, ?, ?, ?)", ['22/06/2018', 25, 1, 1, null, null, null]);
            $rootScope.db.executeSql("INSERT OR IGNORE INTO Evento(fechaHora, cantidad, idTipoEvento, idVacuna, idAntibiotico, idAlimento, idRodeoDestino) VALUES(?, ?, ?, ?, ?, ?, ?)", ['24/06/2018', 20, 1, 1, undefined, undefined, undefined]);
            var aux = $q(function (resolve, reject) {
                $rootScope.db.executeSql("SELECT last_insert_rowid() as idEvento FROM Evento", [],
                function (resultado) {
                    resolve(resultado.rows.item(0));
                }, reject);
            });
            console.log(aux);
        }
        //$rootScope.db = window.sqlitePlugin.openDatabase({ name: "farmix.db", location: 'default' });

        /*if (!$localStorage.ultimaConConexion) {
            //si la ultima vez fue sin conexion, realizar post
            //tirar a los services que hagan el post
            va en Background, variable para ver si hay algo para actualizar
        }*/

        /*if ($rootScope.logueado == true && conexion.online) {
            alimentoService.getDatosAlimento($localStorage.campo);
            antibioticoService.getDatosAntibiotico($localStorage.campo);
            bovinoService.getBovinos($localStorage.campo);
            rodeoService.getDatosRodeo($localStorage.campo);
            vacunaService.getDatosVacuna($localStorage.campo);
        }*/

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