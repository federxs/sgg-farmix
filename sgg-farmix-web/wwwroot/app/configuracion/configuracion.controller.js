(function () {
    'use strict';

    angular
        .module('app')
        .controller('configuracionController', configuracionController);

    configuracionController.$inject = ['$scope', 'configuracionService', 'toastr', '$localStorage', '$sessionStorage', 'razaService', '$timeout', 'alimentoService', 'rodeoService', 'estadoService', 'categoriaService', 'establecimientoOrigenService', 'antibioticoService', 'vacunaService', 'registrarBovinoService'];

    function configuracionController($scope, configuracionService, toastr, $localStorage, $sessionStorage, razaService, $timeout, alimentoService, rodeoService, estadoService, categoriaService, establecimientoOrigenService, antibioticoService, vacunaService, registrarBovinoService) {
        $scope.showSpinner = true;
        $scope.itemsPorPagina = 5;
        $scope.nuevaRaza = false;
        $scope.nuevoAlimento = false;
        $scope.nuevoRodeo = false;
        $scope.nuevoEstado = false;
        $scope.nuevaCategoria = false;
        $scope.nuevoEstab = false;
        $scope.nuevoAntibiotico = false;
        $scope.nuevaVacuna = false;
        var localidadesOriginales = [];
        $scope.inicializar = inicializar();
        $scope.popupRazas = popupRazas;
        $scope.popupAlimentos = popupAlimentos;
        $scope.popupRodeos = popupRodeos;
        $scope.popupEstados = popupEstados;
        $scope.popupCategorias = popupCategorias;
        $scope.popupEstablecimientos = popupEstablecimientos;
        $scope.popupAntibioticos = popupAntibioticos;
        $scope.popupVacunas = popupVacunas;
        $scope.cargarProvinciasyLocalidades = cargarProvinciasyLocalidades;
        $scope.getLocalidades = getLocalidades;
        $scope.agregarEstabOrigen = agregarEstabOrigen;
        $scope.agregarRodeo = agregarRodeo;
        $scope.agregarEstado = agregarEstado;
        $scope.agregarRaza = agregarRaza;
        $scope.agregarAlimento = agregarAlimento;
        $scope.agregarAntibiotico = agregarAntibiotico;
        $scope.agregarVacuna = agregarVacuna;
        $scope.agregarCategoria = agregarCategoria;
        $scope.popupPerfil = popupPerfil;

        function inicializar() {
            $scope.showSpinner = true;
            cargarProvinciasyLocalidades();            
        }

        function popupAlimentos() {
            $scope.nuevoAlimento = false;
            $scope.itemsPorPagina = 5;
            $scope.alimento = new alimentoService();
            alimentoService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.alimentosCollection = data;
                $('#modalNuevoAlimento').modal('show');
            }, function (error) {

            });
        };

        function popupAntibioticos() {
            $scope.nuevoAntibiotico = false;
            $scope.itemsPorPagina = 5;
            $scope.antibiotico = new antibioticoService();
            antibioticoService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.antibioticosCollection = data;
                $('#modalNuevoAntibiotico').modal('show');
            }, function (error) {

            });
        };

        function popupEstados() {
            $scope.nuevoEstado = false;
            $scope.itemsPorPagina = 5;
            $scope.estado = new estadoService();
            estadoService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.estadosCollection = data;
                $('#modalNuevoEstado').modal('show');
            }, function (error) {

            });
        };

        function popupEstablecimientos() {
            $scope.nuevoEstab = false;
            $scope.itemsPorPagina = 5;
            $scope.establecimiento = new establecimientoOrigenService();
            establecimientoOrigenService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.establecimientosCollection = data;
                $('#modalNuevoEstablecimiento').modal('show');
            }, function (error) {

            });
        };

        function popupCategorias() {
            $scope.nuevaCategoria = false;
            $scope.itemsPorPagina = 5;
            $scope.categoria = new categoriaService();
            categoriaService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.categoriasCollection = data;
                $('#modalNuevaCategoria').modal('show');
            }, function (error) {

            });
        };

        function popupRazas() {
            $scope.nuevaRaza = false;
            $scope.itemsPorPagina = 5;
            $scope.raza = new razaService();
            razaService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.razasCollection = data;
                $('#modalNuevaRaza').modal('show');
            }, function (error) {

            });
        };

        function popupRodeos() {
            $scope.nuevoRodeo = false;
            $scope.itemsPorPagina = 5;
            $scope.rodeo = new rodeoService();
            rodeoService.get({ campo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.rodeosCollection = data;
                $('#modalNuevoRodeo').modal('show');
            }, function (error) {

            });
        };

        function popupVacunas() {
            $scope.nuevaVacuna = false;
            $scope.itemsPorPagina = 5;
            $scope.vacuna = new vacunaService();
            vacunaService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.vacunasCollection = data;
                $('#modalNuevaVacuna').modal('show');
            }, function (error) {

            });
        };

        function popupPerfil() {
            configuracionService.getDatosPerfilUsuario($sessionStorage.usuarioInfo.usuario).then(function success(data) {
                $scope.perfilUsuario = data;
                $('#modalPerfilUser').modal('show');
            }, function (error) {

            });
        };

        function cargarProvinciasyLocalidades() {
            registrarBovinoService.cargarProvinciasyLocalidades({}, function (data) {
                $scope.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.showSpinner = false;
            }, function error(error) {
                $scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function getLocalidades() {
            $scope.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt($scope.establecimiento.idProvincia);
            }).ToArray();
        };

        function agregarEstabOrigen() {
            $scope.showSpinner = true;
            $scope.establecimiento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.establecimiento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevoEstablecimiento').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Establecimiento Origen ya existe')
                    toastr.warning('El establecimiento origen que intenta registrar, ya existe en este campo', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRodeo() {
            $scope.showSpinner = true;
            $scope.rodeo.idCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.rodeo.$save(function (data) {
                toastr.success('Se agrego con éxito el rodeo', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevoRodeo').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Rodeo ya existe')
                    toastr.warning('El rodeo que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarEstado() {
            $scope.showSpinner = true;
            $scope.estado.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.estado.$save(function (data) {
                toastr.success('Se agrego con éxito el estado ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevoEstado').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Estado ya existe')
                    toastr.warning('El estado que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarCategoria() {
            $scope.showSpinner = true;
            $scope.categoria.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.categoria.$save(function (data) {
                toastr.success('Se agrego con éxito la categoría ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevaCategoria').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Categoria ya existe')
                    toastr.warning('La categoría que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRaza() {
            $scope.showSpinner = true;
            $scope.raza.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.raza.$save(function (data) {
                toastr.success('Se agrego con éxito la raza ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevaRaza').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Raza ya existe')
                    toastr.warning('La raza que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAlimento() {
            $scope.showSpinner = true;
            $scope.alimento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.alimento.$save(function (data) {
                toastr.success('Se agrego con éxito el alimento ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevoAlimento').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Alimento ya existe')
                    toastr.warning('El alimento que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAntibiotico() {
            $scope.showSpinner = true;
            $scope.antibiotico.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.antibiotico.$save(function (data) {
                toastr.success('Se agrego con éxito el antibiótico ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevoAntibiotico').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Antibiotico ya existe')
                    toastr.warning('El antibiótico que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarVacuna() {
            $scope.showSpinner = true;
            $scope.vacuna.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.vacuna.$save(function (data) {
                toastr.success('Se agrego con éxito el vacuna ', 'Éxito');
                $scope.showSpinner = false;
                $('#modalNuevaVacuna').modal('hide');
                $state.reload();
            }, function (error) {
                $scope.showSpinner = false;
                if (error.statusText === 'Vacuna ya existe')
                    toastr.warning('La vacuna que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };
    }//fin controlador
})();
