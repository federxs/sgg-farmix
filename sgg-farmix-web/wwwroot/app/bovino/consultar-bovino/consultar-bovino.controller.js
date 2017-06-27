(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope'];

    function consultarBovinoController($scope) {
        var vm = $scope;
        vm.list = [{
            categoria: 'Toruno',
            genero: 'Macho',
            raza: 'Aberdeen Angus',
            rodeo:'3',
            estado:'Activo',
            peso:'200',
        }, {
            categoria: 'Vaca',
            genero: 'Hembra',
            raza: 'Braford',
            rodeo: '2',
            estado: 'Preñada',
            peso: '230',
        }, {
            categoria: 'Toro',
            genero: 'Macho',
            raza: 'Hereford',
            rodeo: '3',
            estado: 'Activo',
            peso: '350',
        }, {
            categoria: 'Ternero',
            genero: 'Macho',
            raza: 'Aberdeen Angus',
            rodeo: '1',
            estado: 'Activo',
            peso: '160',
        }, {
            categoria: 'Vaquillona',
            genero: 'Hembra',
            raza: 'Brangus',
            rodeo: '5',
            estado: 'Activo',
            peso: '380',
        }, {
            categoria: 'Toro',
            genero: 'Macho',
            raza: 'Hereford',
            rodeo: '3',
            estado: 'Activo',
            peso: '370',
        }, {
            categoria: 'Toro',
            genero: 'Macho',
            raza: 'Aberdeen Angus',
            rodeo: '3',
            estado: 'Activo',
            peso: '340',
        }, {
            categoria: 'Ternera',
            genero: 'Hembra',
            raza: 'Brangus',
            rodeo: '1',
            estado: 'Activo',
            peso: '130',
        }, {
            categoria: 'Ternero',
            genero: 'Macho',
            raza: 'Aberdeen Angus',
            rodeo: '1',
            estado: 'Activo',
            peso: '140',
        }, ];
        //vm.tableParams = new NgTableParams({}, { dataset: list });
    }
})();