(function () {
    'use strict';

    angular
        .module('app')
        .controller('presentacionController', presentacionController);

    presentacionController.$inject = ['$location'];

    function presentacionController($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'caca';

        activate();

        function activate() { }
    }
})();
