(function () {
    'use strict';

    angular
        .module('app')
        .controller('configuracionController', configuracionController);

    configuracionController.$inject = ['$scope', 'inicioService', 'toastr', '$localStorage', 'razaService', '$timeout', 'alimentoService', 'rodeoService', 'estadoService', 'categoriaService', 'establecimientoOrigenService', 'antibioticoService', 'vacunaService', 'registrarBovinoService'];

    function configuracionController($scope, configuracionService, toastr, $localStorage, razaService, $timeout, alimentoService, rodeoService, estadoService, categoriaService, establecimientoOrigenService, antibioticoService, vacunaService, registrarBovinoService) {
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

        function inicializar() {
            $scope.showSpinner = true;
            cargarProvinciasyLocalidades();            
        }

        function popupAlimentos() {
            $scope.nuevoAlimento = false;
            $scope.itemsPorPagina = 5;
            alimentoService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.alimentosCollection = data;
                $('#modalNuevoAlimento').modal('show');
            }, function (error) {

            });
        };

        function popupAntibioticos() {
            $scope.nuevoAntibiotico = false;
            $scope.itemsPorPagina = 5;
            antibioticoService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.antibioticosCollection = data;
                $('#modalNuevoAntibiotico').modal('show');
            }, function (error) {

            });
        };

        function popupEstados() {
            $scope.nuevoEstado = false;
            $scope.itemsPorPagina = 5;
            estadoService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.estadosCollection = data;
                $('#modalNuevoEstado').modal('show');
            }, function (error) {

            });
        };

        function popupEstablecimientos() {
            $scope.nuevoEstab = false;
            $scope.itemsPorPagina = 5;
            establecimientoOrigenService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.establecimientosCollection = data;
                $('#modalNuevoEstablecimiento').modal('show');
            }, function (error) {

            });
        };

        function popupCategorias() {
            $scope.nuevaCategoria = false;
            $scope.itemsPorPagina = 5;
            categoriaService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.categoriasCollection = data;
                $('#modalNuevaCategoria').modal('show');
            }, function (error) {

            });
        };

        function popupRazas() {
            $scope.nuevaRaza = false;
            $scope.itemsPorPagina = 5;
            razaService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.razasCollection = data;
                $('#modalNuevaRaza').modal('show');
            }, function (error) {

            });
        };

        function popupRodeos() {
            $scope.nuevoRodeo = false;
            $scope.itemsPorPagina = 5;
            rodeoService.get({ campo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.rodeosCollection = data;
                $('#modalNuevoRodeo').modal('show');
            }, function (error) {

            });
        };

        function popupVacunas() {
            $scope.nuevaVacuna = false;
            $scope.itemsPorPagina = 5;
            vacunaService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.vacunasCollection = data;
                $('#modalNuevaVacuna').modal('show');
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
    }//fin controlador
})();
