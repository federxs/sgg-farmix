(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService'];

    function consultarInseminacionController($scope, consultarInseminacionService) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.itemsPorPagina = 9;
        vm.mostrarServiciosYVacas = true;
        vm.mostrarTablaHembrasServicio = false;
        vm.mostrarTablaServiciosSinConfirmar = false;
        vm.mostrarTablaPreniadasPorParir = false;
        vm.mostrarTablaLactanciasActivas = false;
        vm.rowCollection = [{col1: 'jajasd',col2: '123fda',col3: 'asdasd',col4: 'asdasd'},
            {col1: 'asdas',col2: 'ddsad',col3: 'cxcvz',col4: 'zxczxc'},
            {col1: 'czxcg',col2: 'fgdh',col3: '3242fsdf',col4: 'sdfsdfs'},
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
            { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' }];

        //vm.caca = [{ col1: 'jajasd', col2: '123fda', col3: 'asdasd', col4: 'asdasd' },
        //    { col1: 'asdas', col2: 'ddsad', col3: 'cxcvz', col4: 'zxczxc' },
        //    { col1: 'czxcg', col2: 'fgdh', col3: '3242fsdf', col4: 'sdfsdfs' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' }];

        //metodos
        vm.inicializar = inicializar;
        vm.hembrasParaServicio = hembrasParaServicio;
        vm.serviciosSinConfirmar = serviciosSinConfirmar;
        vm.preniadasPorParir = preniadasPorParir;
        vm.lactanciasActivas = lactanciasActivas;
        inicializar();

        function inicializar() {
            vm.showSpinner = false;}

        function hembrasParaServicio() {
            mostrarTablaActual('HembrasServicio');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }
        function serviciosSinConfirmar() {
            mostrarTablaActual('ServiciosSinConfirmar');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }
        function preniadasPorParir() {
            mostrarTablaActual('PreniadasPorParir');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }
        function lactanciasActivas() {
            mostrarTablaActual('LactanciasActivas');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }

        //Puede ser 'HembraServicio', 'ServiciosSinConfirmar','PreniadasPorParir' o 'LactanciasActivas'
        function mostrarTablaActual(tablaActual) {
            if (mostrarServiciosYVacas === true) {
                mostrarServiciosYVacas = false;
            }
            if (tablaActual === 'HembrasServicio') {
                mostrarTablaHembrasServicio = true;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'ServiciosSinConfirmar') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = true;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'PreniadasPorParir') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = true;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'LactanciasActivas') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = true;
            }
        }
    }
})();
